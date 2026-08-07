'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import {
  deleteProduct,
  saveProduct,
  toggleProductActive,
  type ProductActionState,
} from '@/app/admin/product-actions';
import {
  AdminField,
  adminInput,
  EmptyState,
  Panel,
  Status,
  Table,
  Td,
  Th,
  Toolbar,
  Tr,
} from '@/components/admin/primitives';
import { FormAlert } from '@/components/auth/FormParts';
import { blurDataURL, cn, formatNumber, formatPrice, slugify } from '@/lib/utils';
import type { Category, Product } from '@/types';

const initialState: ProductActionState = {};

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'featured', label: 'Öne çıkan' },
  { id: 'discount', label: 'İndirimli' },
  { id: 'low', label: 'Kritik stok' },
  { id: 'passive', label: 'Yayında değil' },
];

const badges = ['', 'Yeni', 'Çok Satan', 'Sınırlı Üretim', 'Ödüllü'];

function ProductForm({
  product,
  categories,
  onDone,
}: {
  product?: Product;
  categories: Category[];
  onDone: () => void;
}) {
  const [state, action] = useActionState(saveProduct, initialState);
  const [name, setName] = useState(product?.name ?? '');

  if (state.success) queueMicrotask(onDone);

  return (
    <form action={action} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <FormAlert error={state.error} success={state.success} />

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Ürün adı" className="sm:col-span-2">
          <input
            name="name"
            required
            minLength={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={adminInput}
            placeholder="Ayvalık Natürel Sızma Zeytinyağı"
          />
        </AdminField>

        <AdminField label="URL adresi (slug)" hint="Boş bırakılırsa isimden üretilir">
          <input
            name="slug"
            defaultValue={product?.slug}
            className={adminInput}
            placeholder={name ? slugify(name) : 'urun-adi'}
          />
        </AdminField>

        <AdminField label="Kategori">
          <select name="category" defaultValue={product?.category ?? ''} className={adminInput}>
            <option value="">Seçilmedi</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Fiyat (₺)">
          <input
            name="price"
            required
            inputMode="decimal"
            defaultValue={product?.price}
            className={adminInput}
            placeholder="649"
          />
        </AdminField>

        <AdminField label="Eski fiyat (₺)" hint="İndirim etiketi için — boş bırakılabilir">
          <input
            name="oldPrice"
            inputMode="decimal"
            defaultValue={product?.oldPrice ?? ''}
            className={adminInput}
            placeholder="799"
          />
        </AdminField>

        <AdminField label="Gramaj / hacim">
          <input
            name="volume"
            defaultValue={product?.volume}
            className={adminInput}
            placeholder="1 L"
          />
        </AdminField>

        <AdminField label="Stok adedi">
          <input
            name="stockCount"
            inputMode="numeric"
            defaultValue={product?.stockCount ?? 0}
            className={adminInput}
            placeholder="50"
          />
        </AdminField>

        <AdminField label="Rozet">
          <select name="badge" defaultValue={product?.badge ?? ''} className={adminInput}>
            {badges.map((badge) => (
              <option key={badge || 'none'} value={badge}>
                {badge || 'Yok'}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Görsel adresi" hint="Görsel Yönetimi'nden yükleyip URL'yi yapıştırın">
          <input
            name="imageUrl"
            defaultValue={product?.image}
            className={adminInput}
            placeholder="https://res.cloudinary.com/…"
          />
        </AdminField>

        <AdminField label="Kısa açıklama" className="sm:col-span-2">
          <input
            name="shortDescription"
            defaultValue={product?.shortDescription}
            className={adminInput}
            placeholder="Kart üzerinde görünen tek cümle"
          />
        </AdminField>

        <AdminField label="Açıklama" className="sm:col-span-2">
          <textarea
            name="description"
            rows={5}
            defaultValue={product?.description}
            className={cn(adminInput, 'h-auto resize-y py-3')}
          />
        </AdminField>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product ? product.inStock : true}
            className="size-4 rounded accent-gold-500"
          />
          Yayında
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.featured ?? false}
            className="size-4 rounded accent-gold-500"
          />
          Ana sayfada öne çıkar
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-5">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-olive-700 px-8 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950"
        >
          {product ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 text-sm font-medium transition-colors hover:border-gold-500/50"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}

export function ProductManager({
  products,
  categories,
  live,
}: {
  products: Product[];
  categories: Category[];
  live: boolean;
}) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState<{ kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: string }>(
    { kind: 'list' },
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (tab === 'featured' && !p.featured) return false;
      if (tab === 'discount' && !p.oldPrice) return false;
      if (tab === 'low' && p.stockCount > 20) return false;
      if (tab === 'passive' && p.inStock) return false;
      if (q.length >= 2 && !slugify(p.name).includes(q)) return false;
      return true;
    });
  }, [products, search, tab, category]);

  const counts = {
    all: products.length,
    featured: products.filter((p) => p.featured).length,
    discount: products.filter((p) => p.oldPrice).length,
    low: products.filter((p) => p.stockCount <= 20).length,
    passive: products.filter((p) => !p.inStock).length,
  };

  const editing = mode.kind === 'edit' ? products.find((p) => p.id === mode.id) : undefined;

  if (mode.kind !== 'list') {
    return (
      <Panel
        title={editing ? 'Ürünü Düzenle' : 'Yeni Ürün'}
        actions={
          <button
            onClick={() => setMode({ kind: 'list' })}
            aria-label="Formu kapat"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
          >
            <X className="size-5" strokeWidth={1.9} />
          </button>
        }
      >
        <ProductForm
          product={editing}
          categories={categories}
          onDone={() => setMode({ kind: 'list' })}
        />
      </Panel>
    );
  }

  return (
    <Panel padded={false}>
      <div className="p-5 pb-0">
        <Toolbar
          search={search}
          onSearch={setSearch}
          placeholder="Ürün adında ara…"
          tabs={tabs.map((t) => ({ ...t, count: counts[t.id as keyof typeof counts] }))}
          activeTab={tab}
          onTab={setTab}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Kategori filtresi"
            className="h-10 shrink-0 rounded-xl border border-border bg-surface px-3 text-sm transition-colors hover:border-gold-500/45 focus:border-gold-500 focus:outline-none"
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMode({ kind: 'new' })}
            disabled={!live}
            title={live ? undefined : 'Ürün eklemek için önce katalogu veritabanına aktarın'}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-gold-500 dark:text-olive-950"
          >
            <Plus className="size-4" strokeWidth={2.4} />
            Yeni Ürün
          </button>
        </Toolbar>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" description="Filtreleri değiştirmeyi deneyin." />
      ) : (
        <div className="px-5 pb-5">
          <Table>
            <thead>
              <tr>
                <Th>Ürün</Th>
                <Th>Kategori</Th>
                <Th align="right">Fiyat</Th>
                <Th align="right">Stok</Th>
                <Th>Durum</Th>
                <Th align="right">İşlem</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => {
                const categoryName = categories.find((c) => c.slug === product.category)?.name;
                return (
                  <Tr key={product.id}>
                    <Td>
                      <span className="flex items-center gap-3">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="44px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {product.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {product.volume} · {product.variants.length} varyant
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>{categoryName ?? '—'}</Td>
                    <Td align="right">
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="mt-0.5 block text-xs text-muted-foreground line-through tabular-nums">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </Td>
                    <Td align="right">
                      <span className="tabular-nums">{formatNumber(product.stockCount)}</span>
                    </Td>
                    <Td>
                      {live ? (
                        <form action={toggleProductActive}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="next" value={product.inStock ? '0' : '1'} />
                          <button type="submit" title="Yayın durumunu değiştir">
                            {!product.inStock ? (
                              <Status tone="danger">Yayında değil</Status>
                            ) : product.stockCount <= 5 ? (
                              <Status tone="warning">Kritik stok</Status>
                            ) : (
                              <Status tone="success">Yayında</Status>
                            )}
                          </button>
                        </form>
                      ) : !product.inStock ? (
                        <Status tone="danger">Yayında değil</Status>
                      ) : product.stockCount <= 5 ? (
                        <Status tone="warning">Kritik stok</Status>
                      ) : (
                        <Status tone="success">Yayında</Status>
                      )}
                    </Td>
                    <Td align="right">
                      <span className="flex items-center justify-end gap-1">
                        <Link
                          href={`/urunler/${product.slug}`}
                          target="_blank"
                          aria-label={`${product.name} sayfasını gör`}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
                        >
                          <Eye className="size-4" strokeWidth={1.9} />
                        </Link>
                        <button
                          onClick={() => setMode({ kind: 'edit', id: product.id })}
                          disabled={!live}
                          aria-label="Düzenle"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600 disabled:opacity-35"
                        >
                          <Pencil className="size-4" strokeWidth={1.9} />
                        </button>
                        <button
                          onClick={() => setConfirmId(product.id)}
                          disabled={!live}
                          aria-label="Sil"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600 disabled:opacity-35"
                        >
                          <Trash2 className="size-4" strokeWidth={1.9} />
                        </button>
                      </span>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Silme onayı */}
      <AnimatePresence>
        {confirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmId(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-olive-950/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-lift"
            >
              <h3 className="font-display text-xl text-foreground">Ürünü sil</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">
                  {products.find((p) => p.id === confirmId)?.name}
                </strong>{' '}
                kalıcı olarak silinecek. Geçmiş siparişlerdeki kaydı korunur.
              </p>
              <div className="mt-6 flex gap-3">
                <form action={deleteProduct} className="flex-1">
                  <input type="hidden" name="id" value={confirmId} />
                  <button
                    type="submit"
                    onClick={() => setConfirmId(null)}
                    className="h-11 w-full rounded-full bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-500 active:scale-[0.98]"
                  >
                    Evet, sil
                  </button>
                </form>
                <button
                  onClick={() => setConfirmId(null)}
                  className="h-11 flex-1 rounded-full border border-border text-sm font-medium transition-colors hover:border-gold-500/50"
                >
                  Vazgeç
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
