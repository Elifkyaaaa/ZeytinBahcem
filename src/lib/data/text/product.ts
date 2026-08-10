/**
 * Ürün listesi, kartı, galerisi, satın alma paneli ve sekmelerinin metinleri.
 *
 * Sayı veya ürün adı içeren ifadeler dize birleştirme yerine parametreli
 * fonksiyon olarak duruyor; böylece cümlenin tamamı — sıralaması dahil —
 * bu dosyada kalıyor.
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
  /** Sepete eklendikten sonra düğmede kısa süre görünen onay */
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
  /** Fiyatın altındaki üç güvence rozeti — ekrandaki sırayla */
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
  /** Besin değerleri girişi "100 g" ibaresini kalın yazıyla araya alır */
  nutritionIntroBefore: 'Aşağıdaki değerler',
  nutritionPortion: '100 g',
  nutritionIntroAfter:
    'ürün içindir. Yüzdeler, günlük 8400 kJ / 2000 kcal referans alım değerine göre hesaplanmıştır.',
  nutritionColumn: 'Besin öğesi',
  nutritionFootnote:
    'RA: Referans alım. Değerler hasat sezonuna göre küçük farklılıklar gösterebilir.',
  /** Kargo seçenekleri — ücretsiz kargo eşiği çalışma anında yerleşir */
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
  /** SSS altındaki iletişim satırı bağlantıyı araya alır */
  faqContactBefore: 'Başka bir sorunuz mu var?',
  whatsappCta: 'WhatsApp’tan yazın',
  faqContactAfter: ', ortalama 12 dakikada dönüyoruz.',
} as const;
