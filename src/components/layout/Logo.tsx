import Link from 'next/link';
import { OliveBranchIcon } from '@/components/ui/icons';
import { site } from '@/lib/data/site';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  tone = 'default',
  compact = false,
}: {
  className?: string;
  tone?: 'default' | 'inverted';
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — ana sayfa`}
      className={cn('group flex shrink-0 items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'grid size-10 place-items-center rounded-full transition-all duration-500',
          'ring-1 ring-inset group-hover:rotate-[-12deg]',
          tone === 'inverted'
            ? 'bg-white/10 text-gold-300 ring-white/25'
            : 'bg-olive-600/8 text-olive-600 ring-olive-600/20 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/25',
        )}
      >
        <OliveBranchIcon className="size-[1.35rem]" />
      </span>
      <span className={cn('flex flex-col leading-none', compact && 'sr-only sm:not-sr-only sm:flex')}>
        <span
          className={cn(
            'font-serif text-[1.08rem] font-semibold tracking-tight',
            // --foreground kullanılıyor ki şeffaf header koyu hero üzerindeyken
            // otomatik olarak açık tona dönsün.
            tone === 'inverted' ? 'text-cream-50' : 'text-foreground',
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            'mt-0.5 text-[0.58rem] font-medium tracking-[0.24em] uppercase',
            tone === 'inverted' ? 'text-cream-200/70' : 'text-gold-600 dark:text-gold-400/90',
          )}
        >
          Est. {site.founded}
        </span>
      </span>
    </Link>
  );
}
