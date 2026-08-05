import type { Post } from '@/types';
import { AVATAR, IMG, img } from '@/lib/images';

const authors = {
  kerem: {
    name: 'Kerem Aydoğan',
    role: 'Üretim Sorumlusu',
    avatar: img(AVATAR.a7, 96, 96),
  },
  nesrin: {
    name: 'Nesrin Aydoğan',
    role: 'Kurucu Ortak',
    avatar: img(AVATAR.a1, 96, 96),
  },
  tolga: {
    name: 'Tolga Bayram',
    role: 'Gıda Mühendisi',
    avatar: img(AVATAR.a5, 96, 96),
  },
};

export const posts: Post[] = [
  {
    slug: 'iyi-zeytinyagi-nasil-anlasilir',
    title: 'İyi Zeytinyağı Nasıl Anlaşılır? 7 Pratik Test',
    excerpt:
      'Etiketteki asit oranından buzdolabı testine kadar, market rafında ve evde uygulayabileceğiniz yedi somut kontrol.',
    cover: img(IMG.cruetOlives, 1200, 800),
    category: 'Rehber',
    date: '2026-07-12',
    readingTime: 8,
    author: authors.tolga,
    content: [
      {
        type: 'p',
        text: 'Zeytinyağı, gıda sektöründe en çok tağşiş edilen ürünlerden biri. İyi haber şu: bir yağın gerçekten natürel sızma olup olmadığını anlamak için laboratuvara ihtiyacınız yok. Aşağıdaki yedi kontrol, hem raf başında hem de evde işinizi görecek.',
      },
      { type: 'h2', text: '1. Etiketteki asit oranına bakın' },
      {
        type: 'p',
        text: 'Natürel sızma sınıfı için yasal üst sınır %0,8’dir. Ancak iyi bir üretici bu sayıyı %0,3–0,5 aralığında tutar ve etikete yazmaktan çekinmez. Etikette asit oranı hiç yazmıyorsa, bu bir bilgi eksikliği değil, bilinçli bir tercihtir.',
      },
      { type: 'h2', text: '2. Hasat yılını arayın' },
      {
        type: 'p',
        text: 'Zeytinyağı yıllandıkça iyileşen bir ürün değildir; tam tersine. “Son kullanma tarihi” yerine “hasat yılı” yazan şişeleri tercih edin. Güncel sezona ait bir ürün, iki yıl öncesine göre çok daha canlı olacaktır.',
      },
      { type: 'h2', text: '3. Şişenin rengine dikkat edin' },
      {
        type: 'p',
        text: 'Işık, zeytinyağının en hızlı düşmanıdır. Şeffaf cam veya plastik şişedeki bir yağ, rafta beklerken oksitlenmeye başlar. Koyu yeşil, kahverengi cam ya da teneke ambalaj arayın.',
      },
      { type: 'h2', text: '4. Buzdolabı testi' },
      {
        type: 'p',
        text: 'Bir miktar yağı buzdolabında birkaç saat bekletin. Natürel sızma zeytinyağı 7 °C altında bulanıklaşır, kısmen katılaşır ve oda sıcaklığında eski hâline döner. Hiç değişmiyorsa, içinde rafine yağ olma ihtimali yüksektir.',
      },
      { type: 'h2', text: '5. Kokusunu tanıyın' },
      {
        type: 'p',
        text: 'Küçük bir bardağa koyup avucunuzda ısıtın, sonra koklayın. Taze biçilmiş çim, yeşil elma, enginar, badem — bunlar iyi işaretlerdir. Küf, ıslak karton veya “yağ” kokusu ise kusur göstergesidir.',
      },
      { type: 'h2', text: '6. Boğazdaki yakıcılığı arayın' },
      {
        type: 'p',
        text: 'Bir yudum alın ve yutun. İyi bir erken hasat zeytinyağı boğazın arkasında iki–üç saniye süren hafif bir yanma bırakır. Bu his, oleokantal adlı doğal antioksidandan gelir. Yakıcılık ne kadar belirginse polifenol o kadar yüksektir.',
      },
      { type: 'h2', text: '7. Fiyatı matematikle sınayın' },
      {
        type: 'p',
        text: 'Bir litre zeytinyağı için ortalama 5–7 kilo zeytin gerekir. Hasat işçiliği, sıkım, ambalaj ve nakliyeyi hesaba katın. Piyasanın belirgin biçimde altındaki bir fiyat, çoğu zaman içeriğin de belirgin biçimde farklı olduğu anlamına gelir.',
      },
      {
        type: 'quote',
        text: 'Zeytinyağı almak, aslında bir üreticiye güvenmektir. Şeffaflığı olmayan etiketten kaçının.',
      },
    ],
  },
  {
    slug: 'erken-hasat-nedir',
    title: 'Erken Hasat Nedir, Neden Daha Pahalıdır?',
    excerpt:
      'Aynı ağaçtan, üç hafta arayla toplanan iki zeytin neden bambaşka iki ürüne dönüşür? Verim ve polifenol arasındaki takas.',
    cover: img(IMG.branchMacro, 1200, 800),
    category: 'Üretim',
    date: '2026-06-28',
    readingTime: 6,
    author: authors.kerem,
    content: [
      {
        type: 'p',
        text: 'Zeytin ağacı, ekim ayından ocak ayına kadar hasat edilebilir. Ama ne zaman topladığınız, elinize geçecek ürünü kökten değiştirir. Erken hasat, bu takvimin en başında — meyve henüz yeşilken — yapılan hasadın adıdır.',
      },
      { type: 'h2', text: 'Verim düşer, değer artar' },
      {
        type: 'p',
        text: 'Yeşil zeytinde yağ oranı henüz zirveye çıkmamıştır. Bir litre yağ için normalde 5 kilo zeytin yeterken, erken hasatta bu rakam 9 kiloya kadar çıkabilir. Fiyat farkının birinci sebebi budur ve tamamen matematikseldir.',
      },
      { type: 'h2', text: 'Polifenol iki katına çıkar' },
      {
        type: 'p',
        text: 'Buna karşılık yeşil meyve, olgunlaşmış meyveye göre çok daha fazla polifenol içerir. Geç hasat bir yağda 150–200 mg/kg olan bu değer, erken hasatta 500 mg/kg üzerine çıkabilir. Polifenol hem antioksidan kaynağıdır hem de yağın raf ömrünü doğal olarak uzatır.',
      },
      {
        type: 'list',
        items: [
          'Yoğun çimen yeşili renk',
          'Enginar, yeşil domates ve badem notaları',
          'Boğazda hissedilen belirgin yakıcılık',
          'Daha uzun doğal raf ömrü',
        ],
      },
      { type: 'h2', text: 'Hangisini seçmeli?' },
      {
        type: 'p',
        text: 'Erken hasat yağları ısıtılmadan, çiğ tüketildiğinde en iyi hâlindedir: salatalar, mezeler, çorbanın üstüne son dokunuş. Günlük pişirme için ise dengeli profilli, geç hasat bir natürel sızma hem tat hem bütçe açısından daha akıllıcadır. Mutfağınızda ikisinin de bulunması en pratik çözümdür.',
      },
    ],
  },
  {
    slug: 'zeytinyagi-saklama-rehberi',
    title: 'Zeytinyağını Doğru Saklamanın Kuralları',
    excerpt:
      'Işık, ısı, hava ve zaman. Zeytinyağının dört düşmanına karşı evde alabileceğiniz basit ama etkili önlemler.',
    cover: img(IMG.bottleLemon, 1200, 800),
    category: 'Rehber',
    date: '2026-06-05',
    readingTime: 5,
    author: authors.tolga,
    content: [
      {
        type: 'p',
        text: 'İyi bir zeytinyağını yanlış saklayarak birkaç ay içinde sıradan bir yağa dönüştürmek mümkündür. Neyse ki korunma yolları basit ve maliyetsiz.',
      },
      { type: 'h2', text: 'Işıktan uzak tutun' },
      {
        type: 'p',
        text: 'Ultraviyole ışık, zeytinyağındaki klorofili tetikler ve oksidasyonu hızlandırır. Pencere kenarı ya da açık raf yerine kapalı bir dolap tercih edin. Şeffaf şişede aldıysanız, yağı koyu bir şişeye aktarın.',
      },
      { type: 'h2', text: 'Ocağın yanına koymayın' },
      {
        type: 'p',
        text: 'Mutfakta en pratik yer, çoğu zaman en kötü yerdir. Ocağın hemen yanındaki sıcaklık dalgalanması yağı hızla yorar. İdeal saklama sıcaklığı 14–18 °C’dir.',
      },
      { type: 'h2', text: 'Kapağı sıkı kapatın' },
      {
        type: 'p',
        text: 'Her açılışta şişeye giren oksijen, geri dönüşü olmayan bir süreç başlatır. Kullandıktan hemen sonra kapağı sıkıca kapatın. Büyük teneke aldıysanız, günlük kullanım için küçük bir cam şişeye aktarıp tenekeyi kapalı tutun.',
      },
      { type: 'h2', text: 'Sezon içinde tüketin' },
      {
        type: 'p',
        text: 'Zeytinyağı açıldıktan sonra ideal olarak iki–üç ay içinde bitirilmelidir. Ne kadar tüketiyorsanız o kadar alın; “yıllık stok” alışkanlığı çoğu zaman ürünün en iyi döneminin kaçırılmasına yol açar.',
      },
      {
        type: 'quote',
        text: 'Zeytinyağı şaraba benzemez. Yeni olan her zaman daha iyidir.',
      },
    ],
  },
  {
    slug: 'sofralik-zeytin-cesitleri',
    title: 'Sofralık Zeytin Çeşitleri: Gemlik’ten Domat’a',
    excerpt:
      'Kahvaltı sofrasının başrolü. Hangi çeşit nerede yetişir, nasıl işlenir ve neyle en iyi gider?',
    cover: img(IMG.olivesBowls, 1200, 800),
    category: 'Mutfak',
    date: '2026-05-19',
    readingTime: 7,
    author: authors.nesrin,
    content: [
      {
        type: 'p',
        text: 'Türkiye’de sofralık olarak değerlendirilen onlarca zeytin çeşidi var. Aşağıda en yaygın dördünü, karakterleri ve kullanım alanlarıyla birlikte topladık.',
      },
      { type: 'h2', text: 'Gemlik' },
      {
        type: 'p',
        text: 'Marmara kökenli, yüksek yağ oranlı siyah zeytin. Eti yumuşak, çekirdeği küçüktür. Kahvaltının klasiğidir; ekmeğe sürülebilecek kadar kremsi olan hurma formu en çok aranan hâlidir.',
      },
      { type: 'h2', text: 'Domat' },
      {
        type: 'p',
        text: 'İri taneli, dolgun yeşil zeytin. Çekirdeği kolay ayrılır, bu yüzden dolmalık olarak da kullanılır. Kırma ve çizik formlarında çıtırlığını korur.',
      },
      { type: 'h2', text: 'Ayvalık' },
      {
        type: 'p',
        text: 'Esas olarak yağlık bir çeşit olsa da sofralık işlendiğinde belirgin, hafif acımsı bir karakter sunar. Çizik yeşil zeytin olarak Ege kahvaltılarının vazgeçilmezidir.',
      },
      { type: 'h2', text: 'Uslu (Edincik Su)' },
      {
        type: 'p',
        text: 'İri, etli ve düşük yağlı. Salamurada dokusunu çok iyi korur, bu yüzden salatalarda ve meze tabaklarında tercih edilir.',
      },
      {
        type: 'list',
        items: [
          'Kahvaltı için: Gemlik hurma, çizik yeşil',
          'Meze ve salata için: Uslu, Domat kırma',
          'Dolma için: iri kalibreli Domat',
          'Pişirme için: siyah sele zeytin',
        ],
      },
    ],
  },
  {
    slug: 'zeytinyagi-ve-akdeniz-mutfagi',
    title: 'Zeytinyağı ve Akdeniz Mutfağı: Bir Ömür Meselesi',
    excerpt:
      'Dünyanın en uzun yaşayan topluluklarının ortak paydası neden hep aynı şişeye çıkıyor?',
    cover: img(IMG.mezeTable, 1200, 800),
    category: 'Sağlık',
    date: '2026-04-30',
    readingTime: 6,
    author: authors.nesrin,
    content: [
      {
        type: 'p',
        text: 'Akdeniz diyeti, beslenme literatüründe en çok araştırılan modellerden biri. Sebze, baklagil, tam tahıl ve balığın yanında değişmeyen bir bileşen daha var: natürel sızma zeytinyağı.',
      },
      { type: 'h2', text: 'Oleokantal ve iltihap' },
      {
        type: 'p',
        text: 'Erken hasat zeytinyağında bulunan oleokantal, boğazda hissedilen o karakteristik yakıcılığın kaynağıdır. Yapılan çalışmalar bu bileşiğin iltihap süreçleri üzerinde olumlu etkileri olabileceğine işaret ediyor.',
      },
      { type: 'h2', text: 'Tekli doymamış yağ asitleri' },
      {
        type: 'p',
        text: 'Zeytinyağının yaklaşık %73’ü oleik asitten oluşur. Bu, kalp-damar sağlığı açısından en olumlu değerlendirilen yağ asidi grubudur.',
      },
      { type: 'h2', text: 'Ama kilit nokta: miktar değil, kalite' },
      {
        type: 'p',
        text: 'Rafine edilmiş bir zeytinyağında polifenollerin büyük bölümü kaybolmuştur. Faydadan söz ederken kastedilen daima natürel sızma, tercihen erken hasat üründür. Günde iki–üç yemek kaşığı, çiğ olarak, yeterlidir.',
      },
      {
        type: 'quote',
        text: 'Akdeniz’de zeytinyağı bir malzeme değil, sofranın kurucu unsurudur.',
      },
    ],
  },
  {
    slug: 'hasat-gunlugu-2026',
    title: 'Hasat Günlüğü 2026: Üç Haftada Bir Sezon',
    excerpt:
      'Orhangazi’deki bahçemizde ekim ayının nasıl geçtiğini, ilk sıkımdan şişeleme gününe kadar anlattık.',
    cover: img(IMG.harvestCrate, 1200, 800),
    category: 'Bahçeden',
    date: '2026-04-02',
    readingTime: 9,
    author: authors.kerem,
    content: [
      {
        type: 'p',
        text: 'Hasat, bizim için yılın en yorucu ve en güzel üç haftasıdır. Bu yıl not tuttuk; aşağıda o günlerden kesitler var.',
      },
      { type: 'h2', text: '2 Ekim — Karar günü' },
      {
        type: 'p',
        text: 'Bahçenin üç ayrı noktasından örnek aldık, laboratuvara gönderdik. Yağ oranı %14, polifenol yüksek. Erken hasat için doğru pencere açılmıştı. Ekibi aradık.',
      },
      { type: 'h2', text: '9 Ekim — İlk gün' },
      {
        type: 'p',
        text: 'Sabah altıda bahçedeydik. Serinde toplanan zeytin, gün ortasındaki sıcakta toplanandan çok daha iyi sonuç verir. Ağaçların altına sererek elle sıyırma yöntemiyle çalıştık — dal kırılmıyor, meyve zedelenmiyor.',
      },
      { type: 'h2', text: '9 Ekim, akşam — Sıkım' },
      {
        type: 'p',
        text: 'Kasalar akşam yedide fabrikadaydı. Hasat ile sıkım arasındaki süre ne kadar kısaysa asitlik o kadar düşük olur. Bu partide sekiz saatte tamamladık; sonuç %0,18 çıktı, rekorumuz.',
      },
      { type: 'h2', text: '11 Ekim — İlk tadım' },
      {
        type: 'p',
        text: 'Tanktan alınan ilk numuneyi ekipçe tattık. Enginar ve yeşil badem çok net, boğazdaki yakıcılık üç saniye sürüyor. O an herkesin yüzündeki ifadeyi anlatmak zor.',
      },
      { type: 'h2', text: '24 Ekim — Şişeleme' },
      {
        type: 'p',
        text: 'İki hafta dinlendirdikten sonra şişeledik. Bu yıl sınırlı üretim serisini 900 şişede kapattık; her birinin üzerinde numara ve hasat ekibinin adı var. Sezon böyle kapandı.',
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export const latestPosts = posts.slice(0, 3);
