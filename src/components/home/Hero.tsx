'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { OliveBranchIcon } from '@/components/ui/icons';
import { useMediaQuery } from '@/hooks';
import { site } from '@/lib/data/site';
import { heroText } from '@/lib/data/text/home';
import { IMG } from '@/lib/images';
import { blurDataURL } from '@/lib/utils';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Parallax on wide screens only; on mobile it is both pointless and costly.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const enabled = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  // The watermark drifts slower than the photo, which separates the layers.
  const markY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      data-dark-hero
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-olive-950"
      aria-label={heroText.regionLabel}
    >
      {/* Base layer: the grove photograph, held well back so the mark reads */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={enabled ? { y: photoY, scale: photoScale } : undefined}
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

      {/* Layered scrim so the text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-olive-950/86 via-olive-950/76 to-olive-950/94"
      />

      {/*
        The brand logo as a watermark. Its artwork is dark green, which would
        disappear against this ground, so the filter flattens it to pure white
        and opacity brings it back to a whisper. Decorative only — the brand
        name is written as real text below, so this carries an empty alt.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        style={enabled ? { y: markY, scale: markScale } : undefined}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={IMG.brandLogo}
          alt=""
          width={1049}
          height={947}
          priority
          sizes="(min-width: 1024px) 62rem, 120vw"
          quality={86}
          className="w-[124%] max-w-none opacity-[0.10] brightness-0 invert sm:w-[92%] lg:w-[62rem]"
        />
      </motion.div>

      <motion.div
        style={enabled ? { y: contentY, opacity: contentOpacity } : undefined}
        className="container-x relative z-10 flex flex-col items-center py-28 text-center"
      >
        {/* Olive branch, sitting above the brand name */}
        <motion.div
          initial={{ opacity: 0, y: -12, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <OliveBranchIcon className="size-14 text-gold-300 sm:size-16" />
        </motion.div>

        {/* Brand name, written out rather than read from the logo artwork */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-[1.6rem] leading-none font-semibold tracking-[0.16em] text-cream-50 uppercase sm:text-[2.1rem] sm:tracking-[0.2em] lg:text-[2.5rem]"
        >
          {site.name}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.28 }}
          className="mt-4 flex items-center gap-3.5"
        >
          <span aria-hidden className="h-px w-10 bg-gold-400/45 sm:w-16" />
          <span className="text-[0.62rem] tracking-[0.24em] text-gold-200/80 uppercase sm:text-[0.68rem]">
            {heroText.badge}
          </span>
          <span aria-hidden className="h-px w-10 bg-gold-400/45 sm:w-16" />
        </motion.div>

        <h1 className="mt-9 max-w-[18ch] font-display text-[2.4rem] leading-[1.06] font-semibold text-cream-50 sm:text-5xl lg:text-[3.9rem]">
          {heroText.titleWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 0.42 + i * 0.1,
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/78 sm:text-lg"
        >
          {heroText.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.98, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:gap-4"
        >
          <Button href="/urunler" variant="gold" size="xl">
            {heroText.primaryCta}
            <ArrowRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.2}
            />
          </Button>
          <Button href="/urunler?siralama=populer" variant="glass" size="xl">
            <ShoppingBag className="size-5" strokeWidth={2} />
            {heroText.secondaryCta}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-9 text-[0.68rem] tracking-[0.2em] text-cream-100/45 uppercase"
        >
          {heroText.brandTagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.32 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.72rem] tracking-[0.16em] text-cream-100/55 uppercase"
        >
          {heroText.trustMarks.map((item) => (
            <span key={item} className="flex items-center gap-2.5">
              <span className="size-1 rounded-full bg-gold-400/70" aria-hidden />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#istatistikler"
        aria-label={heroText.scrollAriaLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 sm:flex"
      >
        <span className="text-[0.62rem] tracking-[0.24em] text-cream-100/45 uppercase">
          {heroText.scrollLabel}
        </span>
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
