import type { ReactNode } from 'react';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

/** Vitrin (mağaza) düzeni — admin paneli bu kabuğun dışında kalır. */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-olive-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-cream-50"
      >
        İçeriğe geç
      </a>

      <Header />
      <main id="icerik">{children}</main>
      <Footer />
      <FloatingActions />
      <CookieConsent />

      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
