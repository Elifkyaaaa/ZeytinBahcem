'use client';

import { Download, Eye, Printer } from 'lucide-react';
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
import { orderStatusMeta, orders, type OrderStatus } from '@/lib/data/admin';
import { paymentMethodMeta } from '@/lib/data/payment';
import { blurDataURL, formatDate, formatNumber, formatPrice, safeImageSrc, slugify } from '@/lib/utils';
import { CheckCircle2, Clock, PackageOpen, Truck } from 'lucide-react';

const statusTabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'bekliyor', label: 'Ödeme Bekliyor' },
  { id: 'hazirlaniyor', label: 'Hazırlanıyor' },
  { id: 'kargoda', label: 'Kargoda' },
  { id: 'teslim', label: 'Teslim Edildi' },
  { id: 'iptal', label: 'İptal' },
];

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<string>('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return orders.filter((o) => {
      if (tab !== 'all' && o.status !== tab) return false;
      if (q.length >= 2) {
        const haystack = slugify(`${o.id} ${o.customer} ${o.email} ${o.city}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tab, search]);

  const revenue = orders
    .filter((o) => o.status !== 'iptal')
    .reduce((sum, o) => sum + o.total, 0);
  const counts = Object.fromEntries(
    statusTabs.map((t) => [
      t.id,
      t.id === 'all' ? orders.length : orders.filter((o) => o.status === t.id).length,
    ]),
  ) as Record<string, number>;

  return (
    <>
      <AdminPageHeader
        title="Sipariş Yönetimi"
        description="Son 7 günün siparişleri"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-gold-500/50">
            <Download className="size-4" strokeWidth={1.9} />
            Dışa Aktar
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam Sipariş"
          value={formatNumber(orders.length)}
          Icon={PackageOpen}
          accent="olive"
        />
        <StatCard
          label="Ödeme Bekleyen"
          value={formatNumber(counts.bekliyor ?? 0)}
          Icon={Clock}
          accent="gold"
        />
        <StatCard
          label="Yolda"
          value={formatNumber(counts.kargoda ?? 0)}
          Icon={Truck}
          accent="blue"
        />
        <StatCard
          label="Ciro"
          value={formatPrice(revenue)}
          Icon={CheckCircle2}
          accent="rose"
        />
      </div>

      <DemoNotice>
        Sipariş kayıtları örnek veridir. Durum güncelleme ve fatura üretimi, ödeme sağlayıcısı ile
        entegrasyon tamamlandığında etkinleşecektir.
      </DemoNotice>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="Sipariş no, müşteri veya şehir…"
            tabs={statusTabs.map((t) => ({ id: t.id, label: t.label, count: counts[t.id] }))}
            activeTab={tab}
            onTab={setTab}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="Sipariş bulunamadı"
            description="Farklı bir durum sekmesi veya arama terimi deneyin."
          />
        ) : (
          <div className="px-5 pb-5">
            <Table>
              <thead>
                <tr>
                  <Th>Sipariş</Th>
                  <Th>Müşteri</Th>
                  <Th>Tarih</Th>
                  <Th>Ödeme</Th>
                  <Th>Durum</Th>
                  <Th align="right">Tutar</Th>
                  <Th align="right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => {
                  const meta = orderStatusMeta[order.status];
                  return (
                    <Tr key={order.id}>
                      <Td>
                        <span className="font-medium text-foreground tabular-nums">{order.id}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {order.items} ürün
                        </span>
                      </Td>
                      <Td>
                        <span className="flex items-center gap-2.5">
                          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                            <Image
                              src={safeImageSrc(order.avatar)}
                              alt=""
                              fill
                              sizes="36px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-foreground">
                              {order.customer}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {order.city}
                            </span>
                          </span>
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm whitespace-nowrap">{formatDate(order.date)}</span>
                      </Td>
                      <Td>
                        <span className="text-sm whitespace-nowrap">{paymentMethodMeta[order.payment].shortName}</span>
                      </Td>
                      <Td>
                        <Status tone={meta.tone}>{meta.label}</Status>
                      </Td>
                      <Td align="right">
                        <span className="font-semibold text-foreground tabular-nums">
                          {formatPrice(order.total)}
                        </span>
                      </Td>
                      <Td align="right">
                        <span className="flex items-center justify-end gap-1">
                          <button
                            aria-label="Sipariş detayı"
                            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
                          >
                            <Eye className="size-4" strokeWidth={1.9} />
                          </button>
                          <button
                            aria-label="Fatura yazdır"
                            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                          >
                            <Printer className="size-4" strokeWidth={1.9} />
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
      </Panel>
    </>
  );
}
