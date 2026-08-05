'use client';

import { Check, Copy, Pencil, Plus, Ticket, Trash2 } from 'lucide-react';
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
  Tr,
} from '@/components/admin/primitives';
import { useCopy } from '@/hooks';
import { coupons } from '@/lib/data/coupons';
import { cn, formatPrice } from '@/lib/utils';

const typeLabels = {
  percent: 'Yüzde',
  amount: 'Sabit tutar',
  shipping: 'Kargo',
} as const;

export default function AdminCouponsPage() {
  const { copied, copy } = useCopy();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    const ok = await copy(code);
    if (ok) {
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Kuponlar"
        description="Sepette uygulanabilen indirim kodları"
      />

      <DemoNotice>
        Buradaki kodlar sepet ve ödeme sayfasında gerçekten çalışır — deneyerek doğrulayabilirsiniz.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Tanımlı Kuponlar" padded={false}>
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Kod</Th>
                  <Th>Tür</Th>
                  <Th align="right">Değer</Th>
                  <Th align="right">Alt limit</Th>
                  <Th>Açıklama</Th>
                  <Th align="right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <Tr key={coupon.code}>
                    <Td>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wider text-foreground transition-colors hover:border-gold-500 hover:text-gold-700 dark:hover:text-gold-400"
                      >
                        {coupon.code}
                        {copied && copiedCode === coupon.code ? (
                          <Check className="size-3.5 text-olive-600" strokeWidth={3} />
                        ) : (
                          <Copy className="size-3.5 opacity-50" strokeWidth={2} />
                        )}
                      </button>
                    </Td>
                    <Td>
                      <Status tone={coupon.type === 'shipping' ? 'olive' : 'gold'}>
                        {typeLabels[coupon.type]}
                      </Status>
                    </Td>
                    <Td align="right">
                      <span className="font-semibold text-foreground tabular-nums">
                        {coupon.type === 'percent'
                          ? `%${Math.round(coupon.value * 100)}`
                          : coupon.type === 'amount'
                            ? formatPrice(coupon.value)
                            : 'Ücretsiz'}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="text-sm tabular-nums">
                        {coupon.minSubtotal > 0 ? formatPrice(coupon.minSubtotal) : '—'}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs text-muted-foreground">{coupon.description}</span>
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
                ))}
              </tbody>
            </Table>
          </div>
        </Panel>

        <Panel title="Yeni Kupon" description="Formu doldurup kaydedin">
          <div className="space-y-5">
            <AdminField label="Kupon kodu" hint="Büyük harf ve rakam kullanın">
              <input
                className={cn(adminInput, 'font-mono tracking-wider uppercase')}
                placeholder="YENIKOD25"
              />
            </AdminField>

            <AdminField label="İndirim türü">
              <select className={adminInput} defaultValue="percent">
                <option value="percent">Yüzde indirim</option>
                <option value="amount">Sabit tutar indirimi</option>
                <option value="shipping">Ücretsiz kargo</option>
              </select>
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Değer">
                <input className={adminInput} inputMode="numeric" placeholder="25" />
              </AdminField>
              <AdminField label="Alt limit (₺)">
                <input className={adminInput} inputMode="numeric" placeholder="0" />
              </AdminField>
            </div>

            <AdminField label="Kullanım limiti" hint="Boş bırakılırsa sınırsız">
              <input className={adminInput} inputMode="numeric" placeholder="1000" />
            </AdminField>

            <AdminField label="Açıklama">
              <input className={adminInput} placeholder="Sepette gösterilecek metin" />
            </AdminField>

            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-olive-700 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950">
              <Plus className="size-4" strokeWidth={2.4} />
              Kuponu Oluştur
            </button>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Ticket className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
              Kuponlar <code className="rounded bg-foreground/8 px-1">src/lib/data/coupons.ts</code>{' '}
              içinde tanımlıdır; kalıcı ekleme için veritabanı bağlanmalıdır.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
