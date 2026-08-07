'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  Copy,
  KeyRound,
  Loader2,
  ShieldCheck,
  Smartphone,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useCopy } from '@/hooks';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface Factor {
  id: string;
  friendlyName: string;
  createdAt: string;
}

type Step = 'yukleniyor' | 'kapali' | 'qr' | 'kurulu';

const CODE_LENGTH = 6;

export function TwoFactorSetup() {
  // Supabase bağlı değilse beklenecek bir şey yok; doğrudan kapalı durumla açılır.
  const [step, setStep] = useState<Step>(isSupabaseConfigured ? 'yukleniyor' : 'kapali');
  const [factors, setFactors] = useState<Factor[]>([]);
  const [qr, setQr] = useState<{ factorId: string; svg: string; secret: string } | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  /** Kayıtlı ve doğrulanmış faktörleri oku. */
  const refresh = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) {
      setError(listError.message);
      setStep('kapali');
      return;
    }

    const verified = (data?.totp ?? []).map((f) => ({
      id: f.id,
      friendlyName: f.friendly_name ?? 'Doğrulayıcı uygulama',
      createdAt: f.created_at,
    }));

    setFactors(verified);
    setStep(verified.length > 0 ? 'kurulu' : 'kapali');
  }, []);

  // İlk okuma. setState yalnızca await sonrasında çağrılır — efekt gövdesinde
  // senkron durum güncellemesi yok.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const supabase = createClient();
      if (!supabase) return;

      const { data } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;

      const verified = (data?.totp ?? []).map((f) => ({
        id: f.id,
        friendlyName: f.friendly_name ?? 'Doğrulayıcı uygulama',
        createdAt: f.created_at,
      }));

      setFactors(verified);
      setStep(verified.length > 0 ? 'kurulu' : 'kapali');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -- Kaydı başlat: QR üret ------------------------------------------- */
  const startEnroll = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);
    setSuccess(null);

    // Yarım kalmış (doğrulanmamış) faktör varsa temizle — aksi hâlde
    // "friendly name already exists" hatası alınır.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.all ?? []) {
      if (f.status === 'unverified') {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Doğrulayıcı ${new Date().toLocaleDateString('tr-TR')}`,
    });

    setBusy(false);

    if (enrollError || !data) {
      setError(enrollError?.message ?? 'QR kod oluşturulamadı.');
      return;
    }

    setQr({ factorId: data.id, svg: data.totp.qr_code, secret: data.totp.secret });
    setCode('');
    setStep('qr');
  };

  /* -- Kodu doğrula ----------------------------------------------------- */
  const verify = async () => {
    const supabase = createClient();
    if (!supabase || !qr) return;

    setBusy(true);
    setError(null);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: qr.factorId,
    });

    if (challengeError || !challenge) {
      setBusy(false);
      setError(challengeError?.message ?? 'Doğrulama başlatılamadı.');
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: qr.factorId,
      challengeId: challenge.id,
      code,
    });

    setBusy(false);

    if (verifyError) {
      setError('Kod doğrulanamadı. Uygulamadaki güncel 6 haneli kodu girin.');
      setCode('');
      return;
    }

    setQr(null);
    setSuccess('İki adımlı doğrulama etkinleştirildi.');
    await refresh();
  };

  /* -- Kaldır ----------------------------------------------------------- */
  const remove = async (factorId: string) => {
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);

    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);

    if (unenrollError) {
      setError(
        'Kaldırılamadı. Bu işlem için oturumunuzun iki adımlı doğrulamadan geçmiş olması gerekir — çıkış yapıp kodla yeniden giriş yapın.',
      );
      return;
    }

    setSuccess('İki adımlı doğrulama kapatıldı.');
    await refresh();
  };

  /* -- Görünüm ---------------------------------------------------------- */

  if (step === 'yukleniyor') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" strokeWidth={2} />
        Güvenlik ayarları okunuyor…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {(error || success) && (
          <motion.div
            key={error ?? success}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              role={error ? 'alert' : 'status'}
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
                <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.6} />
              )}
              <span>{error ?? success}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kurulu değil */}
      {step === 'kapali' && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-500/12 text-amber-700 dark:text-amber-400">
              <Smartphone className="size-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">İki adımlı doğrulama kapalı</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Etkinleştirdiğinizde giriş sırasında şifrenize ek olarak telefonunuzdaki
                doğrulayıcı uygulamanın ürettiği 6 haneli kod istenir. Şifreniz ele geçse bile
                hesabınıza girilemez.
              </p>
            </div>
          </div>

          <button
            onClick={startEnroll}
            disabled={busy}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-olive-700 px-6 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] disabled:opacity-60 dark:bg-gold-500 dark:text-olive-950"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={2} />
            ) : (
              <ShieldCheck className="size-4" strokeWidth={2} />
            )}
            İki Adımlı Doğrulamayı Aç
          </button>
        </div>
      )}

      {/* QR gösterimi ve doğrulama */}
      {step === 'qr' && qr && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-600/10 text-xs font-semibold text-olive-700 dark:bg-gold-400/12 dark:text-gold-400">
                1
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">Doğrulayıcı uygulamayı açın</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Google Authenticator, Microsoft Authenticator veya Authy — hangisi
                  kuruluysa. Yoksa uygulama mağazasından ücretsiz kurabilirsiniz.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-600/10 text-xs font-semibold text-olive-700 dark:bg-gold-400/12 dark:text-gold-400">
                2
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">QR kodu okutun</p>

                <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row">
                  {/* Supabase QR'ı SVG veri URI'si olarak döner */}
                  <span className="rounded-xl border border-border bg-white p-3">
                    <Image
                      src={qr.svg}
                      alt="İki adımlı doğrulama QR kodu"
                      width={176}
                      height={176}
                      unoptimized
                      className="size-44"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">
                      QR okutamıyorsanız bu anahtarı uygulamaya elle girin:
                    </p>
                    <button
                      onClick={() => copy(qr.secret)}
                      className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-left font-mono text-xs break-all text-foreground transition-colors hover:border-gold-500/50"
                    >
                      <span className="min-w-0 flex-1">{qr.secret}</span>
                      {copied ? (
                        <Check className="size-4 shrink-0 text-olive-600" strokeWidth={2.8} />
                      ) : (
                        <Copy className="size-4 shrink-0 opacity-50" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-olive-600/10 text-xs font-semibold text-olive-700 dark:bg-gold-400/12 dark:text-gold-400">
                3
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">Uygulamadaki kodu girin</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  6 haneli kod 30 saniyede bir yenilenir.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH));
                      setError(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && code.length === CODE_LENGTH && verify()}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    aria-label="Doğrulama kodu"
                    className="h-12 w-40 rounded-xl border border-border bg-background px-4 text-center font-mono text-lg tracking-[0.4em] transition-all focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
                  />
                  <button
                    onClick={verify}
                    disabled={busy || code.length !== CODE_LENGTH}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-olive-700 px-6 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] disabled:opacity-40 dark:bg-gold-500 dark:text-olive-950"
                  >
                    {busy && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
                    Doğrula ve Etkinleştir
                  </button>
                  <button
                    onClick={() => {
                      setQr(null);
                      setStep('kapali');
                      setError(null);
                    }}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </li>
          </ol>
        </motion.div>
      )}

      {/* Kurulu */}
      {step === 'kurulu' && (
        <div className="rounded-2xl border border-olive-500/35 bg-olive-500/6 p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-olive-600 text-cream-50">
              <ShieldCheck className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">İki adımlı doğrulama etkin</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Girişte şifrenizin ardından doğrulayıcı uygulamanızdaki kod istenir.
              </p>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-border border-t border-border">
            {factors.map((factor) => (
              <li key={factor.id} className="flex flex-wrap items-center gap-3 py-3.5">
                <KeyRound
                  className="size-4 shrink-0 text-olive-600 dark:text-gold-400"
                  strokeWidth={1.9}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {factor.friendlyName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {new Date(factor.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    tarihinde eklendi
                  </span>
                </span>
                <button
                  onClick={() => remove(factor.id)}
                  disabled={busy}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium transition-colors hover:border-red-400/60 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.9} />
                  Kaldır
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={startEnroll}
            disabled={busy}
            className="mt-4 text-sm font-medium text-gold-700 underline-offset-4 transition-colors hover:underline disabled:opacity-50 dark:text-gold-400"
          >
            Başka bir cihaz ekle
          </button>
        </div>
      )}
    </div>
  );
}
