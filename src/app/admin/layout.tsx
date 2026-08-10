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

/** Placeholder shown when there is no session, which only happens without Supabase. */
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
        // Fall back to the local part of the email when the profile has no name.
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
