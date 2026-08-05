'use client';

import { motion } from 'framer-motion';
import { useId, useState } from 'react';
import { cn, formatNumber } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Alan grafiği — aylık ciro                                                  */
/* -------------------------------------------------------------------------- */

const W = 720;
const H = 260;
const PAD = { top: 18, right: 12, bottom: 28, left: 48 };

export function AreaChart({
  data,
  valueKey = 'revenue',
  formatValue = (v: number) => `${formatNumber(Math.round(v / 1000))}B ₺`,
}: {
  data: { month: string; revenue: number; orders: number }[];
  valueKey?: 'revenue' | 'orders';
  formatValue?: (v: number) => string;
}) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const values = data.map((d) => d[valueKey]);
  const max = Math.max(...values) * 1.12;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = `${line} L ${x(values.length - 1)} ${PAD.top + innerH} L ${x(0)} ${PAD.top + innerH} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Aylık ciro grafiği"
        preserveAspectRatio="none"
        style={{ height: 'clamp(200px, 30vw, 260px)' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-olive-500)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--color-olive-500)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Yatay kılavuzlar */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={y(t) + 4}
              textAnchor="end"
              className="fill-current text-[11px] opacity-45"
            >
              {formatValue(t)}
            </text>
          </g>
        ))}

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        />

        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-olive-500)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {data.map((d, i) => (
          <g key={d.month}>
            <text
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              className="fill-current text-[11px] opacity-50"
            >
              {d.month}
            </text>

            {hover === i && (
              <line
                x1={x(i)}
                x2={x(i)}
                y1={PAD.top}
                y2={PAD.top + innerH}
                stroke="var(--color-gold-500)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            <circle
              cx={x(i)}
              cy={y(d[valueKey])}
              r={hover === i ? 5.5 : 3.5}
              fill="var(--background)"
              stroke={hover === i ? 'var(--color-gold-500)' : 'var(--color-olive-500)'}
              strokeWidth={2.5}
              className="transition-all duration-200"
            />

            {/* Görünmez isabet alanı */}
            <rect
              x={x(i) - innerW / data.length / 2}
              y={PAD.top}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-border bg-background px-3 py-2 shadow-lift"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 0 }}
        >
          <p className="text-[0.68rem] text-muted-foreground">{data[hover].month} ayı</p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {formatValue(data[hover][valueKey])}
          </p>
          <p className="text-[0.68rem] text-muted-foreground tabular-nums">
            {formatNumber(data[hover].orders)} sipariş
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sütun grafiği — aylık sipariş adedi                                        */
/* -------------------------------------------------------------------------- */

export function BarChart({ data }: { data: { month: string; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.orders));

  return (
    <div className="flex h-52 items-end gap-1.5 sm:gap-2.5">
      {data.map((d, i) => (
        <div key={d.month} className="group flex min-w-0 flex-1 flex-col items-center gap-2">
          <span className="text-[0.65rem] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 tabular-nums">
            {formatNumber(d.orders)}
          </span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.orders / max) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-t-md bg-gradient-to-t from-olive-600/55 to-olive-500 transition-colors duration-300 group-hover:from-gold-600/60 group-hover:to-gold-400"
          />
          <span className="text-[0.65rem] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Halka grafiği — kategori payları                                           */
/* -------------------------------------------------------------------------- */

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;

  // Dilim uzunlukları ve başlangıç noktaları render'dan önce hesaplanır.
  const arcs = data.reduce<{ item: (typeof data)[number]; length: number; offset: number }[]>(
    (acc, item) => {
      const previous = acc.at(-1);
      const start = previous ? previous.offset + previous.length : 0;
      return [...acc, { item, length: (item.value / total) * circumference, offset: start }];
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative shrink-0">
        <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={18}
          />
          {arcs.map(({ item, length, offset }, i) => (
            <motion.circle
              key={item.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={18}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-foreground tabular-nums">{centerValue}</span>
          <span className="mt-0.5 text-[0.68rem] text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-sm text-foreground/85">{d.label}</span>
            <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
              %{d.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Yatay çubuklar — trafik kaynakları                                         */
/* -------------------------------------------------------------------------- */

export function ProgressList({
  data,
  className,
}: {
  data: { label: string; value: number }[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <ul className={cn('space-y-4', className)}>
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm text-foreground/85">{d.label}</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">%{d.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-olive-500 to-gold-500"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
