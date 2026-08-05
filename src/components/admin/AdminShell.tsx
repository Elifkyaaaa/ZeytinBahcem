'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Compass,
  CreditCard,
  ExternalLink,
  FileText,
  Folder,
  ImageUp,
  Images,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Percent,
  Settings,
  ShoppingCart,
  Ticket,
  Truck,
  Users,
  UserCog,
  UserRound,
  Warehouse,
  X,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState, type ReactNode } from 'react';
import { signOut } from '@/app/(auth)/actions';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { AdminTour } from '@/components/admin/AdminTour';
import { OliveBranchIcon } from '@/components/ui/icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useEscape, useLockBodyScroll } from '@/hooks';
import { dashboardStats } from '@/lib/data/admin';
import { site } from '@/lib/data/site';
import { useUi } from '@/lib/store/ui';
import { cn } from '@/lib/utils';

interface NavEntry {
  label: string;
  href: string;
  Icon: LucideIcon;
  badge?: number;
}

const navGroups: { title: string; items: NavEntry[] }[] = [
  {
    title: 'Genel',
    items: [{ label: 'Dashboard', href: '/admin', Icon: LayoutDashboard }],
  },
  {
    title: 'Katalog',
    items: [
      { label: 'Ürün Yönetimi', href: '/admin/urunler', Icon: Package },
      { label: 'Kategori Yönetimi', href: '/admin/kategoriler', Icon: Folder },
      { label: 'Stok Takibi', href: '/admin/stok', Icon: Warehouse, badge: dashboardStats.lowStock },
    ],
  },
  {
    title: 'Satış',
    items: [
      {
        label: 'Sipariş Yönetimi',
        href: '/admin/siparisler',
        Icon: ShoppingCart,
        badge: dashboardStats.pendingOrders,
      },
      { label: 'Müşteri Yönetimi', href: '/admin/musteriler', Icon: Users },
      { label: 'Kampanyalar', href: '/admin/kampanyalar', Icon: Percent },
      { label: 'Kuponlar', href: '/admin/kuponlar', Icon: Ticket },
    ],
  },
  {
    title: 'İçerik',
    items: [
      {
        label: 'Yorum Yönetimi',
        href: '/admin/yorumlar',
        Icon: MessageSquare,
        badge: dashboardStats.pendingReviews,
      },
      { label: 'Blog Yönetimi', href: '/admin/blog', Icon: FileText },
      { label: 'Slider Yönetimi', href: '/admin/slider', Icon: Images },
      { label: 'Görsel Yönetimi', href: '/admin/gorseller', Icon: ImageUp },
    ],
  },
  {
    title: 'Ayarlar',
    items: [
      { label: 'Site Ayarları', href: '/admin/ayarlar', Icon: Settings },
      { label: 'Kargo Ayarları', href: '/admin/kargo', Icon: Truck },
      { label: 'Ödeme Ayarları', href: '/admin/odeme-ayarlari', Icon: CreditCard },
      { label: 'Kullanıcı Yetkileri', href: '/admin/yetkiler', Icon: UserCog },
    ],
  },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(({ label, href, Icon, badge }) => {
              const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                      active
                        ? 'bg-olive-600/10 font-medium text-olive-800 dark:bg-gold-400/12 dark:text-gold-300'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute top-1/2 -left-3 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-500"
                      />
                    )}
                    <Icon className="size-4.5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{label}</span>
                    {badge ? (
                      <span className="ml-auto grid min-w-5 shrink-0 place-items-center rounded-full bg-gold-500 px-1.5 text-[0.62rem] font-bold text-olive-950 tabular-nums">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-border p-3">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <ExternalLink className="size-4.5" strokeWidth={1.8} />
        Siteyi Görüntüle
      </Link>
    </div>
  );
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

/** Ad soyaddan en fazla iki harflik baş harf üretir. */
function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toLocaleUpperCase('tr-TR') || 'ZB'
  );
}

const roleLabels: Record<string, string> = {
  admin: 'Yönetici',
  staff: 'Personel',
  customer: 'Müşteri',
};

