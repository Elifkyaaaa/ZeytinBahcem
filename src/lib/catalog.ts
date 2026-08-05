import 'server-only';

import { categories as localCategories } from '@/lib/data/categories';
import { products as localProducts } from '@/lib/data/products';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient } from '@/utils/supabase/server';
import type { Category, Product, ProductVariant } from '@/types';
import type { CategoryRow, ProductRow } from '@/types/database';

/**
 * Katalog okuma katmanı.
 *
 * Supabase bağlıysa ve tabloda kayıt varsa veritabanından okur; aksi hâlde
 * `src/lib/data` altındaki tipli katalogla devam eder. Böylece proje anahtarsız
 * da çalışır, veritabanı doldurulduğunda ise tek satır değişiklik gerekmeden
 * canlı veriye geçer.
 */

function mapVariants(raw: ProductRow['variants']): ProductVariant[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map((v) => ({
    label: v.label,
    value: v.value,
    price: Number(v.price),
    oldPrice: v.old_price == null ? undefined : Number(v.old_price),
    inStock: v.in_stock,
  }));
}

function rowToProduct(row: ProductRow, categorySlug: string): Product {
  const variants = mapVariants(row.variants);
  const fallback = localProducts.find((p) => p.slug === row.slug);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: (categorySlug || fallback?.category || 'naturel-sizma') as Product['category'],
    price: Number(row.price),
    oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    image: row.image_url ?? fallback?.image ?? '',
    gallery: row.gallery?.length ? row.gallery : (fallback?.gallery ?? []),
    variants: variants.length ? variants : (fallback?.variants ?? []),
    volume: row.volume ?? fallback?.volume ?? '',
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    highlights: row.highlights ?? [],
    specs: row.specs ?? [],
    nutrition: row.nutrition ?? [],
    faq: row.faq ?? [],
    // Yorumlar ayrı tabloda; ürün detayında ayrıca çekilir.
    reviews: fallback?.reviews ?? [],
    badge: (row.badge as Product['badge']) ?? undefined,
    featured: row.is_featured,
    inStock: row.is_active && row.stock_count > 0,
    stockCount: row.stock_count,
  };
}

function rowToCategory(row: CategoryRow): Category {
  const fallback = localCategories.find((c) => c.slug === row.slug);
  return {
    slug: row.slug as Category['slug'],
    name: row.name,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    image: row.image_url ?? fallback?.image ?? '',
    featured: row.is_featured,
  };
}

/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return localCategories;

  const supabase = await createClient();
  if (!supabase) return localCategories;

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (!data?.length) return localCategories;
  return data.map(rowToCategory);
}

/**
 * Kategori kimliği → slug eşlemesi.
 * Gömülü ilişki sorgusu (`categories(slug)`) yerine ayrı çekip eşliyoruz;
 * kategori sayısı tek haneli olduğu için maliyeti ihmal edilebilir ve
 * şema tipinde ilişki tanımı gerektirmez.
 */
async function categorySlugMap(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
) {
  const { data } = await supabase.from('categories').select('id, slug');
  return new Map((data ?? []).map((c) => [c.id, c.slug]));
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await loadProducts({ activeOnly: true });
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) return localProducts.find((p) => p.slug === slug);

  const supabase = await createClient();
  if (!supabase) return localProducts.find((p) => p.slug === slug);

  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (!data) return localProducts.find((p) => p.slug === slug);

  const slugs = await categorySlugMap(supabase);
  const row = data as ProductRow;
  return rowToProduct(row, slugs.get(row.category_id ?? '') ?? '');
}

/** Yönetim paneli için: pasif ürünler dâhil hepsi. */
export async function getAllProductsForAdmin() {
  return loadProducts({ activeOnly: false });
}

async function loadProducts({ activeOnly }: { activeOnly: boolean }) {
  if (!isSupabaseConfigured) return { products: localProducts, live: false };

  const supabase = await createClient();
  if (!supabase) return { products: localProducts, live: false };

  const query = supabase.from('products').select('*').order('created_at', { ascending: false });
  const { data, error } = activeOnly ? await query.eq('is_active', true) : await query;

  // Tablo boşsa yerel katalogla devam — site hiçbir zaman boş görünmez.
  if (error || !data?.length) return { products: localProducts, live: false };

  const slugs = await categorySlugMap(supabase);

  return {
    products: (data as ProductRow[]).map((row) =>
      rowToProduct(row, slugs.get(row.category_id ?? '') ?? ''),
    ),
    live: true,
  };
}
