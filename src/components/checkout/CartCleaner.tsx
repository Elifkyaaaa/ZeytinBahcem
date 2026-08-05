'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';
import { useCheckout } from '@/lib/store/checkout';

/**
 * Ödeme başarıyla döndüğünde sepeti ve uygulanmış kuponu temizler.
 * Sunucu bileşeninden çağrılabilsin diye ayrı bir istemci bileşeni.
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