function AdminUserMenu({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const openTour = useUi((s) => s.openTour);
  const close = useCallback(() => setOpen(false), []);
  useEscape(close, open);

  return (
    <div data-tour="user" className="relative ml-2 border-l border-border pl-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full py-1 pr-2 transition-colors hover:bg-foreground/5"
      >
        {user.avatarUrl ? (
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface-muted">
            <Image src={user.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
          </span>
        ) : (
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-olive-700 text-xs font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
            {initialsOf(user.name)}
          </span>
        )}

        <span className="hidden max-w-40 flex-col items-start leading-none sm:flex">
          <span className="max-w-full truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="mt-0.5 text-[0.68rem] text-muted-foreground">
            {roleLabels[user.role] ?? user.role}
          </span>
        </span>

        <ChevronDown
          className={cn(
            'hidden size-4 shrink-0 text-muted-foreground transition-transform duration-300 sm:block',
            open && 'rotate-180',
          )}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              aria-hidden
              tabIndex={-1}
              onClick={close}
              className="fixed inset-0 z-10 cursor-default"
            />
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
            >
              <div className="border-b border-border px-4 py-3.5">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-gold-500/12 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-700 dark:text-gold-400">
                  {roleLabels[user.role] ?? user.role}
                </span>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openTour();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <Compass className="size-4" strokeWidth={1.9} />
                  Tanıtım Turu
                </button>
                <Link
                  href="/admin/sifre-degistir"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <KeyRound className="size-4" strokeWidth={1.9} />
                  Şifre Değiştir
                </Link>
                <Link
                  href="/hesap"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <UserRound className="size-4" strokeWidth={1.9} />
                  Hesabım
                </Link>
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <ExternalLink className="size-4" strokeWidth={1.9} />
                  Siteyi Görüntüle
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                  >
                    <LogOut className="size-4" strokeWidth={1.9} />
                    Çıkış Yap
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminShell({ children, user }: { children: ReactNode; user: AdminUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useLockBodyScroll(mobileOpen);

  return (
    <div className="flex min-h-dvh bg-surface-muted">
      {/* Masaüstü kenar çubuğu */}
      <aside
        data-tour="sidebar"
        className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background lg:flex"
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="grid size-9 place-items-center rounded-full bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/20 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/25">
            <OliveBranchIcon className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[0.98rem] font-semibold text-foreground">
              {site.name}
            </span>
            <span className="mt-0.5 text-[0.58rem] font-medium tracking-[0.2em] text-gold-600 uppercase dark:text-gold-400/90">
              Yönetim
            </span>
          </span>
        </div>
        <NavList />
        <SidebarFooter />
      </aside>

      {/* Mobil çekmece */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-olive-950/45 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Yönetim menüsü"
              className="fixed inset-y-0 left-0 z-[75] flex w-[min(17rem,86vw)] flex-col border-r border-border bg-background lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <span className="font-serif text-lg font-semibold">Yönetim</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menüyü kapat"
                  className="grid size-9 place-items-center rounded-full text-foreground/70 hover:bg-foreground/6"
                >
                  <X className="size-5" strokeWidth={1.8} />
                </button>
              </div>
              <NavList onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="grid size-10 shrink-0 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/6 lg:hidden"
          >
            <Menu className="size-5" strokeWidth={1.8} />
          </button>

          <div data-tour="search" className="contents">
            <AdminSearch />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              aria-label="Bildirimler"
              className="relative grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/6"
            >
              <Bell className="size-[1.15rem]" strokeWidth={1.8} />
              <span className="absolute top-2 right-2.5 size-2 rounded-full bg-gold-500 ring-2 ring-background" />
            </button>
            <ThemeToggle />
            <AdminUserMenu user={user} />
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <AdminTour />
    </div>
  );
}

/** Yönetim sayfalarının ortak başlık bandı. */
export function AdminPageHeader({
  title,
  description,
  backHref,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
            Geri
          </Link>
        )}
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
