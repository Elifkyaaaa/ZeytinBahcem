import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env, hasServiceRole, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/**
 * Client for server components, route handlers and server actions.
 * Session cookies are read from and written to the Next.js cookie store.
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
          // Cookies cannot be written from inside a Server Component;
          // the middleware already handles session refresh.
        }
      },
    },
  });
}

/**
 * Service client that bypasses RLS. Server-only, and reserved for trusted
 * flows such as the payment callback and admin operations.
 */
export function createServiceClient() {
  if (!hasServiceRole) return null;
  return createSupabaseClient<Database>(env.supabase.url!, env.supabase.serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** The signed-in user and their profile, or null when there is no session. */
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
