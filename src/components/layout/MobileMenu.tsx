'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Phone,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { signOut } from '@/app/(auth)/actions';
import { Logo } from '@/components/layout/Logo';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/icons';
import { useEscape, useLockBodyScroll } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { categories } from '@/lib/data/categories';
import { mainNav, site } from '@/lib/data/site';
import { useUi } from '@/lib/store/ui';
import { cn } from '@/lib/utils';
import { commonText, mobileMenuText } from '@/lib/data/text/layout';

export function MobileMenu() {
  const open = useUi((s) => s.menuOpen);
  const close = useUi((s) => s.closeMenu);
  const pathname = usePathname();
  const auth = useAuth();

  const handleClose = useCallback(() => close(), [close]);
  useEscape(handleClose, open);
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[70] bg-olive-950/45 backdrop-blur-sm lg:hidden"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mobileMenuText.regionLabel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[75] flex w-[min(23rem,88vw)] flex-col border-l border-border bg-background shadow-lift lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Logo />
              <button
                onClick={handleClose}
                aria-label={mobileMenuText.closeLabel}
                className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/6 hover:text-foreground"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              <ul className="space-y-1">
                {mainNav.map((item, i) => {
                  const active =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-xl transition-colors',
                          active
                            ? 'bg-olive-600/8 text-olive-800 dark:bg-gold-400/10 dark:text-gold-300'
                            : 'text-foreground/85 hover:bg-foreground/5',
                        )}
                      >
                        {item.label}
                        <ArrowRight className="size-4 opacity-40" strokeWidth={1.8} />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-7 border-t border-border pt-6">
                <p className="mb-3 px-4 text-[0.68rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Kategoriler
                </p>
                <ul className="space-y-0.5">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/products?kategori=${c.slug}`}
                        onClick={handleClose}
                        className="block rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-2.5 border-t border-border pt-6">
                <Link
                  href="/favorites"
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-gold-500/50"
                >
                  <Heart className="size-4" strokeWidth={1.8} /> Favoriler
                </Link>
                <Link
                  href="/cart"
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-gold-500/50"
                >
                  <ShoppingBag className="size-4" strokeWidth={1.8} /> Sepet
                </Link>
                {auth.loading ? (
                  <span className="col-span-2 h-11 rounded-xl bg-foreground/6" />
                ) : auth.user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={handleClose}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-gold-500/50"
                    >
                      <User className="size-4" strokeWidth={1.8} /> {commonText.account}
                    </Link>
                    {(auth.user.role === 'admin' || auth.user.role === 'staff') && (
                      <Link
                        href="/admin"
                        onClick={handleClose}
                        className="flex items-center gap-2 rounded-xl border border-gold-500/40 px-4 py-3 text-sm font-medium text-gold-700 transition-colors hover:bg-gold-500/8 dark:text-gold-400"
                      >
                        <LayoutDashboard className="size-4" strokeWidth={1.8} /> {mobileMenuText.adminShort}
                      </Link>
                    )}
                    <form action={signOut} className="col-span-2">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-600"
                      >
                        <LogOut className="size-4" strokeWidth={1.8} /> {commonText.signOut}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={handleClose}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-gold-500/50"
                    >
                      <LogIn className="size-4" strokeWidth={1.8} /> {commonText.signIn}
                    </Link>
                    <Link
                      href="/register"
                      onClick={handleClose}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-3 text-sm font-semibold text-olive-950"
                    >
                      <UserPlus className="size-4" strokeWidth={2} /> {commonText.signUp}
                    </Link>
                  </>
                )}
              </div>
            </nav>

            <div className="border-t border-border px-5 py-4">
              <a
                href={site.phoneHref}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-gold-600"
              >
                <Phone className="size-4" strokeWidth={1.8} />
                {site.phone}
              </a>
              <div className="mt-3 flex items-center gap-1.5">
                {[
                  { Icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
                  { Icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
                  { Icon: WhatsAppIcon, href: site.whatsappHref, label: 'WhatsApp' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                  >
                    <Icon className="size-[1.05rem]" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
