import { env, isIyzicoConfigured } from '@/utils/env';

/**
 * iyzico Checkout Form entegrasyonu.
 *
 * `iyzipay` paketi geri çağırma (callback) tabanlıdır; burada Promise'e
 * sarmalıyoruz. Paket CommonJS olduğu için yalnızca Node.js runtime'ında,
 * route handler içinden dinamik olarak yüklenir.
 */

export interface CheckoutBasketItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface CheckoutBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  identityNumber: string;
  address: string;
  city: string;
  country: string;
  ip: string;
}

export interface CheckoutInit {
  conversationId: string;
  price: number;
  paidPrice: number;
  callbackUrl: string;
  buyer: CheckoutBuyer;
  shippingAddress: { contactName: string; city: string; country: string; address: string };
  basketItems: CheckoutBasketItem[];
  enabledInstallments?: number[];
}

export interface CheckoutFormResult {
  status: 'success' | 'failure';
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  token?: string;
  errorMessage?: string;
}

/** iyzipay istemcisi — yalnızca anahtarlar tanımlıysa üretilir. */
async function getClient() {
  if (!isIyzicoConfigured) return null;
  const { default: Iyzipay } = await import('iyzipay');
  return {
    client: new Iyzipay({
      apiKey: env.iyzico.apiKey!,
      secretKey: env.iyzico.secretKey!,
      uri: env.iyzico.baseUrl,
    }),
    Iyzipay,
  };
}

const money = (value: number) => value.toFixed(2);

/**
 * Ödeme formunu başlatır. Dönen `checkoutFormContent`, ödeme sayfasında
 * iframe olarak gömülür; 3D Secure akışı iyzico tarafında yürür.
 */
export async function initCheckoutForm(input: CheckoutInit): Promise<CheckoutFormResult> {
  const loaded = await getClient();
  if (!loaded) {
    return {
      status: 'failure',
      errorMessage:
        'iyzico yapılandırılmamış. .env.local dosyasına IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin.',
    };
  }

  const { client, Iyzipay } = loaded;

  // Sepet kalemlerinin toplamı `price` ile birebir eşleşmelidir, aksi hâlde iyzico reddeder.
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: input.conversationId,
    price: money(input.price),
    paidPrice: money(input.paidPrice),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: input.conversationId,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: input.callbackUrl,
    enabledInstallments: input.enabledInstallments ?? [1, 2, 3, 6, 9, 12],
    buyer: {
      id: input.buyer.id,
      name: input.buyer.name,
      surname: input.buyer.surname,
      gsmNumber: input.buyer.phone,
      email: input.buyer.email,
      identityNumber: input.buyer.identityNumber,
      registrationAddress: input.buyer.address,
      ip: input.buyer.ip,
      city: input.buyer.city,
      country: input.buyer.country,
    },
    shippingAddress: {
      contactName: input.shippingAddress.contactName,
      city: input.shippingAddress.city,
      country: input.shippingAddress.country,
      address: input.shippingAddress.address,
    },
    billingAddress: {
      contactName: input.shippingAddress.contactName,
      city: input.shippingAddress.city,
      country: input.shippingAddress.country,
      address: input.shippingAddress.address,
    },
    basketItems: input.basketItems.map((item) => ({
      id: item.id,
      name: item.name,
      category1: item.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: money(item.price),
    })),
  };

  return new Promise((resolve) => {
    client.checkoutFormInitialize.create(request, (error: unknown, result: CheckoutFormResult) => {
      if (error) {
        resolve({
          status: 'failure',
          errorMessage: error instanceof Error ? error.message : 'Ödeme başlatılamadı.',
        });
        return;
      }
      resolve(result);
    });
  });
}

export interface CheckoutRetrieveResult {
  status: 'success' | 'failure';
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
  paidPrice?: string;
  errorMessage?: string;
}

/**
 * Ödeme dönüşünde sonucu doğrular.
 * Tutar ve durum, veritabanına yazmadan önce mutlaka burada teyit edilmelidir —
 * callback'ten gelen veriye tek başına güvenilmez.
 */
export async function retrieveCheckoutResult(token: string): Promise<CheckoutRetrieveResult> {
  const loaded = await getClient();
  if (!loaded) return { status: 'failure', errorMessage: 'iyzico yapılandırılmamış.' };

  const { client, Iyzipay } = loaded;

  return new Promise((resolve) => {
    client.checkoutForm.retrieve(
      { locale: Iyzipay.LOCALE.TR, token },
      (error: unknown, result: CheckoutRetrieveResult) => {
        if (error) {
          resolve({
            status: 'failure',
            errorMessage: error instanceof Error ? error.message : 'Ödeme doğrulanamadı.',
          });
          return;
        }
        resolve(result);
      },
    );
  });
}
