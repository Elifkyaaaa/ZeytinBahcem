import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { ProductTabs } from '@/components/product/ProductTabs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Reveal } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Section';
import { getCategory } from '@/lib/data/categories';
import { getProduct, getRelatedProducts, products } from '@/lib/data/products';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, productJsonLd } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return buildMetadata({ title: 'Ürün bulunamadı', description: '', noIndex: true });

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(product, 4);

  const trail = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Ürünler', path: '/products' },
    ...(category ? [{ name: category.name, path: `/products?kategori=${category.slug}` }] : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
        <Container>
          <Breadcrumbs trail={trail} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <ProductGallery images={product.gallery} name={product.name} />
            <ProductPurchase product={product} />
          </div>

          <ProductTabs product={product} />
        </Container>
      </div>

      <section className="border-t border-border bg-surface-muted py-20 lg:py-24" aria-label="Benzer ürünler">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase dark:text-gold-400">
                Bunları da beğenebilirsiniz
              </p>
              <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">Benzer Ürünler</h2>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06} className="h-full">
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd(trail),
          faqJsonLd(product.faq),
        ]}
      />
    </>
  );
}
