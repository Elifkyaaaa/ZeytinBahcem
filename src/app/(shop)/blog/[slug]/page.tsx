import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Section';
import { getPost, posts } from '@/lib/data/posts';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { blurDataURL, formatDate } from '@/lib/utils';

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Yazı bulunamadı', description: '', noIndex: true });

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const index = posts.findIndex((p) => p.slug === post.slug);
  const nextPost = posts[index + 1] ?? posts[0];

  const trail = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <article>
        {/* Kapak */}
        <div
          data-dark-hero
          className="relative flex min-h-[26rem] items-end overflow-hidden bg-olive-950 sm:min-h-[32rem]"
        >
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={74}
            placeholder="blur"
            blurDataURL={blurDataURL('olive')}
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-olive-950/94 via-olive-950/62 to-olive-950/42"
          />

          <Container className="relative z-10 pt-28 pb-12 sm:pb-16">
            <Breadcrumbs
              trail={trail}
              className="mb-6 [&_a]:text-cream-200/65 [&_a:hover]:text-gold-300 [&_span]:text-cream-50"
            />

            <Badge tone="gold">{post.category}</Badge>

            <h1 className="mt-4 max-w-4xl font-display text-3xl leading-[1.12] text-cream-50 sm:text-5xl lg:text-[3.4rem]">
              {post.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="flex items-center gap-3">
                <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-gold-400/30">
                  <Image
                    src={post.author.avatar}
                    alt=""
                    fill
                    sizes="44px"
                    placeholder="blur"
                    blurDataURL={blurDataURL('olive')}
                    className="object-cover"
                  />
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-cream-50">{post.author.name}</span>
                  <span className="block text-xs text-cream-200/60">{post.author.role}</span>
                </span>
              </span>

              <span className="text-cream-200/25" aria-hidden>
                |
              </span>

              <time dateTime={post.date} className="text-sm text-cream-200/70">
                {formatDate(post.date)}
              </time>

              <span className="flex items-center gap-1.5 text-sm text-cream-200/70">
                <Clock className="size-4" strokeWidth={1.8} />
                {post.readingTime} dakika okuma
              </span>
            </div>
          </Container>
        </div>

        {/* Body */}
        <Container className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="border-l-2 border-gold-500/50 pl-6 font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              {post.excerpt}
            </p>

            <div className="mt-10 space-y-6">
              {post.content.map((block, i) => {
                if (block.type === 'h2') {
                  return (
                    <Reveal key={i} y={16}>
                      <h2 className="pt-6 font-display text-2xl text-foreground sm:text-3xl">
                        {block.text}
                      </h2>
                    </Reveal>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <Reveal key={i} y={16}>
                      <blockquote className="my-8 rounded-2xl bg-surface-muted p-7 font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
                        <span className="mb-3 block text-3xl leading-none text-gold-500" aria-hidden>
                          “
                        </span>
                        {block.text}
                      </blockquote>
                    </Reveal>
                  );
                }

                if (block.type === 'list') {
                  return (
                    <Reveal key={i} y={16}>
                      <ul className="my-6 space-y-3">
                        {block.items?.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[1.05rem] leading-relaxed text-muted-foreground"
                          >
                            <span
                              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500"
                              aria-hidden
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  );
                }

                return (
                  <Reveal key={i} y={16}>
                    <p className="text-[1.05rem] leading-[1.9] text-muted-foreground">
                      {block.text}
                    </p>
                  </Reveal>
                );
              })}
            </div>

            {/* Yazar kutusu */}
            <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-7 shadow-soft sm:flex-row sm:items-center">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                <Image
                  src={post.author.avatar}
                  alt=""
                  fill
                  sizes="64px"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-foreground">{post.author.name}</p>
                <p className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-gold-600 uppercase dark:text-gold-400">
                  {post.author.role}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  Bahçeden mutfağa uzanan süreçte edindiğimiz bilgiyi paylaşıyoruz. Soru ve
                  önerileriniz için bize her zaman yazabilirsiniz.
                </p>
              </div>
              <Button href="/contact" variant="outline" size="md" className="shrink-0">
                İletişim
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <Button href="/blog" variant="ghost" size="md">
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
                Tüm Yazılar
              </Button>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex max-w-xs flex-col items-end text-right"
              >
                <span className="text-xs text-muted-foreground">Sonraki yazı</span>
                <span className="mt-1 flex items-center gap-2 font-display text-lg text-foreground transition-colors group-hover:text-gold-700 dark:group-hover:text-gold-400">
                  {nextPost.title}
                  <ArrowRight
                    className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </article>

      {/* Other posts */}
      <section className="border-t border-border bg-surface-muted py-16 lg:py-20" aria-label="Diğer yazılar">
        <Container>
          <h2 className="font-display text-3xl text-foreground">Bunları da Okuyun</h2>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {others.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.07} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 92vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <Badge tone="gold" className="w-fit">
                      {item.category}
                    </Badge>
                    <h3 className="mt-3 font-display text-lg leading-snug text-foreground">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="transition-colors after:absolute after:inset-0 hover:text-gold-700 dark:hover:text-gold-400"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <JsonLd data={[articleJsonLd(post), breadcrumbJsonLd(trail)]} />
    </>
  );
}
