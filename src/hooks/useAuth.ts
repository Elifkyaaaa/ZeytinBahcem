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
  /** İlk okuma tamamlanana kadar true — bu sırada header'da yer tutucu gösterilir. */
  loading: boolean;
}

/**
 * Oturumu istemci tarafında okur.
 *
 * Neden sunucuda değil: Header, statik üretilen vitrin sayfalarında da
 * görünüyor. Oturumu layout'ta sunucudan okusaydık tüm ürün ve blog
 * sayfaları dinamikleşir, statik üretimin faydası kaybolurdu. Burada
 * hidrasyondan sonra okuyup `onAuthStateChange` ile canlı tutuyoruz —
 * giriş/çıkış anında sayfa yenilemeden güncelleniyor.
 */
export function useAuth(): AuthState {
  // Supabase bağlı değilse okunacak oturum yok; beklemeden misafir kabul edilir.
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
