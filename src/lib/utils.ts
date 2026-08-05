import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Koşullu sınıfları birleştirir ve çakışan Tailwind kurallarını sadeleştirir. */
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

/** İndirim yüzdesini tam sayıya yuvarlar. 0 dönerse etiket gösterilmez. */
export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Türkçe karakterleri koruyan güvenli slug üretimi. */
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
 * next/image için hafif bir blur placeholder.
 * Krem tonlu düz bir SVG — görsel yüklenene kadar zemin boşluğu titremez.
 */
export function blurDataURL(tone: 'cream' | 'olive' = 'cream') {
  const color = tone === 'cream' ? '%23efe7d8' : '%233a4630';
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='${color}'/%3E%3C/svg%3E`;
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

/** Unsplash görsellerini sabit en–boy oranı ve kalite ile ister. */
export function unsplash(id: string, w = 1200, h = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
