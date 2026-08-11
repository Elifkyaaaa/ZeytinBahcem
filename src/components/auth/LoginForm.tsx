'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { signInWithPassword, type AuthState } from '@/app/(auth)/actions';
import {
  AuthField,
  Divider,
  FormAlert,
  PasswordInput,
  SubmitButton,
  authInput,
} from '@/components/auth/FormParts';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { loginFormText } from '@/lib/data/text/auth';

const initialState: AuthState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/account';
  const urlError = searchParams.get('hata');

  const [state, formAction] = useActionState(signInWithPassword, initialState);

  return (
    <div className="space-y-6">
      <GoogleButton next={next} />

      <Divider>veya e-posta ile</Divider>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <FormAlert
          error={
            state.error ??
            (urlError ? (loginFormText.errors[urlError] ?? urlError) : undefined)
          }
        />

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

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-foreground/85">
              {loginFormText.passwordLabel}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-gold-700 underline-offset-4 transition-colors hover:underline dark:text-gold-400"
            >
              {loginFormText.forgotPassword}
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="size-4 rounded accent-gold-500"
          />
          {loginFormText.rememberMe}
        </label>

        <SubmitButton>{loginFormText.submit}</SubmitButton>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {loginFormText.consentBefore}{' '}
        <Link href="/gizlilik" className="underline underline-offset-2 hover:text-foreground">
          {loginFormText.privacyLinkLabel}
        </Link>{' '}
        {loginFormText.consentBetween}{' '}
        <Link href="/kvkk" className="underline underline-offset-2 hover:text-foreground">
          {loginFormText.kvkkLinkLabel}
        </Link>
        {loginFormText.consentAfter}
      </p>
    </div>
  );
}
