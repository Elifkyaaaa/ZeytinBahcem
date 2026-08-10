'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { useEscape, useLockBodyScroll } from '@/hooks';
import { categories } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import { useUi } from '@/lib/store/ui';
import { blurDataURL, formatPrice, slugify } from '@/lib/utils';
import { searchOverlayText } from '@/lib/data/text/layout';

const popular = ['Erken hasat', 'Natürel sızma', 'Sofralık zeytin', 'Hediye seti', 'Organik'];

export function SearchOverlay() {
  const open = useUi((s) => s.searchOpen);
  const close = useUi((s) => s.closeSearch);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    close();
    setQuery('');
  }, [close]);

  useEscape(handleClose, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      // Focusing before the panel animation ends breaks scrolling, so wait a frame.
      const id = window.setTimeout(() => inputRef.current?.focus(), 220);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = slugify(query.trim());
    if (q.length < 2) return [];
    return products
      .filter((p) => {
        const haystack = slugify(`${p.name} ${p.shortDescription} ${p.category}`);
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query]);

  const showEmpty = query.trim().length >= 2 && results.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-olive-950/55 backdrop-blur-md"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={searchOverlayText.regionLabel}
            initial={{ opacity: 0, y: -22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[85] mx-auto w-full max-w-3xl px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-20"
          >
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lift">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Search className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchOverlayText.placeholder}
                  aria-label="Arama terimi"
                  className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-lg"
                />
                <button
                  onClick={handleClose}
                  aria-label={searchOverlayText.closeLabel}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
                >
                  <X className="size-4.5" strokeWidth={1.8} />
                </button>
              </div>

              <div className="max-h-[min(28rem,60vh)] overflow-y-auto overscroll-contain p-3">
                {results.length > 0 && (
                  <ul className="space-y-1">
                    {results.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.28 }}
                      >
                        <Link
                          href={`/urunler/${p.slug}`}
                          onClick={handleClose}
                          className="group flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-foreground/5"
                        >
                          <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              sizes="64px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">
                              {p.name}
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                              {p.shortDescription}
                            </span>
                            <StarRating rating={p.rating} className="mt-1.5" count={p.reviewCount} />
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block text-sm font-semibold text-foreground tabular-nums">
                              {formatPrice(p.price)}
                            </span>
                            <CornerDownLeft className="mt-1.5 ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {showEmpty && (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-foreground">
                      “{query}” için sonuç bulunamadı
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {searchOverlayText.emptyHint}
                    </p>
                  </div>
                )}

                {query.trim().length < 2 && (
                  <div className="p-3">
                    <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      {searchOverlayText.popularHeading}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popular.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-gold-500/50 hover:text-foreground"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    <p className="mt-6 mb-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      Kategoriler
                    </p>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/urunler?kategori=${c.slug}`}
                          onClick={handleClose}
                          className="rounded-xl px-3.5 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-foreground/5"
                        >
                          {c.name}
                          <span className="ml-2 text-xs text-muted-foreground">{c.tagline}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
