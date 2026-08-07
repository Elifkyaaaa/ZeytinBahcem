import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { MfaChallenge } from '@/components/auth/MfaChallenge';
import { IMG } from '@/lib/images';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'İki Adımlı Doğrulama',
  description: 'Girişi tamamlamak için doğrulayıcı uygulamanızdaki kodu girin.',
  path: '/dogrulama',
  noIndex: true,
});

export default function MfaVerifyPage() {
  return (
    <AuthShell
      eyebrow="Güvenlik"
      title="İki Adımlı Doğrulama"
      description="Girişi tamamlamak için doğrulayıcı uygulamanızdaki 6 haneli kodu girin."
      image={IMG.groveHill}
      quote={{
        text: 'Güven, doğrulanabilir bilgiyle başlar.',
        author: 'Kerem Aydoğan · Üretim Sorumlusu',
      }}
    >
      <Suspense fallback={<div className="skeleton h-64 rounded-2xl" />}>
        <MfaChallenge />
      </Suspense>
    </AuthShell>
  );
}
