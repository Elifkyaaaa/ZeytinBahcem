'use client';

import { motion } from 'framer-motion';
import { Check, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { useHydrated } from '@/hooks';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { useWishlist } from '@/lib/store/wishlist';
import { blurDataURL, cn, discountPercent, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { productCardText } from '@/lib/data/text/product';

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toast = useUi((s) => s.toast);
  const hydrated = useHydrated();
  const [added, setAdded] = useState(false);

  const discount = discountPercent(product.price, product.oldPrice);
  const defaultVariant =
    product.variants.find((v) => v.label === product.volume) ?? product.variants[0];

  const handleAdd = () => {
    add(product, defaultVariant, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    toast({
      variant: 'success',
      title: productCardText.addedToCartToast,
      description: `${product.name} — ${defaultVariant.label}`,
    });
    openCart();
  };

  const handleWish = () => {
    toggleWish(product.id);
    toast({
      variant: 'info',
      title: wished ? productCardText.removedToast : productCardText.addedToast,
      description: product.name,
    });
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border',
        'bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-surface-muted">
        {/* `fill` needs its immediate parent to be positioned; the wrapper one level
            up being relative does not help when this link sits in between. */}
        <Link
          href={`/products/${product.slug}`}
          aria-label={product.name}
          className="relative block size-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 44vw, 88vw"
            placeholder="blur"
            blurDataURL={blurDataURL()}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
        </Link>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-olive-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {discount > 0 && <Badge tone="discount">{productCardText.discountBadge(discount)}</Badge>}
          {product.badge && <Badge tone="gold">{product.badge}</Badge>}
          {product.stockCount <= 5 && product.inStock && (
            <Badge tone="warning">{productCardText.lowStockBadge(product.stockCount)}</Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleWish}
          aria-label={wished ? productCardText.removeFromWishlist : productCardText.addToWishlist}
          aria-pressed={hydrated ? wished : undefined}
          className={cn(
            'absolute top-3 right-3 z-20 grid size-10 place-items-center rounded-full',
            'border border-white/25 bg-white/80 backdrop-blur-md transition-all duration-300',
            'hover:scale-110 active:scale-95 dark:bg-olive-950/70',
            hydrated && wished ? 'text-red-500' : 'text-olive-800/70 dark:text-cream-100/80',
          )}
        >
          <motion.span
            key={hydrated && wished ? 'on' : 'off'}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 18 }}
          >
            <Heart
              className="size-[1.05rem]"
              strokeWidth={1.9}
              fill={hydrated && wished ? 'currentColor' : 'none'}
            />
          </motion.span>
        </button>

        {/* Rises on hover on desktop; always visible on touch */}
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-0 opacity-100 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-y-[130%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-full px-4 py-3',
              'text-sm font-semibold shadow-lift transition-all duration-300 active:scale-[0.97]',
              added
                ? 'bg-olive-600 text-cream-50'
                : 'bg-cream-50 text-olive-900 hover:bg-gold-400 dark:bg-olive-900 dark:text-cream-50 dark:hover:bg-gold-500 dark:hover:text-olive-950',
              !product.inStock && 'cursor-not-allowed opacity-60',
            )}
          >
            {added ? (
              <>
                <Check className="size-4" strokeWidth={2.6} />
                {productCardText.added}
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" strokeWidth={2.1} />
                {product.inStock ? productCardText.addToCart : productCardText.outOfStock}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <StarRating rating={product.rating} count={product.reviewCount} />

        <h3 className="mt-2.5 font-display text-[1.05rem] leading-snug text-foreground">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors duration-300 after:absolute after:inset-0 hover:text-gold-700 dark:hover:text-gold-400"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div>
            <span className="block text-[0.68rem] tracking-wide text-muted-foreground">
              {product.volume}
            </span>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
