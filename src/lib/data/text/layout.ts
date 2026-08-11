/**
 * Copy for the chrome: header, mobile menu, search, cart drawer, footer and
 * floating actions.
 *
 * `commonText` holds phrases used by more than one component. Actions such as
 * sign in and sign out appear in both the desktop and the mobile menu, and
 * this shared block stops the same action being worded differently in each.
 */

export const commonText = {
  signIn: 'Giriş Yap',
  signUp: 'Üye Ol',
  signOut: 'Çıkış Yap',
  account: 'Hesabım',
  adminPanel: 'Yönetim Paneli',
  browseProducts: 'Ürünleri İncele',
} as const;

export const logoText = {
  /** Accessible name for the mark, which links back to the home page */
  homeAriaLabel: (brand: string) => `${brand} — ana sayfa`,
} as const;

export const headerText = {
  navLabel: 'Ana menü',
  searchLabel: 'Ürün ara',
  openMenuLabel: 'Menüyü aç',
} as const;

export const mobileMenuText = {
  regionLabel: 'Mobil menü',
  closeLabel: 'Menüyü kapat',
  /** Short label for the admin link, because space is tight on mobile */
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
  /** Free-shipping-remaining sentence; the amount goes in the middle, in bold */
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
