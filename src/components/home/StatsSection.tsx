'use client';

import { useInView } from 'framer-motion';
import { Droplets, Heart, Leaf, Truck, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { useCountUp } from '@/hooks';
import { stats } from '@/lib/data/content';
import { formatNumber } from '@/lib/utils';
import type { Stat } from '@/types';

const icons: Record<string, LucideIcon> = { Leaf, Droplets, Truck, Heart };

function StatCard({ stat, active, delay }: { stat: Stat; active: boolean; delay: number }) {
  const value = useCountUp(stat.value, 1900, active);
  const Icon = icons[stat.icon] ?? Leaf;

  return (
    <Reveal delay={delay} className="h-full">
      <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 size-40 -translate-x-1/2 rounded-full bg-gold-400/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        />

        <span className="relative grid size-13 place-items-center rounded-full bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/15 transition-all duration-500 group-hover:bg-gold-500/12 group-hover:text-gold-600 group-hover:ring-gold-500/30 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/20">
          <Icon className="size-6" strokeWidth={1.6} />
        </span>

        <p className="relative mt-5 font-serif text-[2rem] leading-none font-semibold text-foreground tabular-nums sm:text-[2.6rem]">
          {stat.prefix}
          {formatNumber(value)}
          <span className="text-gold-600 dark:text-gold-400">{stat.suffix}</span>
        </p>

        <p className="relative mt-2.5 text-sm font-semibold tracking-wide text-foreground">
          {stat.label}
        </p>
        <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {stat.description}
        </p>
      </div>
    </Reveal>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="istatistikler"
      className="relative z-10 -mt-16 pb-4 sm:-mt-20"
      aria-label="Rakamlarla biz"
    >
      <Container>
        <div ref={ref} className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} active={inView} delay={i * 0.08} />
          ))}
        </div>
      </Container>
    </section>
  );
}
