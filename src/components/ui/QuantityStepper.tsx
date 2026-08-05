'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
  label = 'Adet',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}) {
  const dim = size === 'sm' ? 'size-8' : 'size-10';
  const text = size === 'sm' ? 'text-sm w-8' : 'text-base w-11';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-surface',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Adet azalt"
        className={cn(
          dim,
          'grid place-items-center rounded-full text-foreground/70 transition-all',
          'hover:bg-foreground/6 hover:text-foreground active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        <Minus className="size-4" strokeWidth={2} />
      </button>
      <span
        className={cn(text, 'text-center font-semibold text-foreground tabular-nums')}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Adet artır"
        className={cn(
          dim,
          'grid place-items-center rounded-full text-foreground/70 transition-all',
          'hover:bg-foreground/6 hover:text-foreground active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
