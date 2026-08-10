/**
 * Ortam değişkenleri tek noktadan okunur.
 *
 * ÖNEMLİ: `NEXT_PUBLIC_*` değişkenleri **sabit** özellik adıyla okunmalıdır
 * (`process.env.NEXT_PUBLIC_X`). Bundler yalnızca bu biçimi derleme anında
 * gerçek değerle değiştirir; `process.env[degisken]` gibi dinamik erişim
 * tarayıcı paketinde `undefined` kalır ve istemci tarafı sessizce çalışmaz.
 *
 * Proje, servis anahtarları tanımlı olmadan da tam olarak çalışır: bu durumda
 * katalog `src/lib/data` altındaki tipli sabitlerden okunur, ödeme ve mail
 * adımları "demo" modunda yürür.
 */

/** Boş dizeleri undefined'a indirger — `.env` içinde `KEY=` yazılı olabilir. */
function clean(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000',

  supabase: {
    url: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    // Yalnızca sunucuda okunur; istemci paketinde undefined kalır.
    serviceKey: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  },

  cloudinary: {
    cloudName: clean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
    apiKey: clean(process.env.CLOUDINARY_API_KEY),
    apiSecret: clean(process.env.CLOUDINARY_API_SECRET),
    folder: clean(process.env.CLOUDINARY_FOLDER) ?? 'elmora',
  },

  iyzico: {
    apiKey: clean(process.env.IYZICO_API_KEY),
    secretKey: clean(process.env.IYZICO_SECRET_KEY),
    baseUrl: clean(process.env.IYZICO_BASE_URL) ?? 'https://sandbox-api.iyzipay.com',
  },

  resend: {
    apiKey: clean(process.env.RESEND_API_KEY),
    from: clean(process.env.RESEND_FROM) ?? 'Elmora Zeytincilik <siparis@elmora.com>',
    adminTo: clean(process.env.ADMIN_NOTIFY_EMAIL),
  },
} as const;

/** Supabase yapılandırıldı mı? İstemci ve sunucu tarafında aynı yanıtı verir. */
export const isSupabaseConfigured = Boolean(env.supabase.url && env.supabase.anonKey);

/** Servis rolü yalnızca sunucuda kullanılabilir (webhook, admin işlemleri). */
export const hasServiceRole = Boolean(env.supabase.url && env.supabase.serviceKey);

export const isCloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

export const isIyzicoConfigured = Boolean(env.iyzico.apiKey && env.iyzico.secretKey);

export const isMailConfigured = Boolean(env.resend.apiKey);
