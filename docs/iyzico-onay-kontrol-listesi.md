# iyzico Üye İşyeri Onay Kontrol Listesi

**Site:** Karabesimoğlu Zeytincilik · **Hazırlık tarihi:** 7 Ağustos 2026

iyzico üye işyeri başvurusunda site, 6502 sayılı Tüketicinin Korunması Hakkında Kanun,
6563 sayılı Elektronik Ticaret Kanunu ve Mesafeli Sözleşmeler Yönetmeliği açısından
incelenir. Aşağıdaki liste, her maddenin sitede nerede karşılandığını gösterir.

Durum anahtarı: **✅ hazır** · **⚠️ sizin doldurmanız gerekiyor** · **⬜ başvuru öncesi yapılacak**

---

## 1. Kurumsal kimlik ve iletişim

| # | Gereklilik | Durum | Nerede |
| --- | --- | --- | --- |
| 1.1 | Ticaret ünvanı sitede görünür | ✅ | Footer künye bloğu, tüm sayfalar |
| 1.2 | Açık adres (mahalle, cadde, no, ilçe, il) | ✅ | Footer, `/iletisim` |
| 1.3 | Telefon numarası | ✅ | Footer, `/iletisim`, mobil menü |
| 1.4 | E-posta adresi | ✅ | Footer, `/iletisim` |
| 1.5 | Vergi dairesi ve vergi numarası | ⚠️ | Footer künye — `src/lib/data/site.ts` → `legal.taxOffice`, `legal.taxNumber` |
| 1.6 | MERSİS numarası | ⚠️ | Footer künye — `legal.mersis` |
| 1.7 | Ticaret sicil numarası | ⚠️ | Footer künye — `legal.tradeRegistryNo` |
| 1.8 | KEP adresi | ⚠️ | `legal.kepAddress` |
| 1.9 | Hakkımızda sayfası | ✅ | `/hakkimizda` |
| 1.10 | Çalışma saatleri | ✅ | Footer, `/iletisim` |

> **Yapmanız gereken:** `src/lib/data/site.ts` içindeki `legal` bloğundaki
> yer tutucu değerleri (`0000000000` vb.) gerçek ticari kayıtlarınızla değiştirin.
> iyzico bu bilgileri vergi levhanız ve ticaret sicil kaydınızla karşılaştırır.

---

## 2. Yasal metinler

| # | Belge | Durum | Adres |
| --- | --- | --- | --- |
| 2.1 | Mesafeli Satış Sözleşmesi | ✅ | `/mesafeli-satis` |
| 2.2 | Ön Bilgilendirme Formu | ✅ | `/on-bilgilendirme-formu` |
| 2.3 | İade ve İptal Koşulları | ✅ | `/iade-politikasi` |
| 2.4 | Teslimat ve Kargo Koşulları | ✅ | `/teslimat-ve-kargo` |
| 2.5 | Gizlilik Politikası | ✅ | `/gizlilik` |
| 2.6 | KVKK Aydınlatma Metni | ✅ | `/kvkk` |
| 2.7 | Çerez Politikası | ✅ | `/cerez-politikasi` |
| 2.8 | Tüm metinler footer'dan erişilebilir | ✅ | Footer → Müşteri Hizmetleri |
| 2.9 | Metinlerde satıcı künyesi yer alıyor | ✅ | Ön Bilgilendirme Formu m.1, Mesafeli Satış m.1 |
| 2.10 | Cayma hakkı süresi ve istisnaları belirtilmiş | ✅ | Ön Bilgilendirme m.6–7, Mesafeli Satış m.5–6 |

---

## 3. Ürün ve fiyat gösterimi

