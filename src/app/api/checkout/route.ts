import { NextResponse } from 'next/server';
import { env, isIyzicoConfigured, isSupabaseConfigured } from '@/utils/env';
import { initCheckoutForm } from '@/utils/iyzico';
import { sendAdminOrderNotice, sendOrderConfirmation } from '@/utils/mail';
import { checkRateLimit, clientKey, tooManyRequests } from '@/utils/rate-limit';
import { createClient, createServiceClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

export interface CheckoutItemInput {
  productId: string;
  slug: string;
  name: string;
  variantLabel: string;
  variantValue: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface CheckoutRequestBody {
  items: CheckoutItemInput[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    identityNumber?: string;
  };
  address: {
    city: string;
    district: string;
    address: string;
    postalCode?: string;
  };
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    vat: number;
    total: number;
  };
  couponCode?: string | null;
  shippingMethod: string;
  paymentMethod: 'card' | 'transfer' | 'cod';
  note?: string;
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

/**
 * Order flow:
 *   1) Validate the body and recompute every total on the server
 *   2) Insert `orders` and `order_items` with status `pending`
 *   3) For card payments, start the iyzico Checkout Form and return its iframe
 *   4) For transfer or cash on delivery, confirm the order and send the emails
 */
export async function POST(request: Request) {
  // Creating an order is expensive, so it is capped at ten attempts per minute.
  const limit = checkRateLimit(clientKey(request, 'checkout'), {
    limit: 10,
    windowMs: 60_000,
  });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return badRequest('Geçersiz istek gövdesi.');
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest('Sepetiniz boş.');
  }
  if (!body.customer?.email || !body.customer?.fullName || !body.customer?.phone) {
    return badRequest('Müşteri bilgileri eksik.');
  }
  if (!body.address?.city || !body.address?.district || !body.address?.address) {
    return badRequest('Teslimat adresi eksik.');
  }

  // Client-supplied totals are never trusted; the line sum is recomputed here.
  const computedSubtotal = body.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  if (Math.abs(computedSubtotal - body.totals.subtotal) > 0.5) {
    return badRequest('Sepet tutarı doğrulanamadı. Sayfayı yenileyip tekrar deneyin.');
  }

  const [firstName, ...restName] = body.customer.fullName.trim().split(/\s+/);
  const lastName = restName.join(' ') || firstName;
  const fullAddress = `${body.address.address}, ${body.address.district} / ${body.address.city}`;

  /* ---------------------------------------------------------------------- */
  /*  1) Write the order to the database                                     */
  /* ---------------------------------------------------------------------- */

  let orderId: string | null = null;
  let orderNo = `ZB-${Date.now().toString().slice(-8)}`;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const service = createServiceClient();
    const db = service ?? supabase;

    if (db) {
      const {
        data: { user },
      } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

      const { data: order, error } = await db
        .from('orders')
        .insert({
          user_id: user?.id ?? null,
          email: body.customer.email,
          phone: body.customer.phone,
          full_name: body.customer.fullName,
          shipping_address: {
            full_name: body.customer.fullName,
            phone: body.customer.phone,
            city: body.address.city,
            district: body.address.district,
            address: body.address.address,
            postal_code: body.address.postalCode ?? null,
          },
          subtotal: body.totals.subtotal,
          discount: body.totals.discount,
          shipping_cost: body.totals.shipping,
          vat: body.totals.vat,
          total: body.totals.total,
          coupon_code: body.couponCode ?? null,
          shipping_method: body.shippingMethod,
          payment_method: body.paymentMethod,
          payment_status: 'pending',
          status: 'pending',
          note: body.note ?? null,
        })
        .select('id, order_no')
        .single();

      if (error || !order) {
        return NextResponse.json(
          { ok: false, error: 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.' },
          { status: 500 },
        );
      }

      orderId = order.id;
      orderNo = order.order_no;

      await db.from('order_items').insert(
        body.items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.name,
          product_slug: item.slug,
          image_url: item.imageUrl ?? null,
          variant_label: item.variantLabel,
          unit_price: item.unitPrice,
          quantity: item.quantity,
        })),
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  2) Card payment goes to iyzico                                         */
  /* ---------------------------------------------------------------------- */

  if (body.paymentMethod === 'card') {
    if (!isIyzicoConfigured) {
      return NextResponse.json({
        ok: true,
        mode: 'demo' as const,
        orderNo,
        orderId,
        message:
          'iyzico anahtarları tanımlı olmadığı için ödeme adımı demo modunda tamamlandı. Gerçek tahsilat için IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin.',
      });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || '85.34.78.112';

    // iyzico requires the basket items to sum to `price` exactly.
    const basketItems = body.items.map((item, index) => ({
      id: item.productId || `item-${index}`,
      name: `${item.name} — ${item.variantLabel}`,
      category: 'Gıda',
      price: Number((item.unitPrice * item.quantity).toFixed(2)),
    }));
    const basketTotal = basketItems.reduce((sum, item) => sum + item.price, 0);

    const result = await initCheckoutForm({
      conversationId: orderNo,
      price: Number(basketTotal.toFixed(2)),
      paidPrice: Number(body.totals.total.toFixed(2)),
      callbackUrl: `${env.siteUrl}/api/checkout/callback`,
      buyer: {
        id: orderId ?? orderNo,
        name: firstName,
        surname: lastName,
        email: body.customer.email,
        phone: body.customer.phone.replace(/\s/g, ''),
        identityNumber: body.customer.identityNumber ?? '11111111111',
        address: fullAddress,
        city: body.address.city,
        country: 'Turkey',
        ip,
      },
      shippingAddress: {
        contactName: body.customer.fullName,
        city: body.address.city,
        country: 'Turkey',
        address: fullAddress,
      },
      basketItems,
    });

    if (result.status !== 'success' || !result.checkoutFormContent) {
      return NextResponse.json(
        { ok: false, error: result.errorMessage ?? 'Ödeme başlatılamadı.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: 'iyzico' as const,
      orderNo,
      orderId,
      checkoutFormContent: result.checkoutFormContent,
      paymentPageUrl: result.paymentPageUrl,
      token: result.token,
    });
  }

  /* ---------------------------------------------------------------------- */
  /*  3) Transfer or cash on delivery: confirm directly and send mail        */
  /* ---------------------------------------------------------------------- */

  const mailPayload = {
    orderNo,
    customerName: body.customer.fullName,
    email: body.customer.email,
    total: body.totals.total,
    paymentMethod: body.paymentMethod === 'transfer' ? 'Havale / EFT' : 'Kapıda Ödeme',
    shippingMethod: body.shippingMethod,
    address: fullAddress,
    items: body.items.map((item) => ({
      name: item.name,
      variant: item.variantLabel,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity,
    })),
  };

  // Sending mail must not block the order; it stays valid even if mail fails.
  const [customerMail] = await Promise.all([
    sendOrderConfirmation(mailPayload),
    sendAdminOrderNotice(mailPayload),
  ]);

  return NextResponse.json({
    ok: true,
    mode: 'manual' as const,
    orderNo,
    orderId,
    mailSent: customerMail.sent,
  });
}
