import type { Feature, InstagramPost, Stat, Testimonial } from '@/types';
import { AVATAR, IMG, img } from '@/lib/images';

export const stats: Stat[] = [
  {
    id: 'natural',
    value: 100,
    suffix: '%',
    label: 'Doğal',
    description: 'Katkı, koruyucu ve aroma maddesi içermez',
    icon: 'Leaf',
  },
  {
    id: 'coldpress',
    value: 27,
    prefix: '<',
    suffix: '°C',
    label: 'Soğuk Sıkım',
    description: 'Aromayı bozmayan düşük sıcaklıkta üretim',
    icon: 'Droplets',
  },
  {
    id: 'shipping',
    value: 500,
    suffix: '₺',
    label: 'Ücretsiz Kargo',
    description: 'Bu tutar üzeri tüm siparişlerde',
    icon: 'Truck',
  },
  {
    id: 'customers',
    value: 12500,
    suffix: '+',
    label: 'Memnun Müşteri',
    description: '4,9 ortalama puan ile değerlendirildi',
    icon: 'Heart',
  },
];

export const features: Feature[] = [
  {
    id: 'natural',
    title: 'Doğal Üretim',
    description:
      'Bahçeden şişeye tek bir kimyasal işlem yok. Zeytin, yalnızca mekanik yöntemlerle yağına dönüşür.',
    icon: 'Leaf',
  },
  {
    id: 'additive-free',
    title: 'Katkısız',
    description:
      'Renklendirici, koruyucu, aroma maddesi ve rafine yağ karışımı kullanılmaz. Etikette ne yazıyorsa şişede o vardır.',
    icon: 'ShieldCheck',
  },
  {
    id: 'early-harvest',
    title: 'Erken Hasat',
    description:
      'Zeytin henüz yeşilken toplanır. Verim düşer, polifenol iki katına çıkar. Biz ikincisini seçiyoruz.',
    icon: 'Sprout',
  },
  {
    id: 'cold-press',
    title: 'Soğuk Sıkım',
    description:
      'Sıkım sıcaklığı 27 °C’yi geçmez. Aroma bileşenleri ve antioksidanlar ısıyla buharlaşmadan şişeye girer.',
    icon: 'Droplets',
  },
  {
    id: 'fast-delivery',
    title: 'Hızlı Teslimat',
    description:
      'Saat 14.00’a kadar verilen siparişler aynı gün kargoda. Türkiye genelinde ortalama teslimat 1–3 iş günü.',
    icon: 'Truck',
  },
  {
    id: 'secure-payment',
    title: 'Güvenli Ödeme',
    description:
      '256-bit SSL şifreleme ve 3D Secure doğrulama. Kart bilgileriniz hiçbir aşamada tarafımızda saklanmaz.',
    icon: 'Lock',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Elif Yıldırım',
    city: 'İzmir',
    avatar: img(AVATAR.a1, 160, 160),
    rating: 5,
    comment:
      'Zeytinyağını ilk açtığımda mutfağın kokusu değişti. Boğazda bıraktığı o hafif yakıcılık, gerçek erken hasat olduğunun kanıtı. Üç yıldır başka marka almıyorum.',
    product: 'Erken Hasat Natürel Sızma',
  },
  {
    id: 't2',
    name: 'Mert Aksoy',
    city: 'Ankara',
    avatar: img(AVATAR.a3, 160, 160),
    rating: 5,
    comment:
      'Etiketin arkasında hasat tarihi, asit oranı ve parti numarası yazıyor. Bu şeffaflığı başka hiçbir yerde göremedim. Ürün de tam anlatıldığı gibi çıktı.',
    product: 'Ayvalık Natürel Sızma',
  },
  {
    id: 't3',
    name: 'Ayşe Demirtaş',
    city: 'İstanbul',
    avatar: img(AVATAR.a2, 160, 160),
    rating: 5,
    comment:
      'Kahvaltı sofram için sofralık zeytin siparişi verdim, kargo iki günde geldi. Zeytinler diri, tuz dengesi tam kararında. Ailem “bunları nereden buldun” diye sordu.',
    product: 'Sofralık Karışık Zeytin',
  },
  {
    id: 't4',
    name: 'Burak Şen',
    city: 'Bursa',
    avatar: img(AVATAR.a4, 160, 160),
    rating: 5,
    comment:
      'Restoranımızda meze tabaklarının son dokunuşunda kullanıyoruz. Misafirlerimiz düzenli olarak hangi yağ olduğunu soruyor. Toplu siparişte de aynı özen var.',
    product: 'Taş Baskı Zeytinyağı',
  },
  {
    id: 't5',
    name: 'Zeynep Karaca',
    city: 'Antalya',
    avatar: img(AVATAR.a6, 160, 160),
    rating: 5,
    comment:
      'Hediye setini anneme gönderdim, el yazısı notu görünce çok duygulandı. Ahşap kutusu da o kadar güzel ki attırmadı, mutfakta kullanıyor.',
    product: 'Organik Hediye Seti',
  },
  {
    id: 't6',
    name: 'Onur Bilgin',
    city: 'Eskişehir',
    avatar: img(AVATAR.a5, 160, 160),
    rating: 5,
    comment:
      'Buzdolabına koyduğumda bulanıklaştı, önce endişelendim. Sonra sitedeki yazıyı okudum — meğer katkısız olduğunun en pratik testiymiş. Böyle bilgilendirme çok kıymetli.',
    product: 'Soğuk Sıkım Günlük',
  },
];

export const instagramPosts: InstagramPost[] = [
  {
    id: 'ig1',
    image: img(IMG.heroGrove, 600, 600),
    caption: 'Sabahın altıda bahçedeyiz. Hasat başlıyor.',
    likes: 1284,
    comments: 46,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig2',
    image: img(IMG.harvestCrate, 600, 600),
    caption: 'Elle toplanan her tane ayrı ayrı seçiliyor.',
    likes: 962,
    comments: 31,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig3',
    image: img(IMG.cruetOlives, 600, 600),
    caption: 'İlk sıkım. Rengine bakın.',
    likes: 2107,
    comments: 88,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig4',
    image: img(IMG.olivesBowls, 600, 600),
    caption: 'Pazar kahvaltısı hazırlıkları 🫒',
    likes: 1743,
    comments: 64,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig5',
    image: img(IMG.branchMacro, 600, 600),
    caption: 'Ekimin ilk haftası: erken hasat zamanı.',
    likes: 1189,
    comments: 27,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig6',
    image: img(IMG.aegeanPath, 600, 600),
    caption: 'Bahçeye giden yol. Ayvalık, sabah.',
    likes: 1521,
    comments: 52,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig7',
    image: img(IMG.mezeTable, 600, 600),
    caption: 'Zeytinyağlı mezeler, uzun sofralar.',
    likes: 2384,
    comments: 103,
    href: 'https://instagram.com/',
  },
  {
    id: 'ig8',
    image: img(IMG.loneTree, 600, 600),
    caption: '140 yaşında. Hâlâ meyve veriyor.',
    likes: 3016,
    comments: 141,
    href: 'https://instagram.com/',
  },
];
