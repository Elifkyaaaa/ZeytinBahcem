'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { useHydrated } from '@/hooks';
import { products } from '@/lib/data/products';
import { useUi } from '@/lib/store/ui';
import { useWishlist } from '@/lib/store/wishlist';
import { favoritesText } from '@/lib/data/text/account';

export function FavoritesView() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const toast = useUi((s) => s.toast);

  const items = products.filter((p) => ids.includes(p.id));

  if (!hydrated) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-96 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center shadow-soft sm:p-16">
        <span className="grid size-20 place-items-center rounded-full bg-surface-muted">
          <Heart className="size-8 text-muted-foreground" strokeWidth={1.3} />
        </span>
        <h2 className="mt-6 font-display text-2xl text-foreground">{favoritesText.emptyTitle}</h2>
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {favoritesText.emptyBody}
        </p>
        <Button href="/products" variant="gold" size="lg" className="mt-7">
          {favoritesText.emptyCta}
          <ArrowRight className="size-4" strokeWidth={2.2} />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground tabular-nums">{items.length}</strong>{' '}
          {favoritesText.countAfter}
        </p>
        <button
          onClick={() => {
            clear();
            toast({ variant: 'info', title: 'Favoriler temizlendi' });
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-red-600 hover:underline"
        >
          <Trash2 className="size-3.5" strokeWidth={1.9} />
          {favoritesText.clearAll}
        </button>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
