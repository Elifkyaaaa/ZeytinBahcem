'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LayoutDashboard, LogOut, MapPin, Package, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { signOut } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/Button';
import { useEscape } from '@/hooks';
import type { SessionUser } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { commonText, userMenuText } from '@/lib/data/text/layout';

const items = [
  { label: 'Profilim', href: '/account', Icon: User },
  { label: 'Siparişlerim', href: '/account/orders', Icon: Package },
  { label: 'Favorilerim', href: '/account/favorites', Icon: Heart },
  { label: 'Adreslerim', href: '/account/addresses', Icon: MapPin },
];

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toLocaleUpperCase('tr-TR') || 'ZB'
  );
}

/**
 * Avatar and menu when signed in, sign in / sign up when not.
 * A placeholder holds the space until the session is read, so the layout
 * does not jump.
 */
export function UserMenu({ user, loading }: { user: SessionUser | null; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEscape(close, open);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (loading) {
    return <span className="ml-1.5 hidden h-9 w-32 rounded-full bg-foreground/6 xl:block" />;
  }

  if (!user) {
    return (
      <div className="ml-1.5 hidden items-center gap-2 xl:flex">
        <Button href="/login" variant="ghost" size="sm">
          {commonText.signIn}
        </Button>
        <Button href="/register" variant="gold" size="sm">
          {commonText.signUp}
        </Button>
      </div>
    );
  }

  const isStaff = user.role === 'admin' || user.role === 'staff';

  return (
    <div ref={boxRef} className="relative ml-1.5 hidden xl:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={userMenuText.menuLabel}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-foreground/6"
      >
        {user.avatarUrl ? (
          <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface-muted">
            <Image src={user.avatarUrl} alt="" fill sizes="32px" className="object-cover" />
          </span>
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-olive-700 text-[0.65rem] font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
            {initialsOf(user.name)}
          </span>
        )}
        <span className="max-w-24 truncate text-sm font-medium text-foreground">{user.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
          >
            <div className="border-b border-border px-4 py-3.5">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
            </div>

            <div className="p-1.5">
              {items.map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon className="size-4" strokeWidth={1.9} />
                  {label}
                </Link>
              ))}

              {isStaff && (
                <Link
                  href="/admin"
                  onClick={close}
                  className={cn(
                    'mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium',
                    'text-gold-700 transition-colors hover:bg-gold-500/10 dark:text-gold-400',
                  )}
                >
                  <LayoutDashboard className="size-4" strokeWidth={1.9} />
                  {commonText.adminPanel}
                </Link>
              )}

              <form action={signOut} className="mt-1 border-t border-border pt-1">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                >
                  <LogOut className="size-4" strokeWidth={1.9} />
                  {commonText.signOut}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
