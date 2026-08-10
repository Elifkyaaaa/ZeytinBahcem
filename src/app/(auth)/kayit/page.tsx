import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { IMG } from '@/lib/images';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Üye Ol',
  description: 'Elmora Zeytincilik üyeliği oluşturun; ilk siparişinize özel indirim ve hasat duyuruları.',
  path: '/kayit',
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Aramıza katılın"
      title="Üyelik Oluşturun"
      description="Siparişlerinizi tek yerden takip edin, favorilerinizi saklayın ve yeni hasat duyurularını ilk siz öğrenin."
      image={IMG.branchOlives}
      quote={{
        text: 'Hasat, bizim için yılın en yorucu ve en güzel üç haftasıdır.',
        author: 'Nesrin Elmora · Kurucu Ortak',
      }}
      footer={
        <span className="text-muted-foreground">
          Zaten üye misiniz?{' '}
          <Link
            href="/giris"
            className="font-medium text-gold-700 underline-offset-4 transition-colors hover:underline dark:text-gold-400"
          >
            Giriş yapın
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
