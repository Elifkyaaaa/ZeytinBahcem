import { Info } from 'lucide-react';

/** Supabase bağlı değilken hesap ekranlarında gösterilen dürüst bilgilendirme. */
export function SupabaseNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/8 p-5">
      <Info className="mt-0.5 size-5 shrink-0 text-gold-700 dark:text-gold-400" strokeWidth={1.9} />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">Hesap sistemi henüz bağlanmadı</p>
        <p className="mt-1.5 text-muted-foreground">
          Bu ekranlar Supabase’e bağlanmaya hazır durumda. Şema{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">supabase/migrations</code> altında
          hazır; <code className="rounded bg-foreground/8 px-1 text-xs">.env.local</code> dosyasına{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> ve{' '}
          <code className="rounded bg-foreground/8 px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
          eklendiğinde giriş, sipariş geçmişi ve adres yönetimi canlıya geçer.
        </p>
      </div>
    </div>
  );
}
