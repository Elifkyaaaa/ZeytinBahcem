/**
 * Ödeme sayfasının metinleri.
 *
 * Doğrulama mesajları `validation` altında alan adına göre toplanmıştır;
 * bileşen artık her kural için ayrı bir dize taşımıyor.
 *
 * Yasal onay cümleleri iki bağlantı içerdiği için parçalıdır. Mesafeli
 * Satış ve Ön Bilgilendirme onayları mevzuat gereği ayrı kutulardır —
 * metinleri birleştirmeyin.
 */

import { commonText } from '@/lib/data/text/layout';

export const checkoutText = {
  validation: {
    firstName: 'Adınızı girin.',
    lastName: 'Soyadınızı girin.',
    email: 'Geçerli bir e-posta girin.',
    phone: 'Geçerli bir telefon girin.',
    city: 'İl seçin.',
    district: 'İlçe seçin.',
    address: 'Açık adresi girin (en az 10 karakter).',
    cardName: 'Kart üzerindeki adı girin.',
    cardNumber: '16 haneli kart numarasını girin.',
    cardExpiry: 'AA/YY biçiminde girin.',
    cardCvc: 'CVC girin.',
    preInfoRequired: 'Ön Bilgilendirme Formu’nu okuduğunuzu onaylamanız gerekiyor.',
    termsRequired: 'Mesafeli Satış Sözleşmesi’ni onaylamanız gerekiyor.',
  },
  serverError: 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.',
  networkError: 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',

  successTitle: 'Siparişiniz alındı',
  /** Sipariş numarası cümlenin ortasında kalın yazıyla görünür */
  successBefore: 'Sipariş numaranız',
  successAfter: '. Onay e-postası kısa süre içinde kutunuzda olacak.',
  paymentMethodLabel: 'Ödeme yöntemi',
  trackOrder: 'Siparişimi Takip Et',
  continueShopping: 'Alışverişe Devam Et',

  emptyTitle: 'Ödenecek ürün yok',
  emptyBody: 'Ödeme adımına geçmek için önce sepetinize ürün ekleyin.',
  emptyCta: commonText.browseProducts,

  cityLabel: 'İl',
  cityPlaceholder: 'İl seçin',
  districtLabel: 'İlçe',
  districtPlaceholder: 'İlçe seçin',
  districtDisabledPlaceholder: 'Önce il seçin',
  addressLabel: 'Açık Adres',
  addressHint: 'Mahalle, cadde, sokak, bina ve daire numarası',
  noteLabel: 'Sipariş Notu',
  noteHint: 'Teslimatla ilgili eklemek istedikleriniz',

  shippingHeading: 'Kargo Seçimi',
  paymentHeading: 'Ödeme Yöntemi',
  freeLabel: 'Ücretsiz',

  cardNameLabel: 'Kart Üzerindeki İsim',
  cardNumberLabel: 'Kart Numarası',
  cardSecurityNote: 'Kart bilgileriniz 256-bit SSL ile şifrelenir ve tarafımızda saklanmaz.',

  transfer: {
    bankLabel: 'Banka',
    bankName: 'Ziraat Bankası',
    ibanLabel: 'IBAN',
    iban: 'TR00 0000 0000 0000 0000 0000 00',
    noteBefore:
      'Açıklama kısmına sipariş numaranızı yazmanız yeterli. Ödemeniz ulaştığında siparişiniz aynı gün kargoya verilir. Havale ile ödemelerde ürün tutarına',
    noteHighlight: ' %3 ek indirim',
    noteAfter: 'uygulanır.',
  },
  cod: {
    noteBefore:
      'Ürünü teslim alırken kurye taşıyıcısına nakit veya kredi kartıyla ödeme yapabilirsiniz. Kapıda ödeme hizmeti için',
    noteFee: '39,90 ₺',
    noteAfter: 'hizmet bedeli eklenir. Bu seçenek yalnızca 5.000 ₺ altındaki siparişlerde geçerlidir.',
  },

  backToCart: 'Sepete Dön',
  summaryHeading: 'Sipariş Özeti',
  discountLabel: (couponCode?: string | null) =>
    couponCode ? `İndirim (${couponCode})` : 'İndirim',
  codFeeLabel: 'Kapıda ödeme bedeli',

  preInfoLinkLabel: 'Ön Bilgilendirme Formu',
  preInfoConsentAfter: '’nu okudum ve bilgilendirildim.',
  termsLinkLabel: 'Mesafeli Satış Sözleşmesi',
  termsConsentBetween: '’ni ve',
  privacyLinkLabel: 'Gizlilik Politikası',
  termsConsentAfter: '’nı okudum, onaylıyorum.',

  submitting: 'İşleniyor…',
  submit: 'Siparişi Tamamla',
  cardStorageNote: 'Kart bilgileriniz tarafımızda saklanmaz.',
} as const;

export const iyzicoFrameText = {
  title: 'Güvenli Ödeme',
  description:
    'Bankanızın 3D Secure doğrulama ekranına yönlendiriliyorsunuz. Bu sayfayı kapatmayın.',
} as const;
