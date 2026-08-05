import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'gold' | 'olive' | 'discount' | 'neutral' | 'success' | 'warning';

const tones: Record<Tone, string> = {
  gold: 'bg-gold-500/12 text-gold-700 ring-gold-500/25 dark:text-gold-300',
  olive: 'bg-olive-600/12 text-olive-700 ring-olive-600/25 dark:text-olive-300',
  discount: 'bg-red-600 text-white ring-red-600/40 shadow-soft',
  neutral: 'bg-foreground/6 text-muted-foreground ring-foreground/10',
  success: 'bg-emerald-600/12 text-emerald-700 ring-emerald-600/25 dark:text-emerald-400',
  warning: 'bg-amber-500/14 text-amber-700 ring-amber-500/30 dark:text-amber-400',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
        'tracking-wide ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
