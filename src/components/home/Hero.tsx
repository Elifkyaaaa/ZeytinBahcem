'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
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

  const branchY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const branchScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-dark-hero
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-olive-950"
      aria-label={heroText.regionLabel}
    >
      {/* One photograph behind everything */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={enabled ? { y: branchY, scale: branchScale } : undefined}
      >
        <Image
          src={IMG.heroBranch}
          alt={heroText.branchAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={74}
          placeholder="blur"
          blurDataURL={blurDataURL('olive')}
          className="object-cover object-center"
        />
      </motion.div>

      {/*
        Everything on top of the photograph is cream, so the whole frame is
        shaded evenly rather than lit on one side. The copy sits over the
        deepest part; the wordmark keeps enough of the branches visible behind
        it to still read as a photograph.
      */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-olive-950/62" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-olive-950/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-olive-950/42 lg:via-olive-950/8 lg:to-transparent"
      />

      {/* The header sits over the hero, so the very top stays darkest of all */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-olive-950/55 to-transparent"
      />

      <motion.div
        style={enabled ? { y: contentY, opacity: contentOpacity } : undefined}
        className="container-x relative z-10 grid grid-cols-1 items-center gap-16 py-24 lg:grid-cols-2 lg:gap-12 lg:py-28"
      >
        {/* ------------------------------------------------------------ */}
        {/*  The promise                                                 */}
        {/* ------------------------------------------------------------ */}
        <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="max-w-[16ch] font-display text-[2.5rem] leading-[1.06] font-semibold text-cream-50 sm:text-6xl lg:text-[3.9rem]">
            {heroText.titleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + i * 0.1,
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
            transition={{ duration: 0.8, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-lg text-base leading-relaxed text-cream-100/82 sm:text-lg"
          >
            {heroText.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[0.7rem] tracking-[0.16em] text-cream-100/55 uppercase lg:justify-start"
          >
            {heroText.trustMarks.map((item) => (
              <span key={item} className="flex items-center gap-2.5">
                <span className="size-1 rounded-full bg-gold-400/70" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  The brand                                                   */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/*
            The cream knockout, not the full-colour lockup. Over a photograph the
            hairline gold ornaments and the ZEYTINCILIK line broke up against the
            leaves whatever the backdrop was tuned to; flattened to one light
            tone every element of the mark survives.
          */}
          <Image
            src={IMG.brandWordmarkLight}
            alt={site.name}
            width={1416}
            height={638}
            priority
            sizes="(min-width: 1024px) 30rem, (min-width: 640px) 26rem, 84vw"
            quality={90}
            className="h-auto w-[86%] max-w-[26rem] drop-shadow-[0_2px_16px_rgba(18,21,14,0.6)] lg:w-full lg:max-w-[30rem]"
          />

          <p className="mt-8 text-[0.64rem] font-semibold tracking-[0.24em] text-gold-200/90 uppercase drop-shadow-[0_2px_10px_rgba(18,21,14,0.7)] sm:text-[0.7rem]">
            {heroText.badge}
          </p>
          <p className="mt-3 text-[0.64rem] tracking-[0.18em] text-cream-100/65 uppercase drop-shadow-[0_2px_10px_rgba(18,21,14,0.7)] sm:text-[0.68rem]">
            {heroText.brandTagline}
          </p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#istatistikler"
        aria-label={heroText.scrollAriaLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex"
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
