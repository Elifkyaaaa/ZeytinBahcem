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

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const branchY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const branchScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // The watermark drifts slower than the panels, which separates the layers.
  const markY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  return (
    <section
      ref={ref}
      data-dark-hero
      className="relative grid min-h-[100svh] grid-cols-1 overflow-hidden bg-olive-950 lg:grid-cols-2"
      aria-label={heroText.regionLabel}
    >
      {/* ---------------------------------------------------------------- */}
      {/*  Left half: the promise                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative order-2 flex items-center justify-center px-6 py-20 sm:px-10 lg:order-1 lg:py-24 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-14">
        {/*
          The logo sits behind the copy as a watermark. Its artwork is dark
          green and would disappear against this ground, so the filter
          flattens it to white and opacity takes it back to a whisper.
          Decorative: the brand name is written as text in the panel opposite.
        */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={enabled ? { y: markY } : undefined}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={IMG.brandLogo}
            alt=""
            width={1049}
            height={947}
            sizes="(min-width: 1024px) 44rem, 130vw"
            quality={86}
            className="w-[130%] max-w-none opacity-[0.07] brightness-0 invert lg:w-[44rem]"
          />
        </motion.div>

        <motion.div
          style={enabled ? { y: copyY, opacity: copyOpacity } : undefined}
          className="relative z-10 flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
        >
          <h1 className="max-w-[16ch] font-display text-[2.5rem] leading-[1.06] font-semibold text-cream-50 sm:text-6xl lg:text-[4rem]">
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
            className="mt-7 max-w-lg text-base leading-relaxed text-cream-100/78 sm:text-lg"
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
        </motion.div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Right half: the brand, over the olive branch                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative order-1 flex min-h-[52svh] items-center justify-center overflow-hidden lg:order-2 lg:min-h-0">
        <motion.div
          className="absolute inset-0"
          style={enabled ? { y: branchY, scale: branchScale } : undefined}
        >
          <Image
            src={IMG.heroBranch}
            alt={heroText.branchAlt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={74}
            placeholder="blur"
            blurDataURL={blurDataURL('olive')}
            className="object-cover object-center"
          />
        </motion.div>

        {/*
          The wordmark is dark green, so this panel is lifted rather than
          darkened: a warm veil keeps the sky bright enough for the lettering to
          read straight off the photograph, with no plaque behind it.
        */}
        <div aria-hidden className="absolute inset-0 bg-cream-50/16" />

        {/* Light bloom directly behind the wordmark — no edges, just contrast */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_30%_at_50%_44%,rgba(253,251,247,0.42),transparent_72%)]"
        />

        {/* The header sits over this panel, so the top stays dark for its links */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-olive-950/80 to-transparent"
        />

        {/* Softens the seam between the two halves on desktop */}
        <div
          aria-hidden
          className="absolute inset-0 lg:bg-gradient-to-r lg:from-olive-950/55 lg:via-transparent lg:to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full flex-col items-center px-6 text-center"
        >
          {/*
            No plaque: the drop-shadow puts a cream halo around the letterforms
            themselves, which lifts the dark green off the branches without
            drawing a box around the logo.
          */}
          <Image
            src={IMG.brandWordmark}
            alt={site.name}
            width={1416}
            height={638}
            priority
            sizes="(min-width: 1024px) 32rem, (min-width: 640px) 27rem, 84vw"
            quality={86}
            className="h-auto w-[84%] max-w-[27rem] drop-shadow-[0_0_10px_rgba(253,251,247,1)] drop-shadow-[0_0_28px_rgba(253,251,247,0.92)] sm:w-full lg:max-w-[32rem]"
          />

          <p className="mt-8 text-[0.64rem] font-semibold tracking-[0.24em] text-olive-900 uppercase drop-shadow-[0_0_8px_rgba(253,251,247,1)] drop-shadow-[0_0_16px_rgba(253,251,247,0.9)] sm:text-[0.7rem]">
            {heroText.badge}
          </p>
          <p className="mt-3 text-[0.64rem] tracking-[0.18em] text-olive-800 uppercase drop-shadow-[0_0_8px_rgba(253,251,247,1)] drop-shadow-[0_0_16px_rgba(253,251,247,0.9)] sm:text-[0.68rem]">
            {heroText.brandTagline}
          </p>
        </motion.div>
      </div>

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
