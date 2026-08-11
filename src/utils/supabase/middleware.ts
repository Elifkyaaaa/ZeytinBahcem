import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/** Oturum gerektiren yollar */
const protectedPrefixes = ['/account'];
/** Paths restricted to the admin and staff roles */
const adminPrefixes = ['/admin'];
/** Paths that a signed-in user should not reach */
const guestOnlyPrefixes = ['/login', '/register', '/forgot-password'];

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Without Supabase the site runs entirely in demo mode, so we do not redirect.
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

  // The getUser() call refreshes an expired token — do not remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAdminArea = adminPrefixes.some((p) => pathname.startsWith(p));
  const isGuestOnly = guestOnlyPrefixes.some((p) => pathname.startsWith(p));

  if (!user && (isProtected || isAdminArea)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isGuestOnly) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
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
      url.pathname = '/account';
      url.search = '';
      return NextResponse.redirect(url);
    }

    // When two-factor is enrolled, the admin panel requires AAL2.
    // `nextLevel > currentLevel` only happens for users with a verified factor,
    // so admins without 2FA are unaffected.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aal && aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
      const url = request.nextUrl.clone();
      url.pathname = '/verify';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}
