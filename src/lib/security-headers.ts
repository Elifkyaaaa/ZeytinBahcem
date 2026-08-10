/**
 * HTTP security headers.
 *
 * Read by `next.config.ts` and applied to every response. The allowed sources
 * are deliberately narrow: when you add a third-party service you must widen
 * the matching directive here, otherwise the browser blocks the request.
 */

/** Content Security Policy sources, managed in one place. */
const csp = {
  // iyzico checkout form and 3D Secure flow
  iyzico: ['https://*.iyzipay.com', 'https://*.iyzico.com'],
  // Image CDNs (local images are covered by 'self')
  images: [
    'https://res.cloudinary.com',
    'https://lh3.googleusercontent.com',
    'https://*.supabase.co',
  ],
  // Database and authentication
  supabase: ['https://*.supabase.co', 'wss://*.supabase.co'],
  // Embedded video and maps
  embeds: ['https://www.youtube-nocookie.com', 'https://www.google.com', 'https://maps.google.com'],
  // Direct upload to Cloudinary
  upload: ['https://api.cloudinary.com'],
};

/**
 * Why `'unsafe-inline'` is here:
 * The Next.js App Router ships hydration data in an inline <script>, and
 * Tailwind writes some styles inline. Moving to a strict nonce-based CSP would
 * mean generating a nonce per request in middleware and threading it into Next.
 * The directives that actually matter (frame-ancestors, object-src, base-uri,
 * form-action) stay strict below, so clickjacking and form hijacking are still
 * blocked.
 */

/**
 * `'unsafe-eval'` is added in development ONLY.
 *
 * Turbopack's hot module replacement runs the updated module through `eval()`.
 * When the CSP blocks that, the browser logs "eval() is not supported in this
 * environment", HMR fails, and Next falls back to a **full page reload** on
 * every change — which looks like the page is re-rendering constantly. The
 * production bundle never calls eval, so the permission is not granted there
 * and the live policy stays strict.
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
  // Stops our pages being embedded elsewhere (clickjacking)
  `frame-ancestors 'none'`,
  // Stops form data being posted to a third-party address
  `form-action 'self' ${csp.iyzico.join(' ')}`,
  // Stops relative links being hijacked via a <base> tag
  `base-uri 'self'`,
  `object-src 'none'`,
  // Mixed content (http) is upgraded to https automatically
  `upgrade-insecure-requests`,
].join('; ');

export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
  {
    // The browser will only reach this site over HTTPS for two years.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Disables MIME sniffing, so an uploaded file cannot be interpreted
    // as a script.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Fallback for older browsers that do not support frame-ancestors
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // External sites see only the origin, never the full path
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Turns off browser capabilities the site does not use
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=()',
  },
  {
    // Cuts cross-origin interaction through window references
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

/** Blocks search engines and caching on personal and transactional pages. */
export const privateHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
  { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
];
