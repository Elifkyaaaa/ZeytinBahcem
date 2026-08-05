# Zeytin Bahçem

Premium zeytin ve zeytinyağı e-ticaret uygulaması. Next.js App Router üzerine kurulu,
tam responsive, koyu tema destekli ve SEO odaklı bir vitrin; yanında müşteri paneli,
yönetim paneli ve uçtan uca sipariş akışı.

> **Önemli:** Proje, hiçbir servis anahtarı tanımlı olmadan da eksiksiz çalışır.
> Katalog `src/lib/data` altındaki tipli sabitlerden okunur; ödeme, mail ve görsel
> yükleme adımları demo modunda yürür. Bir anahtar grubu `.env.local` dosyasına
> eklendiği anda ilgili katman otomatik olarak gerçek servise geçer.

---

## Hızlı başlangıç

```bash
npm install
cp .env.local.example .env.local   # isteğe bağlı
npm run dev                        # http://localhost:3000
```

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm start` | Derlenmiş uygulamayı çalıştırır |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Teknoloji

| Katman | Seçim |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 · Tailwind CSS v4 (CSS-first `@theme`) |
| Animasyon | Framer Motion |
| İkonlar | lucide-react (marka ikonları `src/components/ui/icons.tsx` içinde özel SVG) |
| İstemci durumu | Zustand + `persist` |
| Tema | next-themes (class stratejisi) |
| Veritabanı & Auth | Supabase (Postgres + RLS + Google OAuth) |
| Görseller | Cloudinary (imzalı doğrudan yükleme) |
| Ödeme | iyzico Checkout Form (3D Secure) |
| E-posta | Resend |

---

## Klasör yapısı

```
.
├── middleware.ts                  # Oturum yenileme + yol koruması
├── supabase/
│   ├── migrations/                # 11 tablo, RLS politikaları, trigger'lar
│   └── seed.sql                   # Kategori, kupon ve site ayarları
├── src/
│   ├── app/
│   │   ├── (shop)/                # Vitrin — Header/Footer kabuğu
│   │   │   ├── page.tsx           # Ana sayfa (10 bölüm)
│   │   │   ├── urunler/           # Liste + [slug] detay
│   │   │   ├── sepet/  odeme/     # Sepet, checkout, ödeme sonucu
│   │   │   ├── hesap/             # Müşteri paneli (6 ekran)
│   │   │   ├── blog/  hakkimizda/ iletisim/ kurumsal/
│   │   │   ├── (legal)/[slug]/    # KVKK, gizlilik, iade, mesafeli satış
│   │   │   └── favoriler/ siparis-takibi/
│   │   ├── (auth)/                # Giriş, kayıt, şifremi unuttum + server action'lar
│   │   ├── admin/                 # Yönetim paneli (16 ekran, kendi kabuğu)
│   │   ├── api/                   # checkout, checkout/callback, upload, admin/seed
│   │   ├── auth/callback/         # OAuth & e-posta doğrulama dönüşü
│   │   ├── sitemap.ts robots.ts icon.svg not-found.tsx
│   │   └── globals.css            # Tasarım token'ları (@theme)
│   ├── components/
│   │   ├── layout/ home/ product/ cart/ checkout/ account/ auth/ admin/ ui/ seo/
│   ├── lib/
│   │   ├── data/                  # Katalog, içerik, yasal metinler, iller
│   │   ├── store/                 # cart, wishlist, checkout, ui (Zustand)
│   │   ├── images.ts              # Doğrulanmış Unsplash kimlikleri
│   │   ├── seo.ts  utils.ts
│   ├── hooks/                     # useHydrated, useScrollDirection, useCountUp…
│   ├── types/                     # Uygulama tipleri + Supabase şema tipleri
│   └── utils/                     # env, supabase/{client,server,middleware}, cloudinary, iyzico, mail
```

---

## Sayfalar

**Vitrin** — Ana sayfa (hero parallax, animasyonlu istatistikler, kategoriler, öne çıkan
ürünler, neden biz, video, yorum slider'ı, blog, Instagram, e-bülten), ürün listesi
(filtre + sıralama), ürün detayı (zoom galeri, gramaj seçimi, 5 sekme, benzer ürünler),
sepet, checkout, ödeme sonucu, blog + blog detayı, hakkımızda, iletişim, kurumsal,
sipariş takibi, favoriler, dört yasal sayfa, 404.

**Müşteri paneli** (`/hesap`) — Profil, Siparişlerim, Favoriler, Adreslerim,
Şifre Değiştir, Çıkış Yap.

**Yönetim paneli** (`/admin`) — Dashboard (4 KPI + alan/sütun/halka grafik + son
siparişler), Ürün, Kategori, Sipariş, Müşteri, Kampanya, Kupon, Stok, Yorum, Blog,
Slider, Görsel yönetimi; Site, Kargo, Ödeme ayarları ve Kullanıcı Yetkileri.
Grafikler harici kütüphane olmadan, saf SVG ile çizilir.

---

## Veritabanı

`supabase/migrations` altında iki dosya var: şema ve RLS politikaları.

**Tablolar:** `users`, `categories`, `products`, `orders`, `order_items`, `addresses`,
`favorites`, `cart`, `coupons`, `reviews`, `blogs`, `settings`

Öne çıkan noktalar:

- `auth.users` → `public.users` profil kopyası trigger ile otomatik oluşturulur
- Sipariş numarası (`ZB-YYMMDD-XXXX`) veritabanı trigger'ıyla üretilir
- Onaylanan yorumlar ürün puanını ve yorum sayısını otomatik günceller
- Kullanıcı başına tek varsayılan adres kısıtı trigger ile korunur
- Sipariş kalemleri ürün adını/görselini kopyalar — ürün silinse bile döküm bozulmaz
- Teslimat adresi sipariş anındaki hâliyle `jsonb` olarak dondurulur

### Kurulum

**1. Anahtarları girin** — `.env.local` içine `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve
`SUPABASE_SERVICE_ROLE_KEY` (Dashboard → Project Settings → API Keys).

