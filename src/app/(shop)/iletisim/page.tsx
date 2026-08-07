import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/icons';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section } from '@/components/ui/Section';
import { site } from '@/lib/data/site';
import { IMG } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'İletişim', path: '/iletisim' },
];

export const metadata = buildMetadata({
  title: 'İletişim',
  description:
    'Sorularınız, toptan siparişleriniz veya bahçe ziyareti için bize telefon, WhatsApp veya e-posta ile ulaşın.',
  path: '/iletisim',
  image: IMG.aegeanTables,
});

const channels = [
  {
    Icon: Phone,
    title: 'Telefon',
    value: site.phone,
    href: site.phoneHref,
    hint: site.workingHours,
  },
  {
    Icon: WhatsAppIcon,
    title: 'WhatsApp',
    value: site.whatsapp,
    href: site.whatsappHref,
    hint: 'Ortalama yanıt süresi 12 dakika',
  },
  {
    Icon: Mail,
    title: 'E-posta',
    value: site.email,
    href: `mailto:${site.email}`,
    hint: 'En geç 1 iş günü içinde dönüş',
  },
  {
    Icon: MapPin,
    title: 'Adres',
    value: `${site.address.street}, ${site.address.district}`,
    href: site.mapEmbed.replace('&output=embed', ''),
    hint: `${site.address.city} · ${site.address.postalCode}`,
  },
];

const faq = [
  {
    question: 'Siparişim ne zaman kargoya verilir?',
    answer:
      'Saat 14.00’a kadar verilen siparişler aynı gün, sonrasındakiler ertesi iş günü kargoya teslim edilir. Ortalama teslim süresi 1–3 iş günüdür.',
  },
  {
    question: 'Toptan alım yapabilir miyim?',
    answer:
      'Evet. Restoran, otel ve kurumsal alımlar için özel fiyat listemiz var. WhatsApp veya e-posta ile bize ulaşın; aynı gün dönüş yapıyoruz.',
  },
  {
    question: 'Bahçeyi ziyaret edebilir miyim?',
    answer:
      'Ekim–Kasım aylarında hasada katılabilir, sıkım sürecini yerinde izleyebilir ve tadım yapabilirsiniz. Ziyaretler randevuyla düzenleniyor.',
  },
  {
    question: 'Yurt dışına gönderim yapıyor musunuz?',
    answer:
      'Şu an yalnızca Türkiye içine gönderim yapıyoruz. Yurt dışı talepleri için bize yazarsanız, uygun bir çözüm bulmaya çalışırız.',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize Ulaşın"
        description="Ürünlerimiz, siparişiniz veya bahçe ziyareti hakkında merak ettiğiniz her şeyi sorun. Gerçekten cevap veriyoruz."
        image={IMG.aegeanTables}
        trail={trail}
        compact
      />

      <Section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ Icon, title, value, href, hint }, i) => (
              <Reveal key={title} delay={i * 0.06} className="h-full">
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-olive-600/8 text-olive-600 transition-colors duration-500 group-hover:bg-gold-500/12 group-hover:text-gold-600 dark:bg-gold-400/10 dark:text-gold-400">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <h2 className="mt-4 text-sm font-semibold text-foreground">{title}</h2>
                  <p className="mt-1.5 text-sm break-words text-foreground/85">{value}</p>
                  <p className="mt-auto pt-3 text-xs text-muted-foreground">{hint}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Reveal>
              <h2 className="font-serif text-3xl text-foreground sm:text-4xl">Mesaj Gönderin</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Formu doldurun; en geç bir iş günü içinde size dönüş yapalım. Acil konular için
                WhatsApp hattımız daha hızlıdır.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
                <iframe
                  src={site.mapEmbed}
                  title={`${site.name} konumu`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full sm:h-96"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-surface-muted p-6">
                <h3 className="flex items-center gap-2.5 font-serif text-lg text-foreground">
                  <Clock className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
                  Ziyaret ve Tadım
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Orhangazi’deki bahçemiz ve değirmenimiz randevuyla ziyarete açık. Hasat döneminde
                  (Ekim–Kasım) toplama sürecine katılabilir, taze sıkım tadımı yapabilirsiniz.
                  Grup ziyaretleri için en az bir hafta önceden haber vermenizi rica ederiz.
                </p>

                <div className="mt-5 flex items-center gap-2">
                  {[
                    { Icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
                    { Icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
                    { Icon: WhatsAppIcon, href: site.whatsappHref, label: 'WhatsApp' },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-gold-600"
                    >
                      <Icon className="size-[1.05rem]" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="py-16 lg:py-20">
        <Container>
          <h2 className="text-center font-serif text-3xl text-foreground sm:text-4xl">
            Sık Sorulan Sorular
          </h2>

          <div className="mx-auto mt-10 max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {faq.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-medium text-foreground transition-colors hover:bg-surface-muted/60 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <JsonLd data={[breadcrumbJsonLd(trail), faqJsonLd(faq)]} />
    </>
  );
}
