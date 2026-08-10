import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Every request except static assets:
     * _next/static, _next/image, favicon and image file extensions are excluded.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};
