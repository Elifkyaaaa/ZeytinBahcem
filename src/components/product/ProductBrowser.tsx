'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { categories } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import { cn, formatPrice, slugify } from '@/lib/utils';

const sortOptions = [
  { value: 'populer', label: 'Önerilen' },
  { value: 'yeni', label: 'En Yeniler' },
  { value: 'fiyat-artan', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'fiyat-azalan', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'puan', label: 'En Yüksek Puan' },
] as const;

const PRICE_MAX = 5500;

export function ProductBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('kategori') ?? '';
  const initialSort = searchParams.get('siralama') ?? 'populer';
  const initialQuery = searchParams.get('q') ?? '';

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const q = slugify(query.trim());
    const filtered = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      if (discountOnly && !p.oldPrice) return false;
      if (q.length >= 2) {
        const haystack = slugify(`${p.name} ${p.shortDescription}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'fiyat-artan':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'fiyat-azalan':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'puan':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'yeni':
        sorted.sort((a, b) => Number(b.badge === 'Yeni') - Number(a.badge === 'Yeni'));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return sorted;
  }, [category, sort, query, maxPrice, inStockOnly, discountOnly]);

  const activeFilterCount =
    (category ? 1 : 0) +
    (maxPrice < PRICE_MAX ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const reset = () => {
    setCategory('');
    setQuery('');
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setDiscountOnly(false);
    router.replace('/urunler', { scroll: false });
  };

  const selectCategory = (slug: string) => {
    setCategory(slug);
    router.replace(slug ? `/urunler?kategori=${slug}` : '/urunler', { scroll: false });
  };

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Kategori</h3>
        <ul className="mt-3.5 space-y-1">
          <li>
            <button
              onClick={() => selectCategory('')}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                !category
                  ? 'bg-olive-600/8 font-medium text-olive-800 dark:bg-gold-400/10 dark:text-gold-300'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              Tüm Ürünler
              <span className="text-xs tabular-nums opacity-60">{products.length}</span>
            </button>
          </li>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <li key={c.slug}>
                <button
                  onClick={() => selectCategory(c.slug)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                    category === c.slug
                      ? 'bg-olive-600/8 font-medium text-olive-800 dark:bg-gold-400/10 dark:text-gold-300'
                      : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                  )}
                >
                  {c.name}
                  <span className="text-xs tabular-nums opacity-60">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Ürün ara</h3>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim veya açıklamada ara…"
          aria-label="Ürünlerde ara"
          className="mt-3.5 h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm transition-all placeholder:text-muted-foreground/70 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">Üst fiyat</h3>
          <span className="text-sm text-muted-foreground tabular-nums">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={150}
          max={PRICE_MAX}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="En yüksek fiyat"
          className="mt-4 w-full accent-gold-500"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Diğer</h3>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="size-4 rounded accent-gold-500"
          />
          Yalnızca stoktakiler
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
            className="size-4 rounded accent-gold-500"
          />
          İndirimli ürünler
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button onClick={reset} variant="outline" size="sm" className="w-full">
          <X className="size-4" strokeWidth={2} />
          Filtreleri temizle
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filterPanel}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <p className="text-sm text-muted-foreground">
            <strong className="font-semibold text-foreground tabular-nums">{results.length}</strong>{' '}
            ürün listeleniyor
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-gold-500/50 lg:hidden"
            >
              <SlidersHorizontal className="size-4" strokeWidth={1.9} />
              Filtrele
              {activeFilterCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-gold-500 text-[0.65rem] font-bold text-olive-950">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <label className="sr-only" htmlFor="sort">
              Sıralama
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-foreground transition-colors hover:border-gold-500/50 focus:border-gold-500 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="py-24 text-center">
            <span className="inline-grid size-16 place-items-center rounded-full bg-surface-muted">
              <LayoutGrid className="size-7 text-muted-foreground" strokeWidth={1.4} />
            </span>
            <p className="mt-5 font-serif text-2xl text-foreground">Sonuç bulunamadı</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Filtreleri gevşetmeyi veya farklı bir kelime denemeyi öneririz.
            </p>
            <Button onClick={reset} variant="primary" size="md" className="mt-6">
              Filtreleri temizle
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.38, delay: Math.min(i, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ProductCard product={product} priority={i < 3} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Mobil filtre çekmecesi */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[70] bg-olive-950/45 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtreler"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[75] flex w-[min(20rem,88vw)] flex-col border-r border-border bg-background shadow-lift lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-serif text-xl">Filtreler</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Filtreleri kapat"
                  className="grid size-10 place-items-center rounded-full text-foreground/70 hover:bg-foreground/6"
                >
                  <X className="size-5" strokeWidth={1.8} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{filterPanel}</div>
              <div className="border-t border-border p-5">
                <Button onClick={() => setFiltersOpen(false)} variant="primary" size="md" className="w-full">
                  {results.length} ürünü göster
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
