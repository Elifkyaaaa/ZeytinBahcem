'use client';

import { motion } from 'framer-motion';
import { Check, PackageSearch, Search, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Field, Input } from '@/components/ui/Input';
import { site } from '@/lib/data/site';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'received', label: 'Sipariş alındı', detail: 'Ödemeniz onaylandı' },
  { id: 'preparing', label: 'Hazırlanıyor', detail: 'Ürünleriniz paketleniyor' },
  { id: 'shipped', label: 'Kargoda', detail: 'Kargo firmasına teslim edildi' },
  { id: 'delivered', label: 'Teslim edildi', detail: 'Afiyet olsun' },
];

export function OrderTracker() {
  const searchParams = useSearchParams();
  const [orderNo, setOrderNo] = useState(searchParams.get('no') ?? '');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ step: number; orderNo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^ZB-/i.test(orderNo.trim())) {
      setError('Sipariş numarası ZB- ile başlamalıdır. Onay e-postanızda yer alır.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Siparişte kullandığınız e-posta adresini girin.');
      return;
    }

    // Sipariş sorgusu Supabase bağlandığında canlıya geçer; şimdilik
    // numaradan türetilen tutarlı bir durum gösteriyoruz.
    const seed = orderNo.replace(/\D/g, '').slice(-1);
    setResult({ step: (Number(seed) % 4) + 1, orderNo: orderNo.trim().toUpperCase() });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
          <PackageSearch className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
          Sipariş Sorgula
        </h2>

        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sipariş numarası" htmlFor="orderNo" required hint="Örn. ZB-260804-0128">
              <Input
                id="orderNo"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value.toUpperCase())}
                placeholder="ZB-…"
                className="tracking-wide uppercase"
              />
            </Field>

            <Field label="E-posta" htmlFor="trackEmail" required>
              <Input
                id="trackEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
              />
            </Field>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="sheen inline-flex h-12 items-center justify-center gap-2 rounded-full bg-olive-700 px-8 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-[0.98] dark:bg-gold-500 dark:text-olive-950"
          >
            <Search className="size-4" strokeWidth={2.2} />
            Sorgula
          </button>
        </form>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-xl text-foreground">
              Sipariş {result.orderNo}
            </h3>
            <span className="text-sm text-muted-foreground">
              {steps[result.step - 1]?.label}
            </span>
          </div>

          <ol className="mt-8 space-y-0">
            {steps.map((step, i) => {
              const done = i < result.step;
              const active = i === result.step - 1;
              const last = i === steps.length - 1;

              return (
                <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-9 left-[0.9rem] h-[calc(100%-1.5rem)] w-0.5 rounded-full',
                        done ? 'bg-olive-500' : 'bg-border',
                      )}
                    />
                  )}

                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.12 + i * 0.1, type: 'spring', stiffness: 420, damping: 22 }}
                    className={cn(
                      'relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-surface',
                      done
                        ? 'bg-olive-600 text-cream-50'
                        : 'bg-surface-muted text-muted-foreground',
                    )}
                  >
                    {done ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      <span className="size-2 rounded-full bg-current opacity-40" />
                    )}
                  </motion.span>

                  <div className="min-w-0 flex-1 pt-1">
                    <p
                      className={cn(
                        'font-medium',
                        active ? 'text-foreground' : done ? 'text-foreground/80' : 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {result.step >= 3 && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-surface-muted p-4">
              <Truck className="size-5 shrink-0 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
              <p className="text-sm text-muted-foreground">
                Kargo takip numarası, kargoya verildiğinde e-posta ile iletilir.
              </p>
            </div>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            Siparişinizle ilgili bir sorun mu var?{' '}
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-700 underline underline-offset-4 dark:text-gold-400"
            >
              WhatsApp’tan yazın
            </a>{' '}
            veya{' '}
            <Link
              href="/iletisim"
              className="font-medium text-gold-700 underline underline-offset-4 dark:text-gold-400"
            >
              iletişim formunu
            </Link>{' '}
            kullanın.
          </p>
        </motion.div>
      )}
    </div>
  );
}
