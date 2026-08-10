import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { InstagramIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { instagramPosts } from '@/lib/data/content';
import { site } from '@/lib/data/site';
import { blurDataURL, formatNumber } from '@/lib/utils';
import { instagramText } from '@/lib/data/text/home';

export function InstagramGallery() {
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow={instagramText.eyebrow}
          title={
            <>
              {instagramText.titlePrefix}{' '}
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient-gold underline-offset-8 transition-opacity hover:opacity-80"
              >
                @elmora
              </a>
            </>
          }
          description={instagramText.description}
        />

        <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 4) * 0.05}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl bg-surface shadow-soft transition-shadow duration-500 hover:shadow-lift sm:rounded-2xl"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(min-width: 640px) 24vw, 46vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]"
                />

                <span
                  aria-hidden
                  className="absolute inset-0 bg-olive-950/0 transition-colors duration-400 group-hover:bg-olive-950/62"
                />

                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition-all duration-400 group-hover:opacity-100">
                  <InstagramIcon className="size-7 -translate-y-2 text-cream-50 transition-transform duration-400 group-hover:translate-y-0" />
                  <span className="flex items-center gap-4 text-xs font-semibold text-cream-50">
                    <span className="flex items-center gap-1.5">
                      <Heart className="size-3.5 fill-current" strokeWidth={0} />
                      {formatNumber(post.likes)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="size-3.5" strokeWidth={2} />
                      {post.comments}
                    </span>
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
