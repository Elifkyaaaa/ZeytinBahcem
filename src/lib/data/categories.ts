import type { Category } from '@/types';
import { IMG } from '@/lib/images';

export const categories: Category[] = [
  {
    slug: 'naturel-sizma',
    name: 'Natürel Sızma',
    tagline: 'Asit oranı %0,8’in altında',
    description:
      'Hiçbir kimyasal işlem görmeden, yalnızca mekanik yöntemlerle elde edilen en saf zeytinyağı sınıfı. Meyvemsi aroması ve dengeli acılığıyla günlük kullanımın vazgeçilmezi.',
    image: IMG.cruetOlives,
    featured: true,
  },
  {
    slug: 'erken-hasat',
    name: 'Erken Hasat',
    tagline: 'Ekim ayının ilk haftası',
    description:
      'Zeytin henüz yeşilken toplanır. Polifenol değeri yüksek, yoğun yeşil renkli, boğazda hissedilen karakteristik yakıcılığa sahip özel bir üretim.',
    image: IMG.branchMacro,
  },
  {
    slug: 'tas-baski',
    name: 'Taş Baskı',
    tagline: 'Geleneksel granit değirmen',
    description:
      'Zeytin, granit taşlar arasında düşük devirde ezilir. Yavaş üretim, aromayı ve yağın doğal yapısını olduğu gibi korur.',
    image: IMG.bottleDark,
  },
  {
    slug: 'sofralik-zeytin',
    name: 'Sofralık Zeytin',
    tagline: 'Doğal salamura, katkısız',
    description:
      'Gemlik, Ayvalık ve Domat çeşitleri; yalnızca kaya tuzu ve zamanla olgunlaştırılır. Sirke, koruyucu ya da renklendirici içermez.',
    image: IMG.olivesBowls,
  },
  {
    slug: 'organik-urunler',
    name: 'Organik Ürünler',
    tagline: 'Sertifikalı organik tarım',
    description:
      'Bahçeden şişeye kadar her aşaması bağımsız kuruluşlarca denetlenen, organik tarım sertifikalı ürün ailemiz.',
    image: IMG.ingredients,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
