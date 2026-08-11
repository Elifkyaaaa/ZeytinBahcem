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

/**
 * A light hero. The photograph behind it is a sunlit grove whose middle is
 * almost white, so everything on top is dark olive rather than cream — and the
 * section deliberately carries no `data-dark-hero`, which would otherwise flip
 * the header to light type over a pale background.
 */
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

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-cream-100"
      aria-label={heroText.regionLabel}
    >
      <motion.div
        className="absolute inset-0 -z-20"
        style={enabled ? { y: photoY, scale: photoScale } : undefined}
      >
        <Image
          src={IMG.heroGroveLight}
          alt={heroText.groveAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={74}
          placeholder="blur"
          blurDataURL={blurDataURL('cream')}
          className="object-cover object-center"
        />
      </motion.div>

      {/*
        No scrim over the photograph. Measured on the raw image, the area the
        copy occupies sits at luma 224–237 across viewports from 390 px to
        2560 px wide, which already gives 11:1 for the headline and 8:1 for
        body copy. Anything painted on top would only hide the grove — the
        few leaves that do drift into the middle are handled by the text
        shadow below, which follows the letterforms instead of covering the
        picture.
      */}
      <motion.div
        style={enabled ? { y: contentY, opacity: contentOpacity } : undefined}
        className="container-x relative z-10 flex flex-col items-center pt-28 pb-16 text-center"
      >
        {/*
          The full-colour lockup, which is what this background finally allows:
          dark green on cream is the pairing it was drawn for.
        */}
        <Image
          src={IMG.brandWordmark}
          alt={site.name}
          width={1416}
          height={638}
          priority
          sizes="(min-width: 1024px) 16rem, (min-width: 640px) 15rem, 58vw"
          quality={86}
          className="h-auto w-[58%] max-w-[15rem] lg:max-w-[16rem]"
        />

        <h1 className="mt-7 max-w-[15ch] font-display text-[2.3rem] leading-[1.06] font-semibold text-olive-900 [text-shadow:0_1px_12px_rgba(253,251,247,0.95)] sm:text-[2.9rem] lg:text-[3.1rem]">
          {heroText.titleWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 0.16 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mr-[0.28em] inline-block"
            >
              {i === heroText.accentWordIndex ? (
                <span className="text-gold-700">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base leading-relaxed text-olive-800 [text-shadow:0_1px_12px_rgba(253,251,247,0.95)] sm:text-lg"
        >
          {heroText.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.74, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:gap-4"
        >
          <Button href="/urunler" variant="gold" size="xl">
            {heroText.primaryCta}
            <ArrowRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.2}
            />
          </Button>
          {/* `glass` is built for dark grounds and would vanish here */}
          <Button href="/urunler?siralama=populer" variant="outline" size="xl">
            <ShoppingBag className="size-5" strokeWidth={2} />
            {heroText.secondaryCta}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="text-[0.64rem] font-semibold tracking-[0.24em] text-gold-700 uppercase [text-shadow:0_1px_12px_rgba(253,251,247,0.95)] sm:text-[0.7rem]">
            {heroText.badge}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[0.7rem] tracking-[0.16em] text-olive-800/85 uppercase [text-shadow:0_1px_12px_rgba(253,251,247,0.95)]">
            {heroText.trustMarks.map((item) => (
              <span key={item} className="flex items-center gap-2.5">
                <span className="size-1 rounded-full bg-gold-600/70" aria-hidden />
                {item}
              </span>
            ))}
          </div>
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
        <span className="text-[0.62rem] tracking-[0.24em] text-olive-800/55 uppercase">
          {heroText.scrollLabel}
        </span>
        <span className="relative h-11 w-6 rounded-full border border-olive-800/25">
          <motion.span
            animate={{ y: [5, 18, 5], opacity: [0, 1, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-gold-600"
          />
        </span>
      </motion.a>
    </section>
  );
}
