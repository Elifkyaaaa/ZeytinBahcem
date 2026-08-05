'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { ReviewStatus } from '@/types/database';

export interface ReviewActionState {
  error?: string;
  success?: string;
}

const VALID: ReviewStatus[] = ['pending', 'approved', 'rejected'];

/** Yorum yönetimi admin/staff rolüne açıktır. */
async function requireStaff() {
  const supabase = await createClient();
  if (!supabase) return { error: 'Supabase bağlantısı gerekiyor.' } as const;

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

/**
 * Yorum durumunu değiştirir.
 * Onaylanan yorumlar ürünün puan ortalamasını ve yorum sayısını veritabanı
 * trigger'ı (`refresh_product_rating`) üzerinden otomatik günceller.
 */
export async function setReviewStatus(form: FormData) {
  const auth = await requireStaff();
  if ('error' in auth) return;

  const id = String(form.get('id') ?? '');
  const status = String(form.get('status') ?? '') as ReviewStatus;

  if (!id || !VALID.includes(status)) return;

  await auth.supabase.from('reviews').update({ status }).eq('id', id);

  revalidatePath('/admin/yorumlar');
  revalidatePath('/urunler', 'layout');
}

export async function deleteReview(form: FormData) {
  const auth = await requireStaff();
  if ('error' in auth) return;

  const id = String(form.get('id') ?? '');
  if (!id) return;

  await auth.supabase.from('reviews').delete().eq('id', id);

  revalidatePath('/admin/yorumlar');
  revalidatePath('/urunler', 'layout');
}
