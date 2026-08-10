import { FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Section';
import { legalDocuments, legalSlugs } from '@/lib/data/legal';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamicParams = false;

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = legalDocuments[slug];
  if (!doc) return buildMetadata({ title: 'Sayfa bulunamadı', description: '', noIndex: true });

  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: `/${doc.slug}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = legalDocuments[slug];
  if (!doc) notFound();

  const trail = [
    { name: 'Ana Sayfa', path: '/' },
    { name: doc.title, path: `/${doc.slug}` },
  ];

  return (
    <>
      <div className="pt-24 pb-20 sm:pt-28 lg:pt-32">
        <Container>
          <Breadcrumbs trail={trail} />

          <div className="mt-8 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
            {/* Other documents */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Yasal Belgeler
              </p>
              <ul className="mt-4 space-y-0.5">
                {legalSlugs.map((item) => {
                  const active = item === doc.slug;
                  return (
                    <li key={item}>
                      <Link
                        href={`/${item}`}
                        aria-current={active ? 'page' : undefined}
                        className={
                          active
                            ? 'block rounded-lg bg-olive-600/8 px-3 py-2 text-sm font-medium text-olive-800 dark:bg-gold-400/10 dark:text-gold-300'
                            : 'block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground'
                        }
                      >
                        {legalDocuments[item].title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 rounded-xl bg-surface-muted p-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Sorularınız için{' '}
                  <Link
                    href="/iletisim"
                    className="font-medium text-gold-700 underline underline-offset-2 dark:text-gold-400"
                  >
                    bize yazın
                  </Link>
                  .
                </p>
              </div>
            </aside>

            <article className="min-w-0 max-w-3xl">
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase dark:text-gold-400">
                <FileText className="size-3.5" strokeWidth={2.2} />
                {doc.eyebrow}
              </p>

              <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                {doc.title}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {doc.summary}
              </p>

              <p className="mt-5 text-xs text-muted-foreground">
                Son güncelleme: <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
              </p>

              <span className="hairline-gold mt-9 block h-px w-full" aria-hidden />

              <div className="mt-9 space-y-10">
                {doc.sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="font-display text-xl text-foreground sm:text-2xl">
                      {section.title}
                    </h2>

                    {section.paragraphs?.map((paragraph, i) => (
                      <p
                        key={i}
                        className="mt-4 leading-[1.85] whitespace-pre-line text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {section.list && (
                      <ul className="mt-4 space-y-2.5">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 leading-relaxed text-muted-foreground"
                          >
                            <span
                              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500"
                              aria-hidden
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </div>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
