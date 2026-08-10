'use client';

import { useActionState } from 'react';
import { updateProfile, type ActionState } from '@/app/(shop)/hesap/actions';
import { AuthField, FormAlert, SubmitButton, authInput } from '@/components/auth/FormParts';
import { cn } from '@/lib/utils';
import { profileFormText } from '@/lib/data/text/account';

const initialState: ActionState = {};

export function ProfileForm({
  defaultName,
  defaultPhone,
  defaultMarketing,
  email,
  disabled,
}: {
  defaultName: string;
  defaultPhone: string;
  defaultMarketing: boolean;
  email: string;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormAlert error={state.error} success={state.success} />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField label="Ad Soyad" id="fullName">
          <input
            id="fullName"
            name="fullName"
            defaultValue={defaultName}
            autoComplete="name"
            required
            minLength={3}
            disabled={disabled}
            className={authInput}
          />
        </AuthField>

        <AuthField label="Telefon" id="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={defaultPhone}
            placeholder="0 5xx xxx xx xx"
            disabled={disabled}
            className={authInput}
          />
        </AuthField>

        <AuthField
          label="E-posta"
          id="email"
          hint={profileFormText.emailHint}
          className="sm:col-span-2"
        >
          <input
            id="email"
            value={email || '—'}
            readOnly
            disabled
            className={cn(authInput, 'cursor-not-allowed opacity-60')}
          />
        </AuthField>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="marketing"
          defaultChecked={defaultMarketing}
          disabled={disabled}
          className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
        />
        {profileFormText.marketingOptIn}
      </label>

      <SubmitButton className="sm:w-auto sm:px-10">{profileFormText.submit}</SubmitButton>
    </form>
  );
}
