import { NextResponse } from 'next/server';
import { categories } from '@/lib/data/categories';
import { posts } from '@/lib/data/posts';
import { products } from '@/lib/data/products';
import { createServiceClient } from '@/utils/supabase/server';
import { hasServiceRole } from '@/utils/env';

export const runtime = 'nodejs';

/**
 * Uygulamanın tipli kataloğunu Supabase'e aktarır.
 *
 * Ürün ve blog verisi tek bir yerde (src/lib/data) tutulduğu için SQL seed
 * dosyasında tekrarlanmaz; bu uç nokta aynı kaynaktan veritabanını doldurur.
 *
 * Yalnızca servis rolü anahtarı tanımlıyken çalışır ve `x-seed-token` başlığı
 * SUPABASE_SERVICE_ROLE_KEY ile eşleşmelidir — herkese açık bir uç değildir.
 */
export async function POST(request: Request) {
  const db = createServiceClient();

  if (!db || !hasServiceRole) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'SUPABASE_SERVICE_ROLE_KEY tanımlı değil. Tohumlama yalnızca servis rolüyle yapılabilir.',
      },
      { status: 503 },
    );
  }

  if (request.headers.get('x-seed-token') !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: 'Geçersiz tohumlama anahtarı.' }, { status: 401 });
  }

  /* Kategoriler ------------------------------------------------------------ */
  const { error: categoryError } = await db.from('categories').upsert(
    categories.map((category, index) => ({
      slug: category.slug,
      name: category.name,
      tagline: category.tagline,
      description: category.description,
      image_url: category.image,
      sort_order: index + 1,
      is_featured: category.featured ?? false,
      is_active: true,
    })),
    { onConflict: 'slug' },
  );

  if (categoryError) {
    return NextResponse.json({ ok: false, error: categoryError.message }, { status: 500 });
  }

  const { data: savedCategories } = await db.from('categories').select('id, slug');
  const categoryIdBySlug = new Map((savedCategories ?? []).map((c) => [c.slug, c.id]));

  /* Ürünler ---------------------------------------------------------------- */
  const { error: productError } = await db.from('products').upsert(
    products.map((product) => ({
      slug: product.slug,
      name: product.name,
      category_id: categoryIdBySlug.get(product.category) ?? null,
      short_description: product.shortDescription,
      description: product.description,
      price: product.price,
      old_price: product.oldPrice ?? null,
      variants: product.variants.map((variant) => ({
        label: variant.label,
        value: variant.value,
        price: variant.price,
        old_price: variant.oldPrice ?? null,
        in_stock: variant.inStock,
      })),
      highlights: product.highlights,
      specs: product.specs,
      nutrition: product.nutrition,
      faq: product.faq,
      image_url: product.image,
      gallery: product.gallery,
      badge: product.badge ?? null,
      volume: product.volume,
      stock_count: product.stockCount,
      is_featured: product.featured ?? false,
      is_active: product.inStock,
      rating: product.rating,
      review_count: product.reviewCount,
    })),
    { onConflict: 'slug' },
  );

  if (productError) {
    return NextResponse.json({ ok: false, error: productError.message }, { status: 500 });
  }

  /* Blog yazıları ---------------------------------------------------------- */
  const { error: blogError } = await db.from('blogs').upsert(
    posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cover_url: post.cover,
      category: post.category,
      content: post.content,
      author_name: post.author.name,
      author_role: post.author.role,
      author_avatar: post.author.avatar,
      reading_time: post.readingTime,
      is_published: true,
      published_at: post.date,
    })),
    { onConflict: 'slug' },
  );

  if (blogError) {
    return NextResponse.json({ ok: false, error: blogError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    seeded: {
      categories: categories.length,
      products: products.length,
      blogs: posts.length,
    },
  });
}
