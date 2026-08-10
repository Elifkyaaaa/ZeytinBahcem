import type { SVGProps } from 'react';

/**
 * Lucide v1 dropped its brand icons, so the social ones live here.
 * They all use currentColor and scale with the size classes.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2.05 22.2l5.56-1.45a9.8 9.8 0 0 0 4.43 1.06h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.77 9.77 0 0 0 12.04 2Zm0 1.86c2.13 0 4.13.83 5.64 2.34a7.93 7.93 0 0 1 2.33 5.64c0 4.4-3.58 7.98-7.98 7.98a8 8 0 0 1-4.06-1.11l-.29-.17-3.02.79.8-2.94-.19-.3a7.93 7.93 0 0 1-1.22-4.25c0-4.4 3.58-7.98 7.99-7.98ZM8.5 6.98c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.72 4.15 3.7 2.03.8 2.45.64 2.89.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.3-.74-1.78-.19-.46-.39-.4-.53-.41h-.46Z" />
    </svg>
  );
}

/** Olive branch, used in the logo lockup and as a decorative divider. */
export function OliveBranchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <path
        d="M4 27c6.5-1.2 11.8-4.4 15.8-9.2C23.4 13.5 25.7 8.6 26.8 3"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <ellipse cx="11.2" cy="20.6" rx="3.1" ry="2.2" transform="rotate(-32 11.2 20.6)" fill="currentColor" opacity={0.9} />
      <ellipse cx="18.4" cy="14.2" rx="3.1" ry="2.2" transform="rotate(-42 18.4 14.2)" fill="currentColor" opacity={0.65} />
      <ellipse cx="23.4" cy="7.4" rx="2.8" ry="2" transform="rotate(-52 23.4 7.4)" fill="currentColor" opacity={0.45} />
      <ellipse cx="7.6" cy="15.4" rx="2.6" ry="1.9" transform="rotate(24 7.6 15.4)" fill="currentColor" opacity={0.55} />
      <ellipse cx="15" cy="9.2" rx="2.6" ry="1.9" transform="rotate(14 15 9.2)" fill="currentColor" opacity={0.4} />
    </svg>
  );
}

/** Card payment marks, kept plain for the footer and checkout. */
export function PaymentMark({ label, ...props }: SVGProps<SVGSVGElement> & { label: string }) {
  return (
    <svg viewBox="0 0 48 30" role="img" aria-label={label} {...props}>
      <rect x="0.6" y="0.6" width="46.8" height="28.8" rx="4.4" fill="none" stroke="currentColor" strokeOpacity={0.28} />
      <text
        x="24"
        y="19.4"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="currentColor"
        fillOpacity={0.72}
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
