import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges conditional classes and collapses conflicting Tailwind rules. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

const numberFormatter = new Intl.NumberFormat('tr-TR');

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Rounds the discount percentage. A result of 0 hides the badge. */
export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Safe slug generation that handles Turkish characters correctly. */
export function slugify(input: string) {
  const map: Record<string, string> = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
  };
  return input
    .toLowerCase()
    .replace(/[çğıİöşü]/g, (ch) => map[ch] ?? ch)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Lightweight blur placeholder for next/image: a flat cream SVG, so the
 * space does not flicker while the real image loads.
 */
export function blurDataURL(tone: 'cream' | 'olive' = 'cream') {
  const color = tone === 'cream' ? '%23efe7d8' : '%233a4630';
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='${color}'/%3E%3C/svg%3E`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

/**
 * `next/image` throws during render when it sees an unconfigured hostname,
 * taking the whole page down with a 500. URLs coming from the admin panel or
 * the database are outside our control (typed by hand, left over from an older
 * source), so they pass through here: an unrecognised address degrades to a
 * single broken thumbnail instead of killing the page.
 *
 * This list mirrors `next.config.ts` → `images.remotePatterns`; adding a
 * source there means adding it here too.
 */
const ALLOWED_IMAGE_HOSTS = [
  'res.cloudinary.com',
  'lh3.googleusercontent.com',
] as const;

/** Placeholder for broken records. We do not return an empty string:
 *  `next/image` throws on an empty `src` too, which would move the problem
 *  rather than fix it. */
export const IMAGE_FALLBACK = '/images/image-missing.svg';

export function safeImageSrc(src: string | null | undefined, fallback = IMAGE_FALLBACK): string {
  if (!src) return fallback;
  // Local paths and inline data URIs are always safe.
  if (src.startsWith('/') || src.startsWith('data:')) return src;

  try {
    const { hostname } = new URL(src);
    const allowed =
      ALLOWED_IMAGE_HOSTS.includes(hostname as (typeof ALLOWED_IMAGE_HOSTS)[number]) ||
      hostname.endsWith('.supabase.co');
    return allowed ? src : fallback;
  } catch {
    // Invalid URL — a broken record.
    return fallback;
  }
}

