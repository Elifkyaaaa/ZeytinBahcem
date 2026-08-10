'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  Truck,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { IyzicoFrame } from '@/components/checkout/IyzicoFrame';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Input';
import { PaymentMark } from '@/components/ui/icons';
import { useHydrated } from '@/hooks';
import { cities, cityNames } from '@/lib/data/cities';
import { shippingMethods, type ShippingMethodId } from '@/lib/data/coupons';
import { paymentMethodMeta, paymentMethods, type PaymentMethod } from '@/lib/data/payment';
import { site } from '@/lib/data/site';
import { useCart } from '@/lib/store/cart';
import { calcTotals, useCheckout } from '@/lib/store/checkout';
import { blurDataURL, cn, formatPrice } from '@/lib/utils';
import { checkoutText } from '@/lib/data/text/checkout';

/** Yöntem başına simge — metin ve tutarlar `@/lib/data/payment` içinde. */
const paymentIcons: Record<PaymentMethod, typeof CreditCard> = {
  card: CreditCard,
  transfer: Banknote,
  cod: Package,
};

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  district: '',
  address: '',
  postalCode: '',
  note: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
};

type FormValues = typeof emptyForm;
type FormErrors = Partial<Record<keyof FormValues, string>>;

export function CheckoutView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const couponCode = useCheckout((s) => s.couponCode);
  const shippingMethod = useCheckout((s) => s.shippingMethod);
  const setShippingMethod = useCheckout((s) => s.setShippingMethod);

  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [agreed, setAgreed] = useState(false);
  const [preInfoAgreed, setPreInfoAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [iyzicoForm, setIyzicoForm] = useState<string | null>(null);

  const base = calcTotals(items, couponCode, shippingMethod);
  const surcharge = paymentMethodMeta[payment].surcharge;
  const bankDiscount = (base.subtotal - base.discount) * paymentMethodMeta[payment].discountRate;
  const total = Math.max(0, base.total + surcharge - bankDiscount);
  const districts = values.city ? (cities[values.city] ?? []) : [];

  const set = (key: keyof FormValues) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next: FormErrors = {};
    if (values.firstName.trim().length < 2) next.firstName = checkoutText.validation.firstName;
    if (values.lastName.trim().length < 2) next.lastName = checkoutText.validation.lastName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = checkoutText.validation.email;
    if (values.phone.replace(/\D/g, '').length < 10) next.phone = checkoutText.validation.phone;
    if (!values.city) next.city = checkoutText.validation.city;
    if (!values.district) next.district = checkoutText.validation.district;
    if (values.address.trim().length < 10) next.address = checkoutText.validation.address;

    if (payment === 'card') {
      if (values.cardName.trim().length < 4) next.cardName = checkoutText.validation.cardName;
      if (values.cardNumber.replace(/\s/g, '').length !== 16)
        next.cardNumber = checkoutText.validation.cardNumber;
      if (!/^\d{2}\/\d{2}$/.test(values.cardExpiry)) next.cardExpiry = checkoutText.validation.cardExpiry;
      if (!/^\d{3,4}$/.test(values.cardCvc)) next.cardCvc = checkoutText.validation.cardCvc;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!preInfoAgreed) {
      setErrors((prev) => ({
        ...prev,
        note: checkoutText.validation.preInfoRequired,
      }));
      return;
    }
    if (!agreed) {
      setErrors((prev) => ({
        ...prev,
        note: checkoutText.validation.termsRequired,
      }));
      return;
    }
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            slug: item.slug,
            name: item.name,
            variantLabel: item.variantLabel,
            variantValue: item.key.split(':')[1] ?? '',
            unitPrice: item.price,
            quantity: item.quantity,
            imageUrl: item.image,
          })),
          customer: {
            fullName: `${values.firstName} ${values.lastName}`.trim(),
            email: values.email,
            phone: values.phone,
          },
          address: {
            city: values.city,
            district: values.district,
            address: values.address,
            postalCode: values.postalCode,
          },
          totals: {
            subtotal: base.subtotal,
            discount: base.discount + bankDiscount,
            shipping: base.shipping + surcharge,
            vat: base.vat,
            total,
          },
          couponCode,
          shippingMethod: shippingMethods.find((m) => m.id === shippingMethod)?.name ?? 'Standart Kargo',
          paymentMethod: payment,
          note: values.note,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        mode?: 'iyzico' | 'manual' | 'demo';
        orderNo?: string;
        checkoutFormContent?: string;
      };

      if (!response.ok || !data.ok) {
        setServerError(data.error ?? checkoutText.serverError);
        setSubmitting(false);
        return;
      }

      // iyzico Checkout Form: dönen HTML/script sayfaya enjekte edilir,
      // 3D Secure akışı iyzico tarafında açılır ve callback'e döner.
      if (data.mode === 'iyzico' && data.checkoutFormContent) {
        setIyzicoForm(data.checkoutFormContent);
        return;
      }

      // Sipariş numarasını her zaman sunucu üretir; burada yalnızca güvenli bir yedek var.
      setOrderNo(data.orderNo ?? 'ZB-BEKLEMEDE');
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError(checkoutText.networkError);
      setSubmitting(false);
    }
  };

  if (iyzicoForm) {
    return <IyzicoFrame content={iyzicoForm} />;
  }

  if (orderNo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl py-14 text-center sm:py-20"
      >
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
          className="inline-grid size-20 place-items-center rounded-full bg-olive-600 text-cream-50"
        >
          <Check className="size-9" strokeWidth={2.8} />
        </motion.span>

        <h2 className="mt-7 font-display text-3xl text-foreground sm:text-4xl">
          {checkoutText.successTitle}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {checkoutText.successBefore}{' '}
          <strong className="font-semibold text-foreground tabular-nums">{orderNo}</strong>
          {checkoutText.successAfter}
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{checkoutText.paymentMethodLabel}</dt>
              <dd className="font-medium text-foreground">
                {paymentMethodMeta[payment].name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Teslimat</dt>
              <dd className="font-medium text-foreground">
                {shippingMethods.find((m) => m.id === shippingMethod)?.name}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-semibold text-foreground">Genel toplam</dt>
              <dd className="font-semibold text-foreground tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/siparis-takibi" variant="gold" size="lg">
            {checkoutText.trackOrder}
          </Button>
          <Button href="/urunler" variant="outline" size="lg">
            {checkoutText.continueShopping}
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_23rem]">
        <div className="space-y-4">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-52 rounded-2xl" />
        </div>
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center sm:py-24">
        <span className="grid size-24 place-items-center rounded-full bg-surface-muted">
          <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1.2} />
        </span>
        <h2 className="mt-7 font-display text-3xl text-foreground">{checkoutText.emptyTitle}</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          {checkoutText.emptyBody}
        </p>
        <Button href="/urunler" variant="gold" size="lg" className="mt-8">
          {checkoutText.emptyCta}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_23rem] lg:gap-10">
      <div className="space-y-6">
        {/* Teslimat bilgileri */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <User className="size-4.5" strokeWidth={1.8} />
            </span>
            Teslimat Bilgileri
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Ad" htmlFor="firstName" required error={errors.firstName}>
              <Input
                id="firstName"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => set('firstName')(e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
              />
            </Field>
            <Field label="Soyad" htmlFor="lastName" required error={errors.lastName}>
              <Input
                id="lastName"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => set('lastName')(e.target.value)}
                aria-invalid={Boolean(errors.lastName)}
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
            <Field label="Telefon" htmlFor="phone" required error={errors.phone}>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0 5xx xxx xx xx"
                value={values.phone}
                onChange={(e) => set('phone')(e.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>
            <Field label={checkoutText.cityLabel} htmlFor="city" required error={errors.city}>
              <select
                id="city"
                value={values.city}
                onChange={(e) => {
                  set('city')(e.target.value);
                  set('district')('');
                }}
                aria-invalid={Boolean(errors.city)}
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-foreground transition-all hover:border-gold-500/45 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none"
              >
                <option value="">{checkoutText.cityPlaceholder}</option>
                {cityNames.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={checkoutText.districtLabel} htmlFor="district" required error={errors.district}>
              <select
                id="district"
                value={values.district}
                onChange={(e) => set('district')(e.target.value)}
                disabled={!values.city}
                aria-invalid={Boolean(errors.district)}
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-[0.95rem] text-foreground transition-all hover:border-gold-500/45 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/12 focus:outline-none disabled:opacity-55"
              >
                <option value="">
                  {values.city
                    ? checkoutText.districtPlaceholder
                    : checkoutText.districtDisabledPlaceholder}
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label={checkoutText.addressLabel}
              htmlFor="address"
              required
              error={errors.address}
              className="sm:col-span-2"
              hint={checkoutText.addressHint}
            >
              <Textarea
                id="address"
                autoComplete="street-address"
                value={values.address}
                onChange={(e) => set('address')(e.target.value)}
                aria-invalid={Boolean(errors.address)}
                className="min-h-24"
              />
            </Field>
            <Field label="Posta Kodu" htmlFor="postalCode">
              <Input
                id="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                value={values.postalCode}
                onChange={(e) => set('postalCode')(e.target.value)}
              />
            </Field>
            <Field
              label={checkoutText.noteLabel}
              htmlFor="note"
              hint={checkoutText.noteHint}
            >
              <Input
                id="note"
                value={values.note}
                onChange={(e) => set('note')(e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Kargo seçimi */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <Truck className="size-4.5" strokeWidth={1.8} />
            </span>
            {checkoutText.shippingHeading}
          </h2>

          <div className="mt-6 space-y-3">
            {shippingMethods.map((method) => {
              const selected = shippingMethod === method.id;
              const free = base.freeShipping || method.price === 0;
              return (
                <label
                  key={method.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-300',
                    selected
                      ? 'border-gold-500 bg-gold-500/6 shadow-soft'
                      : 'border-border hover:border-gold-500/45',
                  )}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={selected}
                    onChange={() => setShippingMethod(method.id as ShippingMethodId)}
                    className="size-4.5 shrink-0 accent-gold-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{method.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{method.detail}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {free ? (
                      <span className="text-olive-700 dark:text-olive-300">{checkoutText.freeLabel}</span>
                    ) : (
                      <span className="text-foreground">{formatPrice(method.price)}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Ödeme yöntemi */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <CreditCard className="size-4.5" strokeWidth={1.8} />
            </span>
            {checkoutText.paymentHeading}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map(({ id, name, detail }) => {
              const Icon = paymentIcons[id];
              const selected = payment === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayment(id)}
                  aria-pressed={selected}
                  className={cn(
                    'relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300',
                    selected
                      ? 'border-gold-500 bg-gold-500/6 shadow-soft'
                      : 'border-border hover:-translate-y-0.5 hover:border-gold-500/45',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-5',
                      selected ? 'text-gold-600 dark:text-gold-400' : 'text-muted-foreground',
                    )}
                    strokeWidth={1.8}
                  />
                  <span className="mt-3 text-sm font-semibold text-foreground">{name}</span>
                  <span className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
                    {detail}
                  </span>
                  {selected && (
                    <motion.span
                      layoutId="payment-check"
                      className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-gold-500 text-olive-950"
                    >
                      <Check className="size-3" strokeWidth={3.2} />
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {payment === 'card' && (
              <motion.div
                key="kart"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field
                    label={checkoutText.cardNameLabel}
                    htmlFor="cardName"
                    required
                    error={errors.cardName}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="cardName"
                      autoComplete="cc-name"
                      value={values.cardName}
                      onChange={(e) => set('cardName')(e.target.value)}
                      aria-invalid={Boolean(errors.cardName)}
                    />
                  </Field>
                  <Field
                    label={checkoutText.cardNumberLabel}
                    htmlFor="cardNumber"
                    required
                    error={errors.cardNumber}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={values.cardNumber}
                      onChange={(e) =>
                        set('cardNumber')(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim(),
                        )
                      }
                      aria-invalid={Boolean(errors.cardNumber)}
                    />
                  </Field>
                  <Field label="Son Kullanma" htmlFor="cardExpiry" required error={errors.cardExpiry}>
                    <Input
                      id="cardExpiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="AA/YY"
                      maxLength={5}
                      value={values.cardExpiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        set('cardExpiry')(
                          digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
                        );
                      }}
                      aria-invalid={Boolean(errors.cardExpiry)}
                    />
                  </Field>
                  <Field label="CVC" htmlFor="cardCvc" required error={errors.cardCvc}>
                    <Input
                      id="cardCvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      maxLength={4}
                      value={values.cardCvc}
                      onChange={(e) => set('cardCvc')(e.target.value.replace(/\D/g, ''))}
                      aria-invalid={Boolean(errors.cardCvc)}
                    />
                  </Field>
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 shrink-0 text-olive-600 dark:text-gold-400" strokeWidth={2} />
                  {checkoutText.cardSecurityNote}
                </p>
              </motion.div>
            )}

            {payment === 'transfer' && (
              <motion.div
                key="havale"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-xl bg-surface-muted p-5 text-sm">
                  <p className="font-semibold text-foreground">{site.legalName}</p>
                  <dl className="mt-3 space-y-1.5 text-muted-foreground">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0">{checkoutText.transfer.bankLabel}</dt>
                      <dd className="font-medium text-foreground">
                        {checkoutText.transfer.bankName}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0">IBAN</dt>
                      <dd className="font-medium text-foreground tabular-nums">
                        {checkoutText.transfer.iban}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed">
                    {checkoutText.transfer.noteBefore}
                    <strong className="font-semibold text-olive-700 dark:text-olive-300">
                      {checkoutText.transfer.noteHighlight}
                    </strong>{' '}
                    {checkoutText.transfer.noteAfter}
                  </p>
                </div>
              </motion.div>
            )}

            {payment === 'cod' && (
              <motion.div
                key="kapida"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-xl bg-surface-muted p-5 text-sm leading-relaxed text-muted-foreground">
                  {checkoutText.cod.noteBefore}{' '}
                  <strong className="font-semibold text-foreground">
                    {checkoutText.cod.noteFee}
                  </strong>{' '}
                  {checkoutText.cod.noteAfter}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div>
          <Button href="/sepet" variant="outline" size="md">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
            {checkoutText.backToCart}
          </Button>
        </div>
      </div>

      {/* Sipariş özeti */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-foreground">
            <MapPin className="size-5 text-gold-600 dark:text-gold-400" strokeWidth={1.8} />
            {checkoutText.summaryHeading}
          </h2>

          <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="56px"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-olive-700 text-[0.62rem] font-bold text-cream-50 tabular-nums">
                    {item.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    href={`/urunler/${item.slug}`}
                    className="line-clamp-1 text-xs font-medium text-foreground hover:text-gold-600"
                  >
                    {item.name}
                  </Link>
                  <span className="mt-0.5 block text-[0.7rem] text-muted-foreground">
                    {item.variantLabel}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-foreground tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Toplam</dt>
              <dd className="font-medium text-foreground tabular-nums">
                {formatPrice(base.subtotal)}
              </dd>
            </div>

            {base.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                    {checkoutText.discountLabel(couponCode)}
                  </dt>
                <dd className="font-medium text-red-600 tabular-nums dark:text-red-400">
                  −{formatPrice(base.discount)}
                </dd>
              </div>
            )}

            {bankDiscount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Havale indirimi (%3)</dt>
                <dd className="font-medium text-red-600 tabular-nums dark:text-red-400">
                  −{formatPrice(bankDiscount)}
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-muted-foreground">KDV (%20, dâhil)</dt>
              <dd className="text-muted-foreground tabular-nums">{formatPrice(base.vat)}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-muted-foreground">Kargo</dt>
              <dd className="font-medium tabular-nums">
                {base.shipping === 0 ? (
                  <span className="text-olive-700 dark:text-olive-300">{checkoutText.freeLabel}</span>
                ) : (
                  <span className="text-foreground">{formatPrice(base.shipping)}</span>
                )}
              </dd>
            </div>

            {surcharge > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{checkoutText.codFeeLabel}</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {formatPrice(surcharge)}
                </dd>
              </div>
            )}

            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="font-semibold text-foreground">Genel Toplam</dt>
              <dd className="font-display text-2xl font-semibold text-foreground tabular-nums">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          {/* Mesafeli Sözleşmeler Yönetmeliği: ön bilgilendirme ve sözleşme
              onayı ayrı ayrı alınmalıdır. */}
          <div className="mt-5 space-y-3 border-t border-border pt-4">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={preInfoAgreed}
                onChange={(e) => {
                  setPreInfoAgreed(e.target.checked);
                  setErrors((prev) => ({ ...prev, note: undefined }));
                }}
                className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
              />
              <span>
                <Link
                  href="/on-bilgilendirme-formu"
                  target="_blank"
                  className="text-gold-700 underline underline-offset-2 dark:text-gold-400"
                >
                  {checkoutText.preInfoLinkLabel}
                </Link>
                {checkoutText.preInfoConsentAfter}
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrors((prev) => ({ ...prev, note: undefined }));
                }}
                className="mt-0.5 size-4 shrink-0 rounded accent-gold-500"
              />
              <span>
                <Link
                  href="/mesafeli-satis"
                  target="_blank"
                  className="text-gold-700 underline underline-offset-2 dark:text-gold-400"
                >
                  {checkoutText.termsLinkLabel}
                </Link>
                {checkoutText.termsConsentBetween}{' '}
                <Link
                  href="/gizlilik"
                  target="_blank"
                  className="text-gold-700 underline underline-offset-2 dark:text-gold-400"
                >
                  {checkoutText.privacyLinkLabel}
                </Link>
                {checkoutText.termsConsentAfter}
              </span>
            </label>
          </div>
          {errors.note && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.note}</p>
          )}

          {serverError && (
            <p
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/8 p-3 text-xs leading-relaxed text-red-700 dark:text-red-300"
            >
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.2} />
              {serverError}
            </p>
          )}

          <Button type="submit" variant="gold" size="lg" className="mt-5 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-olive-950/30 border-t-olive-950" />
                {checkoutText.submitting}
              </>
            ) : (
              <>
                <ShieldCheck className="size-5" strokeWidth={2} />
                {checkoutText.submit}
              </>
            )}
          </Button>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-muted-foreground/70">
            {['VISA', 'MASTER', 'TROY', 'AMEX', '3D'].map((label) => (
              <PaymentMark key={label} label={label} className="h-6 w-10" />
            ))}
          </div>

          <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-muted-foreground">
            {site.paymentProvider.note} {checkoutText.cardStorageNote}
          </p>
        </div>
      </aside>
    </form>
  );
}
