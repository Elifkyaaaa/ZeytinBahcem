'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { useEscape, useLockBodyScroll, useMediaQuery } from '@/hooks';
import { blurDataURL, cn } from '@/lib/utils';
import { productGalleryText } from '@/lib/data/text/product';

const ZOOM = 2.4;

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  const closeLightbox = useCallback(() => setLightbox(false), []);
  useEscape(closeLightbox, lightbox);
  useLockBodyScroll(lightbox);

  const step = useCallback(
    (delta: number) => setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  // Cursor-following zoom: the source point is fed to transform-origin as a percentage.
  const track = (e: MouseEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <div className="lg:sticky lg:top-24">
        <div
          ref={frameRef}
          onMouseEnter={() => canHover && setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={track}
          onClick={() => setLightbox(true)}
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-surface-muted shadow-soft"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={productGalleryText.imageAlt(name, active + 1)}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 46vw, 94vw"
                placeholder="blur"
                blurDataURL={blurDataURL()}
                className="object-cover transition-transform duration-300 ease-out"
                style={
                  zooming
                    ? {
                        transform: `scale(${ZOOM})`,
                        transformOrigin: `${origin.x}% ${origin.y}%`,
                      }
                    : undefined
                }
              />
            </motion.div>
          </AnimatePresence>

          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full',
              'bg-olive-950/72 px-3 py-1.5 text-[0.7rem] font-medium text-cream-50 backdrop-blur-sm',
              'transition-opacity duration-300',
              zooming ? 'opacity-0' : 'opacity-100',
            )}
          >
            <ZoomIn className="size-3.5" strokeWidth={2} />
            {canHover ? productGalleryText.hoverHint : productGalleryText.touchHint}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
            aria-label={productGalleryText.openFullscreen}
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-olive-950/55 text-cream-50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            <Expand className="size-4" strokeWidth={2} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={productGalleryText.previous}
                className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cream-50/85 text-olive-900 opacity-0 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-cream-50 dark:bg-olive-900/80 dark:text-cream-50"
              >
                <ChevronLeft className="size-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={productGalleryText.next}
                className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cream-50/85 text-olive-900 opacity-0 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-cream-50 dark:bg-olive-900/80 dark:text-cream-50"
              >
                <ChevronRight className="size-5" strokeWidth={2} />
              </button>
            </>
          )}
        </div>

        <div className="mt-3.5 grid grid-cols-4 gap-2.5 sm:gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={productGalleryText.thumbLabel(i + 1)}
              aria-current={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl border-2 bg-surface-muted transition-all duration-300',
                i === active
                  ? 'border-gold-500 shadow-soft'
                  : 'border-transparent opacity-65 hover:opacity-100',
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 11vw, 22vw"
                placeholder="blur"
                blurDataURL={blurDataURL()}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={productGalleryText.galleryLabel(name)}
            className="fixed inset-0 z-[95] grid place-items-center bg-olive-950/94 p-4 backdrop-blur-md sm:p-8"
          >
            <button
              onClick={closeLightbox}
              aria-label="Kapat"
              className="absolute top-5 right-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 text-cream-100 transition-colors hover:bg-white/10"
            >
              <X className="size-5" strokeWidth={1.8} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-square w-full max-w-3xl overflow-hidden rounded-2xl"
            >
              <Image
                src={images[active]}
                alt={productGalleryText.zoomedAlt(name, active + 1)}
                fill
                sizes="(min-width: 768px) 48rem, 92vw"
                className="object-contain"
              />
            </motion.div>

            <div
              className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={productGalleryText.dotLabel(i + 1)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === active ? 'w-8 bg-gold-400' : 'w-1.5 bg-cream-200/35 hover:bg-cream-200/60',
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
