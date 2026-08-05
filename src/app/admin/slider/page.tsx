'use client';

import { ChevronDown, ChevronUp, Images, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { AdminField, adminInput, DemoNotice, Panel, Status, Toggle } from '@/components/admin/primitives';
import { IMG, img } from '@/lib/images';
import type { SliderItem } from '@/lib/data/admin';
import { blurDataURL, cn } from '@/lib/utils';

const initialSlides: SliderItem[] = [
  {
    id: 'S-01',
    title: 'Doğadan Sofranıza Gerçek Zeytinyağı',
    subtitle: 'Dalından özenle toplanan zeytinlerden soğuk sıkım olarak üretilmiştir.',
    image: img(IMG.heroGrove, 800, 450),
    link: '/urunler',
    order: 1,
    active: true,
  },
  {
    id: 'S-02',
    title: 'Erken Hasat Sezonu Başladı',
    subtitle: 'Ekimin ilk haftasında toplanan zeytinlerden, sınırlı üretim.',
    image: img(IMG.branchMacro, 800, 450),
    link: '/urunler?kategori=erken-hasat',
    order: 2,
    active: true,
  },
  {
    id: 'S-03',
    title: 'Kahvaltı Sofraları İçin',
    subtitle: 'Doğal salamura sofralık zeytin çeşitleri.',
    image: img(IMG.olivesBowls, 800, 450),
    link: '/urunler?kategori=sofralik-zeytin',
    order: 3,
    active: true,
  },
  {
    id: 'S-04',
    title: 'Hediye Setleri',
    subtitle: 'Ahşap kutuda, el yazısı notunuzla birlikte.',
    image: img(IMG.ingredients, 800, 450),
    link: '/urunler/organik-hediye-seti',
    order: 4,
    active: false,
  },
];

export default function AdminSliderPage() {
  const [slides, setSlides] = useState(initialSlides);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const toggle = (id: string) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <>
      <AdminPageHeader
        title="Slider Yönetimi"
        description="Ana sayfa üst görsellerinin sırası ve içeriği"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Plus className="size-4" strokeWidth={2.4} />
            Yeni Slayt
          </button>
        }
      />

      <DemoNotice>
        Vitrin şu anda tek görsellik bir hero kullanıyor. Buradaki slaytlar birden fazla olduğunda
        hero otomatik olarak döngüye geçecek şekilde tasarlandı.
      </DemoNotice>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Slaytlar" description="Oklarla sırayı değiştirin" padded={false}>
          <ul className="divide-y divide-border">
            {slides.map((slide, i) => (
              <li key={slide.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Yukarı taşı"
                      className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="size-4" strokeWidth={2.2} />
                    </button>
                    <span className="grid size-7 place-items-center text-xs font-semibold text-muted-foreground tabular-nums">
                      {slide.order}
                    </span>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === slides.length - 1}
                      aria-label="Aşağı taşı"
                      className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="size-4" strokeWidth={2.2} />
                    </button>
                  </div>

                  <span
                    className={cn(
                      'relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:w-40',
                      !slide.active && 'opacity-45 grayscale',
                    )}
                  >
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 160px, 92vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-serif text-lg leading-snug text-foreground">
                        {slide.title}
                      </h3>
                      <div className="flex shrink-0 items-center gap-1">
                        <Status tone={slide.active ? 'success' : 'neutral'}>
                          {slide.active ? 'Yayında' : 'Gizli'}
                        </Status>
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
                      </div>
                    </div>

                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {slide.subtitle}
                    </p>
                    <p className="mt-2 font-mono text-xs text-gold-700 dark:text-gold-400">
                      {slide.link}
                    </p>

                    <div className="-mb-3.5">
                      <Toggle
                        checked={slide.active}
                        onChange={() => toggle(slide.id)}
                        label="Yayında"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Yeni Slayt" description="Görsel yükleyip metinleri girin">
          <div className="space-y-5">
            <AdminField label="Görsel" hint="Önerilen ölçü: 2400 × 1600 px, en fazla 600 KB">
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-gold-500/50 hover:text-foreground">
                <Images className="size-6" strokeWidth={1.6} />
                <span className="text-xs">Sürükleyip bırakın veya seçin</span>
              </div>
            </AdminField>

            <AdminField label="Başlık">
              <input className={adminInput} placeholder="Slayt başlığı" />
            </AdminField>

            <AdminField label="Alt başlık">
              <input className={adminInput} placeholder="Kısa açıklama" />
            </AdminField>

            <AdminField label="Bağlantı" hint="Butonun yönlendireceği sayfa">
              <input className={adminInput} placeholder="/urunler" />
            </AdminField>

            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-olive-700 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950">
              <Plus className="size-4" strokeWidth={2.4} />
              Slaytı Ekle
            </button>
          </div>
        </Panel>
      </div>
    </>
  );
}
