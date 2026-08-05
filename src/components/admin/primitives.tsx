'use client';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Kart & panel                                                               */
/* -------------------------------------------------------------------------- */

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background shadow-soft',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="font-serif text-lg text-foreground">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn(padded && 'p-5')}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  Icon,
  accent = 'olive',
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  Icon: LucideIcon;
  accent?: 'olive' | 'gold' | 'blue' | 'rose';
}) {
  const accents = {
    olive: 'bg-olive-600/10 text-olive-700 dark:bg-olive-400/12 dark:text-olive-300',
    gold: 'bg-gold-500/12 text-gold-700 dark:bg-gold-400/12 dark:text-gold-400',
    blue: 'bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300',
    rose: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/12 dark:text-rose-300',
  };
  const up = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-border bg-background p-5 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn('grid size-11 place-items-center rounded-xl', accents[accent])}>
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
        {delta !== undefined && delta !== 0 && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.7rem] font-semibold tabular-nums',
              up
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-700 dark:text-red-400',
            )}
          >
            {up ? (
              <TrendingUp className="size-3" strokeWidth={2.6} />
            ) : (
              <TrendingDown className="size-3" strokeWidth={2.6} />
            )}
            {up ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold text-foreground tabular-nums sm:text-[1.7rem]">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground/80">{hint}</p>}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tablo                                                                      */
/* -------------------------------------------------------------------------- */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[46rem] text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
  align = 'left',
}: {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      scope="col"
      className={cn(
        'bg-surface-muted px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align = 'left',
}: {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <td
      className={cn(
        'px-5 py-3.5 text-foreground/85',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr className={cn('border-t border-border transition-colors hover:bg-surface-muted/55', className)}>
      {children}
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/*  Durum rozeti                                                               */
/* -------------------------------------------------------------------------- */

const statusTones = {
  gold: 'bg-gold-500/12 text-gold-700 ring-gold-500/25 dark:text-gold-300',
  olive: 'bg-olive-600/12 text-olive-700 ring-olive-600/25 dark:text-olive-300',
  success: 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400',
  warning: 'bg-amber-500/14 text-amber-700 ring-amber-500/30 dark:text-amber-400',
  danger: 'bg-red-500/12 text-red-700 ring-red-500/25 dark:text-red-400',
  neutral: 'bg-foreground/6 text-muted-foreground ring-foreground/10',
} as const;

export type StatusTone = keyof typeof statusTones;

export function Status({ children, tone = 'neutral' }: { children: ReactNode; tone?: StatusTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap ring-1 ring-inset',
        statusTones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form kontrolleri                                                           */
/* -------------------------------------------------------------------------- */

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3.5">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300',
          checked ? 'bg-olive-600 dark:bg-gold-500' : 'bg-foreground/15',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-sm',
            checked ? 'left-[1.375rem]' : 'left-0.5',
          )}
        />
      </button>
    </label>
  );
}

export function AdminField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <span className="block text-sm font-medium text-foreground/85">{label}</span>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const adminInput =
  'h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground ' +
  'transition-all placeholder:text-muted-foreground/70 hover:border-gold-500/45 ' +
  'focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none';

/** Filtre çubuğu — tablolarda arama ve sekme filtresi. */
export function Toolbar({
  search,
  onSearch,
  placeholder = 'Ara…',
  tabs,
  activeTab,
  onTab,
  children,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  placeholder?: string;
  tabs?: { id: string; label: string; count?: number }[];
  activeTab?: string;
  onTab?: (id: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {tabs && (
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTab?.(tab.id)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors duration-300',
                activeTab === tab.id
                  ? 'bg-olive-700 font-medium text-cream-50 dark:bg-gold-500 dark:text-olive-950'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs opacity-70 tabular-nums">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5 lg:ml-auto">
        {onSearch && (
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className={cn(adminInput, 'h-10 w-full lg:w-64')}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="font-serif text-lg text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/** Panelde kalıcı kayıt olmadığını dürüstçe belirten not. */
export function DemoNotice({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold-500/30 bg-gold-500/8 px-4 py-3">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
      <p className="flex-1 text-xs leading-relaxed text-foreground/80">{children}</p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Kapat
      </button>
    </div>
  );
}
