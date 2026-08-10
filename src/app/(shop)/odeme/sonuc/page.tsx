import { Check, Package, TriangleAlert } from 'lucide-react';
import { CartCleaner } from '@/components/checkout/CartCleaner';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ödeme Sonucu',
  description: 'Sipariş ödemenizin sonucu.',
  path: '/odeme/sonuc',
  noIndex: true,
});

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; no?: string; mesaj?: string }>;
}) {
  const { durum, no, mesaj } = await searchParams;
  const success = durum === 'basarili';

  return (
    <div className="flex min-h-[70svh] items-center pt-24 pb-20 sm:pt-28">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          {success ? (
            <>
              {/* Clear the cart once payment is confirmed */}
              <CartCleaner />

              <span className="inline-grid size-20 place-items-center rounded-full bg-olive-600 text-cream-50">
                <Check className="size-9" strokeWidth={2.8} />
              </span>

              <h1 className="mt-7 font-display text-3xl text-foreground sm:text-4xl">
                Ödemeniz alındı
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {no ? (
                  <>
                    Sipariş numaranız{' '}
                    <strong className="font-semibold text-foreground tabular-nums">{no}</strong>.
                  </>
                ) : (
                  'Siparişiniz başarıyla oluşturuldu.'
                )}{' '}
                Onay e-postası kısa süre içinde kutunuzda olacak.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left shadow-soft">
                <h2 className="flex items-center gap-2.5 font-display text-lg text-foreground">
                  <Package className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
                  Bundan sonra ne olacak?
                </h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {[
                    'Siparişiniz depomuzda hazırlanmaya başlar.',
                    'Cam şişeler çift katmanlı köpükle, ayrı bölmeli kutuda paketlenir.',
                    'Kargoya verildiğinde takip numaranızı e-posta ile göndeririz.',
                    'Ortalama teslim süresi 1–3 iş günüdür.',
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-olive-600/10 text-xs font-semibold text-olive-700 tabular-nums dark:bg-gold-400/12 dark:text-gold-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  href={no ? `/siparis-takibi?no=${encodeURIComponent(no)}` : '/siparis-takibi'}
                  variant="gold"
                  size="lg"
                >
                  Siparişimi Takip Et
                </Button>
                <Button href="/urunler" variant="outline" size="lg">
                  Alışverişe Devam Et
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="inline-grid size-20 place-items-center rounded-full bg-red-500/12 text-red-600 dark:text-red-400">
                <TriangleAlert className="size-9" strokeWidth={2} />
              </span>

              <h1 className="mt-7 font-display text-3xl text-foreground sm:text-4xl">
                Ödeme tamamlanamadı
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {mesaj ??
                  'Ödeme işlemi sırasında bir sorun oluştu. Kartınızdan herhangi bir tahsilat yapılmadı.'}
              </p>

              <div className="mt-8 rounded-2xl bg-surface-muted p-6 text-left text-sm leading-relaxed text-muted-foreground">
                <p className="font-semibold text-foreground">Sık karşılaşılan nedenler</p>
                <ul className="mt-3 space-y-2">
                  {[
                    'Kart bilgilerinde hata veya limit yetersizliği',
                    'Bankanızın 3D Secure doğrulamasının tamamlanmaması',
                    'Kartın internetten alışverişe kapalı olması',
                  ].map((reason) => (
                    <li key={reason} className="flex gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/odeme" variant="gold" size="lg">
                  Tekrar Dene
                </Button>
                <Button href="/iletisim" variant="outline" size="lg">
                  Destek Alın
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
