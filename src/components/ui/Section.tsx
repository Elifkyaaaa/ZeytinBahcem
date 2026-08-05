import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('container-x', className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'default' | 'muted' | 'deep';
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 sm:py-24 lg:py-32',
        tone === 'muted' && 'bg-surface-muted',
        tone === 'deep' && 'bg-olive-900 text-cream-100 dark:bg-olive-950',
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Bölüm başlıkları: küçük altın etiket + serif başlık + açıklama. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'default',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'center' | 'left';
  tone?: 'default' | 'inverted';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.22em] uppercase',
            align === 'center' && 'justify-center',
            tone === 'inverted' ? 'text-gold-300' : 'text-gold-600 dark:text-gold-400',
          )}
        >
          <span className="hairline-gold h-px w-8" aria-hidden />
          {eyebrow}
          <span className="hairline-gold h-px w-8" aria-hidden />
        </div>
      )}
      <h2
        className={cn(
          'text-3xl leading-[1.12] sm:text-4xl lg:text-[2.75rem]',
          tone === 'inverted' ? 'text-cream-50' : 'text-olive-900 dark:text-cream-100',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            tone === 'inverted' ? 'text-cream-200/80' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
