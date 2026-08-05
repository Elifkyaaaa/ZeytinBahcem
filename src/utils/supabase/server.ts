import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env, hasServiceRole, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/**
 * Sunucu bileşenleri, route handler'lar ve server action'lar için istemci.
 * Oturum çerezleri Next.js cookie deposundan okunur/yazılır.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(env.supabase.url!, env.supabase.anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component içinden çağrıldığında çerez yazılamaz;
          // oturum yenilemesi middleware tarafından zaten yapılıyor.
        }
      },
    },
  });
}

/**
 * RLS'i atlayan servis istemcisi. Yalnızca sunucuda, ödeme callback'i ve
 * yönetim işlemleri gibi güvenilen akışlarda kullanılmalıdır.
 */
export function createServiceClient() {
  if (!hasServiceRole) return null;
  return createSupabaseClient<Database>(env.supabase.url!, env.supabase.serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Oturumdaki kullanıcı ve profil bilgisi. Oturum yoksa null döner. */
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return { user, profile };
}
