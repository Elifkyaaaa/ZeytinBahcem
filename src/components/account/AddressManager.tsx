'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import {
  deleteAddress,
  saveAddress,
  setDefaultAddress,
  type ActionState,
} from '@/app/(shop)/hesap/actions';
import { AuthField, FormAlert, SubmitButton, authInput } from '@/components/auth/FormParts';
import { Badge } from '@/components/ui/Badge';
import { cities, cityNames } from '@/lib/data/cities';
import { cn } from '@/lib/utils';
import type { AddressRow } from '@/types/database';

const initialState: ActionState = {};

function AddressForm({
  address,
  defaultName,
  defaultPhone,
  onDone,
}: {
  address?: AddressRow;
  defaultName: string;
  defaultPhone: string;
  onDone: () => void;
}) {
  const [state, formAction] = useActionState(saveAddress, initialState);
  const [city, setCity] = useState(address?.city ?? '');
  const districts = city ? (cities[city] ?? []) : [];

  // Kaydetme başarılıysa formu kapat.
  if (state.success) {
    queueMicrotask(onDone);
  }

  return (
    <form action={formAction} className="space-y-5">
      {address && <input type="hidden" name="id" value={address.id} />}
      <FormAlert error={state.error} success={state.success} />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField label="Adres başlığı" id="title" hint="Örn. Ev, İş">
          <input
            id="title"
            name="title"
            defaultValue={address?.title ?? 'Ev'}
            className={authInput}
          />
        </AuthField>

        <AuthField label="Ad Soyad" id="fullName">
          <input
            id="fullName"
            name="fullName"
            required
            minLength={3}
            defaultValue={address?.full_name ?? defaultName}
            className={authInput}
          />
        </AuthField>

        <AuthField label="Telefon" id="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            defaultValue={address?.phone ?? defaultPhone}
            placeholder="0 5xx xxx xx xx"
            className={authInput}
          />
        </AuthField>

        <AuthField label="Posta kodu" id="postalCode">
          <input
            id="postalCode"
            name="postalCode"
            inputMode="numeric"
            defaultValue={address?.postal_code ?? ''}
            className={authInput}
          />
        </AuthField>

        <AuthField label="İl" id="city">
          <select
            id="city"
            name="city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={authInput}
          >
            <option value="">İl seçin</option>
            {cityNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </AuthField>

        <AuthField label="İlçe" id="district">
          <select
            id="district"
            name="district"
            required
            defaultValue={address?.district ?? ''}
            disabled={!city}
            className={cn(authInput, 'disabled:opacity-55')}
          >
            <option value="">{city ? 'İlçe seçin' : 'Önce il seçin'}</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </AuthField>

        <AuthField label="Açık adres" id="address" className="sm:col-span-2">
          <textarea
            id="address"
            name="address"
            required
            minLength={10}
            rows={3}
            defaultValue={address?.address ?? ''}
            placeholder="Mahalle, cadde, sokak, bina ve daire numarası"
            className={cn(authInput, 'h-auto resize-y py-3')}
          />
        </AuthField>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.is_default ?? false}
          className="size-4 rounded accent-gold-500"
        />
        Varsayılan teslimat adresim olsun
      </label>

      <div className="flex flex-wrap gap-3">
        <SubmitButton className="sm:w-auto sm:px-10">
          {address ? 'Adresi Güncelle' : 'Adresi Kaydet'}
        </SubmitButton>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-medium transition-colors hover:border-gold-500/50"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}

export function AddressManager({
  addresses,
  defaultName,
  defaultPhone,
}: {
  addresses: AddressRow[];
  defaultName: string;
  defaultPhone: string;
}) {
  const [mode, setMode] = useState<{ kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: string }>(
    { kind: 'list' },
  );

  const editing =
    mode.kind === 'edit' ? addresses.find((a) => a.id === mode.id) : undefined;

  return (
    <>
      <AnimatePresence mode="wait">
        {mode.kind === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl text-foreground">
                Kayıtlı Adresler
                <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
                  ({addresses.length})
                </span>
              </h2>
              <button
                onClick={() => setMode({ kind: 'new' })}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950"
              >
                <Plus className="size-4" strokeWidth={2.4} />
                Yeni Adres
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
                <span className="grid size-16 place-items-center rounded-full bg-surface-muted">
                  <MapPin className="size-7 text-muted-foreground" strokeWidth={1.3} />
                </span>
                <h3 className="mt-5 font-serif text-xl text-foreground">Kayıtlı adresiniz yok</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Adres eklediğinizde ödeme adımında tek dokunuşla seçebilirsiniz.
                </p>
                <button
                  onClick={() => setMode({ kind: 'new' })}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 px-7 text-sm font-semibold text-olive-950 transition-all hover:shadow-glow active:scale-95"
                >
                  <Plus className="size-4" strokeWidth={2.4} />
                  İlk Adresimi Ekle
                </button>
              </div>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className={cn(
                      'relative rounded-2xl border bg-surface p-5 shadow-soft transition-all duration-400 hover:shadow-lift',
                      address.is_default ? 'border-gold-500/50' : 'border-border',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-foreground">{address.title}</h3>
                          {address.is_default && (
                            <Badge tone="gold">
                              <Star className="size-3 fill-current" strokeWidth={0} />
                              Varsayılan
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-foreground/85">{address.full_name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{address.phone}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => setMode({ kind: 'edit', id: address.id })}
                          aria-label={`${address.title} adresini düzenle`}
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                        >
                          <Pencil className="size-4" strokeWidth={1.9} />
                        </button>
                        <form action={deleteAddress}>
                          <input type="hidden" name="id" value={address.id} />
                          <button
                            type="submit"
                            aria-label={`${address.title} adresini sil`}
                            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                          >
                            <Trash2 className="size-4" strokeWidth={1.9} />
                          </button>
                        </form>
                      </div>
                    </div>

                    <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                      {address.address}
                      <br />
                      {address.district} / {address.city}
                      {address.postal_code ? ` · ${address.postal_code}` : ''}
                    </p>

                    {!address.is_default && (
                      <form action={setDefaultAddress} className="mt-4">
                        <input type="hidden" name="id" value={address.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 underline-offset-4 transition-colors hover:underline dark:text-gold-400"
                        >
                          <Check className="size-3.5" strokeWidth={2.6} />
                          Varsayılan yap
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.section
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl text-foreground">
                {editing ? 'Adresi Düzenle' : 'Yeni Adres'}
              </h2>
              <button
                onClick={() => setMode({ kind: 'list' })}
                aria-label="Formu kapat"
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
              >
                <X className="size-5" strokeWidth={1.9} />
              </button>
            </div>

            <AddressForm
              address={editing}
              defaultName={defaultName}
              defaultPhone={defaultPhone}
              onDone={() => setMode({ kind: 'list' })}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
