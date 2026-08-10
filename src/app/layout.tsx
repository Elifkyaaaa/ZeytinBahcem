import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers/Providers';
import { site } from '@/lib/data/site';
import { IMG } from '@/lib/images';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  keywords: [
    'zeytinyağı',
    'natürel sızma zeytinyağı',
    'erken hasat zeytinyağı',
    'soğuk sıkım zeytinyağı',
    'taş baskı zeytinyağı',
    'sofralık zeytin',
    'organik zeytinyağı',
    'Orhangazi zeytinyağı',
    'Bursa zeytinyağı',
    'Ege zeytinyağı',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: IMG.heroGrove,
        width: 1200,
        height: 630,
        alt: 'Orhangazi’de güneş altında uzanan zeytin bahçesi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [IMG.heroGrove],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'food',
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#12150E' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      // globals.css'te `scroll-behavior: smooth` tanımlı. Next bunu bilmezse
      // rota geçişlerinde sayfayı yumuşak kaydırıp konumu şaşırtıyor; bu
      // öznitelik Next'e durumu bildirir ve geçişlerde anlık konumlandırır.
      data-scroll-behavior="smooth"
      className={inter.variable}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
