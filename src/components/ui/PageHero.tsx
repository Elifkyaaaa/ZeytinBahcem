import Image from 'next/image';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { blurDataURL, cn } from '@/lib/utils';

/** Alt sayfaların ortak üst bandı: görsel, başlık ve sayfa yolu. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  trail,
  compact = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  trail: { name: string; path: string }[];
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      data-dark-hero
      className={cn(
        'relative flex items-end overflow-hidden bg-olive-950',
        compact ? 'min-h-[19rem] sm:min-h-[21rem]' : 'min-h-[24rem] sm:min-h-[28rem]',
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={72}
        placeholder="blur"
        blurDataURL={blurDataURL('olive')}
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-olive-950/92 via-olive-950/62 to-olive-950/45"
      />

      <Container className="relative z-10 pt-28 pb-12 sm:pb-14">
        <Breadcrumbs
          trail={trail}
          className="mb-6 [&_a]:text-cream-200/65 [&_a:hover]:text-gold-300 [&_span]:text-cream-50"
        />

        {eyebrow && (
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-300 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.1] text-cream-50 sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-200/78 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
