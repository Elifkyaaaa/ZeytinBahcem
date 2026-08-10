'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export interface AuthState {
  error?: string;
  success?: string;
}

const DEMO_MESSAGE =
  'Kimlik doğrulama için Supabase bağlantısı gerekiyor. .env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ekleyin.';

/** The origin as the browser sees it, used for OAuth and email return URLs. */
async function siteOrigin() {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `${proto}://${host}` : 'http://localhost:3000');
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/* -------------------------------------------------------------------------- */
/*  Sign in with email and password                                            */
/* -------------------------------------------------------------------------- */

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { error: DEMO_MESSAGE };

  const email = readString(formData, 'email');
  const password = readString(formData, 'password');
  const next = readString(formData, 'next') || '/hesap';

  if (!email || !password) return { error: 'E-posta ve şifre zorunludur.' };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      return { error: 'E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin.' };
    }
    return { error: 'E-posta veya şifre hatalı.' };
  }

  revalidatePath('/', 'layout');
  redirect(next);
}

/* -------------------------------------------------------------------------- */
/*  Sign up, with email verification                                           */
/* -------------------------------------------------------------------------- */

export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { error: DEMO_MESSAGE };

  const fullName = readString(formData, 'fullName');
  const email = readString(formData, 'email');
  const phone = readString(formData, 'phone');
  const password = readString(formData, 'password');
  const passwordConfirm = readString(formData, 'passwordConfirm');
  const terms = formData.get('terms');

  if (fullName.length < 3) return { error: 'Ad soyad en az 3 karakter olmalıdır.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Geçerli bir e-posta girin.' };
  if (password.length < 8) return { error: 'Şifre en az 8 karakter olmalıdır.' };
  if (password !== passwordConfirm) return { error: 'Şifreler eşleşmiyor.' };
  if (!terms) return { error: 'Üyelik sözleşmesini onaylamanız gerekiyor.' };

  const origin = await siteOrigin();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/hesap`,
      data: {
        full_name: fullName,
        phone,
        marketing_opt_in: Boolean(formData.get('marketing')),
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Bu e-posta adresiyle zaten bir hesap var. Giriş yapmayı deneyin.' };
    }
    return { error: 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.' };
  }

  return {
    success:
      'Hesabınız oluşturuldu. Doğrulama bağlantısını e-posta kutunuza gönderdik — bağlantıya tıklayarak üyeliğinizi etkinleştirin.',
  };
}

/* -------------------------------------------------------------------------- */
/*  Sign in with Google                                                        */
/* -------------------------------------------------------------------------- */

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = await createClient();
  if (!supabase) {
    redirect(`/giris?hata=${encodeURIComponent(DEMO_MESSAGE)}`);
  }

  const next = readString(formData, 'next') || '/hesap';
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });

  if (error || !data.url) {
    redirect('/giris?hata=Google%20ile%20giri%C5%9F%20ba%C5%9Flat%C4%B1lamad%C4%B1.');
  }

  redirect(data.url);
}

/* -------------------------------------------------------------------------- */
/*  Forgot password and reset                                                  */
/* -------------------------------------------------------------------------- */

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { error: DEMO_MESSAGE };

  const email = readString(formData, 'email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: 'Geçerli bir e-posta adresi girin.' };
  }

  const origin = await siteOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/hesap/sifre-degistir`,
  });

  // Always answer the same way so we do not leak whether the account exists.
  return {
    success:
      'Eğer bu adrese kayıtlı bir hesap varsa, şifre sıfırlama bağlantısını gönderdik. Gelen kutunuzu kontrol edin.',
  };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { error: DEMO_MESSAGE };

  const password = readString(formData, 'password');
  const passwordConfirm = readString(formData, 'passwordConfirm');

  if (password.length < 8) return { error: 'Yeni şifre en az 8 karakter olmalıdır.' };
  if (password !== passwordConfirm) return { error: 'Şifreler eşleşmiyor.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: 'Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir.' };

  return { success: 'Şifreniz güncellendi.' };
}

/* -------------------------------------------------------------------------- */
/*  Resend the verification email                                              */
/* -------------------------------------------------------------------------- */

export async function resendVerification(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) return { error: DEMO_MESSAGE };

  const email = readString(formData, 'email');
  if (!email) return { error: 'E-posta adresi gerekli.' };

  const origin = await siteOrigin();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/hesap` },
  });

  if (error) return { error: 'Doğrulama e-postası gönderilemedi.' };
  return { success: 'Doğrulama bağlantısını yeniden gönderdik.' };
}

/* -------------------------------------------------------------------------- */
/*  Sign out                                                                   */
/* -------------------------------------------------------------------------- */

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
