import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Return point for OAuth and email links.
 * The incoming `code` is exchanged for a session, then the user is sent on to
 * their destination page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/account';
  const errorDescription = searchParams.get('error_description');

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?hata=${encodeURIComponent(errorDescription)}`,
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?hata=supabase-yapilandirilmadi`);
  }

  // OAuth flow
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Email verification and password reset flow
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'email_change' | 'invite' | 'magiclink',
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?hata=dogrulama-basarisiz`);
}
