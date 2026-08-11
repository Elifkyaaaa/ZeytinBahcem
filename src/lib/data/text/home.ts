/**
 * Copy for the home page sections.
 *
 * UI components never hold literal text: every user-visible phrase is read
 * from here. Changing a sentence does not mean opening a component, and the
 * same phrase cannot end up worded two different ways.
 *
 * Domain data (products, categories, posts) lives in its own modules under
 * `@/lib/data`; this file is interface copy only.
 */

export const heroText = {
  /** Accessible name for the section, announced by screen readers */
  regionLabel: 'Giriş',
  badge: '1889’dan beri Orhangazi',
  /** Kept as an array because the heading animates in word by word */
  titleWords: ['Doğadan', 'Sofranıza', 'Gerçek', 'Zeytinyağı'],
  /** Index of the word in the array above that gets the gold treatment */
  accentWordIndex: 3,
  subtitle: 'Dalından özenle toplanan zeytinlerden soğuk sıkım olarak üretilmiştir.',
  primaryCta: 'Ürünleri İncele',
  secondaryCta: 'Hemen Sipariş Ver',
  trustMarks: ['Soğuk Sıkım', '%100 Doğal', 'Katkısız', 'Ücretsiz Kargo'],
  branchAlt: 'Mavi gökyüzüne uzanan zeytin dalları ve olgunlaşmakta olan yeşil zeytinler',
  groveAlt:
    'Güneşin altında denize bakan zeytinlik; kenarlarda zeytin dalları, aşağıda taş bir seki',
  /** Sits under the brand name in the hero's brand panel */
  brandTagline: 'Olive & Gift · From Olive Trees, With Love.',
  scrollLabel: 'Keşfet',
  scrollAriaLabel: 'Aşağı kaydır',
} as const;

export const categoriesText = {
  eyebrow: 'Koleksiyon',
  title: 'Her Sofraya Bir Zeytin Hikâyesi',
  description:
    'Aynı bahçenin farklı yüzleri. Hasat zamanı, sıkım yöntemi ve olgunlaştırma süresi değiştikçe ortaya bambaşka karakterler çıkıyor.',
  cardCta: 'Ürünleri gör',
} as const;

export const featuredProductsText = {
  eyebrow: 'Öne Çıkanlar',
  title: 'Bu Sezonun Favorileri',
  description:
    'En çok tercih edilen ürünlerimiz. Her biri kendi bahçesinden, kendi hikâyesiyle geliyor.',
  allCta: 'Tümünü Gör',
} as const;

export const whyUsText = {
  eyebrow: 'Neden Biz?',
  title: 'Bir Buçuk Asırlık Bir Alışkanlık: Kestirmeden Gitmemek',
  description:
    'Zeytinyağı üretiminde hızlandırılabilecek çok adım var. Biz bir buçuk asırdır hiçbirini hızlandırmıyoruz.',
} as const;

export const videoText = {
  regionLabel: 'Hasat filmi',
  posterAlt: 'Hasat sırasında kasalara toplanan zeytinler ve ayıklama yapan eller',
  playLabel: 'Hasat filmini oynat',
  closeLabel: 'Videoyu kapat',
  frameTitle: 'Zeytin hasadı filmi',
  eyebrow: 'Bahçeden',
  title: 'Bir Sezon, Üç Hafta, Tek Bir Amaç',
  description:
    'Ekim sabahlarında başlayan hasadın, akşam sıkıma girene kadar geçtiği yolu izleyin.',
} as const;

export const testimonialsText = {
  eyebrow: 'Müşteri Yorumları',
  title: 'On İki Binden Fazla Sofrada',
  description: 'Ürünlerimizi deneyen müşterilerimizin kendi cümleleri.',
  previousLabel: 'Önceki yorum',
  nextLabel: 'Sonraki yorum',
  dotsLabel: 'Yorum seçimi',
  /** Accessible name for the dot buttons, combined with the slide number */
  dotLabel: (index: number) => `${index}. yorum`,
} as const;

export const blogSectionText = {
  eyebrow: 'Blog',
  title: 'Zeytinin Peşinde',
  description: 'Üretimden mutfağa, bahçeden sofraya — bildiklerimizi paylaşıyoruz.',
  allCta: 'Tüm Yazılar',
  readCta: 'Devamını Oku',
} as const;

export const instagramText = {
  eyebrow: 'Instagram',
  titlePrefix: 'Bahçeden Kareler',
  description: 'Hasat sabahları, sıkım günleri ve uzun sofralar — hepsi profilimizde.',
} as const;

export const newsletterText = {
  regionLabel: 'E-bülten',
  title: 'Kampanyaları Kaçırmayın',
  description:
    'Yeni hasat duyuruları, sınırlı üretim serileri ve aboneye özel indirimler — ayda en fazla iki e-posta.',
  emailPlaceholder: 'ornek@eposta.com',
  submitCta: 'Abone Ol',
  invalidEmail: 'Lütfen geçerli bir e-posta adresi girin.',
  successTitle: 'Aramıza hoş geldiniz.',
  successBody: 'İlk bültenimiz kısa süre içinde kutunuzda olacak.',
  /** The consent sentence contains a link, so it is split into three parts */
  consentBefore: 'Kişisel verilerimin',
  consentLinkLabel: 'KVKK Aydınlatma Metni',
  consentAfter: 'kapsamında işlenmesini kabul ediyorum.',
} as const;
