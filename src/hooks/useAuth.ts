'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isSupabaseConfigured } from '@/utils/env';
import type { UserRole } from '@/types/database';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
}

export interface AuthState {
  user: SessionUser | null;
  /** True until the first read completes; the header shows a placeholder meanwhile. */
  loading: boolean;
}

/**
 * Reads the session on the client.
 *
 * Why not on the server: the header also appears on statically generated
 * storefront pages. Reading the session from the server in the layout would
 * make every product and blog page dynamic and throw away the benefit of
 * static generation. Instead we read after hydration and keep it live through
 * `onAuthStateChange`, so signing in or out updates without a page reload.
 */
export function useAuth(): AuthState {
  // Without Supabase there is no session to read, so treat the visitor as a guest.
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: isSupabaseConfigured,
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;

    async function readProfile(userId: string, email: string) {
      const { data } = await supabase!
        .from('users')
        .select('full_name, avatar_url, role')
        .eq('id', userId)
        .maybeSingle();

      return {
        id: userId,
        email,
        name: data?.full_name?.trim() || email.split('@')[0],
        avatarUrl: data?.avatar_url ?? null,
        role: (data?.role ?? 'customer') as UserRole,
      };
    }

    async function sync() {
      const {
        data: { user },
      } = await supabase!.auth.getUser();

      if (cancelled) return;

      if (!user?.email) {
        setState({ user: null, loading: false });
        return;
      }

      const profile = await readProfile(user.id, user.email);
      if (!cancelled) setState({ user: profile, loading: false });
    }

    void sync();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session?.user?.email) {
        setState({ user: null, loading: false });
        return;
      }
      void readProfile(session.user.id, session.user.email).then((profile) => {
        if (!cancelled) setState({ user: profile, loading: false });
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
