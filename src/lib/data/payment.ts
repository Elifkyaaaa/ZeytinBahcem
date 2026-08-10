/**
 * Payment methods — the single source of truth.
 *
 * The ids match the database `payment_method` enum exactly
 * (`supabase/migrations/…_initial_schema.sql` → `create type payment_method
 * as enum ('card', 'transfer', 'cod')`), so the value chosen on the checkout
 * page goes straight into the database and the iyzico request with no
 * translation step.
 *
 * To add a method: add a row below and add the same id to the database enum.
 * `PaymentMethod` is derived from this list, so every consumer fails to
 * compile until it handles the new value — nothing slips through silently.
 */

import type { PaymentMethodDb } from '@/types/database';

export const paymentMethods = [
  {
    id: 'card',
    /** Option heading on the checkout page */
    name: 'Kredi / Banka Kartı',
    /** Short name for tight spaces such as the order list */
    shortName: 'Kredi Kartı',
    detail: '3D Secure ile korumalı, tek çekim veya taksitli',
    /** Service fee added to the order total */
    surcharge: 0,
    /** Discount rate applied to the subtotal */
    discountRate: 0,
  },
  {
    id: 'transfer',
    name: 'Havale / EFT',
    shortName: 'Havale',
    detail: 'Havale ile ödemelerde %3 ek indirim',
    surcharge: 0,
    discountRate: 0.03,
  },
  {
    id: 'cod',
    name: 'Kapıda Ödeme',
    shortName: 'Kapıda Ödeme',
    detail: 'Teslimatta nakit veya kart · 39,90 ₺ hizmet bedeli',
    surcharge: 39.9,
    discountRate: 0,
  },
] as const satisfies readonly {
  id: PaymentMethodDb;
  name: string;
  shortName: string;
  detail: string;
  surcharge: number;
  discountRate: number;
}[];

export type PaymentMethod = (typeof paymentMethods)[number]['id'];

/**
 * The `satisfies` above guarantees every id in the list exists in the database
 * enum. This record checks the other direction: if a value is added to the
 * enum but not to the list, compilation fails here. Together they stop the two
 * sides drifting apart unnoticed.
 */
export const paymentMethodByDbValue: Record<PaymentMethodDb, PaymentMethod> = {
  card: 'card',
  transfer: 'transfer',
  cod: 'cod',
};

/** Lookup by id, e.g. `paymentMethodMeta.transfer.shortName`. */
export const paymentMethodMeta = Object.fromEntries(
  paymentMethods.map((m) => [m.id, m]),
) as Record<PaymentMethod, (typeof paymentMethods)[number]>;
