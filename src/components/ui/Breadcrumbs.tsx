import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Breadcrumbs({
  trail,
  className,
}: {
  trail: { name: string; path: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Sayfa yolu" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="transition-colors duration-300 hover:text-gold-700 dark:hover:text-gold-400"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight className="size-3.5 opacity-45" strokeWidth={2} aria-hidden />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
