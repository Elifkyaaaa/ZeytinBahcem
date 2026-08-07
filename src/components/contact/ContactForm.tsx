'use client';

import { motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Field, Input, Textarea } from '@/components/ui/Input';

const subjects = [
  'Sipariş hakkında',
  'Ürün bilgisi',
  'Toptan / kurumsal alım',
  'Bahçe ziyareti',
  'İade ve değişim',
  'Diğer',
];

interface Values {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    phone: '',
    subject: subjects[0],
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const next: Partial<Record<keyof Values, string>> = {};
    if (values.name.trim().length < 3) next.name = 'Adınızı girin.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = 'Geçerli bir e-posta girin.';
    if (values.message.trim().length < 15)
      next.message = 'Mesajınız en az 15 karakter olmalıdır.';
    if (!consent) next.phone = 'KVKK metnini onaylamanız gerekiyor.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Form uçtan uca bağlanana kadar yerel geri bildirim veriyoruz.
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-olive-500/30 bg-olive-500/8 p-8 text-center"
        role="status"
      >
        <span className="inline-grid size-14 place-items-center rounded-full bg-olive-600 text-cream-50">
          <Check className="size-7" strokeWidth={2.8} />
        </span>
        <h3 className="mt-5 font-display text-2xl text-foreground">Mesajınız alındı</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          En geç bir iş günü içinde <strong className="text-foreground">{values.email}</strong>{' '}
          adresine dönüş yapacağız.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setValues({ name: '', email: '', phone: '', subject: subjects[0], message: '' });
            setConsent(false);
          }}
          className="mt-6 text-sm font-medium text-gold-700 underline-offset-4 hover:underline dark:text-gold-400"
        >
          Yeni mesaj gönder
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ad Soyad" htmlFor="name" required error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name')(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="E-posta" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
            value={values.email}
            onChange={(e) => set('email')(e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Telefon" htmlFor="phone" hint="İsteğe bağlı">
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0 5xx xxx xx xx"
            value={values.phone}
            onChange={(e) => set('phone')(e.target.value)}
          />
        </Field>

        <Field label="Konu" htmlFor="subject">
          <select
            id="subject"
            value={values.subject}
            onChange={(e) => set('subject')(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-foreground transition-all hover:border-gold-500/45 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Mesajınız" htmlFor="message" required error={errors.message}>
        <Textarea
          id="message"
          value={values.message}
          onChange={(e) => set('message')(e.target.value)}
          placeholder="Size nasıl yardımcı olabiliriz?"
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
        />
        <span>
          Kişisel verilerimin{' '}
          <Link href="/kvkk" className="text-gold-700 underline underline-offset-2 dark:text-gold-400">
            KVKK Aydınlatma Metni
          </Link>{' '}
          kapsamında, yalnızca bu talebe yanıt vermek amacıyla işlenmesini kabul ediyorum.
        </span>
      </label>
      {errors.phone && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {errors.phone}
        </p>
      )}

      <button
        type="submit"
        className="sheen group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 px-9 text-sm font-semibold text-olive-950 transition-all duration-300 hover:shadow-glow active:scale-[0.98]"
      >
        Mesajı Gönder
        <Send
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.2}
        />
      </button>
    </form>
  );
}
