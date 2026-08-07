'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { requestPasswordReset, type AuthState } from '@/app/(auth)/actions';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthField, FormAlert, SubmitButton, authInput } from '@/components/auth/FormParts';
import { IMG } from '@/lib/images';

const initialState: AuthState = {};

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <AuthShell
      eyebrow="Şifre sıfırlama"
      title="Şifrenizi mi Unuttunuz?"
      description="Kayıtlı e-posta adresinizi girin; şifrenizi yenilemeniz için bir bağlantı gönderelim."
      image={IMG.leavesTilt}
      footer={
        <Link
          href="/giris"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Giriş sayfasına dön
        </Link>
      }
    >
      <form action={formAction} className="space-y-5">
        <FormAlert error={state.error} success={state.success} />

        {!state.success && (
          <>
            <AuthField label="E-posta" id="email">
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="ornek@eposta.com"
                className={authInput}
              />
            </AuthField>

            <SubmitButton>Sıfırlama Bağlantısı Gönder</SubmitButton>
          </>
        )}
      </form>
    </AuthShell>
  );
}
