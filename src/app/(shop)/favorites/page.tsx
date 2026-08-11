import { FavoritesView } from '@/components/account/FavoritesView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Favorilerim',
  description: 'Beğendiğiniz zeytinyağı ve sofralık zeytin ürünlerini tek yerde toplayın.',
  path: '/favorites',
  noIndex: true,
});

export default function FavoritesPage() {
  return (
    <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
      <Container>
        <Breadcrumbs
          trail={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Favorilerim', path: '/favorites' },
          ]}
        />
        <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">Favorilerim</h1>
        <p className="mt-3 text-muted-foreground">
          Beğendiğiniz ürünler tarayıcınızda saklanır; hesabınıza giriş yaptığınızda kalıcı hâle gelir.
        </p>

        <div className="mt-10">
          <FavoritesView />
        </div>
      </Container>
    </div>
  );
}
