import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import {
  FacebookIcon,
  InstagramIcon,
  OliveBranchIcon,
  PaymentMark,
  WhatsAppIcon,
} from '@/components/ui/icons';
import { categories } from '@/lib/data/categories';
import { footerNav, site } from '@/lib/data/site';

const socials = [
  { Icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
  { Icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
  { Icon: WhatsAppIcon, href: site.whatsappHref, label: 'WhatsApp' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative border-t border-olive-800/40 bg-olive-900 text-cream-200/85 dark:bg-olive-950">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
          <div>
            <Logo tone="inverted" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/70">
              {site.founded} yılından bu yana Orhangazi’deki bahçelerimizde zeytin yetiştiriyor,
              her sezon dalından özenle topladığımız meyveyi soğuk sıkım yöntemiyle
              zeytinyağına dönüştürüyoruz.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-cream-200/15 text-cream-200/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/60 hover:text-gold-300"
                >
                  <Icon className="size-[1.1rem]" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="font-serif text-base text-cream-50">{group.title}</h3>
              <span className="hairline-gold mt-3 block h-px w-10" aria-hidden />
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center text-sm text-cream-200/70 transition-colors duration-300 hover:text-gold-300"
                    >
                      <span className="mr-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="font-serif text-base text-cream-50">İletişim</h3>
            <span className="hairline-gold mt-3 block h-px w-10" aria-hidden />
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400/80" strokeWidth={1.7} />
                <address className="not-italic text-cream-200/70">
                  {site.address.street}
                  <br />
                  {site.address.district} / {site.address.city}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400/80" strokeWidth={1.7} />
                <a href={site.phoneHref} className="text-cream-200/70 transition-colors hover:text-gold-300">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-gold-400/80" />
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-200/70 transition-colors hover:text-gold-300"
                >
                  {site.whatsapp}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400/80" strokeWidth={1.7} />
                <a href={`mailto:${site.email}`} className="text-cream-200/70 transition-colors hover:text-gold-300">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400/80" strokeWidth={1.7} />
                <span className="text-cream-200/70">{site.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Kategori bağlantıları — dahili gezinme ve SEO için düz liste */}
        <nav aria-label="Kategoriler" className="mt-12 border-t border-cream-200/10 pt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/urunler?kategori=${c.slug}`}
                  className="text-sm text-cream-200/60 transition-colors hover:text-gold-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 overflow-hidden rounded-2xl border border-cream-200/10">
          <iframe
            src={site.mapEmbed}
            title={`${site.name} konumu — ${site.address.district}, ${site.address.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-56 w-full grayscale-[0.35] contrast-[1.05] sm:h-64"
          />
        </div>
      </div>

      {/* Ticari künye — 6563 sayılı E-Ticaret Kanunu gereği erişilebilir olmalı */}
      <div className="border-t border-cream-200/10">
        <div className="container-x py-7">
          <dl className="grid gap-x-8 gap-y-3 text-xs text-cream-200/55 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-cream-200/40">Ünvan</dt>
              <dd className="mt-0.5 text-cream-200/75">{site.legalName}</dd>
            </div>
            <div>
              <dt className="text-cream-200/40">Vergi Dairesi / No</dt>
              <dd className="mt-0.5 text-cream-200/75 tabular-nums">
                {site.legal.taxOffice} / {site.legal.taxNumber}
              </dd>
            </div>
            <div>
              <dt className="text-cream-200/40">MERSİS No</dt>
              <dd className="mt-0.5 text-cream-200/75 tabular-nums">{site.legal.mersis}</dd>
            </div>
            <div>
              <dt className="text-cream-200/40">Ticaret Sicil No</dt>
              <dd className="mt-0.5 text-cream-200/75 tabular-nums">
                {site.legal.tradeRegistryNo}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-cream-200/10">
        <div className="container-x flex flex-col items-center justify-between gap-5 py-6 lg:flex-row">
          <p className="order-3 text-center text-xs text-cream-200/55 lg:order-1 lg:text-left">
            © {year} {site.legalName}. Tüm hakları saklıdır.
          </p>

          {/* Ödeme altyapısı beyanı — ödeme kuruluşu başvurusunda aranır */}
          <p className="order-2 flex items-center gap-2 text-center text-xs text-cream-200/55">
            <ShieldCheck className="size-3.5 shrink-0 text-gold-400/70" strokeWidth={2} />
            Ödeme altyapısı{' '}
            <a
              href={site.paymentProvider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-300 underline-offset-2 hover:underline"
            >
              {site.paymentProvider.name}
            </a>{' '}
            tarafından sağlanmaktadır.
          </p>

          <div className="order-1 flex items-center gap-3 lg:order-3">
            <OliveBranchIcon className="size-4 text-gold-400/50" />
            <div className="flex items-center gap-1.5 text-cream-200/50">
              {['VISA', 'MASTER', 'TROY', 'AMEX', '3D'].map((label) => (
                <PaymentMark key={label} label={label} className="h-6 w-10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
