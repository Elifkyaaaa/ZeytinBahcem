'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { PaymentMark } from '@/components/ui/icons';
import { useHydrated } from '@/hooks';
import { coupons } from '@/lib/data/coupons';
import { site } from '@/lib/data/site';
import { useCart } from '@/lib/store/cart';
import { calcTotals, useCheckout } from '@/lib/store/checkout';
import { useUi } from '@/lib/store/ui';
import { blurDataURL, cn, formatPrice } from '@/lib/utils';
import { cartText } from '@/lib/data/text/shop';

export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const couponCode = useCheckout((s) => s.couponCode);
  const applyCoupon = useCheckout((s) => s.applyCoupon);
  const clearCoupon = useCheckout((s) => s.clearCoupon);
  const shippingMethod = useCheckout((s) => s.shippingMethod);
  const toast = useUi((s) => s.toast);

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const totals = calcTotals(items, couponCode, shippingMethod);
  const remaining = Math.max(0, site.freeShippingThreshold - (totals.subtotal - totals.discount));
  const progress = Math.min(
    100,
    ((totals.subtotal - totals.discount) / site.freeShippingThreshold) * 100,
  );

  const handleApply = () => {
    const result = applyCoupon(codeInput);
    if (result.ok) {
      setCodeError(null);
      setCodeInput('');
      toast({ variant: 'success', title: cartText.couponAppliedToast, description: result.message });
    } else {
      setCodeError(result.message);
    }
  };

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_23rem]">
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center sm:py-24">
        <span className="grid size-24 place-items-center rounded-full bg-surface-muted">
          <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1.2} />
        </span>
        <h2 className="mt-7 font-display text-3xl text-foreground">{cartText.emptyTitle}</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {cartText.emptyBody}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/urunler" variant="gold" size="lg">
            {cartText.emptyCta}
            <ArrowRight className="size-4" strokeWidth={2.2} />
          </Button>
          <Button href="/favoriler" variant="outline" size="lg">
            Favorilerime Bak
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:gap-10">
      <div>
        {/* Free shipping progress */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2.5 text-sm">
            <Truck className="size-4.5 shrink-0 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
            {remaining > 0 ? (
              <span className="text-foreground/85">
                {cartText.freeShippingBefore}{' '}
                <strong className="font-semibold text-foreground">{formatPrice(remaining)}</strong>{' '}
                {cartText.freeShippingAfter}
              </span>
            ) : (
              <span className="font-medium text-olive-700 dark:text-olive-300">
                {cartText.freeShippingReached}
              </span>
            )}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-olive-500 to-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">
            {cartText.itemsHeading}
            <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
              {cartText.itemCount(items.length)}
            </span>
          </h2>
          <button
            onClick={() => {
              clear();
              toast({ variant: 'info', title: cartText.clearedToast });
            }}
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-red-600 hover:underline"
          >
            {cartText.clearCart}
          </button>
        </div>

        <ul className="mt-4 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.key}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginTop: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-shadow duration-400 hover:shadow-lift sm:flex-row sm:items-center sm:p-5">
                  <Link
                    href={`/urunler/${item.slug}`}
                    className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 640px) 112px, 92vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/urunler/${item.slug}`}
                      className="font-display text-lg leading-snug text-foreground transition-colors hover:text-gold-700 dark:hover:text-gold-400"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{item.variantLabel}</p>
                    <p className="mt-2 text-sm text-muted-foreground tabular-nums">
                      Birim: {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => setQuantity(item.key, q)}
                    />
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                      <span className="text-lg font-semibold text-foreground tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => remove(item.key)}
                        aria-label={cartText.removeItemLabel(item.name)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.9} />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-7">
          <Button href="/urunler" variant="outline" size="md">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
            {cartText.continueShopping}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-display text-xl text-foreground">{cartText.summaryHeading}</h2>

          {/* Kupon */}
          <div className="mt-5">
            {couponCode ? (
              <div
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3.5',
                  totals.couponValid
                    ? 'border-olive-500/35 bg-olive-500/8'
                    : 'border-amber-500/40 bg-amber-500/8',
                )}
              >
                <Tag
                  className={cn(
                    'mt-0.5 size-4 shrink-0',
                    totals.couponValid ? 'text-olive-600 dark:text-olive-300' : 'text-amber-600',
                  )}
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{couponCode}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{totals.couponMessage}</p>
                </div>
                <button
                  onClick={() => {
                    clearCoupon();
                    toast({ variant: 'info', title: cartText.couponRemovedToast });
                  }}
                  aria-label={cartText.removeCouponLabel}
                  className="-m-1 rounded-lg p-1 text-muted-foreground transition-colors hover:text-red-600"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="coupon" className="text-sm font-medium text-foreground">
                  Kupon kodu
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="coupon"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value.toUpperCase());
                      setCodeError(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                    placeholder={cartText.couponPlaceholder}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm tracking-wide uppercase transition-all placeholder:normal-case placeholder:text-muted-foreground/70 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
                  />
                  <button
                    onClick={handleApply}
                    disabled={!codeInput.trim()}
                    className="h-11 shrink-0 rounded-xl bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 disabled:opacity-40 dark:bg-olive-500 dark:text-olive-950"
                  >
                    Uygula
                  </button>
                </div>
                {codeError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">{codeError}</p>
                )}
                <p className="mt-2.5 text-[0.7rem] text-muted-foreground">
                  Deneyin:{' '}
                  {coupons.slice(0, 3).map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => setCodeInput(c.code)}
                      className="font-medium text-gold-700 underline-offset-2 hover:underline dark:text-gold-400"
                    >
                      {i > 0 && ', '}
                      {c.code}
                    </button>
                  ))}
                </p>
              </>
            )}
          </div>

          <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ara toplam</dt>
              <dd className="font-medium text-foreground tabular-nums">
                {formatPrice(totals.subtotal)}
              </dd>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{cartText.discountLabel}</dt>
                <dd className="font-medium text-red-600 tabular-nums dark:text-red-400">
                  −{formatPrice(totals.discount)}
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-muted-foreground">Kargo</dt>
              <dd className="font-medium tabular-nums">
                {totals.shipping === 0 ? (
                  <span className="text-olive-700 dark:text-olive-300">{cartText.freeLabel}</span>
                ) : (
                  <span className="text-foreground">{formatPrice(totals.shipping)}</span>
                )}
              </dd>
            </div>

            <div className="flex justify-between text-xs">
              <dt className="text-muted-foreground">KDV (%20, dâhil)</dt>
              <dd className="text-muted-foreground tabular-nums">{formatPrice(totals.vat)}</dd>
            </div>

            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="font-semibold text-foreground">Toplam</dt>
              <dd className="font-display text-2xl font-semibold text-foreground tabular-nums">
                {formatPrice(totals.total)}
              </dd>
            </div>
          </dl>

          <Button href="/odeme" variant="gold" size="lg" className="mt-6 w-full">
            {cartText.checkoutCta}
            <ArrowRight className="size-4" strokeWidth={2.2} />
          </Button>

          <ul className="mt-5 space-y-2 border-t border-border pt-5">
            {[ShieldCheck, Check, Truck].map((Icon, i) => {
              const text = cartText.trustNotes[i];
              return (
                <li key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Icon
                    className="size-4 shrink-0 text-olive-600 dark:text-gold-400"
                    strokeWidth={1.9}
                  />
                  {text}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center gap-1.5 text-muted-foreground/70">
            {['VISA', 'MASTER', 'TROY', '3D'].map((label) => (
              <PaymentMark key={label} label={label} className="h-6 w-10" />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
