import type { FaqItem, NutritionRow, Product, ProductReview, ProductVariant } from '@/types';
import { AVATAR, IMG } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Shared templates                                                           */
/* -------------------------------------------------------------------------- */

const oilNutrition: NutritionRow[] = [
  { label: 'Enerji', amount: '3700 kJ / 900 kcal', daily: '%45' },
  { label: 'Yağ', amount: '100 g', daily: '%143' },
  { label: '— doymuş yağ', amount: '14 g', daily: '%70' },
  { label: '— tekli doymamış yağ', amount: '73 g' },
  { label: '— çoklu doymamış yağ', amount: '11 g' },
  { label: 'Karbonhidrat', amount: '0 g', daily: '%0' },
  { label: '— şeker', amount: '0 g', daily: '%0' },
  { label: 'Protein', amount: '0 g', daily: '%0' },
  { label: 'Tuz', amount: '0 g', daily: '%0' },
  { label: 'E Vitamini', amount: '14,4 mg', daily: '%120' },
  { label: 'K Vitamini', amount: '60 µg', daily: '%80' },
];

const oliveNutrition: NutritionRow[] = [
  { label: 'Enerji', amount: '605 kJ / 145 kcal', daily: '%7' },
  { label: 'Yağ', amount: '15 g', daily: '%21' },
  { label: '— doymuş yağ', amount: '2 g', daily: '%10' },
  { label: 'Karbonhidrat', amount: '3,8 g', daily: '%1' },
  { label: '— şeker', amount: '0,5 g', daily: '%1' },
  { label: 'Lif', amount: '3,3 g' },
  { label: 'Protein', amount: '1 g', daily: '%2' },
  { label: 'Tuz', amount: '3,3 g', daily: '%55' },
  { label: 'Demir', amount: '3,3 mg', daily: '%24' },
];

const oilFaq: FaqItem[] = [
  {
    question: 'Zeytinyağı nasıl saklanmalı?',
    answer:
      'Işık, ısı ve hava zeytinyağının üç düşmanıdır. Serin (14–18 °C), karanlık bir dolapta, kapağı sıkıca kapalı biçimde saklayın. Ocağın hemen yanında ya da pencere önünde bekletmeyin.',
  },
  {
    question: 'Şişenin dibinde tortu görüyorum, bozulmuş mu?',
    answer:
      'Hayır. Filtrelenmemiş ya da az filtrelenmiş zeytinyağlarında zeytin partikülleri zamanla dibe çöker. Bu, doğallığın göstergesidir ve ürünün kalitesini etkilemez.',
  },
  {
    question: 'Soğukta donması normal mi?',
    answer:
      'Evet. Natürel sızma zeytinyağı yaklaşık 7 °C altında bulanıklaşır ve kısmen katılaşır. Oda sıcaklığına geldiğinde eski haline döner; bu, katkısız olduğunun en pratik testidir.',
  },
  {
    question: 'Kızartmada kullanılabilir mi?',
    answer:
      'Kullanılabilir. Natürel sızma zeytinyağının duman noktası 190–210 °C aralığındadır. Ancak yüksek polifenollü erken hasat ürünlerini ısıtmadan, salata ve mezede tüketmenizi öneririz.',
  },
  {
    question: 'Hasat yılını nereden görebilirim?',
    answer:
      'Her şişenin arka etiketinde hasat sezonu, sıkım tarihi ve parti numarası yer alır. Sitede satılan tüm ürünler güncel sezona aittir.',
  },
];

const oliveFaq: FaqItem[] = [
  {
    question: 'Zeytinler nasıl saklanır?',
    answer:
      'Ambalajı açtıktan sonra buzdolabında, kendi salamurası içinde saklayın. Zeytinlerin salamura seviyesinin altında kalması küflenmeyi önler.',
  },
  {
    question: 'Salamurada koruyucu madde var mı?',
    answer:
      'Yok. Yalnızca kaya tuzu, su ve zeytinin kendi doğal fermantasyonu kullanılır. Sirke, renklendirici veya kimyasal koruyucu içermez.',
  },
  {
    question: 'Zeytin çok tuzlu gelirse ne yapmalıyım?',
    answer:
      'Servis etmeden önce 20–30 dakika ılık suda bekletip süzün. Doğal salamurada tuz oranı damak zevkine göre kolayca ayarlanabilir.',
  },
  {
    question: 'Vakumlu ambalajın şişmesi normal mi?',
    answer:
      'Hafif şişme, doğal fermantasyonun devam ettiğini gösterir ve zararsızdır. Belirgin şişme veya koku değişimi olursa bizimle iletişime geçin.',
  },
];

