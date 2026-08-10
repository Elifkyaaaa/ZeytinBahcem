import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { featuredProducts } from '@/lib/data/products';
import { featuredProductsText } from '@/lib/data/text/home';

export function FeaturedProducts() {
  return (
    <Section id="one-cikanlar">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={featuredProductsText.eyebrow}
            title={featuredProductsText.title}
            description={featuredProductsText.description}
            align="left"
            className="max-w-xl"
          />
          <Button href="/urunler" variant="outline" size="md" className="shrink-0 self-start sm:self-end">
            {featuredProductsText.allCta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06} className="h-full">
              <ProductCard product={product} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
