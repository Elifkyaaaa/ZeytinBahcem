import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthShell } from '@/components/auth/AuthShell';
import { IMG } from '@/lib/images';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Giriş Yap',
  description: 'Zeytin Bahçem hesabınıza giriş yapın; siparişlerinizi takip edin, favorilerinize ulaşın.',
  path: '/giris',
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Tekrar hoş geldiniz"
      title="Hesabınıza Giriş Yapın"
      description="Siparişlerinizi takip edin, favorilerinize ulaşın ve adreslerinizi yönetin."
      image={IMG.groveHill}
      quote={{
        text: 'Zeytinyağı almak, aslında bir üreticiye güvenmektir. Güven ise doğrulanabilir bilgiyle başlar.',
        author: 'Kerem Aydoğan · Üretim Sorumlusu',
      }}
      footer={
        <span className="text-muted-foreground">
          Hesabınız yok mu?{' '}
          <Link
            href="/kayit"
            className="font-medium text-gold-700 underline-offset-4 transition-colors hover:underline dark:text-gold-400"
          >
            Üye olun
          </Link>
        </span>
      }
    >
      <Suspense fallback={<div className="skeleton h-80 rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
