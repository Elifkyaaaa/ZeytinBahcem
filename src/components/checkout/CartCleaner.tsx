'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';
import { useCheckout } from '@/lib/store/checkout';

/**
 * Clears the cart and any applied coupon when payment returns successfully.
 * Kept as its own client component so a server component can render it.
 */
export function CartCleaner() {
  const clear = useCart((s) => s.clear);
  const clearCoupon = useCheckout((s) => s.clearCoupon);

  useEffect(() => {
    clear();
    clearCoupon();
  }, [clear, clearCoupon]);

  return null;
}
