import { KeyRound, ShieldAlert } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { Panel } from '@/components/admin/primitives';
import { PasswordForm } from '@/components/account/PasswordForm';
import { getCurrentUser } from '@/utils/supabase/server';

export const metadata = { title: 'Şifre Değiştir' };
export const dynamic = 'force-dynamic';

const tips = [
  'En az 8 karakter kullanın; 12 karakter ve üzeri belirgin şekilde daha güvenlidir.',
  'Büyük/küçük harf, rakam ve sembolü bir arada kullanın.',
  'Başka sitelerde kullandığınız bir şifreyi tekrar etmeyin.',
  'Yönetici hesapları tüm sipariş ve müşteri verisine erişir — bu şifreyi kimseyle paylaşmayın.',
];

export default async function AdminChangePasswordPage() {
  const session = await getCurrentUser();

  return (
    <>
      <AdminPageHeader
        title="Şifre Değiştir"
        description={session?.user.email ?? 'Hesap güvenliği'}
        backHref="/admin"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Panel
          title="Yeni Şifre"
          description="Güvenliğiniz için mevcut şifrenizi doğrulamamız gerekiyor"
        >
          <PasswordForm />
        </Panel>

        <Panel title="Güçlü şifre önerileri">
          <ul className="space-y-3">
            {tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-surface-muted p-4">
            <ShieldAlert
              className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-400"
              strokeWidth={1.9}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Şifrenizi değiştirdikten sonra diğer cihazlardaki oturumlarınız açık kalır.
              Şifrenizin ele geçirildiğinden şüpheleniyorsanız, değişiklikten sonra tüm
              cihazlardan çıkış yapmanızı öneririz.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2.5 text-xs text-muted-foreground">
            <KeyRound className="size-3.5 shrink-0" strokeWidth={2} />
            Google ile giriş yapıyorsanız şifre değiştirme Google hesabınızdan yapılır.
          </div>
        </Panel>
      </div>
    </>
  );
}
