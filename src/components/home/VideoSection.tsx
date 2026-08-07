'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Container } from '@/components/ui/Section';
import { useEscape, useLockBodyScroll } from '@/hooks';
import { IMG } from '@/lib/images';
import { blurDataURL } from '@/lib/utils';

/** Hasat filmi — yalnızca oynat tıklanınca yüklenir (facade deseni). */
const VIDEO_ID = 'ScMzIvxBSi4';

export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const close = useCallback(() => setPlaying(false), []);

  useEscape(close, playing);
  useLockBodyScroll(playing);

  return (
    <section className="relative" aria-label="Hasat filmi">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl shadow-lift">
          <div className="relative aspect-16/10 sm:aspect-21/9">
            <Image
              src={IMG.harvestCrate}
              alt="Hasat sırasında kasalara toplanan zeytinler ve ayıklama yapan eller"
              fill
              sizes="(min-width: 1280px) 80rem, 94vw"
              placeholder="blur"
              blurDataURL={blurDataURL('olive')}
              className="object-cover"
            />

            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-olive-950/85 via-olive-950/40 to-olive-950/25"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Hasat filmini oynat"
                className="group relative grid size-20 place-items-center rounded-full bg-cream-50/95 text-olive-900 shadow-lift transition-transform duration-400 hover:scale-110 active:scale-95 sm:size-24"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 animate-[ring_2.6s_cubic-bezier(0.22,1,0.36,1)_infinite] rounded-full bg-cream-50/35"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 animate-[ring_2.6s_cubic-bezier(0.22,1,0.36,1)_infinite_0.9s] rounded-full bg-cream-50/25"
                />
                <Play className="relative ml-1 size-7 fill-current sm:size-8" strokeWidth={1} />
              </button>

              <p className="mt-8 text-[0.68rem] font-semibold tracking-[0.24em] text-gold-300 uppercase">
                Bahçeden
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
                Bir Sezon, Üç Hafta, Tek Bir Amaç
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-200/75 sm:text-base">
                Ekim sabahlarında başlayan hasadın, akşam sıkıma girene kadar geçtiği yolu
                izleyin.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Hasat filmi"
            className="fixed inset-0 z-[95] grid place-items-center bg-olive-950/92 p-4 backdrop-blur-md"
          >
            <button
              onClick={close}
              aria-label="Videoyu kapat"
              className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-white/20 text-cream-100 transition-colors hover:bg-white/10"
            >
              <X className="size-5" strokeWidth={1.8} />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-lift"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Zeytin hasadı filmi"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
