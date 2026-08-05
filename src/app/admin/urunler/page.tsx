import { AdminPageHeader } from '@/components/admin/AdminShell';
import { DemoNotice } from '@/components/admin/primitives';
import { ProductManager } from '@/components/admin/ProductManager';
import { getAllProductsForAdmin, getCategories } from '@/lib/catalog';

export const metadata = { title: 'Ürün Yönetimi' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [{ products, live }, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getCategories(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Ürün Yönetimi"
        description={
          live
            ? `${products.length} ürün — veritabanından okunuyor`
            : `${products.length} ürün — yerel katalogdan okunuyor`
        }
      />

      {!live && (
        <DemoNotice>
          Ürünler henüz veritabanında değil; liste{' '}
          <code className="rounded bg-foreground/8 px-1">src/lib/data/products.ts</code> dosyasından
          okunuyor ve bu yüzden düzenlenemiyor. Aktarmak için sunucu açıkken{' '}
          <code className="rounded bg-foreground/8 px-1">npm run db:seed</code> çalıştırın —
          ardından ekleme, düzenleme ve silme çalışır hâle gelir.
        </DemoNotice>
      )}

      <ProductManager products={products} categories={categories} live={live} />
    </>
  );
}
