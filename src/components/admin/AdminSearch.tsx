'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Package, Search, ShoppingCart, User, X, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useEscape } from '@/hooks';
import { orders } from '@/lib/data/admin';
import { products } from '@/lib/data/products';
import { cn, formatPrice, slugify } from '@/lib/utils';

interface Result {
  id: string;
  group: 'Ürün' | 'Sipariş' | 'Sayfa';
  title: string;
  meta: string;
  href: string;
  Icon: LucideIcon;
}

/** Quick navigation targets inside the panel. */
const pages: { label: string; href: string }[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Ürün Yönetimi', href: '/admin/products' },
  { label: 'Kategori Yönetimi', href: '/admin/categories' },
  { label: 'Stok Takibi', href: '/admin/stock' },
  { label: 'Sipariş Yönetimi', href: '/admin/orders' },
  { label: 'Müşteri Yönetimi', href: '/admin/customers' },
  { label: 'Kampanyalar', href: '/admin/campaigns' },
  { label: 'Kuponlar', href: '/admin/coupons' },
  { label: 'Yorum Yönetimi', href: '/admin/reviews' },
  { label: 'Blog Yönetimi', href: '/admin/blog' },
  { label: 'Slider Yönetimi', href: '/admin/slider' },
  { label: 'Görsel Yönetimi', href: '/admin/images' },
  { label: 'Site Ayarları', href: '/admin/settings' },
  { label: 'Kargo Ayarları', href: '/admin/shipping' },
  { label: 'Ödeme Ayarları', href: '/admin/payment-settings' },
  { label: 'Kullanıcı Yetkileri', href: '/admin/permissions' },
];

export function AdminSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEscape(() => setOpen(false), open);

  // Ctrl/⌘ + K ile odaklan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = slugify(query.trim());
    if (q.length < 2) return [];

    const productHits: Result[] = products
      .filter((p) => slugify(`${p.name} ${p.shortDescription}`).includes(q))
      .slice(0, 5)
      .map((p) => ({
        id: `p-${p.id}`,
        group: 'Ürün',
        title: p.name,
        meta: `${p.volume} · ${formatPrice(p.price)} · ${p.stockCount} adet stok`,
        href: `/admin/products`,
        Icon: Package,
      }));

    const orderHits: Result[] = orders
      .filter((o) => slugify(`${o.id} ${o.customer} ${o.city} ${o.email}`).includes(q))
      .slice(0, 5)
      .map((o) => ({
        id: `o-${o.id}`,
        group: 'Sipariş',
        title: o.id,
        meta: `${o.customer} · ${formatPrice(o.total)}`,
        href: `/admin/orders`,
        Icon: ShoppingCart,
      }));

    const customerHits: Result[] = orders
      .filter((o) => slugify(`${o.customer} ${o.email}`).includes(q))
      .slice(0, 3)
      .map((o) => ({
        id: `c-${o.email}`,
        group: 'Sipariş',
        title: o.customer,
        meta: o.email,
        href: `/admin/customers`,
        Icon: User,
      }));

    const pageHits: Result[] = pages
      .filter((p) => slugify(p.label).includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: `s-${p.href}`,
        group: 'Sayfa',
        title: p.label,
        meta: p.href,
        href: p.href,
        Icon: Search,
      }));

    // One customer can appear in several orders, so de-duplicate.
    const seen = new Set<string>();
    return [...pageHits, ...productHits, ...orderHits, ...customerHits].filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [query]);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <div ref={boxRef} className="relative hidden min-w-0 flex-1 sm:block md:max-w-sm">
      <label className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground"
          strokeWidth={1.8}
        />
        <span className="sr-only">Panelde ara</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Reset the highlighted row whenever the query changes.
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Sipariş, ürün veya sayfa ara…"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="admin-search-results"
          aria-autocomplete="list"
          className="h-10 w-full rounded-full border border-border bg-surface pr-16 pl-10 text-sm transition-all placeholder:text-muted-foreground/70 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Aramayı temizle"
            className="absolute right-3 grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
          >
            <X className="size-3.5" strokeWidth={2.2} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 rounded border border-border px-1.5 py-0.5 font-sans text-[0.62rem] text-muted-foreground">
            Ctrl K
          </kbd>
        )}
      </label>

      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            id="admin-search-results"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 z-50 mt-2 w-full min-w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
          >
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                “{query}” için sonuç bulunamadı
              </p>
            ) : (
              <ul className="max-h-96 overflow-y-auto p-1.5">
                {results.map((result, i) => (
                  <li key={result.id}>
                    <Link
                      href={result.href}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                      }}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                        i === active ? 'bg-foreground/6' : 'hover:bg-foreground/4',
                      )}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted-foreground">
                        <result.Icon className="size-4" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {result.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {result.meta}
                        </span>
                      </span>
                      <span className="shrink-0 text-[0.62rem] tracking-wide text-muted-foreground uppercase">
                        {result.group}
                      </span>
                      {i === active && (
                        <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
