'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { testimonials } from '@/lib/data/content';
import { blurDataURL, cn } from '@/lib/utils';

const AUTOPLAY_MS = 6500;

export function TestimonialsSlider() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((step: number) => {
    setState(([current]) => {
      const next = (current + step + testimonials.length) % testimonials.length;
      return [next, step];
    });
  }, []);

  const goTo = useCallback((target: number) => {
    setState(([current]) => [target, target > current ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, go]);

  const active = testimonials[index];

  return (
    <Section tone="deep" className="grain overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-gold-500/8 blur-3xl"
      />

      <Container>
        <SectionHeading
          eyebrow="Müşteri Yorumları"
          title="On İki Binden Fazla Sofrada"
          description="Ürünlerimizi deneyen müşterilerimizin kendi cümleleri."
          tone="inverted"
        />

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Quote
            aria-hidden
            className="pointer-events-none absolute -top-6 left-1/2 size-28 -translate-x-1/2 text-gold-400/12 sm:size-40"
            strokeWidth={1}
          />

          <div className="relative mx-auto min-h-[22rem] max-w-3xl sm:min-h-[19rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 44 : -44 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -44 : 44 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                className="flex cursor-grab flex-col items-center text-center active:cursor-grabbing"
              >
                <StarRating rating={active.rating} size="lg" />

                <blockquote className="mt-6 font-serif text-xl leading-relaxed text-cream-50 text-balance sm:text-2xl lg:text-[1.7rem]">
                  “{active.comment}”
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-3.5">
                  <span className="relative size-13 overflow-hidden rounded-full ring-2 ring-gold-400/35">
                    <Image
                      src={active.avatar}
                      alt=""
                      fill
                      sizes="52px"
                      placeholder="blur"
                      blurDataURL={blurDataURL('olive')}
                      className="object-cover"
                    />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-cream-50">{active.name}</span>
                    <span className="block text-xs text-cream-200/60">
                      {active.city} · {active.product}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() => go(-1)}
              aria-label="Önceki yorum"
              className="grid size-11 place-items-center rounded-full border border-cream-200/20 text-cream-100/80 transition-all duration-300 hover:-translate-x-0.5 hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronLeft className="size-5" strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Yorum seçimi">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}. yorum`}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-400',
                    i === index
                      ? 'w-7 bg-gold-400'
                      : 'w-1.5 bg-cream-200/30 hover:bg-cream-200/55',
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Sonraki yorum"
              className="grid size-11 place-items-center rounded-full border border-cream-200/20 text-cream-100/80 transition-all duration-300 hover:translate-x-0.5 hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronRight className="size-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
