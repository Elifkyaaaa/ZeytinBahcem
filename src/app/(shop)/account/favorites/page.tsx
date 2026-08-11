import { FavoritesView } from '@/components/account/FavoritesView';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Favorilerim',
  description: 'Beğendiğiniz ürünleri tek yerde toplayın.',
  path: '/account/favorites',
  noIndex: true,
});

export default function AccountFavoritesPage() {
  return (
    <div>
      <h2 className="mb-5 font-display text-xl text-foreground">Favorilerim</h2>
      <FavoritesView />
    </div>
  );
}