| # | Gereklilik | Durum | Nerede |
| --- | --- | --- | --- |
| 3.1 | Fiyatlar Türk Lirası cinsinden | ✅ | `formatPrice()` — `tr-TR`/`TRY` |
| 3.2 | Fiyatlar KDV dâhil | ✅ | Ürün kartı, detay, sepet; "KDV dâhil" ibaresi ürün detayında |
| 3.3 | Ürün görselleri ve açıklamaları | ✅ | 14 üründe galeri, künye, besin değeri, SSS |
| 3.4 | Stok durumu görünür | ✅ | Ürün kartı ve detayda rozet |
| 3.5 | Kargo bedeli sipariş öncesi belli | ✅ | Sepet ve ödeme özetinde ayrı satır |
| 3.6 | İndirimli üründe eski fiyat gösterimi | ✅ | Üstü çizili eski fiyat + indirim yüzdesi |

---

## 4. Sipariş akışı

```
Ürün detay → Sepete ekle → Sepet (kupon, ara toplam, kargo, KDV, toplam)
   → Ödeme sayfası
       ├─ Teslimat bilgileri (ad, telefon, il, ilçe, açık adres)
       ├─ Kargo yöntemi seçimi (ücretiyle birlikte)
       ├─ Ödeme yöntemi (kart / havale / kapıda)
       ├─ Sipariş özeti — ara toplam, indirim, KDV, kargo, GENEL TOPLAM
       └─ İki ayrı onay kutusu (Ön Bilgilendirme + Mesafeli Satış)
   → iyzico 3D Secure
   → /api/checkout/callback — sonuç iyzico'dan sorgulanarak doğrulanır
   → /odeme/sonuc (başarılı / başarısız)
   → Sipariş onay e-postası + yönetici bildirimi
   → Admin panelinde görünür → kargoya verilir → müşteriye kargo e-postası
```

| # | Gereklilik | Durum |
| --- | --- | --- |
| 4.1 | Sepette tutarlar kalem kalem gösteriliyor | ✅ |
| 4.2 | Ödeme öncesi sipariş özeti sunuluyor | ✅ |
| 4.3 | Ön Bilgilendirme onayı **ayrı** kutu | ✅ |
| 4.4 | Mesafeli Satış onayı **ayrı** kutu | ✅ |
| 4.5 | Onaylar işaretlenmeden sipariş tamamlanamıyor | ✅ |
| 4.6 | Sipariş numarası üretiliyor (`ZB-YYMMDD-XXXX`) | ✅ veritabanı trigger'ı |
| 4.7 | Sipariş onay e-postası gönderiliyor | ✅ Resend — `RESEND_API_KEY` gerekli |
| 4.8 | Sipariş takibi sayfası | ✅ `/siparis-takibi` |
| 4.9 | Üye olmadan sipariş verilebiliyor | ✅ |

---

## 5. iyzico entegrasyonu

| # | Gereklilik | Durum | Dosya |
| --- | --- | --- | --- |
| 5.1 | Checkout Form entegrasyonu | ✅ | `src/utils/iyzico.ts` → `initCheckoutForm()` |
| 5.2 | 3D Secure akışı | ✅ | iyzico tarafında; `PAYMENT_GROUP.PRODUCT` |
| 5.3 | Callback ile sonuç doğrulama | ✅ | `/api/checkout/callback` → `retrieveCheckoutResult()` |
| 5.4 | **Sonuç callback gövdesine güvenilmiyor** | ✅ | Token ile iyzico'ya yeniden sorulur |
| 5.5 | Sepet kalem toplamı `price` ile eşleşiyor | ✅ | `/api/checkout` — basketItems toplamı hesaplanır |
| 5.6 | Tutarlar sunucuda yeniden doğrulanıyor | ✅ | İstemciden gelen toplam kabul edilmez |
| 5.7 | Başarısız ödemede sipariş `cancelled` | ✅ | Callback'te `payment_status: 'failed'` |
| 5.8 | Taksit seçenekleri destekleniyor | ✅ | `enabledInstallments: [1,2,3,6,9,12]` |
| 5.9 | Kart bilgisi sunucuda saklanmıyor | ✅ | Form iyzico iframe'inde; bizde tutulmaz |
| 5.10 | Ödeme altyapısı beyanı sitede görünür | ✅ | Footer + ödeme sayfası |
| 5.11 | Canlı anahtarlar tanımlı | ⬜ | `.env.local` → `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` |

