'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { OliveBranchIcon } from '@/components/ui/icons';
import { useMediaQuery } from '@/hooks';
import { heroText } from '@/lib/data/text/home';
import { IMG } from '@/lib/images';
import { blurDataURL } from '@/lib/utils';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Parallax yalnızca geniş ekranlarda; mobilde hem gereksiz hem de maliyetli.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const enabled = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  // Portre metinden biraz daha yavaş kayar; katmanlı derinlik hissi verir.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section
      ref={ref}
      data-dark-hero
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-olive-950"
      aria-label={heroText.regionLabel}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={enabled ? { y: imageY, scale: imageScale } : undefined}
      >
        <Image
          src={IMG.heroGrove}
          alt={heroText.backgroundAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={72}
          placeholder="blur"
          blurDataURL={blurDataURL('olive')}
          className="object-cover object-center"
        />
      </motion.div>

      {/* Metnin okunabilirliği için katmanlı karartma */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-olive-950/72 via-olive-950/48 to-olive-950/88"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(18,21,14,0.62)_100%)]"
      />

      <motion.div
        style={enabled ? { y: contentY, opacity: contentOpacity } : undefined}
        className="container-x relative z-10 grid grid-cols-1 items-center gap-12 pt-28 pb-28 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24"
      >
        {/* Metin — mobilde portrenin altında, masaüstünde solda */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/18 bg-white/8 px-4 py-1.5 backdrop-blur-md"
          >
            <OliveBranchIcon className="size-4 text-gold-300" />
            <span className="text-[0.7rem] font-medium tracking-[0.2em] text-cream-100/90 uppercase">
              {heroText.badge}
            </span>
          </motion.div>

          <h1 className="max-w-[15ch] font-display text-[2.65rem] leading-[1.04] font-semibold text-cream-50 sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]">
            {heroText.titleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 34, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  delay: 0.12 + i * 0.11,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-[0.28em] inline-block"
              >
                {i === heroText.accentWordIndex ? (
                  <span className="text-gradient-gold">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-base leading-relaxed text-cream-100/78 sm:text-lg"
          >
            {heroText.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.76, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Button href="/urunler" variant="gold" size="xl">
              {heroText.primaryCta}
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
            </Button>
            <Button href="/urunler?siralama=populer" variant="glass" size="xl">
              <ShoppingBag className="size-5" strokeWidth={2} />
              {heroText.secondaryCta}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.72rem] tracking-[0.16em] text-cream-100/55 uppercase lg:justify-start"
          >
            {heroText.trustMarks.map((item) => (
              <span key={item} className="flex items-center gap-2.5">
                <span className="size-1 rounded-full bg-gold-400/70" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Kurucu portresi — üzerindeki marka yazısı kırpılmasın diye
            görselin kendi oranında (4/5) ve object-contain ile gösterilir. */}
        <motion.figure
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={enabled ? { y: portraitY } : undefined}
          className="order-1 mx-auto w-full max-w-[16rem] sm:max-w-[19rem] lg:order-2 lg:max-w-[25rem]"
        >
          <div className="relative rounded-[1.75rem] border border-gold-400/30 bg-olive-950/45 p-2.5 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)] backdrop-blur-sm sm:p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
              <Image
                src={IMG.founderPortrait}
                alt={heroText.portraitAlt}
                fill
                priority
                sizes="(min-width: 1024px) 25rem, (min-width: 640px) 19rem, 16rem"
                quality={86}
                placeholder="blur"
                blurDataURL={blurDataURL('cream')}
                className="object-contain"
              />
            </div>
            {/* İnce altın iç çerçeve */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-2 rounded-[1.35rem] ring-1 ring-gold-300/25 sm:inset-3"
            />
          </div>

          <figcaption className="mt-5 text-center text-[0.7rem] tracking-[0.22em] text-cream-100/60 uppercase">
            {heroText.portraitCaption}
          </figcaption>
        </motion.figure>
      </motion.div>

      <motion.a
        href="#istatistikler"
        aria-label={heroText.scrollAriaLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 sm:flex"
      >
        <span className="text-[0.62rem] tracking-[0.24em] text-cream-100/45 uppercase">{heroText.scrollLabel}</span>
        <span className="relative h-11 w-6 rounded-full border border-cream-100/25">
          <motion.span
            animate={{ y: [5, 18, 5], opacity: [0, 1, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-gold-300"
          />
        </span>
      </motion.a>
    </section>
  );
}
