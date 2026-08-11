import type { MetadataRoute } from 'next';
import { site } from '@/lib/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Personal and transactional pages must stay out of search results.
        disallow: [
          '/admin',
          '/account',
          '/cart',
          '/checkout',
          '/favorites',
          '/login',
          '/register',
          '/forgot-password',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
