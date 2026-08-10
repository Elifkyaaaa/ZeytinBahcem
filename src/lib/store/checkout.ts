'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { findCoupon, shippingMethods, VAT_RATE, type ShippingMethodId } from '@/lib/data/coupons';
import { site } from '@/lib/data/site';
import type { CartItem } from '@/types';

interface CheckoutState {
  couponCode: string | null;
  shippingMethod: ShippingMethodId;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  setShippingMethod: (id: ShippingMethodId) => void;
}

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      couponCode: null,
      shippingMethod: 'standart',

      applyCoupon: (code) => {
        const coupon = findCoupon(code);
        if (!coupon) return { ok: false, message: 'Bu kupon kodu geçerli değil.' };
        set({ couponCode: coupon.code });
        return { ok: true, message: coupon.description };
      },

      clearCoupon: () => set({ couponCode: null }),
      setShippingMethod: (id) => set({ shippingMethod: id }),
    }),
    { name: 'zb-checkout' },
  ),
);

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
  freeShipping: boolean;
  couponValid: boolean;
  couponMessage: string | null;
}

/**
 * Single source of truth for the order summary. The cart and checkout pages
 * call the same function so their totals can never disagree.
 */
export function calcTotals(
  items: CartItem[],
  couponCode: string | null,
  shippingMethodId: ShippingMethodId,
): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const method = shippingMethods.find((m) => m.id === shippingMethodId) ?? shippingMethods[0];

  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const couponValid = Boolean(coupon && subtotal >= coupon.minSubtotal);
  let couponMessage: string | null = null;

  if (coupon && !couponValid) {
    couponMessage = `Bu kupon en az ${coupon.minSubtotal.toLocaleString('tr-TR')} ₺ tutarında sipariş gerektirir.`;
  } else if (coupon && couponValid) {
    couponMessage = coupon.description;
  }

  let discount = 0;
  let shippingFree = false;

  if (coupon && couponValid) {
    if (coupon.type === 'percent') discount = subtotal * coupon.value;
    else if (coupon.type === 'amount') discount = Math.min(coupon.value, subtotal);
    else shippingFree = true;
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const thresholdMet = afterDiscount >= site.freeShippingThreshold;
  const freeShipping = shippingFree || thresholdMet || method.price === 0;
  const shipping = items.length === 0 || freeShipping ? 0 : method.price;

  const total = afterDiscount + shipping;
  // Prices include VAT; the summary line extracts it back out.
  const vat = total - total / (1 + VAT_RATE);

  return {
    subtotal,
    discount,
    shipping,
    vat,
    total,
    freeShipping,
    couponValid,
    couponMessage,
  };
}
