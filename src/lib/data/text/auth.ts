/**
 * Copy for the sign-in, sign-up and two-factor screens.
 *
 * The legal consent sentences contain two links each, so they are split into
 * parts that the component joins in order.
 */

import { commonText } from '@/lib/data/text/layout';

export const formPartsText = {
  showPassword: 'Şifreyi göster',
  hidePassword: 'Şifreyi gizle',
} as const;

export const loginFormText = {
  passwordLabel: 'Şifre',
  forgotPassword: 'Şifremi unuttum',
  rememberMe: 'Beni hatırla',
  submit: commonText.signIn,
  /** Messages keyed by the error code in the address bar */
  errors: {
    'dogrulama-basarisiz': 'Doğrulama bağlantısı geçersiz veya süresi dolmuş. Yeniden deneyin.',
    'supabase-yapilandirilmadi': 'Kimlik doğrulama henüz yapılandırılmadı.',
  } as Record<string, string | undefined>,
  consentBefore: 'Giriş yaparak',
  privacyLinkLabel: 'Gizlilik Politikası',
  consentBetween: 've',
  kvkkLinkLabel: 'KVKK Aydınlatma Metni',
  consentAfter: '’ni kabul etmiş olursunuz.',
} as const;

export const registerFormText = {
  noEmailHeading: 'E-posta gelmedi mi?',
  noEmailBefore: 'Spam klasörünü kontrol edin. Birkaç dakika içinde ulaşmazsa',
  noEmailLinkLabel: 'giriş sayfasından',
  noEmailAfter: 'yeniden gönderebilirsiniz.',
  backToLogin: 'Giriş Sayfasına Dön',
  namePlaceholder: 'Adınız ve soyadınız',
  phoneLabel: 'Telefon',
  phoneHint: 'Kargo bilgilendirmesi için kullanılır',
  passwordLabel: 'Şifre',
  passwordHint: 'En az 8 karakter',
  passwordConfirmLabel: 'Şifre Tekrar',
  termsLinkLabel: 'Üyelik Sözleşmesi',
  consentBetween: 've',
  kvkkLinkLabel: 'KVKK Aydınlatma Metni',
  consentAfter: '’ni okudum, onaylıyorum.',
  marketingOptIn: 'Kampanya ve yeni hasat duyurularından e-posta ile haberdar olmak istiyorum.',
  submit: commonText.signUp,
} as const;

export const mfaChallengeText = {
  intro:
    'Doğrulayıcı uygulamanızı açın ve hesabınız için görünen 6 haneli kodu girin. Kod 30 saniyede bir yenilenir.',
  codeLabel: 'Doğrulama kodu',
  submit: 'Doğrula ve Devam Et',
  startError: 'Doğrulama başlatılamadı. Sayfayı yenileyip tekrar deneyin.',
  wrongCode: 'Kod hatalı veya süresi dolmuş. Uygulamadaki güncel kodu girin.',
} as const;
