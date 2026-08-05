'use client';

import { Banknote, CreditCard, Lock, Package, Save, ShieldCheck } from 'lucide-react';
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
import { PaymentMark } from '@/components/ui/icons';

const providers = [
  { name: 'iyzico', type: 'Sanal POS', status: 'Bağlı', tone: 'success' as const, commission: '%2,49 + 0,25 ₺' },
  { name: 'PayTR', type: 'Sanal POS', status: 'Pasif', tone: 'neutral' as const, commission: '%2,29 + 0,25 ₺' },
  { name: 'Stripe', type: 'Uluslararası', status: 'Pasif', tone: 'neutral' as const, commission: '%2,90 + 0,30 $' },
  { name: 'Ziraat Bankası', type: 'Havale / EFT', status: 'Bağlı', tone: 'success' as const, commission: '—' },
];

const installments = [
  { bank: 'Garanti BBVA', options: '2, 3, 6, 9', commission: '%3,2 – %8,4' },
  { bank: 'İş Bankası', options: '2, 3, 6', commission: '%3,0 – %6,9' },
  { bank: 'Yapı Kredi', options: '2, 3, 6, 9, 12', commission: '%3,4 – %11,2' },
  { bank: 'Akbank', options: '2, 3, 6', commission: '%3,1 – %7,1' },
];

