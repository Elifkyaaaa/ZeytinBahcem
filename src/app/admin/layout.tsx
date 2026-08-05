import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminShell, type AdminUser } from '@/components/admin/AdminShell';
import { isSupabaseConfigured } from '@/utils/env';
import { getCurrentUser } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: {
    default: 'Yönetim Paneli',
    template: '%s | Yönetim Paneli',
  },
  robots: { index: false, follow: false },
};

/** Oturum yoksa (yalnızca Supabase bağlı değilken mümkün) gösterilecek yer tutucu. */
const demoUser: AdminUser = {
  name: 'Demo Yönetici',
  email: 'supabase-baglanmadi@local',
  role: 'admin',
  avatarUrl: null,
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = isSupabaseConfigured ? await getCurrentUser() : null;

  const user: AdminUser = session
    ? {
        // Profilde ad yoksa e-postanın kullanıcı adı kısmına düşeriz.
        name:
          session.profile?.full_name?.trim() ||
          session.user.email?.split('@')[0] ||
          'Yönetici',
        email: session.user.email ?? '',
        role: session.profile?.role ?? 'customer',
        avatarUrl: session.profile?.avatar_url ?? null,
      }
    : demoUser;

  return <AdminShell user={user}>{children}</AdminShell>;
}
