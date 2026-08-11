'use client';

import { useActionState, useState } from 'react';
import { changePassword, type ActionState } from '@/app/(shop)/account/actions';
import { AuthField, FormAlert, PasswordInput, SubmitButton } from '@/components/auth/FormParts';
import { cn } from '@/lib/utils';
import { passwordFormText } from '@/lib/data/text/account';

const initialState: ActionState = {};

/** Simple strength meter based on length and character variety. */
function strengthOf(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}

const labels = passwordFormText.strengthLabels;
const colors = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-olive-500', 'bg-emerald-500'];

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState);
  const [value, setValue] = useState('');
  const score = strengthOf(value);

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <FormAlert error={state.error} success={state.success} />

      <AuthField label={passwordFormText.currentLabel} id="currentPassword">
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </AuthField>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground/85">
          {passwordFormText.newLabel}
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
        />

        {value.length > 0 && (
          <div className="flex items-center gap-3 pt-1">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors duration-300',
                    i < score ? colors[score] : 'bg-foreground/10',
                  )}
                />
              ))}
            </div>
            <span className="w-16 text-right text-xs text-muted-foreground">{labels[score]}</span>
          </div>
        )}
      </div>

      <AuthField label={passwordFormText.confirmLabel} id="passwordConfirm">
        <PasswordInput
          id="passwordConfirm"
          name="passwordConfirm"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </AuthField>

      <SubmitButton>{passwordFormText.submit}</SubmitButton>
    </form>
  );
}
