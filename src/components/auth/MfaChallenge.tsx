'use client';

import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { mfaChallengeText } from '@/lib/data/text/auth';

const CODE_LENGTH = 6;

/**
 * Second step after sign-in.
 *
 * Once the password is accepted the session sits at AAL1. If the user has a
 * verified TOTP factor, the code is requested here and the session is raised
 * to AAL2, which the admin panel requires (see middleware).
 */
export function MfaChallenge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/account';

  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Find the verified factor; without one, send the user straight on.
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      router.replace(next);
      return;
    }

    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;

      const totp = data?.totp?.[0];
      if (!totp) {
        router.replace(next);
        return;
      }

      setFactorId(totp.id);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, next]);

  const submit = useCallback(async () => {
    const supabase = createClient();
    if (!supabase || !factorId) return;

    setBusy(true);
    setError(null);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (challengeError || !challenge) {
      setBusy(false);
      setError(mfaChallengeText.startError);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      setBusy(false);
      setError(mfaChallengeText.wrongCode);
      setCode('');
      return;
    }

    // The session is now AAL2; let server components see the new cookie.
    router.replace(next);
    router.refresh();
  }, [factorId, code, router, next]);

  if (!ready) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" strokeWidth={2} />
        Kontrol ediliyor…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-4">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-olive-600 dark:text-gold-400"
          strokeWidth={1.8}
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {mfaChallengeText.intro}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/8 p-3.5 text-sm leading-relaxed text-red-700 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          {error}
        </p>
      )}

      <div>
        <label htmlFor="mfa-code" className="mb-2 block text-sm font-medium text-foreground/85">
          {mfaChallengeText.codeLabel}
        </label>
        <input
          id="mfa-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH));
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && code.length === CODE_LENGTH && submit()}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="000000"
          className="h-14 w-full rounded-xl border border-border bg-surface text-center font-mono text-2xl tracking-[0.5em] transition-all focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
        />
      </div>

      <button
        onClick={submit}
        disabled={busy || code.length !== CODE_LENGTH}
        className="sheen inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-semibold text-olive-950 transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-50"
      >
        {busy && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
        {mfaChallengeText.submit}
      </button>
    </div>
  );
}
