import { Suspense } from 'react';
import { ProductBrowser } from '@/components/product/ProductBrowser';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Section';
import { IMG } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Ürünler', path: '/urunler' },
];

export const metadata = buildMetadata({
  title: 'Ürünler',
  description:
    'Natürel sızma, erken hasat, taş baskı zeytinyağları ve doğal salamura sofralık zeytin çeşitlerimiz. Soğuk sıkım, katkısız, Ege bahçelerinden.',
  path: '/urunler',
  image: IMG.cruetOlives,
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Koleksiyon"
        title="Tüm Ürünler"
        description="Her biri kendi bahçesinden, kendi hasat gününden ve kendi hikâyesinden geliyor. Filtreleyerek size en uygun olanı bulun."
        image={IMG.groveField}
        trail={trail}
        compact
      />

      <div className="py-16 lg:py-20">
        <Container>
          <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Yükleniyor…</div>}>
            <ProductBrowser />
          </Suspense>
        </Container>
      </div>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