**2. Şemayı uygulayın** — iki yol var, ikisi de aynı sonucu verir:

```bash
# A) Panelden — Dashboard → SQL Editor → supabase/setup.sql içeriğini yapıştırın
#    (şema + RLS + başlangıç verisi tek dosyada, tekrar çalıştırılabilir)

# B) CLI ile — veritabanı şifresi sorulur
npm run db:link
npm run db:push
```

**3. Doğrulayın ve katalogu aktarın:**

```bash
npm run db:check   # bağlantı + 12 tablo denetimi
npm run dev
npm run db:seed    # kategori, ürün ve blog verisini aktarır
```

**4. Kendinizi yönetici yapın** — `/kayit` üzerinden üye olduktan sonra SQL Editor'de:

```sql
update public.users set role = 'admin' where email = 'sizin@epostaniz.com';
```

| Komut | Açıklama |
| --- | --- |
| `npm run db:check` | Bağlantıyı ve tabloları denetler (salt okunur) |
| `npm run db:link` | Supabase CLI'ı projeye bağlar |
| `npm run db:push` | `supabase/migrations` klasörünü uygular |
| `npm run db:seed` | Katalogu `/api/admin/seed` üzerinden aktarır |

---

## Kimlik doğrulama

- **Google OAuth** — Supabase panelinde Google sağlayıcısını etkinleştirin, dönüş
  adresi olarak `{SITE_URL}/auth/callback` tanımlayın
- **E-posta + şifre** — doğrulama e-postası, şifre sıfırlama ve şifre değiştirme dâhil
- `middleware.ts` her istekte oturumu yeniler; `/hesap` oturum, `/admin` ise
  `admin`/`staff` rolü ister

> ⚠️ Supabase yapılandırılmadığında middleware yönlendirme yapmaz — yani `/admin`
> **herkese açıktır**. Bu, anahtarsız geliştirme için bilinçli bir tercihtir.
> Yayına almadan önce Supabase anahtarlarını tanımlayın ve en az bir kullanıcıyı
> `admin` rolüne yükseltin.

---

## Sipariş akışı

