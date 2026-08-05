import { AdminPageHeader } from '@/components/admin/AdminShell';
import { DemoNotice } from '@/components/admin/primitives';
import { ReviewModeration, type PanelReview } from '@/components/admin/ReviewModeration';
import { adminReviews } from '@/lib/data/admin';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient } from '@/utils/supabase/server';
import type { ReviewRow } from '@/types/database';

export const metadata = { title: 'Yorum Yönetimi' };
export const dynamic = 'force-dynamic';

type Row = ReviewRow & { products: { name: string; slug: string } | null };

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  let reviews: PanelReview[] = [];
  let live = false;

  if (supabase) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      live = true;

      // Ürün adlarını tek sorguda eşliyoruz (gömülü ilişki yerine).
      const { data: products } = await supabase.from('products').select('id, name, slug');
      const byId = new Map((products ?? []).map((p) => [p.id, p]));

      reviews = (data as Row[]).map((row) => {
        const product = byId.get(row.product_id);
        return {
          id: row.id,
          productName: product?.name ?? 'Silinmiş ürün',
          productSlug: product?.slug ?? '',
          author: row.author_name,
          avatarUrl: null,
          rating: row.rating,
          title: row.title,
          comment: row.comment,
          date: row.created_at,
          status: row.status,
          verified: row.is_verified,
        };
      });
    }
  }

  if (!live) {
    reviews = adminReviews.map((r) => ({
      id: r.id,
      productName: r.product,
      productSlug: '',
      author: r.customer,
      avatarUrl: r.avatar,
      rating: r.rating,
      title: null,
      comment: r.comment,
      date: r.date,
      status: r.status === 'onaylandi' ? 'approved' : r.status === 'reddedildi' ? 'rejected' : 'pending',
      verified: false,
    }));
  }

  return (
    <>
      <AdminPageHeader
        title="Yorum Yönetimi"
        description={
          live
            ? `${reviews.length} yorum — veritabanından okunuyor`
            : 'Örnek veri gösteriliyor'
        }
      />

      {!live && (
        <DemoNotice>
          {isSupabaseConfigured
            ? 'Yorum listesi okunamadı. Hesabınızın rolü admin veya staff olmalı.'
            : 'Supabase bağlanmadığı için örnek veri gösteriliyor.'}
        </DemoNotice>
      )}

      {live && reviews.length === 0 && (
        <DemoNotice>
          Veritabanındaki <code className="rounded bg-foreground/8 px-1">reviews</code> tablosu
          henüz boş. Müşteriler ürün sayfalarından yorum bıraktıkça burada onayınıza düşer.
          Örnek yorumları aktarmak için sunucu açıkken{' '}
          <code className="rounded bg-foreground/8 px-1">npm run db:seed</code> çalıştırın.
        </DemoNotice>
      )}

      <ReviewModeration reviews={reviews} />
    </>
  );
}
