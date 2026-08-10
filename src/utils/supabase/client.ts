'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env, isSupabaseConfigured } from '@/utils/env';
import type { Database } from '@/types/database';

/**
 * Browser client. Returns null when Supabase is not configured, in which case
 * the caller falls back to the demo flow.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(env.supabase.url!, env.supabase.anonKey!);
}
