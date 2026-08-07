import type { ReactNode } from 'react';
import { AccountNav } from '@/components/account/AccountNav';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { getCurrentUser } from '@/utils/supabase/server';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentUser();
  const displayName =
    session?.profile?.full_name ?? session?.user.email?.split('@')[0] ?? 'Misafir';
  const email = session?.user.email ?? null;
  const avatar = session?.profile?.avatar_url ?? null;

  return (
    <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
      <Container>
        <Breadcrumbs
          trail={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Hesabım', path: '/hesap' },
          ]}
        />

        <div className="mt-6 flex flex-col gap-2">
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">Hesabım</h1>
          <p className="text-muted-foreground">
            Merhaba <strong className="font-medium text-foreground">{displayName}</strong> — sipariş,
            adres ve güvenlik ayarlarınız burada.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
          <AccountNav name={displayName} email={email} avatar={avatar} />
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}
