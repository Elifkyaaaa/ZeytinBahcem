'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, variant: ProductVariant, quantity?: number) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (product, variant, quantity = 1) =>
        set((state) => {
          const key = `${product.id}:${variant.value}`;
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, 99) } : i,
              ),
            };
          }
          const item: CartItem = {
            key,
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: variant.price,
            image: product.image,
            variantLabel: variant.label,
            quantity,
          };
          return { items: [...state.items, item] };
        }),

      remove: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) =>
                  i.key === key ? { ...i, quantity: Math.min(quantity, 99) } : i,
                ),
        })),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'zb-cart',
      // Panelin açık/kapalı durumu kalıcı olmamalı; yalnızca satırlar saklanır.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
