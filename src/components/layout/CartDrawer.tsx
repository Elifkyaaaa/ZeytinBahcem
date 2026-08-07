'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useEscape, useLockBodyScroll } from '@/hooks';
import { site } from '@/lib/data/site';
import { cartCount, cartTotal, useCart } from '@/lib/store/cart';
import { blurDataURL, formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const open = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  const handleClose = useCallback(() => close(), [close]);
  useEscape(handleClose, open);
  useLockBodyScroll(open);

  const subtotal = cartTotal(items);
  const count = cartCount(items);
  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[70] bg-olive-950/45 backdrop-blur-sm"
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Sepetim"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[75] flex w-[min(28rem,100vw)] flex-col border-l border-border bg-background shadow-lift"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="size-5 text-gold-600 dark:text-gold-400" strokeWidth={1.8} />
                <h2 className="font-display text-xl text-foreground">Sepetim</h2>
                {count > 0 && (
                  <span className="rounded-full bg-foreground/8 px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                aria-label="Sepeti kapat"
                className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/6 hover:text-foreground"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </header>

            {items.length > 0 && (
              <div className="border-b border-border bg-surface-muted px-5 py-3.5">
                <div className="flex items-center gap-2 text-xs text-foreground/80">
                  <Truck className="size-4 shrink-0 text-olive-600 dark:text-olive-300" strokeWidth={1.8} />
                  {remaining > 0 ? (
                    <span>
                      Ücretsiz kargoya <strong className="font-semibold">{formatPrice(remaining)}</strong> kaldı
                    </span>
                  ) : (
                    <span className="font-medium text-olive-700 dark:text-olive-300">
                      Kargo bedava — tebrikler!
                    </span>
                  )}
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-foreground/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-olive-500 to-gold-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-surface-muted">
                    <ShoppingBag className="size-8 text-muted-foreground" strokeWidth={1.3} />
                  </span>
                  <p className="mt-5 font-display text-xl text-foreground">Sepetiniz boş</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Ege’nin en iyi zeytinyağlarını keşfetmeye ne dersiniz?
                  </p>
                  <Button href="/urunler" variant="primary" size="md" className="mt-6" onClick={handleClose}>
                    Ürünleri İncele
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-3.5 rounded-2xl border border-border bg-surface p-3">
                          <Link
                            href={`/urunler/${item.slug}`}
                            onClick={handleClose}
                            className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/urunler/${item.slug}`}
                                onClick={handleClose}
                                className="line-clamp-2 text-sm leading-snug font-medium text-foreground transition-colors hover:text-gold-600"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => remove(item.key)}
                                aria-label={`${item.name} ürününü sepetten çıkar`}
                                className="-m-1 shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-red-600"
                              >
                                <Trash2 className="size-4" strokeWidth={1.8} />
                              </button>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.variantLabel}</p>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                              <QuantityStepper
                                value={item.quantity}
                                onChange={(q) => setQuantity(item.key, q)}
                                size="sm"
                              />
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border bg-surface px-5 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Ara toplam</span>
                  <span className="font-display text-2xl text-foreground tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Kargo ve indirimler ödeme adımında hesaplanır.
                </p>
                <div className="mt-4 grid gap-2.5">
                  <Button href="/odeme" variant="gold" size="lg" onClick={handleClose}>
                    Ödemeye Geç
                    <ArrowRight className="size-4" strokeWidth={2.2} />
                  </Button>
                  <Button href="/sepet" variant="outline" size="md" onClick={handleClose}>
                    Sepeti Görüntüle
                  </Button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
