/**
 * Sepet, iletişim formu ve çerez bandı metinleri.
 *
 * KVKK onay cümleleri bağlantı içerdiği için parçalara bölünmüştür; bileşen
 * bunları `{' '}` ile birleştirir. Cümleyi değiştirirken parçaların sırasını
 * koruyun.
 */

import { commonText } from '@/lib/data/text/layout';

export const cartText = {
  emptyTitle: 'Sepetiniz henüz boş',
  emptyBody:
    'Ege’nin asırlık bahçelerinden gelen zeytinyağlarımıza ve doğal salamura zeytinlerimize göz atın.',
  emptyCta: commonText.browseProducts,
  freeShippingReached: 'Kargonuz ücretsiz — tebrikler!',
  clearCart: 'Sepeti boşalt',
  clearedToast: 'Sepet boşaltıldı',
  continueShopping: 'Alışverişe Devam Et',
  summaryHeading: 'Sipariş Özeti',
  discountLabel: 'İndirim',
  freeLabel: 'Ücretsiz',
  checkoutCta: 'Ödemeye Geç',
  removeCouponLabel: 'Kuponu kaldır',
  couponPlaceholder: 'Örn. HASAT10',
  couponAppliedToast: 'Kupon uygulandı',
  couponRemovedToast: 'Kupon kaldırıldı',
  /** Ücretsiz kargoya kalan tutar cümlesi; tutar araya girer */
  freeShippingBefore: 'Ücretsiz kargoya',
  freeShippingAfter: 'kaldı',
  itemsHeading: 'Ürünler',
  itemCount: (count: number) => `(${count} kalem)`,
  removeItemLabel: (name: string) => `${name} ürününü sil`,
  /** Özetin altındaki güven rozetleri — sıra ekrandaki sırayla aynı */
  trustNotes: [
    '256-bit SSL ile güvenli ödeme',
    '14 gün koşulsuz iade',
    'Aynı gün kargoya teslim',
  ],
} as const;

export const contactFormText = {
  sentTitle: 'Mesajınız alındı',
  /** Onay cümlesi e-posta adresini araya alır */
  sentBefore: 'En geç bir iş günü içinde',
  sentAfter: 'adresine dönüş yapacağız.',
  newMessage: 'Yeni mesaj gönder',
  phoneHint: 'İsteğe bağlı',
  messageLabel: 'Mesajınız',
  messagePlaceholder: 'Size nasıl yardımcı olabiliriz?',
  consentBefore: 'Kişisel verilerimin',
  consentLinkLabel: 'KVKK Aydınlatma Metni',
  consentAfter: 'kapsamında, yalnızca bu talebe yanıt vermek amacıyla işlenmesini kabul ediyorum.',
  submitCta: 'Mesajı Gönder',
} as const;

export const cookieConsentText = {
  regionLabel: 'Çerez tercihi',
  bodyBefore:
    'Sepet ve oturum işlevleri için zorunlu çerezler kullanıyoruz. İsteğe bağlı istatistik çerezleri yalnızca onayınızla çalışır. Ayrıntılar',
  policyLinkLabel: 'Çerez Politikası',
  bodyAfter: 'sayfamızda.',
  necessaryOnly: 'Yalnızca zorunlu',
} as const;

export const quantityStepperText = {
  decreaseLabel: 'Adet azalt',
  increaseLabel: 'Adet artır',
} as const;
