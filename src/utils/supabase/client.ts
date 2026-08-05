'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/**
 * Tarayıcı istemcisi. Supabase yapılandırılmadıysa null döner; çağıran taraf
 * bu durumda demo akışına düşer.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(env.supabase.url!, env.supabase.anonKey!);
}
