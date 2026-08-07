import { ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { latestPosts } from '@/lib/data/posts';
import { blurDataURL, formatDate } from '@/lib/utils';

export function BlogSection() {
  return (
    <Section id="blog">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Blog"
            title="Zeytinin Peşinde"
            description="Üretimden mutfağa, bahçeden sofraya — bildiklerimizi paylaşıyoruz."
            align="left"
            className="max-w-xl"
          />
          <Button href="/blog" variant="outline" size="md" className="shrink-0 self-start sm:self-end">
            Tüm Yazılar
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </Button>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {latestPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 92vw"
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

                  <h3 className="mt-3 font-display text-xl leading-snug text-foreground">
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
    </Section>
  );
}
