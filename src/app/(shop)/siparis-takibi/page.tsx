import { OrderTracker } from '@/components/account/OrderTracker';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Section';
import { IMG } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { Suspense } from 'react';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Sipariş Takibi', path: '/siparis-takibi' },
];

export const metadata = buildMetadata({
  title: 'Sipariş Takibi',
  description: 'Sipariş numaranız ve e-posta adresinizle siparişinizin durumunu sorgulayın.',
  path: '/siparis-takibi',
});

export default function OrderTrackingPage() {
  return (
    <>
      <PageHero
        eyebrow="Sipariş Takibi"
        title="Siparişiniz Nerede?"
        description="Sipariş numaranız ve e-posta adresinizle güncel durumu sorgulayabilirsiniz."
        image={IMG.harvestNet}
        trail={trail}
        compact
      />

      <div className="py-16 lg:py-20">
        <Container>
          <Suspense fallback={<div className="skeleton mx-auto h-96 max-w-2xl rounded-2xl" />}>
            <OrderTracker />
          </Suspense>
        </Container>
      </div>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
