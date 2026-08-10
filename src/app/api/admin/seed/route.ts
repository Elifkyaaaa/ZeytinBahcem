import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { categories } from '@/lib/data/categories';
import { posts } from '@/lib/data/posts';
import { products } from '@/lib/data/products';
import { createServiceClient } from '@/utils/supabase/server';
import { hasServiceRole } from '@/utils/env';
import { checkRateLimit, clientKey, tooManyRequests } from '@/utils/rate-limit';

export const runtime = 'nodejs';

/**
 * Copies the app's typed catalog into Supabase.
 *
 * Product and blog data lives in one place (src/lib/data), so it is not
 * duplicated in the SQL seed file; this endpoint fills the database from that
 * same source.
 *
 * It runs only when the service role key is configured, and the `x-seed-token`
 * header must match SUPABASE_SERVICE_ROLE_KEY — this is not a public endpoint.
 */
export async function POST(request: Request) {
  // Guards against key guessing: five attempts per minute.
  const limit = checkRateLimit(clientKey(request, 'seed'), { limit: 5, windowMs: 60_000 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

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

  // This endpoint is destructive: it overwrites the catalog and deletes
  // reviews. In production it only opens with an explicit
  // ALLOW_SEED_ENDPOINT=true.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED_ENDPOINT !== 'true') {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Tohumlama ucu üretimde kapalıdır. Gerekiyorsa ALLOW_SEED_ENDPOINT=true tanımlayıp işlem sonrası kaldırın.',
      },
      { status: 403 },
    );
  }

  const provided = request.headers.get('x-seed-token') ?? '';
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  // Constant-time comparison: `===` short-circuits character by character, so
  // response timing would leak the key.
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const valid = a.length === b.length && timingSafeEqual(a, b);

  if (!valid) {
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

  /* Products ---------------------------------------------------------------- */
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

  /* Blog posts -------------------------------------------------------------- */
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

  /* Yorumlar --------------------------------------------------------------- */
  // Product ids are generated by the database, so we match on slug.
  const { data: savedProducts } = await db.from('products').select('id, slug');
  const productIdBySlug = new Map((savedProducts ?? []).map((p) => [p.slug, p.id]));

  const reviewRows = products.flatMap((product) => {
    const productId = productIdBySlug.get(product.slug);
    if (!productId) return [];
    return product.reviews.map((review) => ({
      product_id: productId,
      author_name: review.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      // Leave some sample reviews pending so the moderation panel can be tested.
      status: review.verified ? ('approved' as const) : ('pending' as const),
      is_verified: review.verified,
      created_at: review.date,
    }));
  });

  // Clear first so reviews do not pile up when this runs again.
  await db.from('reviews').delete().not('id', 'is', null);

  const { error: reviewError } = await db.from('reviews').insert(reviewRows);
  if (reviewError) {
    return NextResponse.json({ ok: false, error: reviewError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    seeded: {
      categories: categories.length,
      products: products.length,
      blogs: posts.length,
      reviews: reviewRows.length,
    },
  });
}
