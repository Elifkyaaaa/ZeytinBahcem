/**
 * Çerçeve bileşenlerinin metinleri: başlık, mobil menü, arama, sepet çekmecesi,
 * alt bilgi ve yüzen düğmeler.
 *
 * `commonText` birden fazla bileşende geçen ifadeler içindir. Giriş/çıkış gibi
 * eylemler hem masaüstü menüsünde hem mobil menüde göründüğü için, aynı
 * eylemin iki yerde farklı yazılmasını bu paylaşılan blok engelliyor.
 */

export const commonText = {
  signIn: 'Giriş Yap',
  signUp: 'Üye Ol',
  signOut: 'Çıkış Yap',
  account: 'Hesabım',
  adminPanel: 'Yönetim Paneli',
  browseProducts: 'Ürünleri İncele',
} as const;

export const headerText = {
  navLabel: 'Ana menü',
  searchLabel: 'Ürün ara',
  openMenuLabel: 'Menüyü aç',
} as const;

export const mobileMenuText = {
  regionLabel: 'Mobil menü',
  closeLabel: 'Menüyü kapat',
  /** Yönetim bağlantısının kısa başlığı — mobilde yer dar */
  adminShort: 'Yönetim',
} as const;

export const userMenuText = {
  menuLabel: 'Hesap menüsü',
} as const;

export const searchOverlayText = {
  regionLabel: 'Ürün arama',
  closeLabel: 'Aramayı kapat',
  placeholder: 'Zeytinyağı, sofralık zeytin, hediye seti…',
  emptyHint: 'Farklı bir kelime deneyin veya kategorilere göz atın.',
  popularHeading: 'Popüler aramalar',
} as const;

export const cartDrawerText = {
  /** Ücretsiz kargoya kalan tutar cümlesi; tutar araya kalın yazıyla girer */
  freeShippingBefore: 'Ücretsiz kargoya',
  freeShippingAfter: 'kaldı',
  emptyTitle: 'Sepetiniz boş',
  emptyBody: 'Ege’nin en iyi zeytinyağlarını keşfetmeye ne dersiniz?',
  emptyCta: commonText.browseProducts,
  totalsNote: 'Kargo ve indirimler ödeme adımında hesaplanır.',
  checkoutCta: 'Ödemeye Geç',
  viewCartCta: 'Sepeti Görüntüle',
} as const;

export const footerText = {
  contactHeading: 'İletişim',
  legalTitleLabel: 'Ünvan',
  mersisLabel: 'MERSİS No',
} as const;

export const floatingActionsText = {
  backToTopLabel: 'Sayfanın başına dön',
  whatsappLabel: 'WhatsApp üzerinden yazın',
} as const;
