/**
 * Copy for the product list, card, gallery, purchase panel and tabs.
 *
 * Phrases that contain a number or a product name are parameterised functions
 * rather than string concatenation, so the whole sentence — word order
 * included — stays in this file.
 */

export const productBrowserText = {
  heading: 'Tüm Ürünler',
  searchHeading: 'Ürün ara',
  searchPlaceholder: 'İsim veya açıklamada ara…',
  searchLabel: 'Ürünlerde ara',
  maxPriceHeading: 'Üst fiyat',
  maxPriceLabel: 'En yüksek fiyat',
  otherHeading: 'Diğer',
  inStockOnly: 'Yalnızca stoktakiler',
  discountedOnly: 'İndirimli ürünler',
  sortHeading: 'Sıralama',
  countSuffix: 'ürün listeleniyor',
  showResults: (count: number) => `${count} ürünü göster`,
  emptyTitle: 'Sonuç bulunamadı',
  emptyBody: 'Filtreleri gevşetmeyi veya farklı bir kelime denemeyi öneririz.',
} as const;

export const productCardText = {
  discountBadge: (percent: number) => `%${percent} İNDİRİM`,
  lowStockBadge: (count: number) => `Son ${count} ürün`,
  addToWishlist: 'Favorilere ekle',
  removeFromWishlist: 'Favorilerden çıkar',
  addedToast: 'Favorilere eklendi',
  removedToast: 'Favorilerden çıkarıldı',
  addToCart: 'Sepete Ekle',
  outOfStock: 'Stokta Yok',
  /** Brief confirmation shown on the button after adding to the cart */
  added: 'Eklendi',
  addedToCartToast: 'Sepete eklendi',
} as const;

export const productGalleryText = {
  imageAlt: (name: string, index: number) => `${name} — görsel ${index}`,
  zoomedAlt: (name: string, index: number) => `${name} — büyütülmüş görsel ${index}`,
  hoverHint: 'Yakınlaştırmak için üzerine gelin',
  touchHint: 'Büyütmek için dokunun',
  openFullscreen: 'Görseli tam ekran aç',
  previous: 'Önceki görsel',
  next: 'Sonraki görsel',
  thumbLabel: (index: number) => `${index}. görseli göster`,
  dotLabel: (index: number) => `${index}. görsel`,
  galleryLabel: (name: string) => `${name} görselleri`,
} as const;

export const productPurchaseText = {
  lowStock: (count: number) => `Son ${count} ürün`,
  reviewCount: (count: number) => `${count} değerlendirme`,
  sku: (code: string) => `Ürün kodu: ${code}`,
  vatNote: 'KDV dâhil · Kargo ödemede hesaplanır',
  outOfStock: 'Tükendi',
  buyNow: 'Hemen Satın Al',
  share: 'Paylaş',
  shareWhatsapp: 'WhatsApp’ta paylaş',
  shareFacebook: 'Facebook’ta paylaş',
  copyLink: 'Bağlantıyı kopyala',
  viewCart: 'Sepeti Görüntüle',
  /** The three assurance badges under the price, in screen order */
  assurances: [
    { text: 'Ücretsiz kargo', hint: (threshold: number) => `${threshold} ₺ üzeri` },
    { text: '14 gün iade', hint: () => 'Koşulsuz' },
    { text: 'Güvenli ödeme', hint: () => '3D Secure' },
  ],
} as const;

export const productTabsText = {
  tabsLabel: 'Ürün bilgisi sekmeleri',
  panelLabel: 'Ürün detayları',
  tabs: {
    aciklama: 'Ürün Açıklaması',
    besin: 'Besin Değerleri',
    kargo: 'Kargo Bilgisi',
    yorumlar: 'Yorumlar',
    sss: 'Sık Sorulan Sorular',
  },
  highlightsHeading: 'Öne çıkan özellikler',
  specsHeading: 'Ürün künyesi',
  /** The nutrition intro wraps "100 g" in bold in the middle of the sentence */
  nutritionIntroBefore: 'Aşağıdaki değerler',
  nutritionPortion: '100 g',
  nutritionIntroAfter:
    'ürün içindir. Yüzdeler, günlük 8400 kJ / 2000 kcal referans alım değerine göre hesaplanmıştır.',
  nutritionColumn: 'Besin öğesi',
  nutritionFootnote:
    'RA: Referans alım. Değerler hasat sezonuna göre küçük farklılıklar gösterebilir.',
  /** Shipping options; the free shipping threshold is filled in at runtime */
  shippingOptions: [
    {
      title: 'Standart Kargo',
      detail: '1–3 iş günü',
      price: (threshold: number) => `${threshold} ₺ üzeri ücretsiz, altında 79,90 ₺`,
    },
    {
      title: 'Hızlı Kargo',
      detail: 'Ertesi iş günü',
      price: () => '149,90 ₺ — saat 14.00’a kadar verilen siparişlerde',
    },
    {
      title: 'Mağazadan Teslim',
      detail: 'Aynı gün',
      price: () => 'Ücretsiz — Orhangazi mağazamızdan',
    },
  ],
  packagingHeading: 'Paketleme',
  packagingNote:
    'Cam şişeler çift katmanlı köpük içinde, ayrı bölmeli kutularda gönderilir. Kırılma durumunda ürün ücretsiz olarak yenilenir. Dolgu malzemelerimizin tamamı geri dönüştürülebilir.',
  returnHeading: 'İade',
  returnNote:
    'Teslimattan itibaren 14 gün içinde, ambalajı açılmamış ürünlerde koşulsuz iade hakkınız vardır. İade kargo ücreti tarafımıza aittir. Detaylar için İade Politikası sayfamıza bakabilirsiniz.',
  reviewCount: (count: number) => `${count} değerlendirme`,
  verifiedPurchase: 'Doğrulanmış alışveriş',
  /** The contact line under the FAQ wraps around a link */
  faqContactBefore: 'Başka bir sorunuz mu var?',
  whatsappCta: 'WhatsApp’tan yazın',
  faqContactAfter: ', ortalama 12 dakikada dönüyoruz.',
} as const;
