'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { AdminField, adminInput, DemoNotice, Panel, Toggle } from '@/components/admin/primitives';
import { site } from '@/lib/data/site';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState({
    maintenance: false,
    darkDefault: false,
    reviews: true,
    guestCheckout: true,
    newsletter: true,
    stockWarning: true,
  });

  const set = (key: keyof typeof flags) => (value: boolean) =>
    setFlags((f) => ({ ...f, [key]: value }));

  return (
    <>
      <AdminPageHeader
        title="Site Ayarları"
        description="Mağaza kimliği, iletişim bilgileri ve genel davranışlar"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Save className="size-4" strokeWidth={2.2} />
            Kaydet
          </button>
        }
      />

      <DemoNotice>
        Alanlar <code className="rounded bg-foreground/8 px-1">src/lib/data/site.ts</code> dosyasından
        doldurulur. Kaydetme işlemi bir yönetim API’si bağlandığında etkinleşir.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Mağaza Kimliği">
          <div className="space-y-5">
            <AdminField label="Mağaza adı">
              <input className={adminInput} defaultValue={site.name} />
            </AdminField>
            <AdminField label="Ünvan">
              <input className={adminInput} defaultValue={site.legalName} />
            </AdminField>
            <AdminField label="Slogan">
              <input className={adminInput} defaultValue={site.tagline} />
            </AdminField>
            <AdminField label="Meta açıklama" hint="Arama sonuçlarında görünen özet, 150–160 karakter">
              <textarea
                className={cn(adminInput, 'h-24 resize-y py-3')}
                defaultValue={site.description}
              />
            </AdminField>
            <AdminField label="Site adresi">
              <input className={adminInput} defaultValue={site.url} />
            </AdminField>
          </div>
        </Panel>

        <Panel title="İletişim Bilgileri">
          <div className="space-y-5">
            <AdminField label="Telefon">
              <input className={adminInput} defaultValue={site.phone} />
            </AdminField>
            <AdminField label="WhatsApp">
              <input className={adminInput} defaultValue={site.whatsapp} />
            </AdminField>
            <AdminField label="E-posta">
              <input className={adminInput} type="email" defaultValue={site.email} />
            </AdminField>
            <AdminField label="Adres">
              <textarea
                className={cn(adminInput, 'h-20 resize-y py-3')}
                defaultValue={`${site.address.street}, ${site.address.district} / ${site.address.city}`}
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Posta kodu">
                <input className={adminInput} defaultValue={site.address.postalCode} />
              </AdminField>
              <AdminField label="Çalışma saatleri">
                <input className={adminInput} defaultValue={site.workingHours} />
              </AdminField>
            </div>
          </div>
        </Panel>

        <Panel title="Sosyal Medya">
          <div className="space-y-5">
            <AdminField label="Instagram">
              <input className={adminInput} defaultValue={site.social.instagram} />
            </AdminField>
            <AdminField label="Facebook">
              <input className={adminInput} defaultValue={site.social.facebook} />
            </AdminField>
            <AdminField label="YouTube">
              <input className={adminInput} defaultValue={site.social.youtube} />
            </AdminField>
            <AdminField label="Harita gömme adresi">
              <input className={adminInput} defaultValue={site.mapEmbed} />
            </AdminField>
          </div>
        </Panel>

        <Panel title="Genel Davranışlar" padded={false}>
          <div className="divide-y divide-border px-5">
            <Toggle
              checked={flags.maintenance}
              onChange={set('maintenance')}
              label="Bakım modu"
              description="Açıldığında ziyaretçilere bakım sayfası gösterilir, yönetim paneli erişilebilir kalır."
            />
            <Toggle
              checked={flags.darkDefault}
              onChange={set('darkDefault')}
              label="Varsayılan koyu tema"
              description="Yeni ziyaretçiler siteyi koyu temayla açar. Kullanıcı tercihi her zaman öncelikli kalır."
            />
            <Toggle
              checked={flags.reviews}
              onChange={set('reviews')}
              label="Ürün yorumları açık"
              description="Kapatıldığında ürün sayfalarındaki yorum sekmesi gizlenir."
            />
            <Toggle
              checked={flags.guestCheckout}
              onChange={set('guestCheckout')}
              label="Üye olmadan alışveriş"
              description="Kapatıldığında ödeme adımı için üyelik zorunlu olur."
            />
            <Toggle
              checked={flags.newsletter}
              onChange={set('newsletter')}
              label="E-bülten bölümü"
              description="Ana sayfadaki abonelik formunu gösterir veya gizler."
            />
            <Toggle
              checked={flags.stockWarning}
              onChange={set('stockWarning')}
              label="Kritik stok uyarısı"
              description="Ürün kartlarında “son N ürün” rozetini gösterir."
            />
          </div>
        </Panel>
      </div>
    </>
  );
}
