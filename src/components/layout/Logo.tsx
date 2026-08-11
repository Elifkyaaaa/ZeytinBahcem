import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/data/site';
import { logoText } from '@/lib/data/text/layout';
import { IMG } from '@/lib/images';
import { cn } from '@/lib/utils';

/**
 * The brand mark, in whichever lockup suits the surface.
 *
 * The horizontal wordmark is dark green on gold and needs a light ground, so
 * the footer — which is deep olive — gets the gold lockup instead. Both are
 * the real artwork rather than type set to look like it, which is why the mark
 * is an image here and not markup.
 */
export function Logo({
  className,
  tone = 'default',
}: {
  className?: string;
  tone?: 'default' | 'inverted';
}) {
  const inverted = tone === 'inverted';

  return (
    <Link
      href="/"
      aria-label={logoText.homeAriaLabel(site.name)}
      className={cn(
        'group flex shrink-0 items-center transition-opacity duration-300 hover:opacity-85',
        className,
      )}
    >
      <Image
        src={inverted ? IMG.brandEmblem : IMG.brandWordmark}
        alt=""
        width={inverted ? 1078 : 1416}
        height={inverted ? 1024 : 638}
        priority
        quality={86}
        sizes={inverted ? '7rem' : '12rem'}
        className={cn('w-auto', inverted ? 'h-[5.25rem]' : 'h-[2.35rem] lg:h-[2.7rem]')}
      />
    </Link>
  );
}
