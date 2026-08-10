/**
 * TypeScript projection of the Supabase schema, matching the SQL under
 * `supabase/migrations` exactly. When the schema changes, regenerate this with
 * `supabase gen types typescript`.
 */

export type UserRole = 'customer' | 'staff' | 'admin';
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
export type PaymentMethodDb = 'card' | 'transfer' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type CouponType = 'percent' | 'amount' | 'shipping';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ShippingAddressJson = {
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postal_code?: string | null;
}

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  marketing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductVariantJson = {
  label: string;
  value: string;
  price: number;
  old_price?: number | null;
  in_stock: boolean;
}

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  price: number;
  old_price: number | null;
  variants: ProductVariantJson[];
  highlights: string[];
  specs: { label: string; value: string }[];
  nutrition: { label: string; amount: string; daily?: string }[];
  faq: { question: string; answer: string }[];
  image_url: string | null;
  gallery: string[];
  badge: string | null;
  volume: string | null;
  stock_count: number;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export type AddressRow = {
  id: string;
  user_id: string;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type CouponRow = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_subtotal: number;
  description: string | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderRow = {
  id: string;
  order_no: string;
  user_id: string | null;
  email: string;
  phone: string;
  full_name: string;
  shipping_address: ShippingAddressJson;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  vat: number;
  total: number;
  coupon_code: string | null;
  shipping_method: string;
  payment_method: PaymentMethodDb;
  payment_status: PaymentStatus;
  status: OrderStatus;
  payment_id: string | null;
  conversation_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string;
  image_url: string | null;
  variant_label: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export type FavoriteRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export type CartRow = {
  id: string;
  user_id: string;
  product_id: string;
  variant_value: string;
  variant_label: string;
  unit_price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string | null;
  order_id: string | null;
  author_name: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string | null;
  content: { type: string; text?: string; items?: string[] }[];
  author_name: string | null;
  author_role: string | null;
  author_avatar: string | null;
  reading_time: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SettingRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

/** Helper types used to derive Insert and Update shapes. */
type Timestamps = 'id' | 'created_at' | 'updated_at';

/** Columns that accept null in the schema are optional on insert. */
type NullableKeys<T> = { [K in keyof T]-?: null extends T[K] ? K : never }[keyof T];

type Insertable<T, Optional extends keyof T> = Omit<T, Optional | NullableKeys<T>> &
  Partial<Pick<T, Optional | NullableKeys<T>>>;

/**
 * postgrest-js expects the `GenericTable` shape: Row/Insert/Update/Relationships.
 * We leave relationships empty because the query types do not use them.
 */
type Table<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      users: Table<UserRow, Insertable<UserRow, 'created_at' | 'updated_at'>>;
      categories: Table<CategoryRow, Insertable<CategoryRow, Timestamps>>;
      products: Table<ProductRow, Insertable<ProductRow, Timestamps>>;
      addresses: Table<AddressRow, Insertable<AddressRow, Timestamps>>;
      coupons: Table<CouponRow, Insertable<CouponRow, Timestamps>>;
      orders: Table<OrderRow, Insertable<OrderRow, Timestamps | 'order_no'>>;
      order_items: Table<OrderItemRow, Insertable<OrderItemRow, 'id' | 'created_at' | 'line_total'>>;
      favorites: Table<FavoriteRow, Insertable<FavoriteRow, 'id' | 'created_at'>>;
      cart: Table<CartRow, Insertable<CartRow, Timestamps>>;
      reviews: Table<ReviewRow, Insertable<ReviewRow, Timestamps>>;
      blogs: Table<BlogRow, Insertable<BlogRow, Timestamps>>;
      settings: Table<SettingRow, Insertable<SettingRow, 'updated_at'>>;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_method: PaymentMethodDb;
      payment_status: PaymentStatus;
      coupon_type: CouponType;
      review_status: ReviewStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
