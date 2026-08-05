export type CategorySlug =
  | 'naturel-sizma'
  | 'erken-hasat'
  | 'tas-baski'
  | 'sofralik-zeytin'
  | 'organik-urunler';

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** Bento ızgarada geniş yerleşim alan kart */
  featured?: boolean;
}

/** Gramaj / hacim seçeneği. Fiyat her varyantta ayrı tanımlıdır. */
export interface ProductVariant {
  /** Kullanıcıya görünen etiket: "750 ml" */
  label: string;
  /** URL ve sepet anahtarı için sadeleştirilmiş değer: "750ml" */
  value: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
}

export interface NutritionRow {
  label: string;
  amount: string;
  /** Referans alıma göre yüzde — bazı satırlarda anlamsız olduğu için opsiyonel */
  daily?: string;
}

export interface ProductReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Varsayılan varyantın fiyatı — liste kartlarında bu gösterilir */
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  /** Varsayılan varyantın etiketi, ör. "1 L" */
  volume: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  nutrition: NutritionRow[];
  faq: FaqItem[];
  reviews: ProductReview[];
  badge?: 'Yeni' | 'Çok Satan' | 'Sınırlı Üretim' | 'Ödüllü';
  featured?: boolean;
  inStock: boolean;
  /** Stokta kalan adet — "son 3 ürün" uyarısı için */
  stockCount: number;
}

export interface CartItem {
  /** `${productId}:${variantValue}` — aynı ürünün farklı gramajı ayrı satırdır */
  key: string;
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variantLabel: string;
  quantity: number;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  date: string;
  readingTime: number;
  author: { name: string; role: string; avatar: string };
  /** Basit blok listesi — CMS'siz statik içerik */
  content: { type: 'p' | 'h2' | 'quote' | 'list'; text?: string; items?: string[] }[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  comment: string;
  product: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
  icon: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}
