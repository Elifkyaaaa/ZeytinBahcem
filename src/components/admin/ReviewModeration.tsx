'use client';

import { Check, MessageSquare, Star, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { deleteReview, setReviewStatus } from '@/app/admin/review-actions';
import { EmptyState, Panel, StatCard, Status, Toolbar } from '@/components/admin/primitives';
import { StarRating } from '@/components/ui/StarRating';
import { blurDataURL, formatDate, safeImageSrc, slugify } from '@/lib/utils';
import type { ReviewStatus } from '@/types/database';

export interface PanelReview {
  id: string;
  productName: string;
  productSlug: string;
  author: string;
  avatarUrl: string | null;
  rating: number;
  title: string | null;
  comment: string;
  date: string;
  status: ReviewStatus;
  verified: boolean;
}

const tabs: { id: ReviewStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'pending', label: 'Onay Bekleyen' },
  { id: 'approved', label: 'Onaylanan' },
  { id: 'rejected', label: 'Reddedilen' },
];

const statusMeta: Record<ReviewStatus, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Onaylandı', tone: 'success' },
  pending: { label: 'Bekliyor', tone: 'warning' },
  rejected: { label: 'Reddedildi', tone: 'danger' },
};

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toLocaleUpperCase('tr-TR') || 'ZB'
  );
}

export function ReviewModeration({ reviews }: { reviews: PanelReview[] }) {
  const [tab, setTab] = useState<string>('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return reviews.filter((r) => {
      if (tab !== 'all' && r.status !== tab) return false;
      if (q.length >= 2 && !slugify(`${r.productName} ${r.author} ${r.comment}`).includes(q))
        return false;
      return true;
    });
  }, [reviews, tab, search]);

  const counts = Object.fromEntries(
    tabs.map((t) => [
      t.id,
      t.id === 'all' ? reviews.length : reviews.filter((r) => r.status === t.id).length,
    ]),
  ) as Record<string, number>;

  const approved = reviews.filter((r) => r.status === 'approved');
  const avg = approved.length
    ? approved.reduce((s, r) => s + r.rating, 0) / approved.length
    : 0;

  return (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Onay Bekleyen"
          value={String(counts.pending ?? 0)}
          hint="Vitrinde henüz görünmüyor"
          Icon={MessageSquare}
          accent="gold"
        />
        <StatCard
          label="Ortalama Puan"
          value={avg > 0 ? avg.toFixed(1) : '—'}
          hint="Yalnızca onaylı yorumlar"
          Icon={Star}
          accent="olive"
        />
        <StatCard
          label="Reddedilen"
          value={String(counts.rejected ?? 0)}
          hint="Spam veya kural dışı"
          Icon={X}
          accent="rose"
        />
      </div>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="Ürün, müşteri veya yorum metni…"
            tabs={tabs.map((t) => ({ id: t.id, label: t.label, count: counts[t.id] }))}
            activeTab={tab}
            onTab={setTab}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="Yorum yok"
            description={
              reviews.length === 0
                ? 'Müşteriler ürünlere yorum bıraktığında burada listelenir.'
                : 'Bu filtreye uyan yorum bulunamadı.'
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((review) => {
              const meta = statusMeta[review.status];
              return (
                <li key={review.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {review.avatarUrl ? (
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                        <Image
                          src={safeImageSrc(review.avatarUrl)}
                          alt=""
                          fill
                          sizes="44px"
                          placeholder="blur"
                          blurDataURL={blurDataURL()}
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-olive-700 text-xs font-bold text-cream-50 dark:bg-gold-500 dark:text-olive-950">
                        {initialsOf(review.author)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="font-medium text-foreground">{review.author}</span>
                        <Status tone={meta.tone}>{meta.label}</Status>
                        {review.verified && <Status tone="olive">Doğrulanmış alışveriş</Status>}
                        <time
                          dateTime={review.date}
                          className="ml-auto text-xs text-muted-foreground"
                        >
                          {formatDate(review.date)}
                        </time>
                      </div>

                      <Link
                        href={`/products/${review.productSlug}`}
                        target="_blank"
                        className="mt-1 block text-xs text-muted-foreground transition-colors hover:text-gold-600"
                      >
                        {review.productName}
                      </Link>

                      <StarRating rating={review.rating} className="mt-2" />

                      {review.title && (
                        <p className="mt-2.5 font-medium text-foreground">{review.title}</p>
                      )}
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
                        {review.comment}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <form action={setReviewStatus}>
                          <input type="hidden" name="id" value={review.id} />
                          <input type="hidden" name="status" value="approved" />
                          <button
                            type="submit"
                            disabled={review.status === 'approved'}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-olive-700 px-4 text-xs font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 disabled:opacity-40 dark:bg-olive-500 dark:text-olive-950"
                          >
                            <Check className="size-3.5" strokeWidth={2.8} />
                            Onayla
                          </button>
                        </form>

                        <form action={setReviewStatus}>
                          <input type="hidden" name="id" value={review.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button
                            type="submit"
                            disabled={review.status === 'rejected'}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium transition-colors hover:border-red-400/60 hover:text-red-600 disabled:opacity-40"
                          >
                            <X className="size-3.5" strokeWidth={2.6} />
                            Reddet
                          </button>
                        </form>

                        <form action={deleteReview} className="ml-auto">
                          <input type="hidden" name="id" value={review.id} />
                          <button
                            type="submit"
                            aria-label="Yorumu sil"
                            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                          >
                            <Trash2 className="size-4" strokeWidth={1.9} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
