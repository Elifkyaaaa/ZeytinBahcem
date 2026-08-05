'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signUpWithPassword, type AuthState } from '@/app/(auth)/actions';
import {
  AuthField,
  Divider,
  FormAlert,
  PasswordInput,
  SubmitButton,
  authInput,
} from '@/components/auth/FormParts';
import { GoogleButton } from '@/components/auth/GoogleButton';

const initialState: AuthState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(signUpWithPassword, initialState);

  // Kayıt başarılıysa formu gizleyip doğrulama mesajını öne çıkarıyoruz.
  if (state.success) {
    return (
      <div className="space-y-6">
        <FormAlert success={state.success} />
        <div className="rounded-2xl bg-surface-muted p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">E-posta gelmedi mi?</p>
          <p className="mt-1.5">
            Spam klasörünü kontrol edin. Birkaç dakika içinde ulaşmazsa{' '}
            <Link href="/giris" className="text-gold-700 underline underline-offset-2 dark:text-gold-400">
              giriş sayfasından
            </Link>{' '}
            yeniden gönderebilirsiniz.
          </p>
        </div>
        <Link
          href="/giris"
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:border-gold-500/50"
        >
          Giriş Sayfasına Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoogleButton />

      <Divider>veya e-posta ile</Divider>

      <form action={formAction} className="space-y-5">
        <FormAlert error={state.error} />

        <AuthField label="Ad Soyad" id="fullName">
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            minLength={3}
            placeholder="Adınız ve soyadınız"
            className={authInput}
          />
        </AuthField>

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

        <AuthField label="Telefon" id="phone" hint="Kargo bilgilendirmesi için kullanılır">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0 5xx xxx xx xx"
            className={authInput}
          />
        </AuthField>

        <AuthField label="Şifre" id="password" hint="En az 8 karakter">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
          />
        </AuthField>

        <AuthField label="Şifre Tekrar" id="passwordConfirm">
          <PasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
          />
        </AuthField>

        <div className="space-y-3 pt-1">
          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
            />
            <span>
              <Link href="/mesafeli-satis" className="text-gold-700 underline underline-offset-2 dark:text-gold-400">
                Üyelik Sözleşmesi
              </Link>{' '}
              ve{' '}
              <Link href="/kvkk" className="text-gold-700 underline underline-offset-2 dark:text-gold-400">
                KVKK Aydınlatma Metni
              </Link>
              ’ni okudum, onaylıyorum.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              name="marketing"
              className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
            />
            <span>Kampanya ve yeni hasat duyurularından e-posta ile haberdar olmak istiyorum.</span>
          </label>
        </div>

        <SubmitButton>Üye Ol</SubmitButton>
      </form>
    </div>
  );
}
