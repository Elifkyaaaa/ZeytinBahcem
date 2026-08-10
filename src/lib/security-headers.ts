/**
 * HTTP güvenlik başlıkları.
 *
 * Bu dosya `next.config.ts` tarafından okunur ve tüm yanıtlara uygulanır.
 * İzin verilen kaynaklar bilinçli olarak dar tutulmuştur; yeni bir üçüncü
 * taraf servis eklerken ilgili yönergeyi güncellemeniz gerekir, aksi hâlde
 * tarayıcı isteği engeller.
 */

/** İçerik Güvenlik Politikası kaynakları — tek yerden yönetilir. */
const csp = {
  // iyzico ödeme formu ve 3D Secure akışı
  iyzico: ['https://*.iyzipay.com', 'https://*.iyzico.com'],
  // Görsel CDN'leri (yerel görseller 'self' kapsamında)
  images: [
    'https://res.cloudinary.com',
    'https://lh3.googleusercontent.com',
    'https://*.supabase.co',
  ],
  // Veritabanı ve kimlik doğrulama
  supabase: ['https://*.supabase.co', 'wss://*.supabase.co'],
  // Gömülü video ve harita
  embeds: ['https://www.youtube-nocookie.com', 'https://www.google.com', 'https://maps.google.com'],
  // Cloudinary'ye doğrudan yükleme
  upload: ['https://api.cloudinary.com'],
};

/**
 * `'unsafe-inline'` neden var:
 * Next.js App Router, hydration verisini satır içi <script> ile gönderir ve
 * Tailwind bazı stilleri satır içi yazar. Nonce tabanlı katı bir CSP'ye
 * geçmek için middleware'de her istekte nonce üretip Next'e geçirmek gerekir.
 * Kritik yönergeler (frame-ancestors, object-src, base-uri, form-action)
 * burada zaten katı tutuluyor — clickjacking ve form kaçırma engelleniyor.
 */

/**
 * `'unsafe-eval'` YALNIZCA geliştirmede eklenir.
 *
 * Turbopack'in sıcak modül değişimi (HMR) güncellenen modülü `eval()` ile
 * çalıştırır. CSP bunu engellediğinde tarayıcı "eval() is not supported in
 * this environment" yazar, HMR başarısız olur ve Next her değişiklikte
 * **tam sayfa yeniden yüklemeye** düşer — sayfa sürekli yeniden render
 * ediliyormuş gibi görünür. Üretim paketinde eval kullanılmadığı için
 * bu izin canlıda verilmez; oradaki politika değişmeden katı kalır.
 */
const isDev = process.env.NODE_ENV === 'development';
const scriptSrc = [
  `'self'`,
  `'unsafe-inline'`,
  ...(isDev ? [`'unsafe-eval'`] : []),
  ...csp.iyzico,
  ...csp.embeds,
].join(' ');

const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${csp.images.join(' ')} ${csp.iyzico.join(' ')}`,
  `font-src 'self' data:`,
  `connect-src 'self' ${csp.supabase.join(' ')} ${csp.upload.join(' ')} ${csp.iyzico.join(' ')}`,
  `frame-src 'self' ${csp.iyzico.join(' ')} ${csp.embeds.join(' ')}`,
  `media-src 'self' ${csp.embeds.join(' ')}`,
  // Sitemizin başka bir sayfaya gömülmesini engeller (clickjacking)
  `frame-ancestors 'none'`,
  // Form verisinin üçüncü bir adrese gönderilmesini engeller
  `form-action 'self' ${csp.iyzico.join(' ')}`,
  // <base> etiketiyle göreli bağlantıların kaçırılmasını engeller
  `base-uri 'self'`,
  `object-src 'none'`,
  // Karışık içerik (http) otomatik https'e yükseltilir
  `upgrade-insecure-requests`,
].join('; ');

export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
  {
    // Tarayıcı bu siteye 2 yıl boyunca yalnızca HTTPS ile bağlanır.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // MIME türü tahmini kapatılır — yüklenen dosyanın script olarak
    // yorumlanmasını engeller.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // frame-ancestors'ı desteklemeyen eski tarayıcılar için yedek
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Dış sitelere yalnızca alan adı sızar, tam yol değil
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Kullanılmayan tarayıcı yetenekleri kapatılır
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=()',
  },
  {
    // Farklı origin'lerin pencere referansıyla etkileşimini keser
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

/** Kişisel/işlem sayfalarında arama motoru ve ara bellek engeli. */
export const privateHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
  { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
];
