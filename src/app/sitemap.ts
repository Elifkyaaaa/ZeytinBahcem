import type { MetadataRoute } from 'next';
import { categories } from '@/lib/data/categories';
import { legalSlugs } from '@/lib/data/legal';
import { posts } from '@/lib/data/posts';
import { products } from '@/lib/data/products';
import { site } from '@/lib/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/urunler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site.url}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/kurumsal`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/siparis-takibi`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${site.url}/urunler?kategori=${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${site.url}/urunler/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const legalRoutes: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${site.url}/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes, ...legalRoutes];
}
