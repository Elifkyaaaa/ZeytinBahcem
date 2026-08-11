import { CheckoutView } from '@/components/checkout/CheckoutView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ödeme',
  description: 'Teslimat bilgilerinizi girin, kargo ve ödeme yönteminizi seçerek siparişinizi tamamlayın.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
      <Container>
        <Breadcrumbs
          trail={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Sepetim', path: '/cart' },
            { name: 'Ödeme', path: '/checkout' },
          ]}
        />
        <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">Ödeme</h1>
        <p className="mt-3 text-muted-foreground">
          Bilgileriniz 256-bit SSL ile şifrelenerek iletilir.
        </p>

        <div className="mt-10">
          <CheckoutView />
        </div>
      </Container>
    </div>
  );
}
