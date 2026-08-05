import type { NavItem } from '@/types';

export const site = {
  name: 'Zeytin Bahçem',
  legalName: 'Zeytin Bahçem Tarım Ürünleri Ltd. Şti.',
  tagline: 'Doğadan Sofranıza Gerçek Zeytinyağı',
  description:
    'Ege’nin asırlık zeytinliklerinden, dalından özenle toplanan zeytinlerle soğuk sıkım üretilen naturel sızma zeytinyağı ve sofralık zeytin çeşitleri.',
  url: 'https://zeytinbahcem.com',
  locale: 'tr_TR',
  founded: 1963,
  phone: '+90 232 555 04 12',
  phoneHref: 'tel:+902325550412',
  whatsapp: '+90 532 555 04 12',
  whatsappHref: 'https://wa.me/905325550412',
  email: 'merhaba@zeytinbahcem.com',
  address: {
    street: 'Zeytinlik Mah. Hasat Cad. No: 12',
    district: 'Ayvalık',
    city: 'Balıkesir',
    postalCode: '10400',
    country: 'Türkiye',
  },
  mapEmbed:
    'https://www.google.com/maps?q=Ayval%C4%B1k%2C%20Bal%C4%B1kesir&z=13&output=embed',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
  },
  /** Ücretsiz kargo eşiği (TL) */
  freeShippingThreshold: 500,
  workingHours: 'Hafta içi 09:00 – 18:00 · Cumartesi 10:00 – 15:00',
} as const;

export const mainNav: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/iletisim' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Kurumsal',
    items: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Kurumsal', href: '/kurumsal' },
      { label: 'Blog', href: '/blog' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
  {
    title: 'Müşteri Hizmetleri',
    items: [
      { label: 'Sipariş Takibi', href: '/siparis-takibi' },
      { label: 'İade Politikası', href: '/iade-politikasi' },
      { label: 'Mesafeli Satış', href: '/mesafeli-satis' },
      { label: 'Gizlilik', href: '/gizlilik' },
      { label: 'KVKK', href: '/kvkk' },
    ],
  },
];
