import type { NavItem } from '@/types';

export const site = {
  name: 'Karabesimoğlu Zeytincilik',
  legalName: 'Karabesimoğlu Zeytincilik Tarım Ürünleri Ltd. Şti.',
  tagline: 'Doğadan Sofranıza Gerçek Zeytinyağı',
  description:
    'Ege’nin asırlık zeytinliklerinden, dalından özenle toplanan zeytinlerle soğuk sıkım üretilen naturel sızma zeytinyağı ve sofralık zeytin çeşitleri.',
  url: 'https://karabesimoglu.com',
  locale: 'tr_TR',
  founded: 1889,
  phone: '+90 232 555 04 12',
  phoneHref: 'tel:+902325550412',
  whatsapp: '+90 532 555 04 12',
  whatsappHref: 'https://wa.me/905325550412',
  email: 'merhaba@karabesimoglu.com',
  address: {
    street: 'Ortaköy Mah. Hasat Cad. No: 12',
    district: 'Orhangazi',
    city: 'Bursa',
    postalCode: '16800',
    country: 'Türkiye',
  },
  mapEmbed:
    'https://www.google.com/maps?q=Ortak%C3%B6y%2C%20Orhangazi%2C%20Bursa&z=13&output=embed',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
  },
  /** Ücretsiz kargo eşiği (TL) */
  freeShippingThreshold: 500,
  workingHours: 'Hafta içi 09:00 – 18:00 · Cumartesi 10:00 – 15:00',

  /**
   * Ticari künye — 6563 sayılı Elektronik Ticaret Kanunu ve Mesafeli
   * Sözleşmeler Yönetmeliği uyarınca sitede erişilebilir olmalıdır.
   * Ödeme kuruluşu başvurularında da bu bilgiler doğrulanır.
   *
   * ⚠ Aşağıdaki değerleri kendi ticari kayıtlarınızla değiştirin.
   */
  legal: {
    taxOffice: 'Orhangazi Vergi Dairesi',
    taxNumber: '0000000000',
    mersis: '0000000000000000',
    tradeRegistryNo: '00000',
    chamber: 'Bursa Ticaret ve Sanayi Odası',
    kepAddress: 'karabesimoglu@hs01.kep.tr',
  },

  /** Ödeme altyapısı — footer ve ödeme sayfasında belirtilir. */
  paymentProvider: {
    name: 'iyzico',
    url: 'https://www.iyzico.com',
    note: 'Ödeme işlemleri lisanslı ödeme kuruluşu iyzico altyapısı üzerinden gerçekleştirilir.',
  },
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
      { label: 'Teslimat ve Kargo', href: '/teslimat-ve-kargo' },
      { label: 'İade Politikası', href: '/iade-politikasi' },
      { label: 'Ön Bilgilendirme Formu', href: '/on-bilgilendirme-formu' },
      { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis' },
      { label: 'Gizlilik', href: '/gizlilik' },
      { label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { label: 'KVKK', href: '/kvkk' },
    ],
  },
];
