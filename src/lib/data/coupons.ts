export interface Coupon {
  code: string;
  /** Oransal indirim (0.15 = %15) ya da sabit tutar */
  type: 'percent' | 'amount' | 'shipping';
  value: number;
  minSubtotal: number;
  description: string;
}

export const coupons: Coupon[] = [
  {
    code: 'HASAT10',
    type: 'percent',
    value: 0.1,
    minSubtotal: 0,
    description: 'Tüm siparişlerde %10 indirim',
  },
  {
    code: 'ZEYTIN25',
    type: 'percent',
    value: 0.25,
    minSubtotal: 1500,
    description: '1.500 ₺ ve üzeri siparişlerde %25 indirim',
  },
  {
    code: 'ILKSIPARIS',
    type: 'amount',
    value: 150,
    minSubtotal: 750,
    description: 'İlk siparişe 150 ₺ indirim',
  },
  {
    code: 'KARGOBEDAVA',
    type: 'shipping',
    value: 0,
    minSubtotal: 0,
    description: 'Kargo ücreti bizden',
  },
];

export function findCoupon(code: string) {
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}

/** VAT is already included in prices; the summary extracts it back out. */
export const VAT_RATE = 0.2;

export const shippingMethods = [
  {
    id: 'standart',
    name: 'Standart Kargo',
    detail: '1–3 iş günü içinde teslim',
    price: 79.9,
  },
  {
    id: 'hizli',
    name: 'Hızlı Kargo',
    detail: 'Ertesi iş günü teslim (14.00’a kadar)',
    price: 149.9,
  },
  {
    id: 'magaza',
    name: 'Mağazadan Teslim Al',
    detail: 'Orhangazi mağazamızdan aynı gün',
    price: 0,
  },
] as const;

export type ShippingMethodId = (typeof shippingMethods)[number]['id'];
