import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { SupabaseNotice } from '@/components/account/SupabaseNotice';
import { TwoFactorSetup } from '@/components/account/TwoFactorSetup';
import { buildMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/utils/env';
import { getCurrentUser } from '@/utils/supabase/server';

export const metadata = buildMetadata({
  title: 'Güvenlik',
  description: 'İki adımlı doğrulama ve hesap güvenliği ayarları.',
  path: '/hesap/guvenlik',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

const apps = [
  { name: 'Google Authenticator', note: 'iOS · Android' },
  { name: 'Microsoft Authenticator', note: 'iOS · Android' },
  { name: 'Authy', note: 'iOS · Android · Masaüstü' },
];

export default async function SecurityPage() {
  const session = await getCurrentUser();
  const isStaff = session?.profile?.role === 'admin' || session?.profile?.role === 'staff';

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && <SupabaseNotice />}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2.5 font-serif text-xl text-foreground">
          <ShieldCheck className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
          İki Adımlı Doğrulama
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Hesabınıza şifrenize ek olarak, telefonunuzdaki doğrulayıcı uygulamanın ürettiği
          zaman bazlı kodla ikinci bir katman ekler.
        </p>

        {isStaff && (
          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-gold-500/30 bg-gold-500/8 p-3.5 text-sm leading-relaxed text-foreground/85">
            <ShieldAlert
              className="mt-0.5 size-4 shrink-0 text-gold-700 dark:text-gold-400"
              strokeWidth={2}
            />
            <span>
              Yönetici hesabınız tüm sipariş ve müşteri verisine erişiyor. Bu hesapta iki adımlı
              doğrulamayı açmanızı özellikle öneririz.
            </span>
          </p>
        )}

        <div className="mt-6">
          <TwoFactorSetup />
        </div>
      </section>

      <section className="rounded-2xl bg-surface-muted p-6">
        <h3 className="text-sm font-semibold text-foreground">Desteklenen uygulamalar</h3>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {apps.map((app) => (
            <li
              key={app.name}
              className="rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="block text-sm font-medium text-foreground">{app.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{app.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Hepsi aynı standardı (TOTP) kullanır; hangisini seçerseniz seçin çalışır.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
        <h3 className="flex items-center gap-2.5 font-serif text-lg text-foreground">
          <ShieldAlert className="size-5 text-gold-600 dark:text-gold-400" strokeWidth={1.8} />
          Telefonunuzu kaybederseniz
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Doğrulayıcı uygulamaya erişiminizi kaybederseniz kodu üretemez ve yönetim paneline
          giremezsiniz. Bu durumda faktörü sunucu tarafından kaldırmak gerekir:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-foreground/6 p-4 text-xs text-foreground/85">
          <code>npm run mfa:reset -- eposta@adresiniz.com</code>
        </pre>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Bu komut servis rolü anahtarını kullanır ve yalnızca sunucuya erişimi olan kişi
          çalıştırabilir. İki farklı cihaza kurmak (ör. telefon + Authy masaüstü) bu durumu
          baştan önler.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
          <Link
            href="/hesap/sifre-degistir"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-gold-500/50"
          >
            <KeyRound className="size-4" strokeWidth={1.9} />
            Şifre Değiştir
          </Link>
        </div>
      </section>
    </div>
  );
}
