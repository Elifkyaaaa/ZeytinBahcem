'use client';

import { motion } from 'framer-motion';
import { Heart, KeyRound, LogOut, MapPin, Package, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(auth)/actions';
import { blurDataURL, cn } from '@/lib/utils';
import { accountNavText } from '@/lib/data/text/account';

const items = [
  { label: 'Profil', href: '/hesap', Icon: User },
  { label: 'Siparişlerim', href: '/hesap/siparislerim', Icon: Package },
  { label: 'Favoriler', href: '/hesap/favoriler', Icon: Heart },
  { label: 'Adreslerim', href: '/hesap/adreslerim', Icon: MapPin },
  { label: 'Güvenlik', href: '/hesap/guvenlik', Icon: ShieldCheck },
  { label: 'Şifre Değiştir', href: '/hesap/sifre-degistir', Icon: KeyRound },
];

export function AccountNav({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string | null;
  avatar: string | null;
}) {
  const pathname = usePathname();
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center gap-3.5">
          {avatar ? (
            <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-muted">
              <Image
                src={avatar}
                alt=""
                fill
                sizes="48px"
                placeholder="blur"
                blurDataURL={blurDataURL()}
                className="object-cover"
              />
            </span>
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-olive-700 text-sm font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
              {initials || 'ZB'}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-medium text-foreground">{name}</span>
            {email && (
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            )}
          </span>
        </div>

        <nav aria-label={accountNavText.menuLabel} className="mt-5 border-t border-border pt-4">
          <ul className="space-y-0.5">
            {items.map(({ label, href, Icon }) => {
              const active = href === '/hesap' ? pathname === '/hesap' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                      active
                        ? 'bg-olive-600/8 font-medium text-olive-800 dark:bg-gold-400/10 dark:text-gold-300'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="account-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute top-1/2 -left-1 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold-500"
                      />
                    )}
                    <Icon className="size-4.5 shrink-0" strokeWidth={1.8} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <form action={signOut} className="mt-3 border-t border-border pt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
            >
              <LogOut className="size-4.5 shrink-0" strokeWidth={1.8} />
              {accountNavText.signOut}
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
