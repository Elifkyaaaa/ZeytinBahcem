'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { slugify } from '@/lib/utils';

export interface ProductActionState {
  error?: string;
  success?: string;
}

const NEEDS_DB =
  'Ürün yönetimi için Supabase bağlantısı gerekiyor. Katalog şu an yerel dosyadan okunuyor — ' +
  'önce `npm run db:seed` ile ürünleri veritabanına aktarın.';

/** Yazma işlemleri yalnızca admin/staff rolüne açık. */
async function requireStaff() {
  const supabase = await createClient();
  if (!supabase) return { error: NEEDS_DB } as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturumunuz sona ermiş. Yeniden giriş yapın.' } as const;

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return { error: 'Bu işlem için yetkiniz yok.' } as const;
  }

  return { supabase } as const;
}

function num(form: FormData, key: string, fallback = 0) {
  const raw = form.get(key);
  const parsed = Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function str(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/* -------------------------------------------------------------------------- */
/*  Oluştur / güncelle                                                         */
/* -------------------------------------------------------------------------- */

export async function saveProduct(
  _prev: ProductActionState,
  form: FormData,
): Promise<ProductActionState> {
  const auth = await requireStaff();
  if ('error' in auth) return { error: auth.error };

  const id = str(form, 'id');
  const name = str(form, 'name');
  const price = num(form, 'price');
  const oldPriceRaw = str(form, 'oldPrice');
  const stock = Math.max(0, Math.round(num(form, 'stockCount')));
  const categorySlug = str(form, 'category');

  if (name.length < 3) return { error: 'Ürün adı en az 3 karakter olmalıdır.' };
  if (price <= 0) return { error: 'Fiyat sıfırdan büyük olmalıdır.' };

  const oldPrice = oldPriceRaw ? num(form, 'oldPrice') : null;
  if (oldPrice !== null && oldPrice <= price) {
    return { error: 'Eski fiyat, güncel fiyattan yüksek olmalıdır.' };
  }

  // Kategori slug'ından kimliği bul.
  let categoryId: string | null = null;
  if (categorySlug) {
    const { data } = await auth.supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    categoryId = data?.id ?? null;
  }

  const payload = {
    name,
    slug: str(form, 'slug') || slugify(name),
    category_id: categoryId,
    short_description: str(form, 'shortDescription') || null,
    description: str(form, 'description') || null,
    price,
    old_price: oldPrice,
    image_url: str(form, 'imageUrl') || null,
    volume: str(form, 'volume') || null,
    badge: str(form, 'badge') || null,
    stock_count: stock,
    is_featured: form.get('isFeatured') !== null,
    is_active: form.get('isActive') !== null,
  };

  // Yeni kayıtta jsonb/dizi sütunlarının varsayılanlarını açıkça veriyoruz;
  // varyant ve künye bilgisi sonradan ürün detayından zenginleştirilir.
  const { error } = id
    ? await auth.supabase.from('products').update(payload).eq('id', id)
    : await auth.supabase.from('products').insert({
        ...payload,
        variants: payload.volume
          ? [{ label: payload.volume, value: slugify(payload.volume), price, in_stock: stock > 0 }]
          : [],
        highlights: [],
        specs: [],
        nutrition: [],
        faq: [],
        gallery: payload.image_url ? [payload.image_url] : [],
        rating: 0,
        review_count: 0,
      });

  if (error) {
    if (error.code === '23505') return { error: 'Bu URL adresi (slug) zaten kullanılıyor.' };
    return { error: `Kaydedilemedi: ${error.message}` };
  }

  revalidatePath('/admin/urunler');
  revalidatePath('/urunler');
  return { success: id ? 'Ürün güncellendi.' : 'Ürün eklendi.' };
}

/* -------------------------------------------------------------------------- */
/*  Sil                                                                        */
/* -------------------------------------------------------------------------- */

export async function deleteProduct(form: FormData) {
  const auth = await requireStaff();
  if ('error' in auth) return;

  const id = String(form.get('id') ?? '');
  if (!id) return;

  await auth.supabase.from('products').delete().eq('id', id);
  revalidatePath('/admin/urunler');
  revalidatePath('/urunler');
}

/* -------------------------------------------------------------------------- */
/*  Yayın durumu / stok — hızlı işlemler                                       */
/* -------------------------------------------------------------------------- */

export async function toggleProductActive(form: FormData) {
  const auth = await requireStaff();
  if ('error' in auth) return;

  const id = String(form.get('id') ?? '');
  const next = form.get('next') === '1';
  if (!id) return;

  await auth.supabase.from('products').update({ is_active: next }).eq('id', id);
  revalidatePath('/admin/urunler');
  revalidatePath('/urunler');
}

export async function updateStock(
  _prev: ProductActionState,
  form: FormData,
): Promise<ProductActionState> {
  const auth = await requireStaff();
  if ('error' in auth) return { error: auth.error };

  const id = str(form, 'id');
  const stock = Math.max(0, Math.round(num(form, 'stockCount')));
  if (!id) return { error: 'Ürün bulunamadı.' };

  const { error } = await auth.supabase
    .from('products')
    .update({ stock_count: stock })
    .eq('id', id);

  if (error) return { error: 'Stok güncellenemedi.' };

  revalidatePath('/admin/stok');
  revalidatePath('/admin/urunler');
  return { success: 'Stok güncellendi.' };
}