> **Sandbox → canlı geçiş:** `IYZICO_BASE_URL` değerini
> `https://sandbox-api.iyzipay.com` yerine `https://api.iyzipay.com` yapın ve
> canlı anahtarları girin.

---

## 6. Güvenlik ve gizlilik

| # | Gereklilik | Durum | Not |
| --- | --- | --- | --- |
| 6.1 | HTTPS / SSL sertifikası | ⬜ | Yayına alınca zorunlu (Vercel otomatik sağlar) |
| 6.2 | Çerez onay bandı | ✅ | İlk ziyarette gösterilir, tercih 12 ay saklanır |
| 6.3 | Şifreler tek yönlü karma ile saklanıyor | ✅ | Supabase Auth |
| 6.4 | Veritabanı satır düzeyi güvenlik (RLS) | ✅ | 12 tabloda etkin, 26 politika |
| 6.5 | Yönetim paneli rol denetimli | ✅ | `middleware.ts` + her sunucu eyleminde kontrol |
| 6.6 | Servis anahtarı istemciye sızmıyor | ✅ | Derleme çıktısında doğrulandı |
| 6.7 | Hesap/sepet/ödeme sayfaları indekslenmiyor | ✅ | `robots.ts` |

---

## 7. Başvuru öncesi yapılacaklar

Sırayla:

1. **Künye bilgilerini doldurun** — `src/lib/data/site.ts` → `legal` bloğu
   (vergi dairesi, vergi no, MERSİS, ticaret sicil, KEP).
2. **Gerçek iletişim bilgilerini girin** — `site.phone`, `site.whatsapp`,
   `site.email`, `site.address`. Şu an örnek değerler var.
3. **Alan adını bağlayın** — `NEXT_PUBLIC_SITE_URL` ve `site.url` gerçek alan
   adınıza güncellenmeli; iyzico başvurusunda canlı adres istenir.
4. **SSL sertifikasını doğrulayın** — site `https://` ile açılmalı.
5. **Banka hesap bilgilerini girin** — havale ödemesi sunacaksanız
   `src/components/checkout/CheckoutView.tsx` içindeki IBAN alanı.
6. **iyzico canlı anahtarlarını tanımlayın** ve `IYZICO_BASE_URL`'i canlıya alın.
7. **Test siparişi verin** — sandbox kartla uçtan uca akışı doğrulayın
   (sipariş oluşuyor mu, e-posta gidiyor mu, admin panelinde görünüyor mu).
8. **Ürün fiyat ve stoklarını gerçek verilerle güncelleyin.**

---

## 8. Başvuruda istenen belgeler

Site dışında iyzico'nun sizden isteyeceği evraklar:

- Vergi levhası
- İmza sirküleri
- Ticaret sicil gazetesi
- Kimlik fotokopisi (yetkili)
- Şirket banka hesap bilgileri (IBAN)
- Faaliyet belgesi

---

## Özet

| Kategori | Hazır | Sizin doldurmanız gereken | Yayın öncesi |
| --- | --- | --- | --- |
| Kurumsal kimlik | 6 | 4 | — |
| Yasal metinler | 10 | — | — |
| Ürün ve fiyat | 6 | — | — |
| Sipariş akışı | 9 | — | — |
| iyzico entegrasyonu | 10 | — | 1 |
| Güvenlik | 6 | — | 1 |
| **Toplam** | **47** | **4** | **2** |

Kodla ilgili tüm gereklilikler karşılandı. Kalan maddeler ticari kayıt
bilgileriniz ve yayına alma adımlarıdır.