```
Ürün → Sepet → Adres & Ödeme (/odeme)
   → POST /api/checkout
       ├─ Tutarlar sunucuda yeniden hesaplanır
       ├─ orders + order_items kaydı 'pending' olarak açılır
       ├─ Kart:            iyzico Checkout Form → 3D Secure → /api/checkout/callback
       │                   → sonuç iyzico'dan sorgulanarak doğrulanır → 'paid'
       └─ Havale / Kapıda: doğrudan onay
   → Müşteriye sipariş onayı + yöneticiye bildirim maili (Resend)
   → /odeme/sonuc → sepet temizlenir
   → Admin panelinde görünür → kargoya verilir → müşteriye kargo maili
```

Ödeme sonucu **asla** callback gövdesine güvenilerek yazılmaz; `retrieveCheckoutResult`
ile iyzico'ya tekrar sorulur.

---

## Görsel yükleme (Cloudinary)

```
Admin görsel seçer
   → POST /api/upload  (yetki denetimi → imzalı parametre)
   → Tarayıcı doğrudan Cloudinary'ye yükler   ← dosya kendi sunucumuzdan geçmez
   → Dönen secure_url ilgili Supabase kaydına yazılır
```

İmza yalnızca `admin`/`staff` oturumları için üretilir; API gizli anahtarı sunucuda kalır.

---

## Tasarım sistemi

Renk, tipografi, gölge ve yumuşatma eğrileri `src/app/globals.css` içinde `@theme` ile
tanımlıdır — Tailwind yapılandırma dosyası yoktur.

- **Palet:** krem `--color-cream-*`, zeytin yeşili `--color-olive-*`, altın `--color-gold-*`
- **Semantik yüzeyler:** `background`, `surface`, `foreground`, `border`, `accent` —
  açık/koyu temada değer değiştirir
- **Tipografi:** başlıklarda Cormorant Garamond, gövdede Inter (`latin-ext` alt kümesiyle,
  Türkçe karakterler için)
- **Hareket dili:** 24 px yukarı + fade, `cubic-bezier(0.22, 1, 0.36, 1)`, 60 ms stagger
- `prefers-reduced-motion` tüm animasyonları devre dışı bırakır

Koyu tema `next-themes` ile class stratejisinde çalışır; `globals.css` içindeki
`@custom-variant dark` satırı bunun için zorunludur.

---

## Performans ve SEO

- Varsayılan Server Component; `"use client"` yalnızca etkileşimli yapraklarda
- `CartDrawer`, `SearchOverlay`, `MobileMenu` ve video modalı `dynamic()` ile yüklenir
- Video, YouTube facade deseniyle — ilk yüklemede üçüncü parti script yok
- `next/image` + AVIF/WebP, doğru `sizes`, hero'da `priority`, paylaşılan blur placeholder
- JSON-LD: `Organization`, `WebSite` (SearchAction), `Product` (+ `AggregateOffer`,
  `AggregateRating`, `Review`), `BlogPosting`, `BreadcrumbList`, `FAQPage`
- `sitemap.xml` ve `robots.txt` üretilir; hesap/sepet/ödeme sayfaları indekslenmez
- Erişilebilirlik: `focus-visible` altın halka, aria etiketleri, klavyeyle kapanabilir
  overlay'ler, "İçeriğe geç" bağlantısı

---

## Görseller

`src/lib/images.ts` içindeki Unsplash kimlikleri tek tek doğrulandı; marka/logo görünen
kareler bilinçli olarak elendi. Kendi görsellerinize geçerken bu dosyadaki değerleri
Cloudinary URL'leriyle değiştirmeniz yeterli — çağrı yerlerinde değişiklik gerekmez.

---

## Ortam değişkenleri

Tümü `.env.local.example` dosyasında açıklamalarıyla listelidir. Özet:

| Grup | Anahtarlar | Tanımlı değilse |
| --- | --- | --- |
| Site | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` varsayılır |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Katalog yerel veriden okunur, auth ekranları bilgilendirme gösterir |
| Cloudinary | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Yükleme uç noktası 503 döner |
| iyzico | `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` | Kart ödemesi demo modunda tamamlanır |
| Resend | `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_NOTIFY_EMAIL` | Mail gönderilmez, sipariş yine oluşur |
