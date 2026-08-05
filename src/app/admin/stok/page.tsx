'use client';

import { Boxes, PackageX, RefreshCw, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import {
  DemoNotice,
  EmptyState,
  Panel,
  StatCard,
  Status,
  Table,
  Td,
  Th,
  Toolbar,
  Tr,
} from '@/components/admin/primitives';
import { products } from '@/lib/data/products';
import { blurDataURL, cn, formatNumber, slugify } from '@/lib/utils';

const LOW = 20;
const CRITICAL = 5;

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'critical', label: 'Kritik' },
  { id: 'low', label: 'Azalıyor' },
  { id: 'ok', label: 'Yeterli' },
];

export default function AdminStockPage() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return products
      .filter((p) => {
        if (tab === 'critical' && p.stockCount > CRITICAL) return false;
        if (tab === 'low' && (p.stockCount <= CRITICAL || p.stockCount > LOW)) return false;
        if (tab === 'ok' && p.stockCount <= LOW) return false;
        if (q.length >= 2 && !slugify(p.name).includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.stockCount - b.stockCount);
  }, [tab, search]);

  const counts = {
    all: products.length,
    critical: products.filter((p) => p.stockCount <= CRITICAL).length,
    low: products.filter((p) => p.stockCount > CRITICAL && p.stockCount <= LOW).length,
    ok: products.filter((p) => p.stockCount > LOW).length,
  };

  const totalUnits = products.reduce((s, p) => s + p.stockCount, 0);

  return (
    <>
      <AdminPageHeader
        title="Stok Takibi"
        description={`Toplam ${formatNumber(totalUnits)} adet ürün depoda`}
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-gold-500/50">
            <RefreshCw className="size-4" strokeWidth={1.9} />
            Stok Senkronize Et
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Adet" value={formatNumber(totalUnits)} Icon={Boxes} accent="olive" />
        <StatCard
          label="Kritik Seviye"
          value={String(counts.critical)}
          hint={`${CRITICAL} adet ve altı`}
          Icon={TriangleAlert}
          accent="rose"
        />
        <StatCard
          label="Azalıyor"
          value={String(counts.low)}
          hint={`${CRITICAL + 1}–${LOW} adet arası`}
          Icon={PackageX}
          accent="gold"
        />
        <StatCard label="Yeterli" value={String(counts.ok)} Icon={Boxes} accent="blue" />
      </div>

      <DemoNotice>
        Stok sayıları ürün kataloğundaki <code className="rounded bg-foreground/8 px-1">stockCount</code>{' '}
        alanından okunur. Depo entegrasyonu bağlandığında gerçek zamanlı güncellenir.
      </DemoNotice>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="Ürün adında ara…"
            tabs={tabs.map((t) => ({ ...t, count: counts[t.id as keyof typeof counts] }))}
            activeTab={tab}
            onTab={setTab}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Kayıt yok" description="Bu filtreye uyan ürün bulunamadı." />
        ) : (
          <div className="px-5 pb-5">
            <Table>
              <thead>
                <tr>
                  <Th>Ürün</Th>
                  <Th>Varyant sayısı</Th>
                  <Th align="right">Mevcut</Th>
                  <Th>Doluluk</Th>
                  <Th>Durum</Th>
                  <Th align="right">Stok Girişi</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((product) => {
                  const critical = product.stockCount <= CRITICAL;
                  const low = !critical && product.stockCount <= LOW;
                  const ratio = Math.min(100, (product.stockCount / 100) * 100);

                  return (
                    <Tr key={product.id}>
                      <Td>
                        <span className="flex items-center gap-3">
                          <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="44px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-foreground">
                              {product.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {product.id.toUpperCase()}
                            </span>
                          </span>
                        </span>
                      </Td>
                      <Td>
                        <span className="tabular-nums">{product.variants.length}</span>
                      </Td>
                      <Td align="right">
                        <span
                          className={cn(
                            'font-semibold tabular-nums',
                            critical ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                          )}
                        >
                          {formatNumber(product.stockCount)}
                        </span>
                      </Td>
                      <Td>
                        <span className="block h-2 w-28 overflow-hidden rounded-full bg-foreground/8">
                          <span
                            className={cn(
                              'block h-full rounded-full transition-all',
                              critical
                                ? 'bg-red-500'
                                : low
                                  ? 'bg-amber-500'
                                  : 'bg-gradient-to-r from-olive-500 to-gold-500',
                            )}
                            style={{ width: `${Math.max(4, ratio)}%` }}
                          />
                        </span>
                      </Td>
                      <Td>
                        {critical ? (
                          <Status tone="danger">Kritik</Status>
                        ) : low ? (
                          <Status tone="warning">Azalıyor</Status>
                        ) : (
                          <Status tone="success">Yeterli</Status>
                        )}
                      </Td>
                      <Td align="right">
                        <button className="h-8 rounded-full border border-border px-3.5 text-xs font-medium transition-colors hover:border-gold-500/50 hover:text-gold-700 dark:hover:text-gold-400">
                          Giriş yap
                        </button>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Panel>
    </>
  );
}
