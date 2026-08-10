/**
 * Ana sayfa bölümlerinin metinleri.
 *
 * UI bileşenlerinin içine doğrudan metin yazılmaz; kullanıcıya görünen her
 * ifade buradan okunur. Böylece bir cümleyi değiştirmek için bileşen dosyası
 * açılmaz ve aynı metin iki yerde farklı yazılmaz.
 *
 * Ürün, kategori, blog gibi alan verileri `@/lib/data` altındaki kendi
 * modüllerinde; burası yalnızca arayüz metni.
 */

export const heroText = {
  /** Bölümün erişilebilirlik adı — ekran okuyucu bunu duyurur */
  regionLabel: 'Giriş',
  badge: '1889’dan beri Orhangazi',
  /** Başlık kelime kelime animasyonlu açıldığı için dizi olarak tutulur */
  titleWords: ['Doğadan', 'Sofranıza', 'Gerçek', 'Zeytinyağı'],
  /** Yukarıdaki dizide altın renge boyanacak kelimenin sırası */
  accentWordIndex: 3,
  subtitle: 'Dalından özenle toplanan zeytinlerden soğuk sıkım olarak üretilmiştir.',
  primaryCta: 'Ürünleri İncele',
  secondaryCta: 'Hemen Sipariş Ver',
  trustMarks: ['Soğuk Sıkım', '%100 Doğal', 'Katkısız', 'Ücretsiz Kargo'],
  backgroundAlt: 'Orhangazi’de sabah güneşi altında sıra sıra uzanan asırlık zeytin ağaçları',
  portraitAlt:
    'Karabesimoğlu ailesinin kurucusu — zeytin dalıyla çekilmiş sepya portre, altında “Karabesimoğlu Zeytincilik · Since 1889” yazısı',
  portraitCaption: 'Kurucumuz · Beş kuşaktır aynı yamaçta',
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
  /** Nokta düğmelerinin erişilebilirlik adı — sıra numarasıyla birleşir */
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
  /** KVKK onay cümlesi bağlantı içerdiği için üç parçaya bölünmüştür */
  consentBefore: 'Kişisel verilerimin',
  consentLinkLabel: 'KVKK Aydınlatma Metni',
  consentAfter: 'kapsamında işlenmesini kabul ediyorum.',
} as const;
