'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  CreditCard,
  Heart,
  Link2,
  PackageCheck,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { StarRating } from '@/components/ui/StarRating';
import { FacebookIcon, WhatsAppIcon } from '@/components/ui/icons';
import { useCopy, useHydrated } from '@/hooks';
import { site } from '@/lib/data/site';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { useWishlist } from '@/lib/store/wishlist';
import { cn, discountPercent, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { productCardText, productPurchaseText } from '@/lib/data/text/product';

const trustPoints = [Truck, PackageCheck, ShieldCheck].map((Icon, i) => ({
  Icon,
  text: productPurchaseText.assurances[i].text,
  hint: productPurchaseText.assurances[i].hint(site.freeShippingThreshold),
}));

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toast = useUi((s) => s.toast);
  const hydrated = useHydrated();
  const { copied, copy } = useCopy();

  const defaultIndex = Math.max(
    0,
    product.variants.findIndex((v) => v.label === product.volume),
  );
  const [variantIndex, setVariantIndex] = useState(defaultIndex);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const variant = product.variants[variantIndex];
  const discount = discountPercent(variant.price, variant.oldPrice);
  const shareUrl = `${site.url}/products/${product.slug}`;

  const handleAdd = () => {
    add(product, variant, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    toast({
      variant: 'success',
      title: 'Sepete eklendi',
      description: `${product.name} — ${variant.label} × ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    add(product, variant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="lg:pt-2">
      <div className="flex flex-wrap items-center gap-2">
        {product.badge && <Badge tone="gold">{product.badge}</Badge>}
        {discount > 0 && <Badge tone="discount">%{discount} indirim</Badge>}
        {product.inStock ? (
          product.stockCount <= 5 ? (
            <Badge tone="warning">
              <TriangleAlert className="size-3" strokeWidth={2.4} />
              {productPurchaseText.lowStock(product.stockCount)}
            </Badge>
          ) : (
            <Badge tone="success">
              <Check className="size-3" strokeWidth={3} />
              Stokta var
            </Badge>
          )
        ) : (
          <Badge tone="neutral">Stokta yok</Badge>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-[2.7rem]">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <StarRating rating={product.rating} size="md" showValue />
        <a
          href="#yorumlar"
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-gold-600 hover:underline"
        >
          {productPurchaseText.reviewCount(product.reviewCount)}
        </a>
        <span className="text-sm text-muted-foreground">{productPurchaseText.sku(product.id.toUpperCase())}</span>
      </div>

      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      <div className="mt-7 flex items-end gap-3.5">
        <span className="font-display text-4xl leading-none font-semibold text-foreground tabular-nums">
          {formatPrice(variant.price)}
        </span>
        {variant.oldPrice && (
          <span className="pb-1 text-lg text-muted-foreground line-through tabular-nums">
            {formatPrice(variant.oldPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="pb-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
            {formatPrice((variant.oldPrice ?? 0) - variant.price)} tasarruf
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{productPurchaseText.vatNote}</p>

      {/* Size selection */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Gramaj / Hacim
          <span className="ml-2 font-normal text-muted-foreground">{variant.label}</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {product.variants.map((v, i) => {
            const selected = i === variantIndex;
            return (
              <button
                key={v.value}
                type="button"
                onClick={() => setVariantIndex(i)}
                disabled={!v.inStock}
                aria-pressed={selected}
                className={cn(
                  'relative flex min-w-[5.25rem] flex-col items-center rounded-xl border px-4 py-2.5 transition-all duration-300',
                  selected
                    ? 'border-gold-500 bg-gold-500/8 shadow-soft'
                    : 'border-border hover:border-gold-500/50 hover:-translate-y-0.5',
                  !v.inStock && 'cursor-not-allowed opacity-45 hover:translate-y-0',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-semibold',
                    selected ? 'text-gold-700 dark:text-gold-300' : 'text-foreground',
                  )}
                >
                  {v.label}
                </span>
                <span className="mt-0.5 text-[0.7rem] text-muted-foreground tabular-nums">
                  {v.inStock ? formatPrice(v.price) : productPurchaseText.outOfStock}
                </span>
                {selected && (
                  <motion.span
                    layoutId="variant-check"
                    className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-gold-500 text-olive-950"
                  >
                    <Check className="size-3" strokeWidth={3.2} />
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Adet + aksiyonlar */}
      <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Adet</span>
          <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stockCount)} />
        </div>
        <p className="text-sm text-muted-foreground sm:ml-auto">
          Toplam:{' '}
          <strong className="font-semibold text-foreground tabular-nums">
            {formatPrice(variant.price * quantity)}
          </strong>
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          onClick={handleAdd}
          variant="primary"
          size="lg"
          disabled={!variant.inStock}
          className="w-full"
        >
          {added ? (
            <>
              <Check className="size-5" strokeWidth={2.6} />
              Sepete Eklendi
            </>
          ) : (
            <>
              <ShoppingBag className="size-5" strokeWidth={2} />
              Sepete Ekle
            </>
          )}
        </Button>
        <Button
          onClick={handleBuyNow}
          variant="gold"
          size="lg"
          disabled={!variant.inStock}
          className="w-full"
        >
          <CreditCard className="size-5" strokeWidth={2} />
          {productPurchaseText.buyNow}
        </Button>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            toggleWish(product.id);
            toast({
              variant: 'info',
              title: wished ? productCardText.removedToast : productCardText.addedToast,
              description: product.name,
            });
          }}
          aria-pressed={hydrated ? wished : undefined}
          className={cn(
            'inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5',
            hydrated && wished
              ? 'border-red-400/50 bg-red-500/8 text-red-600 dark:text-red-400'
              : 'border-border text-foreground/80 hover:border-gold-500/50',
          )}
        >
          <Heart className="size-4" strokeWidth={1.9} fill={hydrated && wished ? 'currentColor' : 'none'} />
          {hydrated && wished ? 'Favorilerde' : 'Favorilere Ekle'}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShareOpen((v) => !v)}
            aria-expanded={shareOpen}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50"
          >
            <Share2 className="size-4" strokeWidth={1.9} />
            {productPurchaseText.share}
          </button>

          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 z-20 mt-2 flex gap-1 rounded-2xl border border-border bg-surface p-1.5 shadow-lift"
              >
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={productPurchaseText.shareWhatsapp}
                  className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-[#25D366]"
                >
                  <WhatsAppIcon className="size-[1.15rem]" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={productPurchaseText.shareFacebook}
                  className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-[#1877F2]"
                >
                  <FacebookIcon className="size-[1.15rem]" />
                </a>
                <button
                  type="button"
                  onClick={() => copy(shareUrl)}
                  aria-label={productPurchaseText.copyLink}
                  className="grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                >
                  {copied ? (
                    <Check className="size-[1.15rem] text-olive-600" strokeWidth={2.6} />
                  ) : (
                    <Link2 className="size-[1.15rem]" strokeWidth={1.9} />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button onClick={openCart} variant="ghost" size="sm" className="ml-auto">
          {productPurchaseText.viewCart}
        </Button>
      </div>

      <ul className="mt-8 grid gap-3 border-t border-border pt-7 sm:grid-cols-3">
        {trustPoints.map(({ Icon, text, hint }) => (
          <li key={text} className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <Icon className="size-4.5" strokeWidth={1.7} />
            </span>
            <span>
              <span className="block text-xs font-semibold text-foreground">{text}</span>
              <span className="block text-[0.68rem] text-muted-foreground">{hint}</span>
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-7 space-y-2.5 rounded-2xl bg-surface-muted p-5">
        {product.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/85">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-400" strokeWidth={2.6} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
