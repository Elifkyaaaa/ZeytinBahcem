import 'server-only';

/**
 * Basit, bellek içi hız sınırlayıcı (sabit pencere).
 *
 * Amaç: sipariş, yükleme ve tohumlama uçlarının kaba kuvvet ve kötüye
 * kullanıma karşı korunması.
 *
 * SINIRLARI — bilerek kabul edilen ödünler:
 *  • Sayaç süreç belleğindedir. Birden çok sunucu örneği (Vercel'de her
 *    bölge/lambda) kendi sayacını tutar; toplam sınır örnek sayısıyla çarpılır.
 *  • Sunucu yeniden başlarsa sayaç sıfırlanır.
 *
 * Tek örnekli kurulumda ve orta ölçekli trafikte yeterlidir. Dağıtık ve kesin
 * bir sınır gerektiğinde `check()` gövdesini Upstash Redis gibi paylaşımlı bir
 * sayaçla değiştirmek yeterli; çağrı yerleri değişmez.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Belleğin sınırsız büyümesini önlemek için süresi dolanları ara sıra temizle. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Sınır aşıldığında kaç saniye sonra tekrar denenebilir */
  retryAfter: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/**
 * İstemci kimliği. Vercel/Cloudflare arkasında gerçek IP `x-forwarded-for`
 * başlığının ilk değeridir. Başlık taklit edilebilir; bu yüzden hız sınırı
 * tek başına yeterli bir güvenlik katmanı değil, ek bir engeldir.
 */
export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'bilinmeyen';
  return `${scope}:${ip}`;
}

/** 429 yanıtı — standart `Retry-After` başlığıyla. */
export function tooManyRequests(retryAfter: number) {
  return Response.json(
    {
      ok: false,
      error: `Çok fazla istek gönderildi. Lütfen ${retryAfter} saniye sonra tekrar deneyin.`,
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}
