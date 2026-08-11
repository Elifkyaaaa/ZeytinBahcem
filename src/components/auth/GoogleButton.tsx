'use client';

import { useFormStatus } from 'react-dom';
import { signInWithGoogle } from '@/app/(auth)/actions';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.56Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.7a11.5 11.5 0 0 0 0 10.3l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.71 1.28 15.1.25 12 .25 7.53.25 3.66 2.82 1.7 6.85l3.85 2.98C6.46 7.11 9 4.77 12 4.77Z"
      />
    </svg>
  );
}

function Inner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-surface text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-soft active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? (
        <span className="size-4 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />
      ) : (
        <GoogleMark />
      )}
      Google ile devam et
    </button>
  );
}

export function GoogleButton({ next = '/account' }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <Inner />
    </form>
  );
}
