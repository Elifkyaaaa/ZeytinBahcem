'use client';

import { MapPin, Plus, Save, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import {
  AdminField,
  adminInput,
  DemoNotice,
  Panel,
  Status,
  Table,
  Td,
  Th,
  Toggle,
  Tr,
} from '@/components/admin/primitives';
import { shippingMethods } from '@/lib/data/coupons';
import { site } from '@/lib/data/site';
import { formatPrice } from '@/lib/utils';

const carriers = [
  { name: 'Yurtiçi Kargo', code: 'YK', active: true, avgDays: '1–3 gün', desi: '0,00 ₺ / desi' },
  { name: 'Aras Kargo', code: 'AR', active: true, avgDays: '1–3 gün', desi: '11,50 ₺ / desi' },
  { name: 'MNG Kargo', code: 'MNG', active: false, avgDays: '2–4 gün', desi: '9,80 ₺ / desi' },
  { name: 'Sürat Kargo', code: 'SR', active: false, avgDays: '2–4 gün', desi: '10,20 ₺ / desi' },
];

const regions = [
  { region: 'Marmara', cities: 11, days: '1 gün', surcharge: 0 },
  { region: 'Ege', cities: 8, days: '1 gün', surcharge: 0 },
  { region: 'İç Anadolu', cities: 13, days: '2 gün', surcharge: 0 },
  { region: 'Akdeniz', cities: 8, days: '2 gün', surcharge: 15 },
  { region: 'Karadeniz', cities: 18, days: '2–3 gün', surcharge: 25 },
  { region: 'Doğu & Güneydoğu', cities: 23, days: '3–4 gün', surcharge: 45 },
];

export default function AdminShippingPage() {
  const [flags, setFlags] = useState({
    freeShipping: true,
    sameDay: true,
    pickup: true,
    insurance: false,
  });
  const [carrierState, setCarrierState] = useState(
    Object.fromEntries(carriers.map((c) => [c.code, c.active])),
  );

  return (
    <>
      <AdminPageHeader
        title="Kargo Ayarları"
        description="Taşıyıcılar, bölge süreleri ve ücretsiz kargo eşiği"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Save className="size-4" strokeWidth={2.2} />
            Kaydet
          </button>
        }
      />

      <DemoNotice>
        Ücretsiz kargo eşiği ve teslimat seçenekleri vitrinde gerçekten uygulanır — sepet ve ödeme
        sayfasında sonuçları görebilirsiniz.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Teslimat Seçenekleri" description="Ödeme adımında sunulan yöntemler" padded={false}>
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Yöntem</Th>
                  <Th>Süre</Th>
                  <Th align="right">Ücret</Th>
                </tr>
              </thead>
              <tbody>
                {shippingMethods.map((method) => (
                  <Tr key={method.id}>
                    <Td>
                      <span className="font-medium text-foreground">{method.name}</span>
                    </Td>
                    <Td>
                      <span className="text-xs text-muted-foreground">{method.detail}</span>
                    </Td>
                    <Td align="right">
                      <span className="font-semibold text-foreground tabular-nums">
                        {method.price === 0 ? 'Ücretsiz' : formatPrice(method.price)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="divide-y divide-border border-t border-border px-5">
            <Toggle
              checked={flags.freeShipping}
              onChange={(v) => setFlags((f) => ({ ...f, freeShipping: v }))}
              label="Ücretsiz kargo eşiği"
              description={`Şu an ${site.freeShippingThreshold} ₺ ve üzeri siparişlerde kargo ücretsiz.`}
            />
            <Toggle
              checked={flags.sameDay}
              onChange={(v) => setFlags((f) => ({ ...f, sameDay: v }))}
              label="Aynı gün kargo"
              description="Saat 14.00’a kadar verilen siparişler aynı gün kargoya verilir."
            />
            <Toggle
              checked={flags.pickup}
              onChange={(v) => setFlags((f) => ({ ...f, pickup: v }))}
              label="Mağazadan teslim"
              description="Orhangazi mağazasından ücretsiz teslim seçeneği sunulur."
            />
            <Toggle
              checked={flags.insurance}
              onChange={(v) => setFlags((f) => ({ ...f, insurance: v }))}
              label="Kargo sigortası"
              description="Cam ürünlerde kırılma sigortası ek ücretle sunulur."
            />
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Ücretsiz Kargo Eşiği">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Alt limit (₺)" hint="Bu tutar üzeri siparişlerde kargo ücretsiz">
                <input
                  className={adminInput}
                  inputMode="numeric"
                  defaultValue={site.freeShippingThreshold}
                />
              </AdminField>
              <AdminField label="Standart kargo ücreti (₺)">
                <input className={adminInput} inputMode="numeric" defaultValue="79,90" />
              </AdminField>
              <AdminField label="Hızlı kargo ücreti (₺)">
                <input className={adminInput} inputMode="numeric" defaultValue="149,90" />
              </AdminField>
              <AdminField label="Kapıda ödeme bedeli (₺)">
                <input className={adminInput} inputMode="numeric" defaultValue="39,90" />
              </AdminField>
            </div>
          </Panel>

          <Panel title="Taşıyıcı Firmalar" padded={false}>
            <ul className="divide-y divide-border">
              {carriers.map((carrier) => (
                <li key={carrier.code} className="flex items-center gap-4 px-5 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-xs font-bold text-muted-foreground">
                    {carrier.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {carrier.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {carrier.avgDays} · {carrier.desi}
                    </span>
                  </span>
                  <button
                    role="switch"
                    aria-checked={carrierState[carrier.code]}
                    aria-label={`${carrier.name} entegrasyonunu değiştir`}
                    onClick={() =>
                      setCarrierState((prev) => ({ ...prev, [carrier.code]: !prev[carrier.code] }))
                    }
                  >
                    <Status tone={carrierState[carrier.code] ? 'success' : 'neutral'}>
                      {carrierState[carrier.code] ? 'Bağlı' : 'Pasif'}
                    </Status>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Bölge Teslimat Süreleri"
          description="Ödeme adımında tahmini teslimat hesaplamasında kullanılır"
          padded={false}
          className="xl:col-span-2"
          actions={
            <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium transition-colors hover:border-gold-500/50">
              <Plus className="size-3.5" strokeWidth={2.4} />
              Bölge Ekle
            </button>
          }
        >
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Bölge</Th>
                  <Th align="right">İl sayısı</Th>
                  <Th>Teslim süresi</Th>
                  <Th align="right">Ek ücret</Th>
                  <Th align="right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <Tr key={region.region}>
                    <Td>
                      <span className="flex items-center gap-2.5 font-medium text-foreground">
                        <MapPin className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
                        {region.region}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="tabular-nums">{region.cities}</span>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-2 text-sm">
                        <Truck className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
                        {region.days}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="tabular-nums">
                        {region.surcharge === 0 ? '—' : formatPrice(region.surcharge)}
                      </span>
                    </Td>
                    <Td align="right">
                      <button
                        aria-label={`${region.region} bölgesini sil`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                      >
                        <Trash2 className="size-4" strokeWidth={1.9} />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Panel>
      </div>
    </>
  );
}
