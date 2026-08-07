import { Heart, Mail, MapPin, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ProfileForm } from '@/components/account/ProfileForm';
import { SupabaseNotice } from '@/components/account/SupabaseNotice';
import { buildMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient, getCurrentUser } from '@/utils/supabase/server';

export const metadata = buildMetadata({
  title: 'Profilim',
  description: 'Hesap bilgilerinizi görüntüleyin ve güncelleyin.',
  path: '/hesap',
  noIndex: true,
});

export default async function AccountPage() {
  const session = await getCurrentUser();
  const supabase = await createClient();

  let orderCount = 0;
  let favoriteCount = 0;
  let addressCount = 0;

  if (supabase && session) {
    const [orders, favorites, addresses] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
      supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
      supabase.from('addresses').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
    ]);
    orderCount = orders.count ?? 0;
    favoriteCount = favorites.count ?? 0;
    addressCount = addresses.count ?? 0;
  }

  const stats = [
    { label: 'Sipariş', value: orderCount, href: '/hesap/siparislerim', Icon: Package },
    { label: 'Favori', value: favoriteCount, href: '/hesap/favoriler', Icon: Heart },
    { label: 'Adres', value: addressCount, href: '/hesap/adreslerim', Icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && <SupabaseNotice />}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-2xl font-semibold text-foreground tabular-nums">
                {value}
              </span>
              <span className="block text-sm text-muted-foreground">{label}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
        <h2 className="font-display text-xl text-foreground">Profil Bilgileri</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Bu bilgiler siparişlerinizde ve kargo bildirimlerinde kullanılır.
        </p>

        <div className="mt-6">
          <ProfileForm
            defaultName={session?.profile?.full_name ?? ''}
            defaultPhone={session?.profile?.phone ?? ''}
            defaultMarketing={session?.profile?.marketing_opt_in ?? false}
            email={session?.user.email ?? ''}
            disabled={!session}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
          <ShieldCheck className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
          Hesap Güvenliği
        </h2>

        <dl className="mt-5 divide-y divide-border">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <div>
              <dt className="text-sm font-medium text-foreground">E-posta doğrulaması</dt>
              <dd className="mt-0.5 text-xs text-muted-foreground">
                {session?.user.email_confirmed_at
                  ? 'E-posta adresiniz doğrulandı.'
                  : 'E-posta adresiniz henüz doğrulanmadı.'}
              </dd>
            </div>
            <span
              className={
                session?.user.email_confirmed_at
                  ? 'rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400'
                  : 'rounded-full bg-amber-500/14 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400'
              }
            >
              {session?.user.email_confirmed_at ? 'Doğrulandı' : 'Bekliyor'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <div>
              <dt className="text-sm font-medium text-foreground">Giriş yöntemi</dt>
              <dd className="mt-0.5 text-xs text-muted-foreground">
                {session?.user.app_metadata?.provider === 'google'
                  ? 'Google hesabınızla giriş yapıyorsunuz.'
                  : 'E-posta ve şifre ile giriş yapıyorsunuz.'}
              </dd>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" strokeWidth={1.9} />
              {session?.user.app_metadata?.provider === 'google' ? 'Google' : 'E-posta'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <div>
              <dt className="text-sm font-medium text-foreground">Şifre</dt>
              <dd className="mt-0.5 text-xs text-muted-foreground">
                Düzenli aralıklarla değiştirmenizi öneririz.
              </dd>
            </div>
            <Link
              href="/hesap/sifre-degistir"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-colors hover:border-gold-500/50"
            >
              Değiştir
            </Link>
          </div>
        </dl>
      </section>
    </div>
  );
}
