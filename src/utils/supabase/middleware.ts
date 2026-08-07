import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/** Oturum gerektiren yollar */
const protectedPrefixes = ['/hesap'];
/** Yalnızca admin/staff rolünün girebileceği yollar */
const adminPrefixes = ['/admin'];
/** Oturum açıkken girilmemesi gereken yollar */
const guestOnlyPrefixes = ['/giris', '/kayit', '/sifremi-unuttum'];

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Supabase bağlı değilse site tamamen demo modunda çalışır; yönlendirme yapmayız.
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient<Database>(env.supabase.url!, env.supabase.anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() çağrısı süresi dolmuş token'ı yeniler — bu satır kaldırılmamalı.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAdminArea = adminPrefixes.some((p) => pathname.startsWith(p));
  const isGuestOnly = guestOnlyPrefixes.some((p) => pathname.startsWith(p));

  if (!user && (isProtected || isAdminArea)) {
    const url = request.nextUrl.clone();
    url.pathname = '/giris';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isGuestOnly) {
    const url = request.nextUrl.clone();
    url.pathname = '/hesap';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (user && isAdminArea) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/hesap';
      url.search = '';
      return NextResponse.redirect(url);
    }

    // İki adımlı doğrulama kuruluysa yönetim paneli AAL2 ister.
    // `nextLevel > currentLevel` yalnızca doğrulanmış faktörü olanlarda oluşur;
    // 2FA açmamış yöneticiler etkilenmez.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aal && aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
      const url = request.nextUrl.clone();
      url.pathname = '/dogrulama';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}
