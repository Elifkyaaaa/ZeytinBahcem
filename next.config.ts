import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Görseller Unsplash CDN üzerinden servis edilir.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Cloudinary — yönetim panelinden yüklenen ürün/blog görselleri
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // Google ile giriş yapan kullanıcıların profil fotoğrafı
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // Supabase Storage'a geçilirse
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    formats: ['image/avif', 'image/webp'],
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
