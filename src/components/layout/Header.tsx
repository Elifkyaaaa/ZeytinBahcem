'use client';

import { motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { UserMenu } from '@/components/layout/UserMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useHydrated, useScrollDirection } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { mainNav } from '@/lib/data/site';
import { cartCount, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { useWishlist } from '@/lib/store/wishlist';
import { cn } from '@/lib/utils';

// İlk boyamada gerekmeyen ağır katmanlar istek üzerine yüklenir.
const SearchOverlay = dynamic(() => import('./SearchOverlay').then((m) => m.SearchOverlay));
const MobileMenu = dynamic(() => import('./MobileMenu').then((m) => m.MobileMenu));
const CartDrawer = dynamic(() => import('./CartDrawer').then((m) => m.CartDrawer));

function CountBadge({ value }: { value: number }) {
  const hydrated = useHydrated();
  if (!hydrated || value <= 0) return null;

  return (
    <motion.span
      key={value}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
      className="absolute -top-0.5 -right-0.5 grid min-w-[1.15rem] place-items-center rounded-full bg-gold-500 px-1 text-[0.62rem] font-bold text-olive-950 tabular-nums shadow-soft"
    >
      {value > 99 ? '99+' : value}
    </motion.span>
  );
}

const iconButton =
  'relative grid size-10 place-items-center rounded-full text-foreground/75 ' +
  'transition-all duration-300 hover:bg-foreground/6 hover:text-foreground active:scale-95';

export function Header() {
  const pathname = usePathname();
  const { direction, scrolled } = useScrollDirection();
  const auth = useAuth();

  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.ids.length);
  const openSearch = useUi((s) => s.openSearch);
  const openMenu = useUi((s) => s.openMenu);

  const count = cartCount(items);
  const hidden = direction === 'down';

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        // Şeffafken ve altında koyu hero varsa renkler globals.css'te açığa çevrilir.
        data-transparent={!scrolled}
        className={cn(
          'fixed inset-x-0 top-0 z-50 isolate transition-[background-color,box-shadow,backdrop-filter] duration-500',
          scrolled
            ? 'border-b border-border/70 bg-background/82 shadow-soft backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        {/* Kaydırıldığında beliren ince altın hat */}
        <span
          aria-hidden
          className={cn(
            'hairline-gold pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.75rem]">
          <Logo compact />

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300',
                        // Renkler --foreground üzerinden gelir; şeffaf header koyu
                        // hero üzerindeyken bu değişken açık tona çevrilir.
                        active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground',
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button onClick={openSearch} className={iconButton} aria-label="Ürün ara">
              <Search className="size-[1.15rem]" strokeWidth={1.7} />
            </button>

            <Link href="/favoriler" className={cn(iconButton, 'hidden sm:grid')} aria-label="Favorilerim">
              <Heart className="size-[1.15rem]" strokeWidth={1.7} />
              <CountBadge value={wishlistCount} />
            </Link>

            <button onClick={openCart} className={iconButton} aria-label="Sepetim">
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.7} />
              <CountBadge value={count} />
            </button>

            <ThemeToggle />

            {/* Oturum açıkken avatar + menü, kapalıyken Giriş Yap / Üye Ol */}
            <UserMenu user={auth.user} loading={auth.loading} />

            <button onClick={openMenu} className={cn(iconButton, 'lg:hidden')} aria-label="Menüyü aç">
              <Menu className="size-[1.2rem]" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </motion.header>

      <SearchOverlay />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}
