import type { NextConfig } from 'next';
import { privateHeaders, securityHeaders } from './src/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Sunucu sürümünü sızdırmayalım — saldırgana bilgi vermez.
  poweredByHeader: false,

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Hesap, sepet, ödeme ve yönetim sayfaları önbelleğe alınmamalı ve
      // arama motorlarında görünmemeli.
      { source: '/hesap/:path*', headers: privateHeaders },
      { source: '/sepet', headers: privateHeaders },
      { source: '/odeme/:path*', headers: privateHeaders },
      { source: '/admin/:path*', headers: privateHeaders },
      { source: '/api/:path*', headers: privateHeaders },
    ];
  },
  images: {
    // Yerel görseller public/ altından; uzak kaynaklar yalnızca aşağıdakiler.
    remotePatterns: [
      // Cloudinary — yönetim panelinden yüklenen ürün/blog görselleri
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // Google ile giriş yapan kullanıcıların profil fotoğrafı
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // Supabase Storage'a geçilirse
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    formats: ['image/avif', 'image/webp'],

    // Avatarlar baş harfli SVG rozetlerdir. next/image SVG'yi varsayılan
    // olarak engeller; aşağıdaki iki ayar Next'in belgelediği azaltmadır:
    // sunulan SVG sandbox'lanır ve betik çalıştıramaz, indirme olarak işaretlenir.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Kaynak görseller 1920 px ile sınırlı; daha büyük varyant istemek anlamsız.
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
  },
  // iyzipay ve cloudinary dinamik require kullanır; bundle'a alınmayıp
  // çalışma anında Node tarafından yüklenmeleri gerekir.
  serverExternalPackages: ['iyzipay', 'cloudinary'],
  experimental: {
    // Ağaç budama: bu paketlerden yalnızca kullanılan modüller bundle'a girer.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
