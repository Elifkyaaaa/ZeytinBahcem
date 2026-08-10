import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { categories } from '@/lib/data/categories';
import { blurDataURL, cn } from '@/lib/utils';
import { categoriesText } from '@/lib/data/text/home';

export function CategoriesSection() {
  return (
    <Section id="kategoriler" tone="muted">
      <Container>
        <SectionHeading
          eyebrow={categoriesText.eyebrow}
          title={categoriesText.title}
          description={categoriesText.description}
        />

        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {categories.map((category, i) => {
            const wide = i === 0;
            return (
              <Reveal
                key={category.slug}
                delay={i * 0.07}
                className={cn(wide && 'lg:col-span-1 lg:row-span-2')}
              >
                <Link
                  href={`/urunler?kategori=${category.slug}`}
                  className={cn(
                    'group relative flex h-full overflow-hidden rounded-3xl',
                    'shadow-soft transition-all duration-500 hover:shadow-lift',
                    wide ? 'min-h-[22rem] lg:min-h-[34rem]' : 'min-h-[15rem] lg:min-h-[16.25rem]',
                  )}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes={wide ? '(min-width: 1024px) 33vw, 92vw' : '(min-width: 1024px) 33vw, 92vw'}
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                  />

                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-olive-950/88 via-olive-950/28 to-transparent transition-opacity duration-500 group-hover:from-olive-950/92"
                  />
                  {/* Gold frame that appears on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-3xl ring-1 ring-gold-400/0 ring-inset transition-all duration-500 group-hover:ring-2 group-hover:ring-gold-400/45"
                  />

                  <div className="relative z-10 mt-auto w-full p-6 sm:p-7">
                    <p className="text-[0.66rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">
                      {category.tagline}
                    </p>
                    <h3
                      className={cn(
                        'mt-2 font-display text-cream-50',
                        wide ? 'text-3xl sm:text-4xl' : 'text-2xl',
                      )}
                    >
                      {category.name}
                    </h3>

                    {wide && (
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-200/75">
                        {category.description}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cream-100">
                      {categoriesText.cardCta}
                      <ArrowRight
                        className="size-4 transition-transform duration-400 group-hover:translate-x-1.5"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
