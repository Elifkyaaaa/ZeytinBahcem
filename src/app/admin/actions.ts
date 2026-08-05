'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/utils/supabase/server';
import type { UserRole } from '@/types/database';

export interface AdminActionState {
  error?: string;
  success?: string;
}

const NEEDS_SUPABASE = 'Bu işlem için Supabase bağlantısı gerekiyor.';
const VALID_ROLES: UserRole[] = ['customer', 'staff', 'admin'];

/** Çağıranın gerçekten yönetici olduğunu sunucuda doğrular. */
async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return { error: NEEDS_SUPABASE } as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturumunuz sona ermiş. Yeniden giriş yapın.' } as const;

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return { error: 'Bu işlem için yönetici yetkisi gerekiyor.' } as const;
  }

  return { supabase, userId: user.id } as const;
}

/* -------------------------------------------------------------------------- */
/*  Rol değiştirme                                                             */
/* -------------------------------------------------------------------------- */

export async function updateUserRole(
  _prev: AdminActionState,
  form: FormData,
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const targetId = String(form.get('userId') ?? '');
  const role = String(form.get('role') ?? '') as UserRole;

  if (!targetId) return { error: 'Kullanıcı bulunamadı.' };
  if (!VALID_ROLES.includes(role)) return { error: 'Geçersiz rol.' };

  // Kendini yetkisizleştirip panelden kilitlenmeyi engelle.
  if (targetId === auth.userId && role !== 'admin') {
    return {
      error:
        'Kendi yönetici yetkinizi kaldıramazsınız. Önce başka bir kullanıcıyı yönetici yapın.',
    };
  }

  // Sistemde en az bir yönetici kalmalı.
  if (role !== 'admin') {
    const { count } = await auth.supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin');

    if ((count ?? 0) <= 1) {
      return { error: 'Sistemde en az bir yönetici kalmalı.' };
    }
  }

  const { error } = await auth.supabase.from('users').update({ role }).eq('id', targetId);
  if (error) return { error: 'Rol güncellenemedi. Lütfen tekrar deneyin.' };

  revalidatePath('/admin/yetkiler');
  return { success: 'Kullanıcı rolü güncellendi.' };
}

/* -------------------------------------------------------------------------- */
/*  Davet — servis rolü gerektirir                                             */
/* -------------------------------------------------------------------------- */

export async function invitePanelUser(
  _prev: AdminActionState,
  form: FormData,
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const fullName = String(form.get('fullName') ?? '').trim();
  const role = String(form.get('role') ?? 'staff') as UserRole;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: 'Geçerli bir e-posta adresi girin.' };
  }
  if (!VALID_ROLES.includes(role)) return { error: 'Geçersiz rol.' };

  // Kayıtlı bir kullanıcıysa yalnızca rolünü yükseltmek yeterli.
  const { data: existing } = await auth.supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    const { error } = await auth.supabase.from('users').update({ role }).eq('id', existing.id);
    if (error) return { error: 'Rol güncellenemedi.' };
    revalidatePath('/admin/yetkiler');
    return { success: `${email} adresine ${role} yetkisi verildi.` };
  }

  // Yeni kişi: davet e-postası göndermek servis rolü anahtarı ister.
  const service = createServiceClient();
  if (!service) {
    return {
      error:
        'Davet göndermek için SUPABASE_SERVICE_ROLE_KEY gerekiyor. Alternatif olarak kişi kendi üye olduktan sonra buradan rolünü yükseltebilirsiniz.',
    };
  }

  const { error } = await service.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (error) return { error: `Davet gönderilemedi: ${error.message}` };

  // Davet kabul edilince trigger profili oluşturur; rolü şimdiden işaretleyemeyiz.
  revalidatePath('/admin/yetkiler');
  return {
    success: `${email} adresine davet gönderildi. Üyelik tamamlandığında rolünü buradan yükseltebilirsiniz.`,
  };
}
