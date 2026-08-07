'use client';

import { Crown, HeartHandshake, Mail, Phone, UserMinus, Users } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  EmptyState,
  Panel,
  StatCard,
  Status,
  Table,
  Td,
  Th,
  Toolbar,
  Tr,
  type StatusTone,
} from '@/components/admin/primitives';
import { blurDataURL, formatDate, formatNumber, formatPrice, safeImageSrc, slugify } from '@/lib/utils';

export interface PanelCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  segment: 'VIP' | 'Sadık' | 'Yeni' | 'Pasif';
  role: string;
}

const segmentTone: Record<PanelCustomer['segment'], StatusTone> = {
  VIP: 'gold',
  Sadık: 'olive',
  Yeni: 'success',
  Pasif: 'neutral',
};

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'VIP', label: 'VIP' },
  { id: 'Sadık', label: 'Sadık' },
  { id: 'Yeni', label: 'Yeni' },
  { id: 'Pasif', label: 'Pasif' },
];

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toLocaleUpperCase('tr-TR') || 'ZB'
  );
}

export function CustomerTable({
  customers,
  live,
}: {
  customers: PanelCustomer[];
  live: boolean;
}) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return customers.filter((c) => {
      if (tab !== 'all' && c.segment !== tab) return false;
      if (q.length >= 2 && !slugify(`${c.name} ${c.email} ${c.city}`).includes(q)) return false;
      return true;
    });
  }, [customers, tab, search]);

  const counts = Object.fromEntries(
    tabs.map((t) => [
      t.id,
      t.id === 'all' ? customers.length : customers.filter((c) => c.segment === t.id).length,
    ]),
  ) as Record<string, number>;

  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
  const totalSpent = customers.reduce((s, c) => s + c.spent, 0);
  const avgBasket = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam Müşteri"
          value={formatNumber(customers.length)}
          hint={live ? 'Kayıtlı üye sayısı' : 'Örnek veri'}
          Icon={Users}
          accent="olive"
        />
        <StatCard
          label="VIP Segment"
          value={formatNumber(counts.VIP ?? 0)}
          hint="20.000 ₺ üzeri harcama"
          Icon={Crown}
          accent="gold"
        />
        <StatCard
          label="Ortalama Sepet"
          value={avgBasket > 0 ? formatPrice(avgBasket) : '—'}
          hint={`${formatNumber(totalOrders)} sipariş üzerinden`}
          Icon={HeartHandshake}
          accent="blue"
        />
        <StatCard
          label="Henüz Sipariş Vermeyen"
          value={formatNumber(counts.Pasif ?? 0)}
          Icon={UserMinus}
          accent="rose"
        />
      </div>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="İsim, e-posta veya şehir…"
            tabs={tabs.map((t) => ({ ...t, count: counts[t.id] }))}
            activeTab={tab}
            onTab={setTab}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="Müşteri bulunamadı"
            description={
              customers.length === 0
                ? 'Biri üye olduğunda burada listelenir.'
                : 'Arama terimini veya segmenti değiştirin.'
            }
          />
        ) : (
          <div className="px-5 pb-5">
            <Table>
              <thead>
                <tr>
                  <Th>Müşteri</Th>
                  <Th>İletişim</Th>
                  <Th>Şehir</Th>
                  <Th align="right">Sipariş</Th>
                  <Th align="right">Harcama</Th>
                  <Th>Segment</Th>
                  <Th>Üyelik</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((customer) => (
                  <Tr key={customer.id}>
                    <Td>
                      <span className="flex items-center gap-3">
                        {customer.avatarUrl ? (
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                            <Image
                              src={safeImageSrc(customer.avatarUrl)}
                              alt=""
                              fill
                              sizes="40px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </span>
                        ) : (
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-700 text-xs font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
                            {initialsOf(customer.name)}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-medium text-foreground">
                              {customer.name}
                            </span>
                            {customer.role !== 'customer' && (
                              <span className="shrink-0 rounded-full bg-gold-500/12 px-1.5 py-0.5 text-[0.6rem] font-semibold text-gold-700 dark:text-gold-400">
                                {customer.role === 'admin' ? 'yönetici' : 'personel'}
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {customer.email}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <span className="flex flex-col gap-1 text-xs">
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-gold-600"
                        >
                          <Mail className="size-3.5 shrink-0" strokeWidth={1.9} />
                          <span className="truncate">{customer.email}</span>
                        </a>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="size-3.5 shrink-0" strokeWidth={1.9} />
                          {customer.phone}
                        </span>
                      </span>
                    </Td>
                    <Td>{customer.city}</Td>
                    <Td align="right">
                      <span className="tabular-nums">{customer.orders}</span>
                    </Td>
                    <Td align="right">
                      <span className="font-semibold text-foreground tabular-nums">
                        {customer.spent > 0 ? formatPrice(customer.spent) : '—'}
                      </span>
                    </Td>
                    <Td>
                      <Status tone={segmentTone[customer.segment]}>{customer.segment}</Status>
                    </Td>
                    <Td>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(customer.joined)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Panel>
    </>
  );
}
