import Link from 'next/link';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'glass';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'tracking-tight transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-olive-700 text-cream-50 shadow-soft hover:bg-olive-600 hover:shadow-lift hover:-translate-y-0.5 ' +
    'dark:bg-olive-500 dark:text-olive-950 dark:hover:bg-olive-400',
  gold:
    'bg-gradient-to-br from-gold-400 to-gold-600 text-olive-950 shadow-soft ' +
    'hover:shadow-glow hover:-translate-y-0.5',
  outline:
    'border border-olive-700/25 text-olive-800 hover:border-gold-500 hover:text-olive-900 ' +
    'hover:-translate-y-0.5 hover:shadow-soft dark:border-cream-200/25 dark:text-cream-100 ' +
    'dark:hover:border-gold-400 dark:hover:text-cream-50',
  ghost:
    'text-olive-800 hover:bg-olive-900/6 dark:text-cream-100 dark:hover:bg-cream-50/10',
  glass:
    'border border-white/30 bg-white/12 text-white backdrop-blur-md hover:bg-white/22 ' +
    'hover:-translate-y-0.5 hover:border-white/50',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
  xl: 'h-14 px-9 text-base sm:h-15 sm:px-11 sm:text-lg',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Işık süpürme efekti — dolgulu butonlarda öne çıkar */
  sheen?: boolean;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    href: string;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(function Button(
  { variant = 'primary', size = 'md', className, children, sheen = true, ...props },
  ref,
) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    sheen && (variant === 'primary' || variant === 'gold') && 'sheen',
    className,
  );

  if ('href' in props && props.href) {
    const { href, ...rest } = props as AnchorProps;
    const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (external) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
});
