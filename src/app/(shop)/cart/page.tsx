import { CartView } from '@/components/cart/CartView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

/**
 * `noIndex` because a cart is per-visitor and has nothing to offer a search
 * result. It is kept in step with `robots.ts` (/cart is disallowed) and with
 * `next.config.ts`, which sends X-Robots-Tag and Cache-Control: no-store for
 * this route — see the account page for why all three are needed.
 *
 * The description still matters even though the page is not indexed: it is
 * what a link preview shows when someone pastes their cart URL into a chat.
 *
 * The cart itself lives in localStorage and renders client-side, so this
 * metadata is the only part of the page the server has anything to say about.
 */
export const metadata = buildMetadata({
  title: 'Sepetim',
  description: 'Sepetinizdeki ürünleri gözden geçirin, kupon uygulayın ve ödemeye geçin.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
      <Container>
        <Breadcrumbs
          trail={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Sepetim', path: '/cart' },
          ]}
        />
        <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">Sepetim</h1>
        <p className="mt-3 text-muted-foreground">
          Siparişinizi tamamlamadan önce ürünlerinizi kontrol edin.
        </p>

        <div className="mt-10">
          <CartView />
        </div>
      </Container>
    </div>
  );
}
