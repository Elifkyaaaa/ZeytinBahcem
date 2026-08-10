/**
 * Environment variables are read from here and nowhere else.
 *
 * IMPORTANT: `NEXT_PUBLIC_*` variables must be read with a **static** property
 * name (`process.env.NEXT_PUBLIC_X`). Only that form is inlined with the real
 * value at build time; dynamic access such as `process.env[key]` stays
 * `undefined` in the browser bundle and the client silently stops working.
 *
 * The project runs fully without any service keys: the catalog then comes from
 * the typed constants under `src/lib/data`, and the payment and mail steps run
 * in demo mode.
 */

/** Collapses empty strings to undefined — `.env` may contain a bare `KEY=`. */
function clean(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000',

  supabase: {
    url: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    // Server-only; stays undefined in the client bundle.
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

/** Is Supabase configured? Answers identically on the client and the server. */
export const isSupabaseConfigured = Boolean(env.supabase.url && env.supabase.anonKey);

/** The service role is server-only (webhooks, admin operations). */
export const hasServiceRole = Boolean(env.supabase.url && env.supabase.serviceKey);

export const isCloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

export const isIyzicoConfigured = Boolean(env.iyzico.apiKey && env.iyzico.secretKey);

export const isMailConfigured = Boolean(env.resend.apiKey);
