import { Building2, FileCheck2, Handshake, Mail, Phone, Truck } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { site } from '@/lib/data/site';
import { IMG } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Kurumsal', path: '/kurumsal' },
];

export const metadata = buildMetadata({
  title: 'Kurumsal',
  description:
    'Restoran, otel ve kurumsal alımlar için toptan fiyat listesi, özel etiketleme ve hediye seti çözümleri.',
  path: '/kurumsal',
  image: IMG.mezeTable,
});

const services = [
  {
    Icon: Handshake,
    title: 'Toptan Tedarik',
    text: 'Restoran, otel ve kafeler için düzenli sevkiyat programı. Aylık taahhüt karşılığında sabit fiyat garantisi sunuyoruz.',
  },
  {
    Icon: FileCheck2,
    title: 'Özel Etiketleme',
    text: 'Kendi markanızla şişeleme (private label). Minimum 500 şişeden başlayan üretim, etiket tasarımı desteği dâhil.',
  },
  {
    Icon: Building2,
    title: 'Kurumsal Hediye',
    text: 'Bayram ve yılbaşı için özel hediye setleri. Kurum logonuzla kutu baskısı ve toplu adrese gönderim yapıyoruz.',
  },
  {
    Icon: Truck,
    title: 'Planlı Sevkiyat',
    text: 'Depo alanınıza göre haftalık, iki haftalık veya aylık teslimat planı. Palet bazında sevkiyatta nakliye bizden.',
  },
];

const facts = [
  { label: 'Yıllık üretim kapasitesi', value: '180 ton' },
  { label: 'Bahçe alanı', value: '60 dönüm' },
  { label: 'Sözleşmeli üretici', value: '24 aile' },
  { label: 'Kurumsal müşteri', value: '90+' },
];

const documents = [
  'Gıda Üretim İzni ve İşletme Kayıt Belgesi',
  'Organik Tarım Sertifikası (TR-ORG-XX)',
  'ISO 22000 Gıda Güvenliği Yönetim Sistemi',
  'Her partiye ait bağımsız laboratuvar analiz raporu',
  'İhracat uygunluk belgeleri (talep hâlinde)',
];

export default function CorporatePage() {
  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="İş Ortaklarımız İçin"
        description="Sofrasında zeytinyağının fark yarattığına inanan işletmelerle çalışıyoruz. Toptan tedarik, özel etiketleme ve kurumsal hediye çözümlerimizi inceleyin."
        image={IMG.mezeTable}
        trail={trail}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Hizmetler"
            title="Dört Farklı Çalışma Modeli"
            description="İhtiyacınıza göre ölçeklenen, esnek iş birlikleri kuruyoruz."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {services.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 2) * 0.08} className="h-full">
                <article className="group flex h-full gap-5 rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/35 hover:shadow-lift">
                  <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/12 transition-all duration-500 group-hover:-rotate-6 group-hover:bg-gold-500/12 group-hover:text-gold-600 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/20">
                    <Icon className="size-6" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-foreground">{title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading eyebrow="Kapasite" title="Rakamlarla Üretim" align="left" />
              <dl className="mt-9 grid grid-cols-2 gap-5">
                {facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl border border-border bg-surface p-6">
                    <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-2 font-display text-3xl font-semibold text-foreground tabular-nums">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <SectionHeading eyebrow="Belgeler" title="Sertifika ve Raporlar" align="left" />
              <ul className="mt-9 space-y-3">
                {documents.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm leading-relaxed text-foreground/85"
                  >
                    <FileCheck2
                      className="mt-0.5 size-4.5 shrink-0 text-olive-600 dark:text-gold-400"
                      strokeWidth={1.8}
                    />
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Tüm belgelerin güncel kopyalarını talep üzerine e-posta ile gönderiyoruz.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl bg-olive-900 px-6 py-14 text-center sm:px-12 dark:bg-olive-950">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-gold-500/10 blur-3xl"
            />

            <h2 className="relative font-display text-3xl text-cream-50 sm:text-4xl">
              Fiyat Listesi ve Numune Talebi
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-cream-200/75">
              Kurumsal fiyat listemizi ve tadım numunelerimizi ücretsiz gönderiyoruz. İşletmeniz ve
              tahmini aylık tüketiminiz hakkında kısa bir not yeterli.
            </p>

            <div className="relative mt-9 flex flex-col justify-center gap-3.5 sm:flex-row">
              <Button href={`mailto:${site.email}?subject=Kurumsal%20Fiyat%20Listesi`} variant="gold" size="lg">
                <Mail className="size-5" strokeWidth={2} />
                Fiyat Listesi İsteyin
              </Button>
              <Button href={site.phoneHref} variant="glass" size="lg">
                <Phone className="size-5" strokeWidth={2} />
                {site.phone}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
