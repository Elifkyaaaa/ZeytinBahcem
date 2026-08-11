import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/utils/env';
import { retrieveCheckoutResult } from '@/utils/iyzico';
import { sendAdminOrderNotice, sendOrderConfirmation } from '@/utils/mail';
import { createServiceClient } from '@/utils/supabase/server';
import type { OrderItemRow, OrderRow } from '@/types/database';

export const runtime = 'nodejs';

/**
 * iyzico 3D Secure return point.
 * iyzico POSTs here, and we verify the result by querying iyzico **ourselves**
 * — the status in the form body is not trusted on its own.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = form.get('token');

  if (typeof token !== 'string' || !token) {
    return NextResponse.redirect(`${env.siteUrl}/checkout/result?durum=hata`, { status: 303 });
  }

  const result = await retrieveCheckoutResult(token);
  const conversationId = result.conversationId;

  const failed = result.status !== 'success' || result.paymentStatus !== 'SUCCESS';

  const db = createServiceClient();

  if (db && conversationId) {
    if (failed) {
      await db
        .from('orders')
        .update({ payment_status: 'failed', status: 'cancelled' })
        .eq('order_no', conversationId);
    } else {
      const { data: order } = await db
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'preparing',
          payment_id: result.paymentId ?? null,
          conversation_id: conversationId,
        })
        .eq('order_no', conversationId)
        .select('*, order_items(*)')
        .single();

      const typed = order as (OrderRow & { order_items: OrderItemRow[] }) | null;

      if (typed) {
        const address = typed.shipping_address;
        const payload = {
          orderNo: typed.order_no,
          customerName: typed.full_name,
          email: typed.email,
          total: Number(typed.total),
          paymentMethod: 'Kredi Kartı (3D Secure)',
          shippingMethod: typed.shipping_method,
          address: `${address.address}, ${address.district} / ${address.city}`,
          items: typed.order_items.map((item) => ({
            name: item.product_name,
            variant: item.variant_label,
            quantity: item.quantity,
            lineTotal: Number(item.line_total),
          })),
        };

        // Mail failures must not affect the payment result.
        await Promise.allSettled([
          sendOrderConfirmation(payload),
          sendAdminOrderNotice(payload),
        ]);
      }
    }
  }

  const target = failed
    ? `${env.siteUrl}/checkout/result?durum=hata&mesaj=${encodeURIComponent(result.errorMessage ?? 'Ödeme tamamlanamadı.')}`
    : `${env.siteUrl}/checkout/result?durum=basarili&no=${encodeURIComponent(conversationId ?? '')}`;

  // 303 turns the POST into a GET redirect
  return NextResponse.redirect(target, { status: 303 });
}

export async function GET() {
  return NextResponse.redirect(`${env.siteUrl}/checkout/result?durum=hata`, { status: 303 });
}
