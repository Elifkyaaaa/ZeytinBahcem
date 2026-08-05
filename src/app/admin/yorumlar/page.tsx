'use client';

import { Check, MessageSquare, Star, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import {
  DemoNotice,
  EmptyState,
  Panel,
  StatCard,
  Status,
  Toolbar,
} from '@/components/admin/primitives';
import { StarRating } from '@/components/ui/StarRating';
import { adminReviews, type AdminReview } from '@/lib/data/admin';
import { blurDataURL, formatDate, slugify } from '@/lib/utils';

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'bekliyor', label: 'Onay Bekleyen' },
  { id: 'onaylandi', label: 'Onaylanan' },
  { id: 'reddedildi', label: 'Reddedilen' },
];

export default function AdminReviewsPage() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [states, setStates] = useState<Record<string, AdminReview['status']>>(
    Object.fromEntries(adminReviews.map((r) => [r.id, r.status])),
  );

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return adminReviews.filter((r) => {
      if (tab !== 'all' && states[r.id] !== tab) return false;
      if (q.length >= 2 && !slugify(`${r.product} ${r.customer} ${r.comment}`).includes(q))
        return false;
      return true;
    });
  }, [tab, search, states]);

  const counts = {
    all: adminReviews.length,
    bekliyor: Object.values(states).filter((s) => s === 'bekliyor').length,
    onaylandi: Object.values(states).filter((s) => s === 'onaylandi').length,
    reddedildi: Object.values(states).filter((s) => s === 'reddedildi').length,
  };

  const avg =
    adminReviews.reduce((s, r) => s + r.rating, 0) / (adminReviews.length || 1);

  return (
    <>
      <AdminPageHeader
        title="Yorum Yönetimi"
        description="Müşteri değerlendirmelerini onaylayın veya reddedin"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Onay Bekleyen"
          value={String(counts.bekliyor)}
          Icon={MessageSquare}
          accent="gold"
        />
        <StatCard
          label="Ortalama Puan"
          value={avg.toFixed(1)}
          hint="Tüm yorumların ortalaması"
          Icon={Star}
          accent="olive"
        />
        <StatCard
          label="Reddedilen"
          value={String(counts.reddedildi)}
          hint="Spam veya kural dışı"
          Icon={X}
          accent="rose"
        />
      </div>

      <DemoNotice>
        Onay/ret düğmeleri bu oturumda durum değişikliğini gösterir; kalıcı kayıt için yönetim API’si
        gerekir.
      </DemoNotice>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar
            search={search}
            onSearch={setSearch}
            placeholder="Ürün, müşteri veya yorum metni…"
            tabs={tabs.map((t) => ({ ...t, count: counts[t.id as keyof typeof counts] }))}
            activeTab={tab}
            onTab={setTab}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Yorum bulunamadı" description="Bu filtreye uyan kayıt yok." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((review) => {
              const status = states[review.id];
              return (
                <li key={review.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                      <Image
                        src={review.avatar}
                        alt=""
                        fill
                        sizes="44px"
                        placeholder="blur"
                        blurDataURL={blurDataURL()}
                        className="object-cover"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="font-medium text-foreground">{review.customer}</span>
                        <Status
                          tone={
                            status === 'onaylandi'
                              ? 'success'
                              : status === 'reddedildi'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {status === 'onaylandi'
                            ? 'Onaylandı'
                            : status === 'reddedildi'
                              ? 'Reddedildi'
                              : 'Bekliyor'}
                        </Status>
                        <time
                          dateTime={review.date}
                          className="ml-auto text-xs text-muted-foreground"
                        >
                          {formatDate(review.date)}
                        </time>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">{review.product}</p>
                      <StarRating rating={review.rating} className="mt-2" />
                      <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
                        {review.comment}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() =>
                            setStates((prev) => ({ ...prev, [review.id]: 'onaylandi' }))
                          }
                          disabled={status === 'onaylandi'}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-olive-700 px-4 text-xs font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 disabled:opacity-40 dark:bg-olive-500 dark:text-olive-950"
                        >
                          <Check className="size-3.5" strokeWidth={2.8} />
                          Onayla
                        </button>
                        <button
                          onClick={() =>
                            setStates((prev) => ({ ...prev, [review.id]: 'reddedildi' }))
                          }
                          disabled={status === 'reddedildi'}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium transition-colors hover:border-red-400/60 hover:text-red-600 disabled:opacity-40"
                        >
                          <X className="size-3.5" strokeWidth={2.6} />
                          Reddet
                        </button>
                        <button
                          aria-label="Yorumu sil"
                          className="ml-auto grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                        >
                          <Trash2 className="size-4" strokeWidth={1.9} />
                        </button>
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
