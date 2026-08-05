import { AdminPageHeader } from '@/components/admin/AdminShell';
import { DemoNotice } from '@/components/admin/primitives';
import { UserRoleTable, type PanelUser } from '@/components/admin/UserRoleTable';
import { adminUsers } from '@/lib/data/admin';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient, getCurrentUser } from '@/utils/supabase/server';

export const metadata = { title: 'Kullanıcı Yetkileri' };

/** Rol değişiklikleri anında yansımalı; bu sayfa önbelleğe alınmaz. */
export const dynamic = 'force-dynamic';

export default async function AdminPermissionsPage() {
  const supabase = await createClient();
  const session = await getCurrentUser();

  let users: PanelUser[] = [];
  let liveData = false;

  if (supabase && session) {
    // RLS: yalnızca admin/staff tüm kullanıcıları görebilir.
    const { data } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, role, created_at')
      .order('role', { ascending: true })
      .order('created_at', { ascending: false });

    if (data) {
      liveData = true;
      users = data.map((row) => ({
        id: row.id,
        name: row.full_name?.trim() || row.email.split('@')[0],
        email: row.email,
        role: row.role,
        avatarUrl: row.avatar_url,
        joined: row.created_at,
        isSelf: row.id === session.user.id,
      }));
    }
  }

  // Supabase bağlı değilken panelin nasıl göründüğünü koruyoruz.
  if (!liveData) {
    users = adminUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === 'Yönetici' ? 'admin' : user.role === 'Depo' ? 'customer' : 'staff',
      avatarUrl: user.avatar,
      joined: '2026-01-01',
      isSelf: false,
    }));
  }

  return (
    <>
      <AdminPageHeader
        title="Kullanıcı Yetkileri"
        description={
          liveData
            ? `${users.length} kullanıcı — canlı veritabanından`
            : 'Örnek veri gösteriliyor'
        }
      />

      {!liveData && (
        <DemoNotice>
          {isSupabaseConfigured
            ? 'Kullanıcı listesi okunamadı. Bu sayfayı görebilmek için hesabınızın rolü admin veya staff olmalı; şemanın uygulandığından da emin olun.'
            : 'Supabase bağlanmadığı için örnek veri gösteriliyor. Anahtarlar tanımlandığında liste gerçek kullanıcılarla dolar.'}
        </DemoNotice>
      )}

      <UserRoleTable users={users} />
    </>
  );
}