export default function AdminPaymentSettingsPage() {
  const [methods, setMethods] = useState({
    card: true,
    transfer: true,
    cod: true,
    installment: true,
    threeD: true,
    saveCard: false,
  });

  const set = (key: keyof typeof methods) => (value: boolean) =>
    setMethods((m) => ({ ...m, [key]: value }));

  return (
    <>
      <AdminPageHeader
        title="Ödeme Ayarları"
        description="Ödeme yöntemleri, sağlayıcılar ve taksit tanımları"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Save className="size-4" strokeWidth={2.2} />
            Kaydet
          </button>
        }
      />

      <DemoNotice>
        API anahtarları hiçbir zaman istemci tarafında saklanmaz. Bu ekrandaki alanlar yalnızca
        arayüz olarak sunulur; gerçek anahtarlar sunucu ortam değişkenlerinde tutulmalıdır.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Ödeme Yöntemleri" description="Ödeme adımında görünen seçenekler" padded={false}>
          <div className="divide-y divide-border px-5">
            <Toggle
              checked={methods.card}
              onChange={set('card')}
              label="Kredi / Banka kartı"
              description="Sanal POS üzerinden tek çekim ve taksitli ödeme."
            />
            <Toggle
              checked={methods.transfer}
              onChange={set('transfer')}
              label="Havale / EFT"
              description="Havale ile ödemelerde otomatik %3 ek indirim uygulanır."
            />
            <Toggle
              checked={methods.cod}
              onChange={set('cod')}
              label="Kapıda ödeme"
              description="39,90 ₺ hizmet bedeli eklenir. 5.000 ₺ altı siparişlerde geçerlidir."
            />
            <Toggle
              checked={methods.installment}
              onChange={set('installment')}
              label="Taksitli ödeme"
              description="Banka anlaşmalarına göre taksit seçenekleri gösterilir."
            />
            <Toggle
              checked={methods.threeD}
              onChange={set('threeD')}
              label="3D Secure zorunlu"
              description="Tüm kart ödemelerinde bankadan doğrulama istenir. Kapatılması önerilmez."
            />
            <Toggle
              checked={methods.saveCard}
              onChange={set('saveCard')}
              label="Kart saklama"
              description="Üyelerin kartlarını sağlayıcı tarafında saklamasına izin verir (tokenizasyon)."
            />
          </div>

          <div className="flex items-center gap-2 border-t border-border px-5 py-4 text-muted-foreground/70">
            {['VISA', 'MASTER', 'TROY', 'AMEX', '3D'].map((label) => (
              <PaymentMark key={label} label={label} className="h-7 w-11" />
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Sanal POS Bağlantısı">
            <div className="space-y-5">
              <AdminField label="Sağlayıcı">
                <select className={adminInput} defaultValue="iyzico">
                  <option value="iyzico">iyzico</option>
                  <option value="paytr">PayTR</option>
                  <option value="stripe">Stripe</option>
                </select>
              </AdminField>
              <AdminField label="API anahtarı" hint="Sunucu ortam değişkeninde saklanır">
                <input className={adminInput} type="password" defaultValue="••••••••••••••••" />
              </AdminField>
              <AdminField label="Gizli anahtar">
                <input className={adminInput} type="password" defaultValue="••••••••••••••••" />
              </AdminField>
              <AdminField label="Ortam">
                <select className={adminInput} defaultValue="sandbox">
                  <option value="sandbox">Test (Sandbox)</option>
                  <option value="production">Canlı (Production)</option>
                </select>
              </AdminField>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
                Anahtarlar yalnızca sunucu tarafında okunur, tarayıcıya gönderilmez.
              </p>
            </div>
          </Panel>

          <Panel title="Banka Hesabı" description="Havale / EFT ödemeleri için">
            <div className="space-y-5">
              <AdminField label="Banka">
                <input className={adminInput} defaultValue="Ziraat Bankası" />
              </AdminField>
              <AdminField label="Hesap sahibi">
                <input className={adminInput} defaultValue="Zeytin Bahçem Tarım Ürünleri Ltd. Şti." />
              </AdminField>
              <AdminField label="IBAN">
                <input
                  className={adminInput}
                  defaultValue="TR00 0000 0000 0000 0000 0000 00"
                />
              </AdminField>
            </div>
          </Panel>
        </div>

        <Panel title="Sağlayıcılar" padded={false}>
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Sağlayıcı</Th>
                  <Th>Tür</Th>
                  <Th>Komisyon</Th>
                  <Th align="right">Durum</Th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <Tr key={provider.name}>
                    <Td>
                      <span className="flex items-center gap-2.5 font-medium text-foreground">
                        {provider.type === 'Havale / EFT' ? (
                          <Banknote className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
                        ) : (
                          <CreditCard className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
                        )}
                        {provider.name}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-sm whitespace-nowrap">{provider.type}</span>
                    </Td>
                    <Td>
                      <span className="text-sm whitespace-nowrap tabular-nums">
                        {provider.commission}
                      </span>
                    </Td>
                    <Td align="right">
                      <Status tone={provider.tone}>{provider.status}</Status>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Panel>

        <Panel title="Taksit Tablosu" description="Banka bazlı taksit ve komisyon oranları" padded={false}>
          <div className="p-5">
            <Table>
              <thead>
                <tr>
                  <Th>Banka</Th>
                  <Th>Taksit seçenekleri</Th>
                  <Th align="right">Komisyon aralığı</Th>
                </tr>
              </thead>
              <tbody>
                {installments.map((row) => (
                  <Tr key={row.bank}>
                    <Td>
                      <span className="font-medium text-foreground">{row.bank}</span>
                    </Td>
                    <Td>
                      <span className="flex flex-wrap gap-1.5">
                        {row.options.split(', ').map((n) => (
                          <span
                            key={n}
                            className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium tabular-nums"
                          >
                            {n}x
                          </span>
                        ))}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="text-sm tabular-nums">{row.commission}</span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="flex items-start gap-2.5 border-t border-border px-5 py-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-olive-600 dark:text-gold-400" strokeWidth={1.9} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Komisyon oranları müşteriye yansıtılmaz; taksit farkı mağaza tarafından karşılanır.
              Bu davranışı sağlayıcı panelinden değiştirebilirsiniz.
            </p>
          </div>
        </Panel>

        <Panel title="Fatura ve Vergi" className="xl:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AdminField label="KDV oranı (%)">
              <input className={adminInput} inputMode="numeric" defaultValue="20" />
            </AdminField>
            <AdminField label="Fiyatlar KDV">
              <select className={adminInput} defaultValue="dahil">
                <option value="dahil">Dâhil</option>
                <option value="haric">Hariç</option>
              </select>
            </AdminField>
            <AdminField label="Vergi dairesi">
              <input className={adminInput} defaultValue="Orhangazi" />
            </AdminField>
            <AdminField label="Vergi numarası">
              <input className={adminInput} inputMode="numeric" defaultValue="0000000000" />
            </AdminField>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-surface-muted p-4">
            <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              e-Arşiv fatura entegrasyonu bağlandığında siparişler tamamlandığı anda fatura otomatik
              kesilir ve müşteriye e-posta ile iletilir.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
