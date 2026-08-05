import { ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { Badge } from '@/components/ui/Badge';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/Section';
import { posts } from '@/lib/data/posts';
import { IMG, img } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { blurDataURL, formatDate } from '@/lib/utils';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Blog', path: '/blog' },
];

export const metadata = buildMetadata({
  title: 'Blog',
  description:
    'Zeytinyağı seçimi, saklama, erken hasat, sofralık zeytin çeşitleri ve bahçeden notlar — üretimin içinden yazılar.',
  path: '/blog',
  image: img(IMG.treeOlives, 1200, 630),
});

export default function BlogPage() {
  const [featured, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Zeytinin Peşinde"
        description="Bahçede öğrendiklerimizi, laboratuvarda doğruladıklarımızı ve mutfakta denediklerimizi burada paylaşıyoruz."
        image={img(IMG.treeOlives, 1920, 900)}
        trail={trail}
        compact
      />

      <div className="py-16 lg:py-20">
        <Container>
          {/* Kategori etiketleri */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Öne çıkan yazı */}
          <Reveal className="mt-10">
            <article className="group grid overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift lg:grid-cols-2">
              <div className="relative aspect-16/10 overflow-hidden bg-surface-muted lg:aspect-auto lg:min-h-[24rem]">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 94vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="gold">{featured.category}</Badge>
                  <span className="text-xs text-muted-foreground">Öne çıkan yazı</span>
                </div>

                <h2 className="mt-5 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="transition-colors duration-300 after:absolute after:inset-0 hover:text-gold-700 dark:hover:text-gold-400"
                  >
                    {featured.title}
                  </Link>
                </h2>

                <p className="mt-4 leading-relaxed text-muted-foreground">{featured.excerpt}</p>

                <div className="mt-7 flex items-center gap-3.5">
                  <span className="relative size-10 overflow-hidden rounded-full bg-surface-muted">
                    <Image
                      src={featured.author.avatar}
                      alt=""
                      fill
                      sizes="40px"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover"
                    />
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-foreground">
                      {featured.author.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDate(featured.date)} · {featured.readingTime} dk okuma
                    </span>
                  </span>
                  <ArrowRight
                    className="ml-auto size-5 text-gold-600 transition-transform duration-400 group-hover:translate-x-1.5 dark:text-gold-400"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </article>
          </Reveal>

          {/* Diğer yazılar */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 0.07} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge tone="gold">{post.category}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span className="size-1 rounded-full bg-current opacity-40" aria-hidden />
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" strokeWidth={1.8} />
                        {post.readingTime} dk
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-xl leading-snug text-foreground">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors duration-300 after:absolute after:inset-0 hover:text-gold-700 dark:hover:text-gold-400"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 pt-1 text-sm font-medium text-gold-700 dark:text-gold-400">
                      Devamını Oku
                      <ArrowRight
                        className="size-4 transition-transform duration-400 group-hover:translate-x-1.5"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
