import { Info } from 'lucide-react';
import { supabaseNoticeText } from '@/lib/data/text/account';

/** Honest notice shown on the account screens when Supabase is not connected. */
export function SupabaseNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/8 p-5">
      <Info className="mt-0.5 size-5 shrink-0 text-gold-700 dark:text-gold-400" strokeWidth={1.9} />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">{supabaseNoticeText.title}</p>
        <p className="mt-1.5 text-muted-foreground">
          {supabaseNoticeText.bodyBefore}{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">
            {supabaseNoticeText.migrationsPath}
          </code>{' '}
          {supabaseNoticeText.bodyMiddle}{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">{supabaseNoticeText.envFile}</code>{' '}
          {supabaseNoticeText.bodyBeforeKeys}{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">{supabaseNoticeText.urlKey}</code>{' '}
          {supabaseNoticeText.keysBetween}{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">{supabaseNoticeText.anonKey}</code>{' '}
          {supabaseNoticeText.bodyAfter}
        </p>
      </div>
    </div>
  );
}
