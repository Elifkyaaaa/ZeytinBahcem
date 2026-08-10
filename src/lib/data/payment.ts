/**
 * Ödeme yöntemleri — tek kaynak.
 *
 * Kimlikler veritabanındaki `payment_method` enum'ıyla birebir aynıdır
 * (`supabase/migrations/…_initial_schema.sql` → `create type payment_method
 * as enum ('card', 'transfer', 'cod')`). Böylece ödeme sayfasından gelen
 * değer hiçbir dönüştürme olmadan doğrudan veritabanına ve iyzico isteğine
 * yazılabiliyor.
 *
 * Yeni bir yöntem eklemek için: aşağıdaki listeye bir satır ekleyin ve aynı
 * kimliği veritabanı enum'ına da ekleyin. `PaymentMethod` tipi listeden
 * türetildiği için kullanan tüm dosyalar derleme anında uyarı verir —
 * eksik kalan bir yer sessizce geçmez.
 */

import type { PaymentMethodDb } from '@/types/database';

export const paymentMethods = [
  {
    id: 'card',
    /** Ödeme sayfasındaki seçenek başlığı */
    name: 'Kredi / Banka Kartı',
    /** Sipariş listesi gibi dar alanlarda kullanılan kısa ad */
    shortName: 'Kredi Kartı',
    detail: '3D Secure ile korumalı, tek çekim veya taksitli',
    /** Sipariş toplamına eklenen hizmet bedeli */
    surcharge: 0,
    /** Ara toplam üzerinden uygulanan indirim oranı */
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
 * `satisfies` yukarıda listedeki her kimliğin veritabanı enum'ında bulunmasını
 * güvence altına alır. Bu kayıt ise ters yönü denetler: enum'a yeni bir değer
 * eklenip liste güncellenmezse burada derleme hatası oluşur. İkisi birlikte,
 * iki tarafın birbirinden sessizce ayrılmasını engeller.
 */
export const paymentMethodByDbValue: Record<PaymentMethodDb, PaymentMethod> = {
  card: 'card',
  transfer: 'transfer',
  cod: 'cod',
};

/** Kimlikten kayda hızlı erişim — `paymentMethodMeta.transfer.shortName` gibi. */
export const paymentMethodMeta = Object.fromEntries(
  paymentMethods.map((m) => [m.id, m]),
) as Record<PaymentMethod, (typeof paymentMethods)[number]>;