/** Price ladder: every variant carries its own price. */
function oilVariants(base: number, discount = 0): ProductVariant[] {
  const ladder: { label: string; value: string; factor: number; stock: boolean }[] = [
    { label: '500 ml', value: '500ml', factor: 1, stock: true },
    { label: '750 ml', value: '750ml', factor: 1.38, stock: true },
    { label: '1 L', value: '1l', factor: 1.72, stock: true },
    { label: '3 L', value: '3l', factor: 4.6, stock: true },
    { label: '5 L', value: '5l', factor: 7.1, stock: false },
  ];
  return ladder.map(({ label, value, factor, stock }) => {
    const price = Math.round(base * factor) - 1;
    return {
      label,
      value,
      price,
      oldPrice: discount ? Math.round(price / (1 - discount)) - 1 : undefined,
      inStock: stock,
    };
  });
}

function oliveVariants(base: number, discount = 0): ProductVariant[] {
  const ladder: { label: string; value: string; factor: number; stock: boolean }[] = [
    { label: '400 g', value: '400g', factor: 1, stock: true },
    { label: '800 g', value: '800g', factor: 1.85, stock: true },
    { label: '1,5 kg', value: '1500g', factor: 3.3, stock: true },
    { label: '3 kg', value: '3000g', factor: 6.2, stock: true },
  ];
  return ladder.map(({ label, value, factor, stock }) => {
    const price = Math.round(base * factor) - 1;
    return {
      label,
      value,
      price,
      oldPrice: discount ? Math.round(price / (1 - discount)) - 1 : undefined,
      inStock: stock,
    };
  });
}

/* A pool of realistic reviews; each product takes three from here in rotation. */
const reviewPool: ProductReview[] = [
  {
    id: 'r1',
    name: 'Elif Yıldırım',
    avatar: AVATAR.a1,
    rating: 5,
    date: '2026-06-18',
    title: 'Kahvaltı sofrasının yıldızı',
    comment:
      'Yıllardır market rafındaki ürünleri alıyordum, aradaki fark ilk kaşıkta belli oluyor. Boğazda hafif bir yakma var, tam olması gerektiği gibi. Ekmeğe banarak yiyoruz artık.',
    verified: true,
  },
  {
    id: 'r2',
    name: 'Mert Aksoy',
    avatar: AVATAR.a3,
    rating: 5,
    date: '2026-05-30',
    title: 'Kargo ve paketleme kusursuz',
    comment:
      'Şişe köpükle sarılı, kutu içinde ayrı bölmede geldi. İki gün içinde elimdeydi. Ürünün arkasında hasat tarihi ve asit oranı yazması güven verdi.',
    verified: true,
  },
  {
    id: 'r3',
    name: 'Ayşe Demirtaş',
    avatar: AVATAR.a2,
    rating: 4,
    date: '2026-05-11',
    title: 'Aroması yoğun',
    comment:
      'Meyvemsi kokusu çok belirgin. Salatalarda harika ama ben biraz daha yumuşak bir tat beklemiştim; yine de kaliteli olduğu her hâlinden anlaşılıyor.',
    verified: true,
  },
  {
    id: 'r4',
    name: 'Burak Şen',
    avatar: AVATAR.a4,
    rating: 5,
    date: '2026-04-27',
    title: 'Üçüncü siparişim',
    comment:
      'Ailece tükettiğimiz için büyük boy alıyorum. Her seferinde aynı kalite. Soğukta bulanıklaşması da doğal olduğunun kanıtı zaten.',
    verified: true,
  },
  {
    id: 'r5',
    name: 'Zeynep Karaca',
    avatar: AVATAR.a6,
    rating: 5,
    date: '2026-04-09',
    title: 'Hediye olarak da aldım',
    comment:
      'Anneme hediye ettim, çok beğendi. Ambalajı sade ve şık duruyor, ayrıca not kartı ekleme seçeneği olması hoşuma gitti.',
    verified: true,
  },
  {
    id: 'r6',
    name: 'Onur Bilgin',
    avatar: AVATAR.a5,
    rating: 5,
    date: '2026-03-22',
    title: 'Fiyat performans',
    comment:
      'Bu kalitede bir ürün için fiyatı gayet makul. Litre bazında hesaplayınca büyük boy çok daha avantajlı çıkıyor.',
    verified: true,
  },
  {
    id: 'r7',
    name: 'Selin Aydın',
    avatar: AVATAR.a2,
    rating: 4,
    date: '2026-03-05',
    title: 'Güzel ama stok sorunu var',
    comment:
      'Ürünü çok beğendim, ancak sevdiğim gramaj sık sık tükeniyor. Stok bildirimi özelliği eklenirse harika olur.',
    verified: false,
  },
  {
    id: 'r8',
    name: 'Kaan Erdem',
    avatar: AVATAR.a7,
    rating: 5,
    date: '2026-02-14',
    title: 'Restoranımızda kullanıyoruz',
    comment:
      'Meze tabaklarında ve son dokunuşlarda tercih ediyoruz. Müşterilerden düzenli olarak “bu yağ nereden” sorusu geliyor.',
    verified: true,
  },
  {
    id: 'r9',
    name: 'Deniz Uçar',
    avatar: AVATAR.a1,
    rating: 5,
    date: '2026-01-28',
    title: 'Çocuklar bile fark etti',
    comment:
      'Evde herkes farkı hissetti. Özellikle taze ekmekle çok iyi gidiyor. Abonelik seçeneği olsa memnuniyetle kullanırdım.',
    verified: true,
  },
  {
    id: 'r10',
    name: 'Hakan Türkmen',
    avatar: AVATAR.a4,
    rating: 5,
    date: '2026-01-07',
    title: 'Tam bir Ege ürünü',
    comment:
      'Orhangazi’de büyüdüm, çocukluğumdaki tadı buldum diyebilirim. Katkısız olduğu tadından belli.',
    verified: true,
  },
];

