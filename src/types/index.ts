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
  /** Card that spans a wide cell in the bento grid */
  featured?: boolean;
}

/** Weight / volume option. Each variant carries its own price. */
export interface ProductVariant {
  /** Label shown to the customer: "750 ml" */
  label: string;
  /** Simplified value for URLs and cart keys: "750ml" */
  value: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
}

export interface NutritionRow {
  label: string;
  amount: string;
  /** Percentage of reference intake — optional, since some rows have none */
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
  /** Price of the default variant — this is what list cards show */
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  /** Label of the default variant, e.g. "1 L" */
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
  /** Units left in stock — drives the "only 3 left" warning */
  stockCount: number;
}

export interface CartItem {
  /** `${productId}:${variantValue}` — different sizes of one product are separate rows */
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
  /** Plain block list — static content, no CMS */
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
