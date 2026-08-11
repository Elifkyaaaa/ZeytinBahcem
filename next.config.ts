import type { NextConfig } from 'next';
import { privateHeaders, securityHeaders } from './src/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Do not leak the server version; it only helps an attacker.
  poweredByHeader: false,

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Account, cart, checkout and admin pages must not be cached and must
      // not show up in search engines.
      { source: '/account/:path*', headers: privateHeaders },
      { source: '/cart', headers: privateHeaders },
      { source: '/checkout/:path*', headers: privateHeaders },
      { source: '/admin/:path*', headers: privateHeaders },
      { source: '/api/:path*', headers: privateHeaders },
    ];
  },
  images: {
    // Local images come from public/; these are the only remote sources.
    remotePatterns: [
      // Cloudinary — product and blog images uploaded from the admin panel
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // Profile photo of users who sign in with Google
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // In case we move to Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    formats: ['image/avif', 'image/webp'],

    // Avatars are initial-based SVG badges. next/image blocks SVG by default;
    // the two settings below are Next's documented mitigation: the SVG is
    // sandboxed, cannot run scripts, and is marked as a download.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Source images cap out at 1920 px, so larger variants are pointless.
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
    // Next 16 only allows the quality values listed here; requesting a
    // `quality` that is missing makes /_next/image return 400. Every value
    // used in the code must appear here (72 hero background, 74 cards,
    // 86 brand logo).
    qualities: [72, 74, 75, 86],
  },
  // iyzipay and cloudinary use dynamic require, so they must stay out of the
  // bundle and be loaded by Node at runtime.
  serverExternalPackages: ['iyzipay', 'cloudinary'],
  experimental: {
    // Tree shaking: only the modules actually used from these packages ship.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