function reviewsFor(index: number, count = 3): ProductReview[] {
  return Array.from({ length: count }, (_, i) => {
    const source = reviewPool[(index * 3 + i) % reviewPool.length];
    return { ...source, id: `${source.id}-p${index}` };
  });
}

/* -------------------------------------------------------------------------- */
/*  Products                                                                    */
/* -------------------------------------------------------------------------- */

type Draft = Omit<Product, 'nutrition' | 'faq' | 'reviews' | 'variants' | 'price' | 'oldPrice' | 'volume'> & {
  kind: 'oil' | 'olive';
  basePrice: number;
  discount?: number;
  /** Index of the variant selected by default */
  defaultVariant: number;
};

const drafts: Draft[] = [
  {
    kind: 'oil',
    id: 'p01',
    slug: 'ayvalik-naturel-sizma-zeytinyagi',
    name: 'Ayvalık Natürel Sızma Zeytinyağı',
    category: 'naturel-sizma',
    basePrice: 379,
    discount: 0.18,
    defaultVariant: 2,
    rating: 4.9,
    reviewCount: 428,
    image: IMG.cruetOlives,
    gallery: [
      IMG.cruetOlives,
      IMG.branchOlives,
      IMG.harvestCrate,
      IMG.heroGrove,
    ],
    shortDescription: 'Ayvalık yağlık zeytininden, ilk soğuk sıkım. Asit oranı %0,4.',
    description:
      'Ayvalık yağlık zeytini, Ege kıyısının tuzlu rüzgârıyla olgunlaşan ve zeytinyağı dünyasında adı efsaneleşmiş bir çeşittir. Bu ürün, hasattan sonraki ilk sekiz saat içinde 27 °C’yi aşmayan sıcaklıkta, yalnızca mekanik yöntemlerle sıkılır. Sonuç; badem ve taze biçilmiş ot notaları taşıyan, damakta yumuşak ama boğazda karakterini belli eden dengeli bir zeytinyağıdır. Günlük kullanım için tasarlandı: salatadan sebze yemeklerine, kahvaltıdan son dokunuşlara kadar her yerde rahatlıkla kullanabilirsiniz.',
    highlights: [
      'Hasattan sıkıma en fazla 8 saat',
      'Soğuk sıkım — 27 °C altında üretim',
      'Serbest asitlik: %0,4 (yasal sınır %0,8)',
      'Koyu cam şişe: ışığa karşı tam koruma',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Ayvalık (Edremit Yağlık)' },
      { label: 'Hasat Bölgesi', value: 'Orhangazi / Bursa' },
      { label: 'Hasat Zamanı', value: 'Kasım – Aralık' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım, sürekli sistem' },
      { label: 'Serbest Asitlik', value: '%0,4' },
      { label: 'Polifenol', value: '320 mg/kg' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 24 ay' },
    ],
    badge: 'Çok Satan',
    featured: true,
    inStock: true,
    stockCount: 42,
  },
  {
    kind: 'oil',
    id: 'p02',
    slug: 'erken-hasat-zeytinyagi',
    name: 'Erken Hasat Natürel Sızma Zeytinyağı',
    category: 'erken-hasat',
    basePrice: 489,
    discount: 0.12,
    defaultVariant: 0,
    rating: 5,
    reviewCount: 316,
    image: IMG.bottleLemon,
    gallery: [
      IMG.bottleLemon,
      IMG.branchMacro,
      IMG.harvestHand,
      IMG.groveField,
    ],
    shortDescription: 'Ekimin ilk haftasında toplanan yeşil zeytinden. Polifenol 520 mg/kg.',
    description:
      'Erken hasat, zeytin ağacının en cömert olduğu an değil; en karakterli olduğu andır. Meyve henüz yeşilken toplandığı için litre başına verim düşer, buna karşılık antioksidan değeri iki katına yaklaşır. Yoğun çimen yeşili rengi, enginar ve yeşil domates hatırlatan aroması, boğazda üç saniye süren o meşhur yakıcılık — hepsi yüksek polifenolün doğal işaretidir. Isıtmadan, çiğ olarak tüketmenizi öneririz.',
    highlights: [
      'Polifenol değeri: 520 mg/kg',
      'Ekim ayının ilk haftasında elle hasat',
      'Filtrelenmemiş, doğal bulanıklık',
      'Sınırlı sayıda üretilir',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Memecik' },
      { label: 'Hasat Bölgesi', value: 'Milas / Muğla' },
      { label: 'Hasat Zamanı', value: 'Ekim ilk hafta' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım, iki fazlı' },
      { label: 'Serbest Asitlik', value: '%0,22' },
      { label: 'Polifenol', value: '520 mg/kg' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 18 ay' },
    ],
    badge: 'Sınırlı Üretim',
    featured: true,
    inStock: true,
    stockCount: 8,
  },
  {
    kind: 'oil',
    id: 'p03',
    slug: 'tas-baski-zeytinyagi',
    name: 'Taş Baskı Zeytinyağı',
    category: 'tas-baski',
    basePrice: 439,
    defaultVariant: 1,
    rating: 4.8,
    reviewCount: 194,
    image: IMG.bottleDark,
    gallery: [
      IMG.bottleDark,
      IMG.olivesMixed,
      IMG.harvestNet,
      IMG.rocksTree,
    ],
    shortDescription: 'Granit değirmende düşük devirde ezilir. Geleneksel yöntem, yoğun aroma.',
    description:
      'Taş baskı, zeytinyağı üretiminin en eski ve en sabırlı yöntemidir. Zeytin, dakikada yalnızca 12 tur dönen granit taşlar arasında yavaşça ezilir. Metal presin yarattığı sürtünme ısısı oluşmadığı için aroma bileşenleri buharlaşmaz. Bu yağ, modern sistemlere göre daha yoğun bir gövdeye ve daha uzun süre damakta kalan bir tada sahiptir. Yılda yalnızca üç parti üretilir.',
    highlights: [
      'Granit değirmen, dakikada 12 devir',
      'Sürtünme ısısı yok — aroma korunur',
      'Yılda yalnızca 3 parti üretim',
      'Doğal dinlendirme ile berraklaştırma',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Domat & Memecik harmanı' },
      { label: 'Hasat Bölgesi', value: 'Akhisar / Manisa' },
      { label: 'Hasat Zamanı', value: 'Kasım' },
      { label: 'Üretim Yöntemi', value: 'Granit taş değirmen, hidrolik pres' },
      { label: 'Serbest Asitlik', value: '%0,5' },
      { label: 'Polifenol', value: '380 mg/kg' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 20 ay' },
    ],
    badge: 'Ödüllü',
    featured: true,
    inStock: true,
    stockCount: 23,
  },
  {
    kind: 'oil',
    id: 'p04',
    slug: 'soguk-sikim-gunluk-zeytinyagi',
    name: 'Soğuk Sıkım Günlük Zeytinyağı',
    category: 'naturel-sizma',
    basePrice: 329,
    discount: 0.22,
    defaultVariant: 2,
    rating: 4.7,
    reviewCount: 512,
    image: IMG.cruetCounter,
    gallery: [
      IMG.cruetCounter,
      IMG.olivesBasin,
      IMG.groveHill,
      IMG.foodTable,
    ],
    shortDescription: 'Her gün, her yemekte. Dengeli aroma, ekonomik hacimler.',
    description:
      'Mutfakta en çok tüketilen ürünümüz. Yumuşak ve dengeli profili sayesinde yemeğin kendi tadını bastırmaz; zeytinyağının orada olduğunu hissedersiniz ama öne çıkmaz. Sebze yemekleri, zeytinyağlılar, hamur işleri ve günlük salatalar için tasarlandı. 3 ve 5 litrelik tenekelerde litre maliyeti belirgin biçimde düşer.',
    highlights: [
      'Dengeli, yumuşak aroma profili',
      'Her tür pişirmeye uygun',
      'Büyük hacimlerde avantajlı fiyat',
      'Işık geçirmeyen teneke ambalaj seçeneği',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Ayvalık & Memecik harmanı' },
      { label: 'Hasat Bölgesi', value: 'Ege Bölgesi' },
      { label: 'Hasat Zamanı', value: 'Kasım – Ocak' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım' },
      { label: 'Serbest Asitlik', value: '%0,6' },
      { label: 'Polifenol', value: '240 mg/kg' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 24 ay' },
    ],
    featured: true,
    inStock: true,
    stockCount: 96,
  },
  {
    kind: 'oil',
    id: 'p05',
    slug: 'organik-naturel-sizma-zeytinyagi',
    name: 'Organik Natürel Sızma Zeytinyağı',
    category: 'organik-urunler',
    basePrice: 469,
    defaultVariant: 0,
    rating: 4.9,
    reviewCount: 231,
    image: IMG.bottlePourer,
    gallery: [
      IMG.bottlePourer,
      IMG.branchClose,
      IMG.leavesTilt,
      IMG.ingredients,
    ],
    shortDescription: 'Organik tarım sertifikalı bahçelerden. Sentetik gübre ve pestisit yok.',
    description:
      'Bu ürünün geldiği bahçelerde on iki yıldır sentetik gübre, herbisit veya pestisit kullanılmıyor. Toprak, keçiboynuzu ve baklagil ekimiyle besleniyor; zararlı kontrolü feromon tuzaklarıyla yapılıyor. Her parti, bağımsız bir sertifikasyon kuruluşu tarafından bahçeden şişeye kadar denetleniyor. Sertifika numarasını şişenin arka etiketinden doğrulayabilirsiniz.',
    highlights: [
      'Organik tarım sertifikalı (TR-ORG-XX)',
      '12 yıldır sentetik girdi kullanılmıyor',
      'Feromon tuzağı ile doğal zararlı kontrolü',
      'Parti bazında bağımsız laboratuvar analizi',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Memecik' },
      { label: 'Hasat Bölgesi', value: 'Ödemiş / İzmir' },
      { label: 'Hasat Zamanı', value: 'Kasım' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım, organik hat' },
      { label: 'Serbest Asitlik', value: '%0,3' },
      { label: 'Polifenol', value: '410 mg/kg' },
      { label: 'Sertifika', value: 'Organik Tarım — TR-ORG-XX' },
    ],
    badge: 'Yeni',
    featured: true,
    inStock: true,
    stockCount: 31,
  },
  {
    kind: 'olive',
    id: 'p06',
    slug: 'sofralik-karisik-zeytin',
    name: 'Sofralık Karışık Zeytin',
    category: 'sofralik-zeytin',
    basePrice: 189,
    discount: 0.15,
    defaultVariant: 1,
    rating: 4.8,
    reviewCount: 287,
    image: IMG.olivesBowls,
    gallery: [
      IMG.olivesBowls,
      IMG.olivesMixed,
      IMG.mezeTable,
      IMG.foodSpread,
    ],
    shortDescription: 'Yeşil ve siyah çeşitlerin dengeli harmanı. Doğal salamura.',
    description:
      'Üç farklı olgunlukta zeytinin bir arada sunulduğu kahvaltı harmanı. Yeşil kırma zeytinin dirençli dokusu, hurma siyahın yumuşak tatlılığı ve çizik yeşilin tuzlu keskinliği aynı tabakta buluşuyor. Yalnızca kaya tuzu ve zamanla, ortalama dört ay doğal fermantasyonla olgunlaştırılır.',
    highlights: [
      'Üç farklı zeytin çeşidi bir arada',
      'Doğal salamura — sirke ve koruyucu yok',
      '4 ay doğal fermantasyon',
      'Elle boylanmış, hasarlı taneler ayıklanmış',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Gemlik, Domat, Ayvalık' },
      { label: 'Kalibre', value: '201–230 adet/kg' },
      { label: 'Salamura', value: 'Kaya tuzu, su' },
      { label: 'Tuz Oranı', value: '%5,5' },
      { label: 'Olgunlaştırma', value: '4 ay' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 12 ay' },
    ],
    badge: 'Çok Satan',
    featured: true,
    inStock: true,
    stockCount: 64,
  },
  {
    kind: 'olive',
    id: 'p07',
    slug: 'yesil-kirma-zeytin',
    name: 'Yeşil Kırma Zeytin',
    category: 'sofralik-zeytin',
    basePrice: 169,
    defaultVariant: 0,
    rating: 4.7,
    reviewCount: 176,
    image: IMG.olivesGreen,
    gallery: [
      IMG.olivesGreen,
      IMG.olivesBasin,
      IMG.branchMacro,
      IMG.mezeTable,
    ],
    shortDescription: 'Taşla kırılmış, limon ve kekikle harmanlanmış çıtır yeşil zeytin.',
    description:
      'Zeytin, acılığını daha hızlı bırakması için hasat sonrası taşla hafifçe kırılır. Ardından kaya tuzu, limon dilimleri ve dağ kekiğiyle birlikte salamuraya alınır. Dokusu diri, tadı canlı ve keskindir. Kahvaltıda, rakı sofrasında ve zeytinyağlı mezelerin yanında en çok tercih edilen çeşidimizdir.',
    highlights: [
      'Elle taşla kırma yöntemi',
      'Limon ve dağ kekiği ile aromalandırma',
      'Diri, çıtır doku',
      'Sirke içermez',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Domat' },
      { label: 'Kalibre', value: '141–160 adet/kg' },
      { label: 'Salamura', value: 'Kaya tuzu, limon, kekik' },
      { label: 'Tuz Oranı', value: '%6' },
      { label: 'Olgunlaştırma', value: '2 ay' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 10 ay' },
    ],
    featured: true,
    inStock: true,
    stockCount: 47,
  },
  {
    kind: 'olive',
    id: 'p08',
    slug: 'gemlik-hurma-siyah-zeytin',
    name: 'Gemlik Hurma Siyah Zeytin',
    category: 'sofralik-zeytin',
    basePrice: 199,
    discount: 0.1,
    defaultVariant: 1,
    rating: 4.9,
    reviewCount: 342,
    image: IMG.olivesMixed,
    gallery: [
      IMG.olivesMixed,
      IMG.olivesDark,
      IMG.foodTable,
      IMG.harvestCrate,
    ],
    shortDescription: 'Ağacında olgunlaşıp kendiliğinden tatlanan, yağlı ve yumuşak Gemlik.',
    description:
      'Hurma zeytin, dalında bırakılarak kendi doğal şekeriyle acılığını kaybeden nadir bir üründür. Salamuraya girmeden önce ağaçta geçirdiği bu ekstra süre, ona buruşuk kabuğunu ve yoğun, neredeyse tatlı tadını verir. Yüksek yağ oranı sayesinde ekmeğe sürülebilecek kadar yumuşaktır.',
    highlights: [
      'Ağacında doğal olarak tatlanır',
      'Yüksek yağ oranı — %28',
      'Kuru sele yöntemiyle olgunlaştırma',
      'Sınırlı hasat penceresi: 3 hafta',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Gemlik' },
      { label: 'Kalibre', value: '231–260 adet/kg' },
      { label: 'Salamura', value: 'Kuru sele, kaya tuzu' },
      { label: 'Yağ Oranı', value: '%28' },
      { label: 'Olgunlaştırma', value: '5 ay' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 12 ay' },
    ],
    featured: true,
    inStock: true,
    stockCount: 3,
  },
  {
    kind: 'oil',
    id: 'p09',
    slug: 'filtresiz-erken-hasat-zeytinyagi',
    name: 'Filtresiz Erken Hasat Zeytinyağı',
    category: 'erken-hasat',
    basePrice: 529,
    defaultVariant: 0,
    rating: 4.8,
    reviewCount: 98,
    image: IMG.harvestHand,
    gallery: [
      IMG.harvestHand,
      IMG.harvestNet,
      IMG.branchOlives,
      IMG.groveField,
    ],
    shortDescription: 'Hiç filtrelenmeden şişelenir. Bulanık görünüm, maksimum aroma.',
    description:
      'Filtreleme, zeytinyağını berraklaştırır ama aynı zamanda aromanın bir bölümünü de alıp götürür. Bu üründe filtreleme adımını tamamen çıkardık. Şişenin dibinde zamanla oluşan ince tortu, zeytin meyvesinin kendisidir. Kullanmadan önce şişeyi hafifçe çevirmeniz yeterli. Tazeyken tüketilmesi için üretilmiştir; sezon içinde bitirmenizi öneririz.',
    highlights: [
      'Filtresiz — hiçbir aroma kaybı yok',
      'Sezon içinde tüketim için üretildi',
      'Elle hasat, aynı gün sıkım',
      'Parti numarası ile izlenebilir',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Memecik' },
      { label: 'Hasat Bölgesi', value: 'Milas / Muğla' },
      { label: 'Hasat Zamanı', value: 'Ekim' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım, filtresiz' },
      { label: 'Serbest Asitlik', value: '%0,25' },
      { label: 'Polifenol', value: '490 mg/kg' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 12 ay' },
    ],
    badge: 'Sınırlı Üretim',
    inStock: true,
    stockCount: 12,
  },
  {
    kind: 'olive',
    id: 'p10',
    slug: 'cizik-yesil-zeytin',
    name: 'Çizik Yeşil Zeytin',
    category: 'sofralik-zeytin',
    basePrice: 159,
    defaultVariant: 0,
    rating: 4.6,
    reviewCount: 143,
    image: IMG.olivesPile,
    gallery: [
      IMG.olivesPile,
      IMG.olivesGreen,
      IMG.mezeTable,
      IMG.branchClose,
    ],
    shortDescription: 'Bıçakla çizilerek salamuraya alınan, tuzlu ve keskin klasik.',
    description:
      'Her tane, salamuranın içeri işlemesi için bıçakla üç kez çizilir. Bu emek yoğun yöntem, zeytinin dokusunu bozmadan acılığını almasını sağlar. Sonuç; dışı diri, içi tam olarak tatlanmış, tuzlu ve keskin bir klasik. Ege kahvaltı sofralarının değişmeyeni.',
    highlights: [
      'Her tane elle üç kez çizilir',
      'Doku bozulmadan acılık giderilir',
      'Yoğun, tuzlu karakter',
      'Katkısız salamura',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Ayvalık' },
      { label: 'Kalibre', value: '161–180 adet/kg' },
      { label: 'Salamura', value: 'Kaya tuzu, su' },
      { label: 'Tuz Oranı', value: '%6,5' },
      { label: 'Olgunlaştırma', value: '3 ay' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 10 ay' },
    ],
    inStock: true,
    stockCount: 58,
  },
  {
    kind: 'olive',
    id: 'p11',
    slug: 'organik-salamura-yesil-zeytin',
    name: 'Organik Salamura Yeşil Zeytin',
    category: 'organik-urunler',
    basePrice: 219,
    defaultVariant: 0,
    rating: 4.8,
    reviewCount: 89,
    image: IMG.olivesBasin,
    gallery: [
      IMG.olivesBasin,
      IMG.olivesBowls,
      IMG.leavesGreen,
      IMG.ingredients,
    ],
    shortDescription: 'Organik sertifikalı bahçelerden, yalnızca tuz ve suyla olgunlaştırılmış.',
    description:
      'Organik tarım sertifikalı bahçelerimizden toplanan Domat zeytinleri, hiçbir hızlandırıcı kullanılmadan, geleneksel takvimle olgunlaştırılır. Kostik veya kimyasal acılık giderme işlemi uygulanmaz; bu yüzden hazır olması altı ayı bulur. Karşılığında zeytinin kendi tadını bozmayan, temiz bir profil elde edersiniz.',
    highlights: [
      'Organik tarım sertifikalı',
      'Kostik kullanılmaz — tamamen doğal fermantasyon',
      '6 ay olgunlaştırma',
      'Cam kavanozda, salamurasıyla birlikte',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Domat' },
      { label: 'Kalibre', value: '121–140 adet/kg' },
      { label: 'Salamura', value: 'Kaya tuzu, su' },
      { label: 'Tuz Oranı', value: '%5' },
      { label: 'Olgunlaştırma', value: '6 ay' },
      { label: 'Sertifika', value: 'Organik Tarım — TR-ORG-XX' },
    ],
    badge: 'Yeni',
    inStock: true,
    stockCount: 26,
  },
  {
    kind: 'olive',
    id: 'p12',
    slug: 'siyah-sele-zeytin',
    name: 'Siyah Sele Zeytin',
    category: 'sofralik-zeytin',
    basePrice: 209,
    discount: 0.12,
    defaultVariant: 1,
    rating: 4.7,
    reviewCount: 205,
    image: IMG.olivesDark,
    gallery: [
      IMG.olivesDark,
      IMG.olivesMixed,
      IMG.harvestCrate,
      IMG.foodSpread,
    ],
    shortDescription: 'Kuru tuzla, hasır selelerde olgunlaştırılan buruşuk siyah zeytin.',
    description:
      'Sele zeytin, salamura yerine kuru kaya tuzuyla, hasır seleler içinde katmanlanarak olgunlaştırılır. Tuz, zeytinin suyunu yavaşça çeker; geriye yoğunlaşmış aroma ve karakteristik buruşuk kabuk kalır. Zeytinyağıyla harmanlanıp servis edildiğinde en iyi hâline ulaşır.',
    highlights: [
      'Hasır selede kuru tuz yöntemi',
      'Su oranı düşük, aroma yoğun',
      'Zeytinyağıyla harmanlanarak paketlenir',
      'Geleneksel Ege usulü',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Gemlik' },
      { label: 'Kalibre', value: '261–290 adet/kg' },
      { label: 'Yöntem', value: 'Kuru sele, kaya tuzu' },
      { label: 'Tuz Oranı', value: '%7' },
      { label: 'Olgunlaştırma', value: '4 ay' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 12 ay' },
    ],
    inStock: true,
    stockCount: 39,
  },
  {
    kind: 'oil',
    id: 'p13',
    slug: 'sinirli-uretim-tek-bahce-zeytinyagi',
    name: 'Sınırlı Üretim Tek Bahçe Zeytinyağı',
    category: 'erken-hasat',
    basePrice: 649,
    defaultVariant: 0,
    rating: 5,
    reviewCount: 61,
    image: IMG.branchClose,
    gallery: [
      IMG.branchClose,
      IMG.loneTree,
      IMG.heroGrove,
      IMG.bottleDark,
    ],
    shortDescription: 'Tek bir bahçenin, tek bir günün hasadı. Numaralandırılmış 900 şişe.',
    description:
      'Orhangazi’nin kuzeyinde, İznik Gölü’ne bakan yamaçtaki 140 yaşındaki ağaçlardan oluşan tek bir bahçenin ürünü. Hasat tek günde, elle yapılır ve aynı akşam sıkılır. Yılda yalnızca 900 şişe çıkar; her şişe numaralandırılır ve hasat ekibinin adı etikete işlenir. Bu, bir zeytinyağından çok, o yılın kaydıdır.',
    highlights: [
      'Tek bahçe, tek gün hasat',
      'Yılda 900 numaralı şişe',
      '140 yaşında ağaçlar',
      'Etiketinde hasat ekibinin adı',
    ],
    specs: [
      { label: 'Zeytin Çeşidi', value: 'Ayvalık (Edremit Yağlık)' },
      { label: 'Hasat Bölgesi', value: 'Ortaköy / Orhangazi' },
      { label: 'Hasat Zamanı', value: '9 Ekim, tek gün' },
      { label: 'Üretim Yöntemi', value: 'Soğuk sıkım, aynı gün' },
      { label: 'Serbest Asitlik', value: '%0,18' },
      { label: 'Polifenol', value: '580 mg/kg' },
      { label: 'Üretim Adedi', value: '900 şişe' },
    ],
    badge: 'Ödüllü',
    inStock: true,
    stockCount: 17,
  },
  {
    kind: 'oil',
    id: 'p14',
    slug: 'organik-hediye-seti',
    name: 'Organik Zeytinyağı Hediye Seti',
    category: 'organik-urunler',
    basePrice: 749,
    discount: 0.2,
    defaultVariant: 0,
    rating: 4.9,
    reviewCount: 112,
    image: IMG.ingredients,
    gallery: [
      IMG.ingredients,
      IMG.foodSpread,
      IMG.cruetOlives,
      IMG.aegeanTables,
    ],
    shortDescription: 'İki şişe organik zeytinyağı, sofralık zeytin ve el yapımı sabun.',
    description:
      'Ahşap kutuda sunulan hediye setimiz; 250 ml organik natürel sızma zeytinyağı, 250 ml erken hasat zeytinyağı, 400 g organik salamura yeşil zeytin ve zeytinyağından üretilmiş el yapımı sabundan oluşur. Sipariş sırasında not kartı ekleyebilir, doğrudan alıcının adresine gönderebilirsiniz.',
    highlights: [
      'Ahşap hediye kutusunda',
      'Dört ürünlük özenli seçki',
      'Ücretsiz el yazısı not kartı',
      'Doğrudan alıcı adresine gönderim',
    ],
    specs: [
      { label: 'İçerik', value: '2 × 250 ml zeytinyağı' },
      { label: 'İçerik', value: '400 g sofralık zeytin' },
      { label: 'İçerik', value: '1 × zeytinyağı sabunu' },
      { label: 'Ambalaj', value: 'Ahşap kutu, geri dönüştürülebilir dolgu' },
      { label: 'Sertifika', value: 'Organik Tarım — TR-ORG-XX' },
      { label: 'Raf Ömrü', value: 'Üretimden itibaren 18 ay' },
    ],
    inStock: true,
    stockCount: 21,
  },
];

export const products: Product[] = drafts.map((draft, index) => {
  const { kind, basePrice, discount, defaultVariant, ...rest } = draft;
  const variants = kind === 'oil' ? oilVariants(basePrice, discount) : oliveVariants(basePrice, discount);
  const active = variants[defaultVariant] ?? variants[0];
  return {
    ...rest,
    variants,
    price: active.price,
    oldPrice: active.oldPrice,
    volume: active.label,
    nutrition: kind === 'oil' ? oilNutrition : oliveNutrition,
    faq: kind === 'oil' ? oilFaq : oliveFaq,
    reviews: reviewsFor(index),
  };
});

export const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

/** Highest rated products in the same category, excluding the product itself. */
export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const fillers = products.filter(
    (p) => p.category !== product.category && p.id !== product.id,
  );
  return [...sameCategory, ...fillers].slice(0, limit);
}
