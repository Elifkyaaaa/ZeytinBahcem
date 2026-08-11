'use client';

import { CalendarRange, Pencil, Percent, Plus, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import {
  DemoNotice,
  Panel,
  StatCard,
  Status,
  Table,
  Td,
  Th,
  Tr,
} from '@/components/admin/primitives';
import { campaigns } from '@/lib/data/admin';
import { formatDate, formatNumber } from '@/lib/utils';

export default function AdminCampaignsPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(campaigns.map((c) => [c.id, c.active])),
  );

  const activeCount = Object.values(active).filter(Boolean).length;
  const totalUsage = campaigns.reduce((s, c) => s + c.usage, 0);

  return (
    <>
      <AdminPageHeader
        title="Kampanyalar"
        description="Süreli indirim ve promosyon tanımları"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Plus className="size-4" strokeWidth={2.4} />
            Yeni Kampanya
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Aktif Kampanya" value={String(activeCount)} Icon={Zap} accent="gold" />
        <StatCard
          label="Toplam Kullanım"
          value={formatNumber(totalUsage)}
          Icon={Percent}
          accent="olive"
        />
        <StatCard
          label="Planlanan"
          value={String(campaigns.filter((c) => new Date(c.start) > new Date('2026-08-04')).length)}
          hint="Başlangıcı gelecekte olan"
          Icon={CalendarRange}
          accent="blue"
        />
      </div>

      <DemoNotice>
        Kampanya anahtarları arayüzde çalışır; kalıcı kayıt için yönetim API’si bağlanmalıdır.
      </DemoNotice>

      <Panel padded={false}>
        <div className="p-5">
          <Table>
            <thead>
              <tr>
                <Th>Kampanya</Th>
                <Th>Tür</Th>
                <Th>İndirim</Th>
                <Th>Tarih Aralığı</Th>
                <Th>Kullanım</Th>
                <Th>Durum</Th>
                <Th align="right">İşlem</Th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const isOn = active[campaign.id];
                const ratio = Math.round((campaign.usage / campaign.limit) * 100);
                return (
                  <Tr key={campaign.id}>
                    <Td>
                      <span className="font-medium text-foreground">{campaign.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                        {campaign.id}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-sm whitespace-nowrap">{campaign.type}</span>
                    </Td>
                    <Td>
                      <span className="font-semibold text-gold-700 dark:text-gold-400">
                        {campaign.discount}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(campaign.start)}
                        <br />
                        {formatDate(campaign.end)}
                      </span>
                    </Td>
                    <Td>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {formatNumber(campaign.usage)} / {formatNumber(campaign.limit)}
                      </span>
                      <span className="mt-1.5 block h-1.5 w-24 overflow-hidden rounded-full bg-foreground/8">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-olive-500 to-gold-500"
                          style={{ width: `${Math.min(100, ratio)}%` }}
                        />
                      </span>
                    </Td>
                    <Td>
                      <button
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`${campaign.name} kampanyasını ${isOn ? 'kapat' : 'aç'}`}
                        onClick={() =>
                          setActive((prev) => ({ ...prev, [campaign.id]: !prev[campaign.id] }))
                        }
                        className="cursor-pointer"
                      >
                        <Status tone={isOn ? 'success' : 'neutral'}>
                          {isOn ? 'Aktif' : 'Pasif'}
                        </Status>
                      </button>
                    </Td>
                    <Td align="right">
                      <span className="flex items-center justify-end gap-1">
                        <button
                          aria-label="Düzenle"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                        >
                          <Pencil className="size-4" strokeWidth={1.9} />
                        </button>
                        <button
                          aria-label="Sil"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
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
      </Panel>
    </>
  );
}
