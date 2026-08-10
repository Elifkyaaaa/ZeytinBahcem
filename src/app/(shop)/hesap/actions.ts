'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export interface ActionState {
  error?: string;
  success?: string;
}

const NEEDS_SUPABASE =
  'Bu işlem için Supabase bağlantısı gerekiyor. .env.local dosyanızı yapılandırın.';

function str(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/* -------------------------------------------------------------------------- */
/*  Profil                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateProfile(_prev: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await createClient();
  if (!supabase) return { error: NEEDS_SUPABASE };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.' };

  const fullName = str(form, 'fullName');
  const phone = str(form, 'phone');
  const marketing = Boolean(form.get('marketing'));

  if (fullName.length < 3) return { error: 'Ad soyad en az 3 karakter olmalıdır.' };

  const { error } = await supabase
    .from('users')
    .update({ full_name: fullName, phone, marketing_opt_in: marketing })
    .eq('id', user.id);

  if (error) return { error: 'Profil güncellenemedi. Lütfen tekrar deneyin.' };

  revalidatePath('/hesap');
  return { success: 'Profil bilgileriniz güncellendi.' };
}

/* -------------------------------------------------------------------------- */
/*  Password                                                                    */
/* -------------------------------------------------------------------------- */

export async function changePassword(_prev: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await createClient();
  if (!supabase) return { error: NEEDS_SUPABASE };

  const current = str(form, 'currentPassword');
  const next = str(form, 'password');
  const confirm = str(form, 'passwordConfirm');

  if (next.length < 8) return { error: 'Yeni şifre en az 8 karakter olmalıdır.' };
  if (next !== confirm) return { error: 'Yeni şifreler eşleşmiyor.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.' };

  // No change is allowed until the current password is verified.
  if (current) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInError) return { error: 'Mevcut şifreniz hatalı.' };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: 'Şifre güncellenemedi. Lütfen tekrar deneyin.' };

  return { success: 'Şifreniz başarıyla güncellendi.' };
}

/* -------------------------------------------------------------------------- */
/*  Adresler                                                                   */
/* -------------------------------------------------------------------------- */

export async function saveAddress(_prev: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await createClient();
  if (!supabase) return { error: NEEDS_SUPABASE };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.' };

  const id = str(form, 'id');
  const payload = {
    user_id: user.id,
    title: str(form, 'title') || 'Adresim',
    full_name: str(form, 'fullName'),
    phone: str(form, 'phone'),
    city: str(form, 'city'),
    district: str(form, 'district'),
    address: str(form, 'address'),
    postal_code: str(form, 'postalCode') || null,
    is_default: Boolean(form.get('isDefault')),
  };

  if (payload.full_name.length < 3) return { error: 'Ad soyad girin.' };
  if (payload.phone.replace(/\D/g, '').length < 10) return { error: 'Geçerli bir telefon girin.' };
  if (!payload.city || !payload.district) return { error: 'İl ve ilçe seçin.' };
  if (payload.address.length < 10) return { error: 'Açık adres en az 10 karakter olmalıdır.' };

  const { error } = id
    ? await supabase.from('addresses').update(payload).eq('id', id).eq('user_id', user.id)
    : await supabase.from('addresses').insert(payload);

  if (error) return { error: 'Adres kaydedilemedi. Lütfen tekrar deneyin.' };

  revalidatePath('/hesap/adreslerim');
  return { success: id ? 'Adres güncellendi.' : 'Yeni adres eklendi.' };
}

export async function deleteAddress(form: FormData) {
  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = str(form, 'id');
  if (!id) return;

  await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/hesap/adreslerim');
}

export async function setDefaultAddress(form: FormData) {
  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = str(form, 'id');
  if (!id) return;

  await supabase.from('addresses').update({ is_default: true }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/hesap/adreslerim');
}

/* -------------------------------------------------------------------------- */
/*  Favoriler                                                                  */
/* -------------------------------------------------------------------------- */

export async function removeFavorite(form: FormData) {
  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const productId = str(form, 'productId');
  if (!productId) return;

  await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
  revalidatePath('/hesap/favoriler');
}
