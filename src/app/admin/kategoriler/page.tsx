'use client';

import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { DemoNotice, Panel, Status, Toggle } from '@/components/admin/primitives';
import { categories } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import { blurDataURL, formatPrice } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.slug, true])),
  );

  return (
    <>
      <AdminPageHeader
        title="Kategori Yönetimi"
        description={`${categories.length} kategori · sıralama vitrinde bu düzende görünür`}
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Plus className="size-4" strokeWidth={2.4} />
            Yeni Kategori
          </button>
        }
      />

      <DemoNotice>
        Kategoriler <code className="rounded bg-foreground/8 px-1">src/lib/data/categories.ts</code>{' '}
        dosyasından okunur. Bir CMS bağlandığında bu ekran doğrudan onu yönetecek şekilde
        tasarlandı.
      </DemoNotice>

      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((category) => {
          const items = products.filter((p) => p.category === category.slug);
          const avgPrice = items.length
            ? items.reduce((s, p) => s + p.price, 0) / items.length
            : 0;

          return (
            <Panel key={category.slug} padded={false}>
              <div className="flex gap-4 p-5">
                <span
                  aria-hidden
                  className="mt-1 hidden cursor-grab text-muted-foreground/50 sm:block"
                >
                  <GripVertical className="size-5" strokeWidth={1.8} />
                </span>

                <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="80px"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="object-cover"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg text-foreground">{category.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        /urunler?kategori={category.slug}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {category.featured && <Status tone="gold">Vitrinde geniş</Status>}
                      <button
                        aria-label={`${category.name} düzenle`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                      >
                        <Pencil className="size-4" strokeWidth={1.9} />
                      </button>
                      <button
                        aria-label={`${category.name} sil`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                      >
                        <Trash2 className="size-4" strokeWidth={1.9} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      <strong className="font-semibold text-foreground tabular-nums">
                        {items.length}
                      </strong>{' '}
                      ürün
                    </span>
                    <span>
                      Ortalama fiyat{' '}
                      <strong className="font-semibold text-foreground tabular-nums">
                        {formatPrice(avgPrice)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-5">
                <Toggle
                  checked={visible[category.slug]}
                  onChange={(next) => setVisible((v) => ({ ...v, [category.slug]: next }))}
                  label="Vitrinde göster"
                  description="Kapatıldığında ana sayfadaki kategori ızgarasından gizlenir."
                />
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
