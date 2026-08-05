'use client';

import { CloudUpload, FolderTree, ImageIcon, Zap } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { AdminField, adminInput, DemoNotice, Panel, StatCard } from '@/components/admin/primitives';

const folders = [
  { value: 'zeytin-store/urunler', label: 'Ürün görselleri' },
  { value: 'zeytin-store/kategoriler', label: 'Kategori görselleri' },
  { value: 'zeytin-store/blog', label: 'Blog kapakları' },
  { value: 'zeytin-store/slider', label: 'Slider görselleri' },
];

const pipeline = [
  'Görsel seçilir veya sürüklenip bırakılır.',
  'Tarayıcı /api/upload adresinden imzalı parametre ister (yalnızca admin/staff yetkisiyle).',
  'Dosya doğrudan Cloudinary’ye yüklenir — kendi sunucumuzdan geçmez.',
  'Dönen secure_url ilgili Supabase kaydına (products.image_url, blogs.cover_url…) yazılır.',
];

export default function AdminMediaPage() {
  const [folder, setFolder] = useState(folders[0].value);
  const [uploaded, setUploaded] = useState(0);

  return (
    <>
      <AdminPageHeader
        title="Görsel Yönetimi"
        description="Cloudinary’ye doğrudan yükleme — ürün, kategori, blog ve slider görselleri"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Bu oturumda yüklenen"
          value={String(uploaded)}
          Icon={CloudUpload}
          accent="olive"
        />
        <StatCard label="Hedef klasör" value={folders.length.toString()} Icon={FolderTree} accent="gold" />
        <StatCard
          label="Dönüşüm"
          value="f_auto q_auto"
          hint="Otomatik format ve kalite"
          Icon={Zap}
          accent="blue"
        />
      </div>

      <DemoNotice>
        Yükleme, Cloudinary anahtarları tanımlandığında çalışır. Anahtarlar sunucuda kalır; imza
        yalnızca yetkili oturumlar için üretilir, böylece imza sızsa bile keyfi yükleme yapılamaz.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Yeni Görsel Yükle">
          <div className="space-y-5">
            <AdminField label="Hedef klasör" hint="Cloudinary üzerinde oluşturulacak dizin">
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className={adminInput}
              >
                {folders.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} — {item.value}
                  </option>
                ))}
              </select>
            </AdminField>

            <ImageUploader folder={folder} onUploaded={() => setUploaded((n) => n + 1)} />
          </div>
        </Panel>

        <Panel title="Yükleme Akışı" description="Dosya hiçbir zaman kendi sunucumuzdan geçmez">
          <ol className="space-y-4">
            {pipeline.map((step, i) => (
              <li key={step} className="flex gap-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-600/10 text-xs font-semibold text-olive-700 tabular-nums dark:bg-gold-400/12 dark:text-gold-400">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-surface-muted p-4">
            <ImageIcon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.9}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Önerilen ölçüler — ürün: 900×1100, kategori: 900×700, blog kapağı: 1200×800,
              slider: 2400×1600. Yükleme sonrası Cloudinary dönüşümleriyle her ölçüde
              servis edilir.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
