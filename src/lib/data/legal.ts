import { site } from '@/lib/data/site';

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}

const address = `${site.address.street}, ${site.address.district} / ${site.address.city}`;

/** Satıcı künyesi — birden çok belgede tekrarlandığı için tek yerden. */
const sellerBlock = [
  `Ünvan: ${site.legalName}`,
  `Adres: ${address}`,
  `Telefon: ${site.phone}`,
  `E-posta: ${site.email}`,
  `Vergi Dairesi / No: ${site.legal.taxOffice} / ${site.legal.taxNumber}`,
  `MERSİS No: ${site.legal.mersis}`,
  `Ticaret Sicil No: ${site.legal.tradeRegistryNo}`,
  `KEP Adresi: ${site.legal.kepAddress}`,
].join('\n');

export const legalDocuments: Record<string, LegalDocument> = {
  'on-bilgilendirme-formu': {
    slug: 'on-bilgilendirme-formu',
    title: 'Ön Bilgilendirme Formu',
    eyebrow: 'Yasal Bilgilendirme',
    summary:
      'Mesafeli Sözleşmeler Yönetmeliği uyarınca, siparişinizi onaylamadan önce satıcı, ürün, ödeme ve teslimat koşulları hakkında bilgilendirilmeniz gerekir.',
    updated: '2026-08-07',
    sections: [
      {
        title: '1. Satıcı Bilgileri',
        paragraphs: [sellerBlock],
      },
      {
        title: '2. Alıcı Bilgileri',
        paragraphs: [
          'Sipariş formunda beyan ettiğiniz ad-soyad, teslimat adresi, telefon ve e-posta bilgileri bu formun ayrılmaz parçasıdır. Siparişi onayladığınızda bu bilgilerin doğruluğunu kabul etmiş olursunuz.',
        ],
      },
      {
        title: '3. Sözleşme Konusu Ürün ve Bedel',
        paragraphs: [
          'Sipariş özetinde listelenen ürünlerin adı, adedi, gramajı ve KDV dâhil satış fiyatı bu formun konusudur. Ödeme sayfasındaki “Sipariş Özeti” bölümünde ara toplam, indirim, KDV, kargo bedeli ve genel toplam ayrı ayrı gösterilir.',
          'Listelenen tüm fiyatlar Türk Lirası cinsinden ve KDV dâhildir. Kargo bedeli, ödeme adımında ayrıca belirtilir.',
        ],
      },
      {
        title: '4. Ödeme Şekli',
        list: [
          'Kredi / banka kartı — 3D Secure doğrulamalı, taksit seçenekleri ödeme adımında görüntülenir',
          'Havale / EFT — ürün tutarına %3 ek indirim uygulanır',
          'Kapıda ödeme — 39,90 ₺ hizmet bedeli eklenir',
        ],
        paragraphs: [
          site.paymentProvider.note +
            ' Kart bilgileriniz hiçbir aşamada satıcı sistemlerinde saklanmaz.',
        ],
      },
      {
        title: '5. Teslimat',
        list: [
          `Sipariş, ödemenin onaylanmasının ardından hazırlanır ve ${site.address.district} deposundan kargoya verilir.`,
          'Standart teslim süresi 1–3 iş günüdür; yasal azami süre 30 gündür.',
          `Kargo bedeli ${site.freeShippingThreshold} ₺ ve üzeri siparişlerde satıcıya aittir.`,
          'Teslimat, sipariş formunda belirtilen adrese kargo firması aracılığıyla yapılır.',
        ],
      },
      {
        title: '6. Cayma Hakkı',
        paragraphs: [
          'ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.',
          'Cayma bildirimini e-posta veya telefon ile satıcıya iletmeniz yeterlidir. İade kargo bedeli satıcıya aittir. Bedel iadesi, cayma bildiriminin ulaşmasından itibaren 14 gün içinde yapılır.',
        ],
      },
      {
        title: '7. Cayma Hakkının Kullanılamayacağı Ürünler',
        paragraphs: [
          'Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca aşağıdaki ürünlerde cayma hakkı kullanılamaz:',
        ],
        list: [
          'Tesliminden sonra ambalajı açılmış gıda ürünleri (sağlık ve hijyen gerekçesiyle)',
          'Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler',
          'Alıcının isteği doğrultusunda kişiselleştirilen ürünler (hediye kutusuna yazdırılan notlar dâhil)',
        ],
      },
      {
        title: '8. Uyuşmazlık Çözümü',
        paragraphs: [
          'Şikâyet ve itirazlar, Ticaret Bakanlığı’nca her yıl ilan edilen parasal sınırlar dâhilinde ALICI’nın yerleşim yerindeki Tüketici Hakem Heyetine veya Tüketici Mahkemesine yapılabilir.',
        ],
      },
      {
        title: '9. Onay',
        paragraphs: [
          'Ödeme adımında bu formu okuduğunuzu ve kabul ettiğinizi onayladığınızda, sipariş vermeden önce yasal olarak bilgilendirilmiş sayılırsınız. Onayınızın bir kopyası sipariş kaydınızda saklanır.',
        ],
      },
    ],
  },

  'cerez-politikasi': {
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    eyebrow: 'Çerezler',
    summary:
      'Sitemizde hangi çerezleri hangi amaçla kullandığımızı, ne kadar süreyle sakladığımızı ve tercihinizi nasıl değiştirebileceğinizi açıklıyoruz.',
    updated: '2026-08-07',
    sections: [
      {
        title: 'Çerez Nedir?',
        paragraphs: [
          'Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınızda saklanan küçük metin dosyalarıdır. Sitenin sizi hatırlamasını, tercihlerinizi korumasını ve düzgün çalışmasını sağlarlar.',
        ],
      },
      {
        title: 'Kullandığımız Çerez Türleri',
        list: [
          'Zorunlu çerezler — oturum yönetimi, sepet içeriğinin korunması ve güvenlik için gereklidir. Bunlar olmadan site çalışmaz ve devre dışı bırakılamaz.',
          'Tercih çerezleri — açık/koyu tema seçiminiz gibi ayarlarınızı hatırlar.',
          'İstatistik çerezleri — hangi sayfaların daha çok görüntülendiğini anlamamıza yardımcı olur. Yalnızca onayınızla kullanılır.',
        ],
      },
      {
        title: 'Kullandığımız Çerezler',
        list: [
          'sb-* — Supabase oturum çerezleri (zorunlu, oturum süresince)',
          'zb-cart — sepet içeriği (zorunlu, tarayıcı deposunda)',
          'zb-wishlist — favori ürünler (tercih, tarayıcı deposunda)',
          'zb-theme — tema tercihi (tercih, tarayıcı deposunda)',
          'zb-cookie-consent — çerez tercihiniz (zorunlu, 12 ay)',
        ],
      },
      {
        title: 'Üçüncü Taraf Çerezleri',
        paragraphs: [
          'Ödeme adımında iyzico, harita gösteriminde Google Maps ve video oynatımında YouTube kendi çerezlerini yerleştirebilir. Bu hizmetler yalnızca ilgili bölümü kullandığınızda yüklenir; video ve harita, siz etkileşime geçene kadar sayfaya hiçbir üçüncü taraf betiği eklemez.',
        ],
      },
      {
        title: 'Tercihinizi Değiştirme',
        paragraphs: [
          'Site ilk ziyaretinizde çerez tercihinizi sorar. Kararınızı daha sonra tarayıcı ayarlarınızdan site verilerini temizleyerek sıfırlayabilirsiniz. Zorunlu çerezleri engellemeniz hâlinde sepet ve oturum işlevleri çalışmayacaktır.',
        ],
      },
      {
        title: 'İlgili Metinler',
        paragraphs: [
          'Kişisel verilerinizin işlenmesine ilişkin ayrıntılar için KVKK Aydınlatma Metni ve Gizlilik Politikası sayfalarımızı inceleyebilirsiniz.',
        ],
      },
    ],
  },

  'teslimat-ve-kargo': {
    slug: 'teslimat-ve-kargo',
    title: 'Teslimat ve Kargo Koşulları',
    eyebrow: 'Teslimat',
    summary:
      'Siparişinizin ne zaman hazırlandığı, hangi sürede teslim edildiği, kargo bedelleri ve hasarlı teslimat durumunda izlenecek yol.',
    updated: '2026-08-07',
    sections: [
      {
        title: 'Hazırlık ve Kargoya Teslim',
        list: [
          'Saat 14.00’a kadar verilen ve ödemesi onaylanan siparişler aynı iş günü kargoya verilir.',
          'Sonrasında verilen siparişler ertesi iş günü kargoya teslim edilir.',
          'Hafta sonu ve resmî tatillerde kargo çıkışı yapılmaz.',
        ],
      },
      {
        title: 'Teslim Süreleri',
        list: [
          'Marmara ve Ege: 1 iş günü',
          'İç Anadolu ve Akdeniz: 2 iş günü',
          'Karadeniz: 2–3 iş günü',
          'Doğu ve Güneydoğu Anadolu: 3–4 iş günü',
          'Yasal azami teslim süresi 30 gündür.',
        ],
      },
      {
        title: 'Kargo Bedelleri',
        list: [
          `Standart kargo: 79,90 ₺ — ${site.freeShippingThreshold} ₺ ve üzeri siparişlerde ücretsiz`,
          'Hızlı kargo: 149,90 ₺ — ertesi iş günü teslim',
          `Mağazadan teslim: ücretsiz — ${site.address.district} mağazamızdan`,
          'Kapıda ödeme hizmet bedeli: 39,90 ₺',
        ],
      },
      {
        title: 'Paketleme',
        paragraphs: [
          'Cam şişeler çift katmanlı köpük içinde, ayrı bölmeli kutularda gönderilir. Dolgu malzemelerinin tamamı geri dönüştürülebilir niteliktedir.',
        ],
      },
      {
        title: 'Hasarlı veya Eksik Teslimat',
        paragraphs: [
          'Ürünü teslim alırken paketi kargo görevlisinin yanında kontrol etmenizi öneririz. Pakette ezilme, ıslanma veya açılma varsa teslim almadan kargo görevlisine tutanak tutturun.',
          'Hasarlı ürün teslim aldıysanız, teslimattan itibaren 3 gün içinde fotoğrafla birlikte bize bildirin. Ürün ücretsiz olarak yenilenir; iade kargo süreci başlatmanıza gerek kalmaz.',
        ],
      },
      {
        title: 'Sipariş Takibi',
        paragraphs: [
          'Siparişiniz kargoya verildiğinde takip numarası e-posta ile iletilir. Sipariş numaranız ve e-posta adresinizle Sipariş Takibi sayfasından da durumu sorgulayabilirsiniz.',
        ],
      },
    ],
  },

  kvkk: {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    eyebrow: 'Kişisel Verilerin Korunması',
    summary:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, kişisel verilerinizi hangi amaçla işlediğimizi, kimlerle paylaştığımızı ve haklarınızı açıklıyoruz.',
    updated: '2026-07-01',
    sections: [
      {
        title: 'Veri Sorumlusu',
        paragraphs: [
          `${site.legalName} (“Şirket”), 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla hareket etmektedir.`,
          `Adres: ${address}\nTelefon: ${site.phone}\nE-posta: ${site.email}`,
        ],
      },
      {
        title: 'İşlenen Kişisel Veriler',
        paragraphs: ['Hizmetlerimizden yararlanmanız sırasında aşağıdaki veriler işlenmektedir:'],
        list: [
          'Kimlik bilgileri: ad, soyad',
          'İletişim bilgileri: e-posta adresi, telefon numarası, teslimat adresi',
          'Müşteri işlem bilgileri: sipariş geçmişi, sepet içeriği, favori ürünler, talep ve şikâyet kayıtları',
          'İşlem güvenliği bilgileri: IP adresi, oturum çerezleri, giriş kayıtları',
          'Pazarlama bilgileri: e-bülten aboneliği ve tercihleri',
        ],
      },
      {
        title: 'İşleme Amaçları',
        list: [
          'Siparişin oluşturulması, hazırlanması, teslimi ve faturalandırılması',
          'Müşteri destek taleplerinin yanıtlanması',
          'İade, değişim ve garanti süreçlerinin yürütülmesi',
          'Yasal yükümlülüklerin (vergi, ticaret ve tüketici mevzuatı) yerine getirilmesi',
          'Açık rızanız bulunması hâlinde kampanya ve duyuruların iletilmesi',
          'Hizmet kalitesinin ölçülmesi ve iyileştirilmesi',
        ],
      },
      {
        title: 'Hukuki Sebepler',
        paragraphs: [
          'Verileriniz KVKK m.5/2 uyarınca; sözleşmenin kurulması ve ifası, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi ve meşru menfaat hukuki sebeplerine dayanılarak; pazarlama iletişimi ise yalnızca açık rızanıza dayanılarak işlenmektedir.',
        ],
      },
      {
        title: 'Aktarılan Taraflar',
        paragraphs: [
          'Kişisel verileriniz, hizmetin gereği olarak yalnızca aşağıdaki taraflarla, amaçla sınırlı biçimde paylaşılır:',
        ],
        list: [
          'Kargo ve lojistik firmaları — teslimatın gerçekleştirilmesi amacıyla',
          'Ödeme kuruluşları ve bankalar — ödeme işleminin tamamlanması amacıyla',
          'Barındırma, e-posta ve altyapı hizmet sağlayıcıları — teknik hizmetin sürdürülmesi amacıyla',
          'Yetkili kamu kurum ve kuruluşları — yasal talep hâlinde',
        ],
      },
      {
        title: 'Saklama Süresi',
        paragraphs: [
          'Veriler, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri kadar saklanır. Ticari defter ve belgeler bakımından bu süre 10 yıldır. Sürenin dolmasının ardından veriler silinir, yok edilir veya anonim hâle getirilir.',
        ],
      },
      {
        title: 'Haklarınız',
        paragraphs: ['KVKK m.11 uyarınca aşağıdaki haklara sahipsiniz:'],
        list: [
          'Kişisel verinizin işlenip işlenmediğini öğrenme',
          'İşlenmişse buna ilişkin bilgi talep etme',
          'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
          'Yurt içinde veya dışında aktarıldığı üçüncü kişileri bilme',
          'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
          'Silinmesini veya yok edilmesini isteme',
          'Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
          'Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç doğmasına itiraz etme',
          'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
        ],
      },
      {
        title: 'Başvuru Yöntemi',
        paragraphs: [
          `Taleplerinizi ${site.email} adresine e-posta ile veya yukarıdaki adrese yazılı olarak iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
        ],
      },
    ],
  },

  gizlilik: {
    slug: 'gizlilik',
    title: 'Gizlilik Politikası',
    eyebrow: 'Gizlilik',
    summary:
      'Sitemizi kullanırken hangi bilgilerin toplandığını, nasıl korunduğunu ve çerezleri nasıl kullandığımızı açıklıyoruz.',
    updated: '2026-07-01',
    sections: [
      {
        title: 'Toplanan Bilgiler',
        paragraphs: [
          'Siteyi ziyaret ettiğinizde teknik olarak zorunlu bazı bilgiler (IP adresi, tarayıcı türü, ziyaret edilen sayfalar) otomatik olarak kaydedilir. Üyelik oluşturduğunuzda veya sipariş verdiğinizde ise ad, e-posta, telefon ve teslimat adresi bilgilerinizi bizimle paylaşırsınız.',
        ],
      },
      {
        title: 'Çerezler',
        paragraphs: [
          'Çerezler, siteyi kullanılabilir kılmak için tarayıcınızda saklanan küçük metin dosyalarıdır. Üç tür çerez kullanıyoruz:',
        ],
        list: [
          'Zorunlu çerezler: oturum yönetimi ve sepet içeriğinin korunması için gereklidir; devre dışı bırakılamaz.',
          'Tercih çerezleri: tema seçiminiz gibi ayarlarınızı hatırlar.',
          'Analitik çerezler: hangi sayfaların daha çok kullanıldığını anlamamıza yardımcı olur ve isteğe bağlıdır.',
        ],
      },
      {
        title: 'Ödeme Güvenliği',
        paragraphs: [
          'Kart bilgileriniz hiçbir aşamada sunucularımızda saklanmaz. Ödeme işlemleri, lisanslı ödeme kuruluşunun altyapısı üzerinden 256-bit SSL şifreleme ve 3D Secure doğrulaması ile gerçekleştirilir.',
        ],
      },
      {
        title: 'Veri Güvenliği',
        list: [
          'Tüm trafik HTTPS üzerinden şifrelenir',
          'Şifreler tek yönlü karma (hash) algoritmalarıyla saklanır',
          'Yönetim paneline erişim rol bazlı yetkilendirmeyle sınırlıdır',
          'Veritabanı erişimi satır düzeyi güvenlik politikalarıyla kısıtlanır',
        ],
      },
      {
        title: 'Üçüncü Taraf Bağlantıları',
        paragraphs: [
          'Sitemiz, sosyal medya ve harita gibi üçüncü taraf hizmetlere bağlantı içerebilir. Bu sitelerin gizlilik uygulamalarından sorumlu değiliz; ilgili sitelerin politikalarını incelemenizi öneririz.',
        ],
      },
      {
        title: 'Değişiklikler',
        paragraphs: [
          'Bu politikada yapılacak değişiklikler bu sayfada yayımlanır. Önemli değişikliklerde kayıtlı kullanıcılarımızı e-posta ile bilgilendiririz.',
        ],
      },
    ],
  },

  'mesafeli-satis': {
    slug: 'mesafeli-satis',
    title: 'Mesafeli Satış Sözleşmesi',
    eyebrow: 'Sözleşme',
    summary:
      '6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, internet üzerinden yapılan satışlara ilişkin taraf hak ve yükümlülükleri.',
    updated: '2026-07-01',
    sections: [
      {
        title: 'Madde 1 — Taraflar',
        paragraphs: [
          `SATICI: ${site.legalName}\nAdres: ${address}\nTelefon: ${site.phone}\nE-posta: ${site.email}`,
          'ALICI: Sipariş formunda bilgileri belirtilen gerçek veya tüzel kişi.',
        ],
      },
      {
        title: 'Madde 2 — Konu',
        paragraphs: [
          'İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait internet sitesinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş formunda belirtilen ürünün satışı ve teslimi ile ilgili tarafların hak ve yükümlülüklerinin belirlenmesidir.',
        ],
      },
      {
        title: 'Madde 3 — Ürün Bilgileri',
        paragraphs: [
          'Ürünün türü, miktarı, marka/modeli, rengi, adedi, satış bedeli ve ödeme şekli sipariş özetinde belirtildiği gibidir. Listelenen fiyatlar KDV dâhil satış fiyatlarıdır.',
        ],
      },
      {
        title: 'Madde 4 — Teslimat',
        list: [
          'Ürün, ALICI’nın sipariş formunda belirttiği adrese kargo firması aracılığıyla teslim edilir.',
          'Teslimat süresi, siparişin onaylanmasından itibaren en geç 30 gündür; standart teslim süresi 1–3 iş günüdür.',
          `Kargo ücreti, sipariş tutarı ${site.freeShippingThreshold} ₺ ve üzeri olduğunda SATICI tarafından karşılanır.`,
          'ALICI, ürünü teslim alırken kontrol etmekle ve hasarlı ürünü kargo firmasından teslim almamakla yükümlüdür.',
        ],
      },
      {
        title: 'Madde 5 — Cayma Hakkı',
        paragraphs: [
          'ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.',
          'Cayma hakkının kullanılabilmesi için ürünün ambalajının açılmamış, kullanılmamış ve yeniden satılabilir durumda olması gerekir. Gıda ürünlerinde ambalajı açılmış ürünler, sağlık ve hijyen açısından iade edilemez.',
          'Cayma bildiriminin SATICI’ya ulaşmasından itibaren 14 gün içinde ürün bedeli ALICI’ya iade edilir.',
        ],
      },
      {
        title: 'Madde 6 — Cayma Hakkının Kullanılamayacağı Hâller',
        list: [
          'Tesliminden sonra ambalajı açılmış gıda ürünleri',
          'Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler',
          'ALICI’nın isteği doğrultusunda kişiselleştirilerek hazırlanan ürünler (hediye seti üzerine yazdırılan notlar dâhil)',
        ],
      },
      {
        title: 'Madde 7 — Uyuşmazlık',
        paragraphs: [
          'İşbu sözleşmeden doğabilecek uyuşmazlıklarda, Ticaret Bakanlığı’nca ilan edilen parasal sınırlar dâhilinde ALICI’nın yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.',
        ],
      },
    ],
  },

  'iade-politikasi': {
    slug: 'iade-politikasi',
    title: 'İade ve Değişim Politikası',
    eyebrow: 'İade',
    summary:
      'Ürününüzü beğenmediyseniz veya bir sorun yaşadıysanız izleyeceğiniz adımlar, süreler ve koşullar.',
    updated: '2026-07-01',
    sections: [
      {
        title: 'İade Süresi',
        paragraphs: [
          'Teslim tarihinden itibaren 14 gün içinde, ambalajı açılmamış ürünlerde koşulsuz iade hakkınız vardır. Bu süre içinde bize ulaşmanız yeterlidir.',
        ],
      },
      {
        title: 'İade Adımları',
        list: [
          `${site.email} adresine sipariş numaranızla birlikte iade talebinizi iletin veya WhatsApp hattımızdan yazın.`,
          'Size iade kargo kodunu ileteceğiz — iade kargo ücreti tarafımıza aittir.',
          'Ürünü orijinal ambalajıyla, fatura fotokopisiyle birlikte kargoya verin.',
          'Ürün depomuza ulaştıktan sonra 3 iş günü içinde kontrol edilir.',
          'Uygun bulunan iadelerde bedel, ödeme yaptığınız yönteme 14 gün içinde iade edilir.',
        ],
      },
      {
        title: 'Hasarlı veya Yanlış Ürün',
        paragraphs: [
          'Cam şişeler çift katmanlı köpük içinde, ayrı bölmeli kutularda gönderilir. Buna rağmen ürününüz kırık ulaştıysa, kargo görevlisine tutanak tutturun ve fotoğrafla birlikte bize bildirin. Ürünü ücretsiz olarak yeniliyoruz; ayrıca iade kargo süreci başlatmanıza gerek kalmıyor.',
        ],
      },
      {
        title: 'İade Edilemeyen Durumlar',
        list: [
          'Ambalajı açılmış veya mührü bozulmuş gıda ürünleri',
          'Kullanılmış ya da yeniden satılabilir durumda olmayan ürünler',
          'Kişiselleştirilmiş hediye setleri (üzerine not yazdırılmış olanlar)',
          '14 günlük süre geçtikten sonra iletilen talepler',
        ],
      },
      {
        title: 'Değişim',
        paragraphs: [
          'Farklı bir gramaj veya ürünle değişim yapmak isterseniz, aradaki fark tarafınıza iade edilir ya da tarafınızdan tahsil edilir. Değişim talepleri de 14 günlük süre içinde geçerlidir.',
        ],
      },
      {
        title: 'Tadını Beğenmediyseniz',
        paragraphs: [
          'Zeytinyağı damak zevkine göre değişen bir üründür. Ambalajı açtıktan sonra tadını beğenmediyseniz bize yazın — hangi profilin size daha uygun olabileceğini birlikte bulalım. Bu durumda ilk siparişinizde ürünü değiştirme sözü veriyoruz.',
        ],
      },
    ],
  },
};

export const legalSlugs = Object.keys(legalDocuments);
