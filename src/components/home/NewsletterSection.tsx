'use client';

import { motion } from 'framer-motion';
import { Check, Mail, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Container } from '@/components/ui/Section';
import { IMG, img } from '@/lib/images';
import { blurDataURL } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle');
  const [consent, setConsent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      return;
    }
    // Gerçek bir uçtan uca entegrasyon yerine yerel geri bildirim veriyoruz.
    setStatus('done');
    setEmail('');
  };

  return (
    <section className="relative" aria-label="E-bülten">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-olive-800/30 shadow-lift">
          <Image
            src={img(IMG.leavesGreen, 1800, 900)}
            alt=""
            fill
            sizes="(min-width: 1280px) 80rem, 94vw"
            placeholder="blur"
            blurDataURL={blurDataURL('olive')}
            className="object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-olive-950/82" />
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.18),transparent_55%)]"
          />

          <div className="relative grain px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            <span className="inline-grid size-14 place-items-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Mail className="size-6" strokeWidth={1.6} />
            </span>

            <h2 className="mt-6 font-serif text-3xl text-cream-50 sm:text-4xl lg:text-[2.75rem]">
              Kampanyaları Kaçırmayın
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream-200/72 sm:text-base">
              Yeni hasat duyuruları, sınırlı üretim serileri ve aboneye özel indirimler —
              ayda en fazla iki e-posta.
            </p>

            {status === 'done' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-6 py-5"
                role="status"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-400 text-olive-950">
                  <Check className="size-5" strokeWidth={2.8} />
                </span>
                <p className="text-left text-sm text-cream-100">
                  <strong className="font-semibold">Aramıza hoş geldiniz.</strong>
                  <br />
                  İlk bültenimiz kısa süre içinde kutunuzda olacak.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-9 max-w-lg" noValidate>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      E-posta adresiniz
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="ornek@eposta.com"
                      aria-invalid={status === 'error'}
                      aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                      className="h-14 w-full rounded-full border border-cream-200/20 bg-white/8 px-6 text-[0.95rem] text-cream-50 backdrop-blur-md transition-all placeholder:text-cream-200/45 focus:border-gold-400/70 focus:bg-white/12 focus:ring-4 focus:ring-gold-400/15 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sheen group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 px-8 font-semibold text-olive-950 transition-all duration-300 hover:shadow-glow active:scale-[0.97]"
                  >
                    Abone Ol
                    <Send
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.2}
                    />
                  </button>
                </div>

                {status === 'error' && (
                  <p id="newsletter-error" className="mt-3 text-sm text-red-300" role="alert">
                    Lütfen geçerli bir e-posta adresi girin.
                  </p>
                )}

                <label className="mt-5 flex cursor-pointer items-start justify-center gap-2.5 text-xs text-cream-200/60">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 rounded border-cream-200/30 bg-white/10 accent-gold-500"
                  />
                  <span className="max-w-md text-left">
                    Kişisel verilerimin{' '}
                    <Link href="/kvkk" className="text-gold-300 underline underline-offset-2">
                      KVKK Aydınlatma Metni
                    </Link>{' '}
                    kapsamında işlenmesini kabul ediyorum.
                  </span>
                </label>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
