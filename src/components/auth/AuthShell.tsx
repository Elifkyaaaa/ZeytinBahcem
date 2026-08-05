import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { OliveBranchIcon } from '@/components/ui/icons';
import { site } from '@/lib/data/site';
import { IMG, img } from '@/lib/images';
import { blurDataURL } from '@/lib/utils';

/** Giriş/kayıt sayfalarının iki sütunlu ortak kabuğu. */
export function AuthShell({
  eyebrow,
  title,
  description,
  image = img(IMG.groveHill, 1200, 1600),
  quote,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  quote?: { text: string; author: string };
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Görsel sütunu */}
      <div className="relative hidden overflow-hidden bg-olive-950 lg:block">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="50vw"
          quality={72}
          placeholder="blur"
          blurDataURL={blurDataURL('olive')}
          className="object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-olive-950/72 via-olive-950/48 to-olive-950/88"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="group flex w-fit items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-white/10 text-gold-300 ring-1 ring-white/20 transition-transform duration-500 group-hover:-rotate-12">
              <OliveBranchIcon className="size-6" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg font-semibold text-cream-50">{site.name}</span>
              <span className="mt-1 text-[0.6rem] font-medium tracking-[0.24em] text-cream-200/70 uppercase">
                Est. {site.founded}
              </span>
            </span>
          </Link>

          {quote && (
            <figure className="max-w-md">
              <span className="hairline-gold mb-6 block h-px w-16" aria-hidden />
              <blockquote className="font-serif text-2xl leading-relaxed text-cream-50">
                “{quote.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-cream-200/65">{quote.author}</figcaption>
            </figure>
          )}

          <p className="text-xs text-cream-200/45">
            © {new Date().getFullYear()} {site.legalName}
          </p>
        </div>
      </div>

      {/* Form sütunu */}
      <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 flex w-fit items-center gap-2.5 lg:hidden">
            <span className="grid size-10 place-items-center rounded-full bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/20 dark:bg-gold-400/10 dark:text-gold-400">
              <OliveBranchIcon className="size-5" />
            </span>
            <span className="font-serif text-lg font-semibold text-foreground">{site.name}</span>
          </Link>

          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase dark:text-gold-400">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-9">{children}</div>

          {footer && <div className="mt-8 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
