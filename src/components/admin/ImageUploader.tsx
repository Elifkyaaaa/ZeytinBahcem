'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ImagePlus, Link2, TriangleAlert, Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState, type DragEvent } from 'react';
import { useCopy } from '@/hooks';
import { blurDataURL, cn, safeImageSrc } from '@/lib/utils';

interface Uploaded {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Direct upload to Cloudinary.
 * The signature comes from our server, the file goes from the browser straight
 * to Cloudinary, and the returned secure_url is what gets written to Supabase
 * `products.image_url`.
 */
export function ImageUploader({
  folder,
  onUploaded,
  multiple = true,
}: {
  folder?: string;
  onUploaded?: (image: Uploaded) => void;
  multiple?: boolean;
}) {
  const [items, setItems] = useState<Uploaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopy();

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (list.length === 0) return;

      setBusy(true);
      setError(null);
      setProgress(0);

      try {
        const signResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ folder }),
        });

        if (!signResponse.ok) {
          const payload = (await signResponse.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? 'İmza alınamadı.');
        }

        const sign = (await signResponse.json()) as {
          signature: string;
          timestamp: number;
          apiKey: string;
          folder: string;
          uploadUrl: string;
        };

        const uploaded: Uploaded[] = [];

        for (const [index, file] of list.entries()) {
          const body = new FormData();
          body.append('file', file);
          body.append('api_key', sign.apiKey);
          body.append('timestamp', String(sign.timestamp));
          body.append('signature', sign.signature);
          body.append('folder', sign.folder);

          const response = await fetch(sign.uploadUrl, { method: 'POST', body });
          if (!response.ok) throw new Error(`${file.name} yüklenemedi.`);

          const data = (await response.json()) as {
            secure_url: string;
            public_id: string;
            width: number;
            height: number;
            bytes: number;
          };

          const item: Uploaded = {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
          };

          uploaded.push(item);
          onUploaded?.(item);
          setProgress(Math.round(((index + 1) / list.length) * 100));
        }

        setItems((prev) => (multiple ? [...prev, ...uploaded] : uploaded));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Yükleme başarısız oldu.');
      } finally {
        setBusy(false);
      }
    },
    [folder, multiple, onUploaded],
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) void upload(event.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-9 text-center transition-all duration-300',
          dragging
            ? 'border-gold-500 bg-gold-500/8'
            : 'border-border hover:border-gold-500/50 hover:bg-surface-muted/50',
        )}
      >
        <span
          className={cn(
            'grid size-14 place-items-center rounded-2xl transition-colors',
            busy
              ? 'bg-gold-500/12 text-gold-600'
              : 'bg-surface-muted text-muted-foreground',
          )}
        >
          {busy ? (
            <UploadCloud className="size-6 animate-pulse" strokeWidth={1.6} />
          ) : (
            <ImagePlus className="size-6" strokeWidth={1.6} />
          )}
        </span>

        <div>
          <p className="text-sm font-medium text-foreground">
            {busy ? `Yükleniyor… %${progress}` : 'Görsel sürükleyip bırakın'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            veya seçmek için tıklayın · JPG, PNG, WebP · en fazla 10 MB
          </p>
        </div>

        {busy && (
          <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-foreground/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-olive-500 to-gold-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && upload(e.target.files)}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/8 p-3.5 text-xs leading-relaxed text-red-700 dark:text-red-300"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.publicId}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface-muted"
            >
              <div className="relative aspect-square">
                <Image
                  src={safeImageSrc(item.url)}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 180px, 45vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-olive-950/72 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copy(item.url)}
                  aria-label="URL'yi kopyala"
                  className="grid size-7 place-items-center rounded-md text-cream-100 transition-colors hover:bg-white/15"
                >
                  {copied ? (
                    <Check className="size-3.5" strokeWidth={2.8} />
                  ) : (
                    <Link2 className="size-3.5" strokeWidth={2} />
                  )}
                </button>
                <span className="flex-1 truncate text-[0.62rem] text-cream-200/80 tabular-nums">
                  {item.width}×{item.height} · {Math.round(item.bytes / 1024)} KB
                </span>
                <button
                  onClick={() => setItems((prev) => prev.filter((x) => x.publicId !== item.publicId))}
                  aria-label="Listeden çıkar"
                  className="grid size-7 place-items-center rounded-md text-cream-100 transition-colors hover:bg-red-500/60"
                >
                  <Trash2 className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
