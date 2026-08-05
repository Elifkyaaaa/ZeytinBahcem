import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

/** Yarım yıldızları da gösterebilen, salt okunur puan göstergesi. */
export function StarRating({
  rating,
  size = 'sm',
  className,
  showValue = false,
  count,
}: {
  rating: number;
  size?: keyof typeof sizes;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const label = `5 üzerinden ${rating.toFixed(1)} puan`;

  return (
    <div className={cn('flex items-center gap-1.5', className)} title={label}>
      <div className="flex items-center gap-0.5" role="img" aria-label={label}>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className={cn('relative block', sizes[size])} aria-hidden>
              <Star className={cn(sizes[size], 'absolute inset-0 text-gold-500/25')} strokeWidth={1.5} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={cn(sizes[size], 'fill-gold-500 text-gold-500')}
                  strokeWidth={1.5}
                />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-foreground/80">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
