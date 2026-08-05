import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * OAuth ve e-posta bağlantılarının döndüğü nokta.
 * Gelen `code` oturuma çevrilir, ardından kullanıcı hedef sayfaya yollanır.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/hesap';
  const errorDescription = searchParams.get('error_description');

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/giris?hata=${encodeURIComponent(errorDescription)}`,
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/giris?hata=supabase-yapilandirilmadi`);
  }

  // OAuth akışı
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // E-posta doğrulama / şifre sıfırlama akışı
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'email_change' | 'invite' | 'magiclink',
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/giris?hata=dogrulama-basarisiz`);
}
