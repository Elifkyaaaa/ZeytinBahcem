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
