-- =============================================================================
--  Zeytin Bahçem — tek seferlik kurulum
--  Supabase Dashboard → SQL Editor → bu dosyanın tamamını yapıştırıp çalıştırın.
--
--  İçerik:
--    1) Şema      — 12 tablo, enum'lar, trigger'lar, indeksler
--    2) Güvenlik  — satır düzeyi güvenlik (RLS) politikaları
--    3) Başlangıç — kategoriler, kuponlar, site ayarları
--
--  Kaynak: supabase/migrations/*.sql + supabase/seed.sql
--  Tekrar çalıştırılabilir (idempotent).
-- =============================================================================


-- ─── supabase/migrations/20260804000001_initial_schema.sql ───────────────────────────────────────────────────────────

-- =============================================================================
--  Zeytin Bahçem — Başlangıç şeması
--  11 tablo: users, categories, products, orders, order_items, addresses,
--            favorites, cart, coupons, reviews, blogs, settings
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
--  Numaralandırmalar
-- -----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('customer', 'staff', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('card', 'transfer', 'cod');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type coupon_type as enum ('percent', 'amount', 'shipping');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
--  Ortak yardımcılar
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
--  users — auth.users tablosunun herkese açık profil izdüşümü
-- -----------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        user_role not null default 'customer',
  marketing_opt_in boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_role_idx on public.users (role);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Yeni kayıt olan her auth kullanıcısı için profil satırı üretilir.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Kayıt formundan gelen alanlar (full_name, phone, marketing_opt_in) ve
  -- Google'dan gelenler (name, avatar_url / picture) burada profile taşınır.
  insert into public.users (id, email, full_name, phone, avatar_url, marketing_opt_in)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do update
    set email = excluded.email,
        -- Kullanıcının panelden girdiği değer, sağlayıcıdan gelene tercih edilir.
        full_name = coalesce(public.users.full_name, excluded.full_name),
        phone = coalesce(public.users.phone, excluded.phone),
        avatar_url = coalesce(public.users.avatar_url, excluded.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Yetki kontrollerinde tekrar tekrar kullanılan yardımcı.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

-- -----------------------------------------------------------------------------
--  categories
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_featured boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_active_idx on public.categories (is_active, sort_order);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
--  products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  category_id   uuid references public.categories(id) on delete set null,
  short_description text,
  description   text,
  price         numeric(10,2) not null check (price >= 0),
  old_price     numeric(10,2) check (old_price is null or old_price >= price),
  -- Gramaj seçenekleri: [{ label, value, price, old_price, in_stock }]
  variants      jsonb not null default '[]'::jsonb,
  highlights    text[] not null default '{}',
  specs         jsonb not null default '[]'::jsonb,
  nutrition     jsonb not null default '[]'::jsonb,
  faq           jsonb not null default '[]'::jsonb,
  image_url     text,
  gallery       text[] not null default '{}',
  badge         text,
  volume        text,
  stock_count   int not null default 0 check (stock_count >= 0),
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  rating        numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count  int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active, is_featured);
create index if not exists products_slug_idx on public.products (slug);
-- Türkçe arama için basit metin araması
create index if not exists products_search_idx
  on public.products using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(short_description, '')));

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
--  addresses
-- -----------------------------------------------------------------------------
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null default 'Adresim',
  full_name   text not null,
  phone       text not null,
  city        text not null,
  district    text not null,
  address     text not null,
  postal_code text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

-- Kullanıcı başına yalnızca tek bir varsayılan adres bulunabilir.
create or replace function public.enforce_single_default_address()
returns trigger
language plpgsql
as $$
begin
  if new.is_default then
    update public.addresses
      set is_default = false
      where user_id = new.user_id and id <> new.id and is_default;
  end if;
  return new;
end;
$$;

drop trigger if exists addresses_single_default on public.addresses;
create trigger addresses_single_default
  after insert or update of is_default on public.addresses
  for each row when (new.is_default) execute function public.enforce_single_default_address();

-- -----------------------------------------------------------------------------
--  coupons
-- -----------------------------------------------------------------------------
create table if not exists public.coupons (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  type          coupon_type not null default 'percent',
  value         numeric(10,2) not null default 0,
  min_subtotal  numeric(10,2) not null default 0,
  description   text,
  usage_limit   int,
  usage_count   int not null default 0,
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists coupons_code_idx on public.coupons (upper(code));

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
--  orders
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text not null unique,
  user_id         uuid references public.users(id) on delete set null,
  -- Misafir siparişlerinde kullanıcı olmayabilir; iletişim bilgisi kopyalanır.
  email           text not null,
  phone           text not null,
  full_name       text not null,
  -- Adres, sipariş anındaki hâliyle dondurulur (sonradan değişse bile bozulmasın).
  shipping_address jsonb not null,
  subtotal        numeric(10,2) not null default 0,
  discount        numeric(10,2) not null default 0,
  shipping_cost   numeric(10,2) not null default 0,
  vat             numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  coupon_code     text,
  shipping_method text not null default 'standart',
  payment_method  payment_method not null default 'card',
  payment_status  payment_status not null default 'pending',
  status          order_status not null default 'pending',
  -- iyzico dönüş bilgileri
  payment_id      text,
  conversation_id text,
  tracking_number text,
  carrier         text,
  note            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);
create index if not exists orders_no_idx on public.orders (order_no);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Okunabilir sipariş numarası: ZB-YYMMDD-XXXX
create sequence if not exists public.order_no_seq;

create or replace function public.generate_order_no()
returns trigger
language plpgsql
as $$
begin
  if new.order_no is null or new.order_no = '' then
    new.order_no := 'ZB-' || to_char(now(), 'YYMMDD') || '-' ||
                    lpad((nextval('public.order_no_seq') % 10000)::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_generate_no on public.orders;
create trigger orders_generate_no
  before insert on public.orders
  for each row execute function public.generate_order_no();

-- -----------------------------------------------------------------------------
--  order_items
-- -----------------------------------------------------------------------------
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  -- Ürün sonradan silinse bile sipariş dökümü bozulmasın diye kopyalanır.
  product_name  text not null,
  product_slug  text not null,
  image_url     text,
  variant_label text not null,
  unit_price    numeric(10,2) not null,
  quantity      int not null check (quantity > 0),
  line_total    numeric(10,2) generated always as (unit_price * quantity) stored,
  created_at    timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

-- -----------------------------------------------------------------------------
--  favorites
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists favorites_user_idx on public.favorites (user_id);

-- -----------------------------------------------------------------------------
--  cart — oturumlar arası taşınan sepet
-- -----------------------------------------------------------------------------
create table if not exists public.cart (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete cascade,
  variant_value text not null,
  variant_label text not null,
  unit_price    numeric(10,2) not null,
  quantity      int not null default 1 check (quantity > 0 and quantity <= 99),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, product_id, variant_value)
);

create index if not exists cart_user_idx on public.cart (user_id);

drop trigger if exists cart_set_updated_at on public.cart;
create trigger cart_set_updated_at
  before update on public.cart
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
--  reviews
-- -----------------------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid references public.users(id) on delete set null,
  order_id    uuid references public.orders(id) on delete set null,
  author_name text not null,
  rating      int not null check (rating between 1 and 5),
  title       text,
  comment     text not null,
  status      review_status not null default 'pending',
  is_verified boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_id, status);
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- Onaylanan yorumlar ürünün puan ortalamasını günceller.
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p
  set rating = coalesce(agg.avg_rating, 0),
      review_count = coalesce(agg.total, 0)
  from (
    select round(avg(rating)::numeric, 1) as avg_rating, count(*) as total
    from public.reviews
    where product_id = target and status = 'approved'
  ) agg
  where p.id = target;
  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_product_rating();

-- -----------------------------------------------------------------------------
--  blogs
-- -----------------------------------------------------------------------------
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  cover_url     text,
  category      text,
  content       jsonb not null default '[]'::jsonb,
  author_name   text,
  author_role   text,
  author_avatar text,
  reading_time  int not null default 5,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blogs_published_idx on public.blogs (is_published, published_at desc);

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
--  settings — tek satırlık anahtar/değer deposu
-- -----------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

insert into public.settings (key, value) values
  ('store', '{"name":"Zeytin Bahçem","phone":"+90 232 555 04 12","email":"merhaba@zeytinbahcem.com","free_shipping_threshold":500}'::jsonb),
  ('shipping', '{"standard":79.9,"express":149.9,"cod_fee":39.9}'::jsonb),
  ('payment', '{"vat_rate":0.20,"transfer_discount":0.03,"installments":true}'::jsonb),
  ('slider', '[]'::jsonb)
on conflict (key) do nothing;

-- ─── supabase/migrations/20260804000002_rls_policies.sql ───────────────────────────────────────────────────────────

-- =============================================================================
--  Satır düzeyi güvenlik (RLS)
--  Kural: müşteri yalnızca kendi verisini görür; katalog herkese açıktır;
--         yazma yetkisi admin/staff rolündedir.
-- =============================================================================

alter table public.users       enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.addresses   enable row level security;
alter table public.coupons     enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites   enable row level security;
alter table public.cart        enable row level security;
alter table public.reviews     enable row level security;
alter table public.blogs       enable row level security;
alter table public.settings    enable row level security;

-- -----------------------------------------------------------------------------
--  users
-- -----------------------------------------------------------------------------
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users_admin_all" on public.users;
create policy "users_admin_all" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  categories & products & blogs — okuma herkese açık
-- -----------------------------------------------------------------------------
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (is_active or public.is_admin());

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_active or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blogs_public_read" on public.blogs;
create policy "blogs_public_read" on public.blogs
  for select using (is_published or public.is_admin());

drop policy if exists "blogs_admin_write" on public.blogs;
create policy "blogs_admin_write" on public.blogs
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  addresses / favorites / cart — yalnızca sahibi
-- -----------------------------------------------------------------------------
drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cart_own" on public.cart;
create policy "cart_own" on public.cart
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
--  orders — müşteri kendi siparişini görür, düzenleyemez
-- -----------------------------------------------------------------------------
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "orders_admin_write" on public.orders;
create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

drop policy if exists "order_items_admin_write" on public.order_items;
create policy "order_items_admin_write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  coupons — geçerli kuponlar herkese okunabilir (sepette doğrulanır)
-- -----------------------------------------------------------------------------
drop policy if exists "coupons_public_read" on public.coupons;
create policy "coupons_public_read" on public.coupons
  for select using (
    public.is_admin()
    or (
      is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    )
  );

drop policy if exists "coupons_admin_write" on public.coupons;
create policy "coupons_admin_write" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  reviews — onaylı yorumlar herkese açık; kullanıcı kendi yorumunu yazar
-- -----------------------------------------------------------------------------
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (status = 'approved' or auth.uid() = user_id or public.is_admin());

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);

drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  settings — okuma herkese açık, yazma admin
-- -----------------------------------------------------------------------------
drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read" on public.settings
  for select using (true);

drop policy if exists "settings_admin_write" on public.settings;
create policy "settings_admin_write" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ─── supabase/seed.sql ───────────────────────────────────────────────────────────

-- =============================================================================
--  Başlangıç verisi
--
--  Kategoriler, kuponlar ve site ayarları burada tanımlıdır.
--  Ürünler ve blog yazıları uygulamanın kendi tipli kataloğundan aktarılır:
--      POST /api/admin/seed   (SUPABASE_SERVICE_ROLE_KEY gerektirir)
--  Böylece tek bir doğruluk kaynağı korunur, veri iki yerde tekrarlanmaz.
-- =============================================================================

insert into public.categories (slug, name, tagline, description, sort_order, is_featured) values
  ('naturel-sizma', 'Natürel Sızma', 'Asit oranı %0,8’in altında',
   'Hiçbir kimyasal işlem görmeden, yalnızca mekanik yöntemlerle elde edilen en saf zeytinyağı sınıfı.', 1, true),
  ('erken-hasat', 'Erken Hasat', 'Ekim ayının ilk haftası',
   'Zeytin henüz yeşilken toplanır. Polifenol değeri yüksek, yoğun yeşil renkli, karakteristik yakıcılığa sahip.', 2, false),
  ('tas-baski', 'Taş Baskı', 'Geleneksel granit değirmen',
   'Zeytin, granit taşlar arasında düşük devirde ezilir. Yavaş üretim aromayı olduğu gibi korur.', 3, false),
  ('sofralik-zeytin', 'Sofralık Zeytin', 'Doğal salamura, katkısız',
   'Gemlik, Ayvalık ve Domat çeşitleri; yalnızca kaya tuzu ve zamanla olgunlaştırılır.', 4, false),
  ('organik-urunler', 'Organik Ürünler', 'Sertifikalı organik tarım',
   'Bahçeden şişeye kadar her aşaması bağımsız kuruluşlarca denetlenen organik ürün ailemiz.', 5, false)
on conflict (slug) do update
  set name = excluded.name,
      tagline = excluded.tagline,
      description = excluded.description,
      sort_order = excluded.sort_order,
      is_featured = excluded.is_featured;

insert into public.coupons (code, type, value, min_subtotal, description, usage_limit) values
  ('HASAT10',     'percent',  0.10,    0, 'Tüm siparişlerde %10 indirim',                1000),
  ('ZEYTIN25',    'percent',  0.25, 1500, '1.500 ₺ ve üzeri siparişlerde %25 indirim',    500),
  ('ILKSIPARIS',  'amount',  150.00,  750, 'İlk siparişe 150 ₺ indirim',                  5000),
  ('KARGOBEDAVA', 'shipping',   0,     0, 'Kargo ücreti bizden',                         2000)
on conflict (code) do update
  set type = excluded.type,
      value = excluded.value,
      min_subtotal = excluded.min_subtotal,
      description = excluded.description,
      usage_limit = excluded.usage_limit;

insert into public.settings (key, value) values
  ('store', jsonb_build_object(
     'name', 'Zeytin Bahçem',
     'legal_name', 'Zeytin Bahçem Tarım Ürünleri Ltd. Şti.',
     'phone', '+90 232 555 04 12',
     'whatsapp', '+90 532 555 04 12',
     'email', 'merhaba@zeytinbahcem.com',
     'address', 'Zeytinlik Mah. Hasat Cad. No: 12, Ayvalık / Balıkesir',
     'free_shipping_threshold', 500
   )),
  ('shipping', jsonb_build_object(
     'standard', 79.9, 'express', 149.9, 'pickup', 0, 'cod_fee', 39.9,
     'same_day_cutoff', '14:00'
   )),
  ('payment', jsonb_build_object(
     'vat_rate', 0.20, 'transfer_discount', 0.03,
     'installments', true, 'three_d_secure', true
   ))
on conflict (key) do update set value = excluded.value;

-- -----------------------------------------------------------------------------
--  İlk yöneticiyi yetkilendirme
--  Supabase Auth üzerinden kayıt olduktan sonra aşağıdaki satırı çalıştırın:
-- -----------------------------------------------------------------------------
-- update public.users set role = 'admin' where email = 'sizin@epostaniz.com';
