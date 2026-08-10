'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { formPartsText } from '@/lib/data/text/auth';

export const authInput =
  'h-12 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-foreground ' +
  'transition-all placeholder:text-muted-foreground/70 hover:border-gold-500/45 ' +
  'focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none';

export function AuthField({
  label,
  id,
  hint,
  children,
  className,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground/85">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PasswordInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className={cn(authInput, 'pr-12')}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? formPartsText.hidePassword : formPartsText.showPassword}
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-4.5" strokeWidth={1.8} />
        ) : (
          <Eye className="size-4.5" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}

export function FormAlert({ error, success }: { error?: string; success?: string }) {
  const message = error ?? success;
  if (!message) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        role={error ? 'alert' : 'status'}
        className="overflow-hidden"
      >
        <div
          className={cn(
            'flex items-start gap-2.5 rounded-xl border p-3.5 text-sm leading-relaxed',
            error
              ? 'border-red-500/30 bg-red-500/8 text-red-700 dark:text-red-300'
              : 'border-olive-500/30 bg-olive-500/8 text-olive-800 dark:text-olive-200',
          )}
        >
          {error ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          ) : (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          )}
          <span>{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'sheen inline-flex h-12 w-full items-center justify-center gap-2 rounded-full',
        'bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-semibold text-olive-950',
        'transition-all duration-300 hover:shadow-glow active:scale-[0.98] disabled:opacity-60',
        className,
      )}
    >
      {pending && (
        <span className="size-4 animate-spin rounded-full border-2 border-olive-950/30 border-t-olive-950" />
      )}
      {children}
    </button>
  );
}

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
