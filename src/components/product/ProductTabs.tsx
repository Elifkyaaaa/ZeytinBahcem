'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock, MapPin, PackageCheck, RotateCcw, Truck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { site } from '@/lib/data/site';
import { blurDataURL, cn, formatDate } from '@/lib/utils';
import type { Product } from '@/types';
import { productTabsText } from '@/lib/data/text/product';

const tabs = (['aciklama', 'besin', 'kargo', 'yorumlar', 'sss'] as const).map((id) => ({
  id,
  label: productTabsText.tabs[id],
}));

type TabId = (typeof tabs)[number]['id'];

const shippingOptions = [Truck, Clock, MapPin].map((Icon, i) => {
  const option = productTabsText.shippingOptions[i];
  return {
    Icon,
    title: option.title,
    detail: option.detail,
    price: option.price(site.freeShippingThreshold),
  };
});

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<TabId>('aciklama');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const ratingBuckets = [5, 4, 3, 2, 1].map((star) => {
    // Derive a plausible distribution from the average rating (demo data).
    const weight = Math.max(0, 1 - Math.abs(product.rating - star) / 2.2);
    return { star, percent: Math.round(weight * 100) };
  });
  const bucketTotal = ratingBuckets.reduce((s, b) => s + b.percent, 0) || 1;

  return (
    <section id="yorumlar" className="mt-20 lg:mt-28" aria-label={productTabsText.panelLabel}>
      <div
        role="tablist"
        aria-label={productTabsText.tabsLabel}
        className="-mx-5 flex gap-1 overflow-x-auto border-b border-border px-5 sm:mx-0 sm:px-0"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative shrink-0 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 sm:px-5',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
              {t.id === 'yorumlar' && (
                <span className="ml-1.5 text-xs text-muted-foreground">({product.reviewCount})</span>
              )}
              {active && (
                <motion.span
                  layoutId="tab-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="py-9">
        <AnimatePresence mode="wait">
          {tab === 'aciklama' && (
            <Panel key="aciklama">
              <div
                role="tabpanel"
                id="panel-aciklama"
                aria-labelledby="tab-aciklama"
                className="grid gap-10 lg:grid-cols-[1.55fr_1fr]"
              >
                <div>
                  <p className="text-base leading-[1.85] text-foreground/85">{product.description}</p>

                  <h3 className="mt-9 font-display text-xl text-foreground">{productTabsText.highlightsHeading}</h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 rounded-xl bg-surface-muted px-4 py-3 text-sm text-foreground/85"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                  <h3 className="font-display text-lg text-foreground">{productTabsText.specsHeading}</h3>
                  <dl className="mt-4 divide-y divide-border">
                    {product.specs.map((spec, i) => (
                      <div key={`${spec.label}-${i}`} className="flex justify-between gap-4 py-3">
                        <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                        <dd className="text-right text-sm font-medium text-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Panel>
          )}

          {tab === 'besin' && (
            <Panel key="besin">
              <div role="tabpanel" id="panel-besin" aria-labelledby="tab-besin">
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {productTabsText.nutritionIntroBefore}{' '}
                  <strong className="font-semibold text-foreground">
                    {productTabsText.nutritionPortion}
                  </strong>{' '}
                  {productTabsText.nutritionIntroAfter}
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th scope="col" className="px-5 py-3.5 text-left font-semibold text-foreground">
                          {productTabsText.nutritionColumn}
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-right font-semibold text-foreground">
                          100 g’da
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-right font-semibold text-foreground">
                          RA %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {product.nutrition.map((row) => (
                        <tr key={row.label} className="transition-colors hover:bg-surface-muted/60">
                          <th
                            scope="row"
                            className={cn(
                              'px-5 py-3 text-left font-normal',
                              row.label.startsWith('—')
                                ? 'pl-9 text-muted-foreground'
                                : 'font-medium text-foreground',
                            )}
                          >
                            {row.label}
                          </th>
                          <td className="px-5 py-3 text-right text-foreground tabular-nums">
                            {row.amount}
                          </td>
                          <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                            {row.daily ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {productTabsText.nutritionFootnote}
                </p>
              </div>
            </Panel>
          )}

          {tab === 'kargo' && (
            <Panel key="kargo">
              <div role="tabpanel" id="panel-kargo" aria-labelledby="tab-kargo">
                <div className="grid gap-4 sm:grid-cols-3">
                  {shippingOptions.map(({ Icon, title, detail, price }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                      <p className="mt-1 text-sm text-gold-700 dark:text-gold-400">{detail}</p>
                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{price}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface-muted p-6">
                    <h3 className="flex items-center gap-2.5 font-semibold text-foreground">
                      <PackageCheck className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
                      {productTabsText.packagingHeading}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {productTabsText.packagingNote}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-muted p-6">
                    <h3 className="flex items-center gap-2.5 font-semibold text-foreground">
                      <RotateCcw className="size-5 text-olive-600 dark:text-gold-400" strokeWidth={1.8} />
                      {productTabsText.returnHeading}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {productTabsText.returnNote}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {tab === 'yorumlar' && (
            <Panel key="yorumlar">
              <div
                role="tabpanel"
                id="panel-yorumlar"
                aria-labelledby="tab-yorumlar"
                className="grid gap-10 lg:grid-cols-[18rem_1fr]"
              >
                <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft lg:sticky lg:top-24 lg:self-start">
                  <p className="font-display text-5xl font-semibold text-foreground tabular-nums">
                    {product.rating.toFixed(1)}
                  </p>
                  <StarRating rating={product.rating} size="lg" className="mt-3 justify-center" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {productTabsText.reviewCount(product.reviewCount)}
                  </p>

                  <div className="mt-6 space-y-2">
                    {ratingBuckets.map(({ star, percent }) => (
                      <div key={star} className="flex items-center gap-2.5">
                        <span className="w-3 text-xs text-muted-foreground tabular-nums">{star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/8">
                          <div
                            className="h-full rounded-full bg-gold-500"
                            style={{ width: `${(percent / bucketTotal) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[0.7rem] text-muted-foreground tabular-nums">
                          {Math.round((percent / bucketTotal) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-4">
                  {product.reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow duration-400 hover:shadow-lift"
                    >
                      <div className="flex items-start gap-4">
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
                            <span className="font-semibold text-foreground">{review.name}</span>
                            {review.verified && (
                              <Badge tone="success">{productTabsText.verifiedPurchase}</Badge>
                            )}
                            <time
                              dateTime={review.date}
                              className="ml-auto text-xs text-muted-foreground"
                            >
                              {formatDate(review.date)}
                            </time>
                          </div>
                          <StarRating rating={review.rating} className="mt-2" />
                          <h4 className="mt-3 font-medium text-foreground">{review.title}</h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          )}

          {tab === 'sss' && (
            <Panel key="sss">
              <div
                role="tabpanel"
                id="panel-sss"
                aria-labelledby="tab-sss"
                className="mx-auto max-w-3xl"
              >
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                  {product.faq.map((item, i) => {
                    const open = openFaq === i;
                    return (
                      <li key={item.question}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? null : i)}
                          aria-expanded={open}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-muted/60"
                        >
                          <span className="font-medium text-foreground">{item.question}</span>
                          <ChevronDown
                            className={cn(
                              'size-5 shrink-0 text-muted-foreground transition-transform duration-400',
                              open && 'rotate-180 text-gold-600',
                            )}
                            strokeWidth={1.9}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {productTabsText.faqContactBefore}{' '}
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold-700 underline underline-offset-4 dark:text-gold-400"
                  >
                    {productTabsText.whatsappCta}
                  </a>
                  {productTabsText.faqContactAfter}
                </p>
              </div>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
