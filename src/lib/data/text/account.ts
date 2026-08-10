/**
 * Copy for the customer area: profile, addresses, favourites, order tracking,
 * password change and two-factor setup.
 */

import { commonText } from '@/lib/data/text/layout';

export const accountNavText = {
  menuLabel: 'Hesap menüsü',
  signOut: commonText.signOut,
} as const;

export const addressManagerText = {
  titleLabel: 'Adres başlığı',
  titleHint: 'Örn. Ev, İş',
  cityLabel: 'İl',
  cityPlaceholder: 'İl seçin',
  districtLabel: 'İlçe',
  districtPlaceholder: 'İlçe seçin',
  districtDisabledPlaceholder: 'Önce il seçin',
  addressLabel: 'Açık adres',
  addressPlaceholder: 'Mahalle, cadde, sokak, bina ve daire numarası',
  makeDefault: 'Varsayılan teslimat adresim olsun',
  update: 'Adresi Güncelle',
  save: 'Adresi Kaydet',
  cancel: 'Vazgeç',
  listHeading: 'Kayıtlı Adresler',
  emptyTitle: 'Kayıtlı adresiniz yok',
  emptyBody: 'Adres eklediğinizde ödeme adımında tek dokunuşla seçebilirsiniz.',
  emptyCta: 'İlk Adresimi Ekle',
  defaultBadge: 'Varsayılan',
  setDefault: 'Varsayılan yap',
  editLabel: (title: string) => `${title} adresini düzenle`,
  editHeading: 'Adresi Düzenle',
  newHeading: 'Yeni Adres',
} as const;

export const favoritesText = {
  emptyTitle: 'Favori listeniz boş',
  emptyBody:
    'Beğendiğiniz ürünlerin kalp simgesine dokunun; buraya eklensin ve sonra kolayca bulun.',
  emptyCta: commonText.browseProducts,
  /** The count sits in bold in the middle of the sentence */
  countAfter: 'ürün favorilerinizde',
  clearAll: 'Tümünü kaldır',
} as const;

export const orderTrackerText = {
  steps: [
    { id: 'received', label: 'Sipariş alındı', detail: 'Ödemeniz onaylandı' },
    { id: 'preparing', label: 'Hazırlanıyor', detail: 'Ürünleriniz paketleniyor' },
    { id: 'shipped', label: 'Kargoda', detail: 'Kargo firmasına teslim edildi' },
  ],
  invalidOrderNo: 'Sipariş numarası ZB- ile başlamalıdır. Onay e-postanızda yer alır.',
  emailRequired: 'Siparişte kullandığınız e-posta adresini girin.',
  submit: 'Sipariş Sorgula',
  orderNoLabel: 'Sipariş numarası',
  orderNoHint: 'Örn. ZB-260804-0128',
  orderHeading: (orderNo: string) => `Sipariş ${orderNo}`,
  trackingNote: 'Kargo takip numarası, kargoya verildiğinde e-posta ile iletilir.',
  /** The help line contains two links, so it is split into parts */
  helpBefore: 'Siparişinizle ilgili bir sorun mu var?',
  whatsappCta: 'WhatsApp’tan yazın',
  helpBetween: 'veya',
  contactCta: 'iletişim formunu',
  helpAfter: 'kullanın.',
} as const;

export const passwordFormText = {
  /** Password strength labels, from weakest to strongest */
  strengthLabels: ['Çok zayıf', 'Zayıf', 'Orta', 'İyi', 'Güçlü'],
  currentLabel: 'Mevcut Şifre',
  newLabel: 'Yeni Şifre',
  confirmLabel: 'Yeni Şifre Tekrar',
  submit: 'Şifreyi Güncelle',
} as const;

export const profileFormText = {
  emailHint: 'E-posta adresi değiştirilemez. Değişiklik için bizimle iletişime geçin.',
  marketingOptIn: 'Kampanya ve yeni hasat duyurularından e-posta ile haberdar olmak istiyorum.',
  submit: 'Değişiklikleri Kaydet',
} as const;

export const supabaseNoticeText = {
  title: 'Hesap sistemi henüz bağlanmadı',
  /** Split because the sentence contains four inline code fragments */
  bodyBefore: 'Bu ekranlar Supabase’e bağlanmaya hazır durumda. Şema',
  migrationsPath: 'supabase/migrations',
  bodyMiddle: 'altında hazır;',
  envFile: '.env.local',
  bodyBeforeKeys: 'dosyasına',
  urlKey: 'NEXT_PUBLIC_SUPABASE_URL',
  keysBetween: 've',
  anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  bodyAfter: 'eklendiğinde giriş, sipariş geçmişi ve adres yönetimi canlıya geçer.',
} as const;

export const twoFactorText = {
  defaultFactorName: 'Doğrulayıcı uygulama',
  factorNamePrefix: 'Doğrulayıcı',
  qrError: 'QR kod oluşturulamadı.',
  challengeError: 'Doğrulama başlatılamadı.',
  wrongCode: 'Kod doğrulanamadı. Uygulamadaki güncel 6 haneli kodu girin.',
  enabledMessage: 'İki adımlı doğrulama etkinleştirildi.',
  disabledMessage: 'İki adımlı doğrulama kapatıldı.',
  removeError:
    'Kaldırılamadı. Bu işlem için oturumunuzun iki adımlı doğrulamadan geçmiş olması gerekir — çıkış yapıp kodla yeniden girin.',
  loading: 'Güvenlik ayarları okunuyor…',
  offTitle: 'İki adımlı doğrulama kapalı',
  offBody:
    'Etkinleştirdiğinizde giriş sırasında şifrenize ek olarak telefonunuzdaki doğrulayıcı uygulamanın ürettiği 6 haneli kod istenir. Şifreniz ele geçse bile hesabınıza girilemez.',
  enableCta: 'İki Adımlı Doğrulamayı Aç',
  appStepTitle: 'Doğrulayıcı uygulamayı açın',
  appStepBody:
    'Google Authenticator, Microsoft Authenticator veya Authy — hangisi kuruluysa. Yoksa uygulama mağazasından ücretsiz kurabilirsiniz.',
  qrAlt: 'İki adımlı doğrulama QR kodu',
  manualKeyHint: 'QR okutamıyorsanız bu anahtarı uygulamaya elle girin:',
  codeLabel: 'Doğrulama kodu',
  verifyCta: 'Doğrula ve Etkinleştir',
  cancel: 'Vazgeç',
  onTitle: 'İki adımlı doğrulama etkin',
  onBody: 'Girişte şifrenizin ardından doğrulayıcı uygulamanızdaki kod istenir.',
  remove: 'Kaldır',
  addDevice: 'Başka bir cihaz ekle',
} as const;
