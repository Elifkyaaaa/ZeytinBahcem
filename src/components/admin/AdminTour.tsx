'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Compass, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useEscape } from '@/hooks';
import { useUi } from '@/lib/store/ui';
import { cn } from '@/lib/utils';

interface Step {
  /** The target element is marked with `data-tour="…"` */
  target: string;
  title: string;
  body: string;
  /** Preferred position of the bubble relative to its target */
  place?: 'bottom' | 'right' | 'left';
}

const steps: Step[] = [
  {
    target: 'sidebar',
    title: 'Yönetim menüsü',
    body: 'Tüm ekranlar burada; katalog, satış, içerik ve ayarlar olarak gruplandı. Yanındaki rakamlar ilgilenmeniz gereken kayıt sayısını gösterir.',
    place: 'right',
  },
  {
    target: 'search',
    title: 'Hızlı arama',
    body: 'Ürün, sipariş, müşteri ve panel sayfalarında arayın. Klavyeden Ctrl + K ile her yerden açabilir, ok tuşlarıyla gezinip Enter ile gidebilirsiniz.',
    place: 'bottom',
  },
  {
    target: 'stats',
    title: 'Günün özeti',
    body: 'Bugünkü sipariş, toplam satış, müşteri ve ürün sayısı. Yeşil/kırmızı rozetler bir önceki döneme göre değişimi gösterir.',
    place: 'bottom',
  },
  {
    target: 'charts',
    title: 'Grafikler',
    body: 'Son 12 ayın cirosu ve kategori dağılımı. Grafik üzerinde gezinerek ay bazında değerleri görebilirsiniz.',
    place: 'bottom',
  },
  {
    target: 'orders',
    title: 'Son siparişler',
    body: 'En güncel siparişler durumlarıyla birlikte. Tümünü görmek için sağ üstteki bağlantıyı kullanın.',
    place: 'bottom',
  },
  {
    target: 'user',
    title: 'Hesabınız',
    body: 'Profil bilgileriniz, şifre değiştirme, siteyi görüntüleme ve çıkış. Bu turu istediğiniz zaman buradan tekrar başlatabilirsiniz.',
    place: 'left',
  },
];

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;

/**
 * The outer shell only tracks open/closed. Because the content is a separate
 * component, the tour mounts fresh every time it opens, which lets us build
 * the step list lazily from the DOM without calling setState in an effect.
 */
export function AdminTour() {
  const open = useUi((s) => s.tourOpen);
  if (!open) return null;
  return <TourOverlay />;
}

function TourOverlay() {
  const close = useUi((s) => s.closeTour);

  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);

  // Steps whose target is absent (charts outside the dashboard) are dropped.
  const [available] = useState<Step[]>(() =>
    steps.filter((s) => document.querySelector(`[data-tour="${s.target}"]`)),
  );

  const finish = useCallback(() => {
    close();
    try {
      window.localStorage.setItem('zb-admin-tour', 'done');
    } catch {
      // localStorage may be unwritable in a private tab; the tour still closes.
    }
  }, [close]);

  useEscape(finish, true);

  const step = available[index];

  // Measure the target before paint so the bubble does not jump.
  useLayoutEffect(() => {
    if (!step) return;

    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) return setBox(null);

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const r = el.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    const id = window.setTimeout(measure, 320); // re-measure once scrolling settles
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, available.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [available.length]);

  if (!step) return null;

  const last = index === available.length - 1;

  /** Position the bubble against its target, keeping it on screen. */
  const bubble = (() => {
    const W = 320;
    if (!box) return { top: 100, left: 100 };

    const place = step.place ?? 'bottom';
    let top = box.top + box.height + PAD + 8;
    let left = box.left;

    if (place === 'right') {
      top = box.top + 24;
      left = box.left + box.width + PAD + 8;
    } else if (place === 'left') {
      top = box.top + box.height + PAD + 8;
      left = box.left + box.width - W;
    }

    left = Math.max(12, Math.min(left, window.innerWidth - W - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - 220));
    return { top, left };
  })();

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[95]"
        role="dialog"
        aria-modal="true"
        aria-label="Tanıtım turu"
      >
        {/* Backdrop plus a window that lights the target (huge box-shadow trick) */}
        {box ? (
          <motion.div
            layout
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={finish}
            className="absolute rounded-xl ring-2 ring-gold-400/70"
            style={{
              top: box.top - PAD,
              left: box.left - PAD,
              width: box.width + PAD * 2,
              height: box.height + PAD * 2,
              boxShadow: '0 0 0 9999px rgb(18 21 14 / 0.68)',
            }}
          />
        ) : (
          <div onClick={finish} className="absolute inset-0 bg-olive-950/68" />
        )}

        {/* Narration bubble */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: bubble.top, left: bubble.left, width: 320 }}
          className="absolute rounded-2xl border border-border bg-surface p-5 shadow-lift"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/12 px-2.5 py-1 text-[0.65rem] font-semibold text-gold-700 dark:text-gold-400">
              <Compass className="size-3.5" strokeWidth={2.2} />
              {index + 1} / {available.length}
            </span>
            <button
              onClick={finish}
              aria-label="Turu kapat"
              className="-m-1 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>

          <h3 className="mt-3 font-display text-lg text-foreground">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

          {/* Progress dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {available.map((s, i) => (
              <button
                key={s.target}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}. adım`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-gold-500' : 'w-1.5 bg-foreground/15 hover:bg-foreground/30',
                )}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium transition-colors hover:border-gold-500/50 disabled:opacity-35"
            >
              <ArrowLeft className="size-3.5" strokeWidth={2.2} />
              Geri
            </button>

            <button
              onClick={() => (last ? finish() : setIndex((i) => i + 1))}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-olive-700 px-4 text-xs font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950"
            >
              {last ? (
                <>
                  <Check className="size-3.5" strokeWidth={2.8} />
                  Turu bitir
                </>
              ) : (
                <>
                  İleri
                  <ArrowRight className="size-3.5" strokeWidth={2.2} />
                </>
              )}
            </button>

            {!last && (
              <button
                onClick={finish}
                className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Atla
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
