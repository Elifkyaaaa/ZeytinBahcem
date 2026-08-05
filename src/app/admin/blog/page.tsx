'use client';

import { Eye, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import {
  DemoNotice,
  EmptyState,
  Panel,
  StatCard,
  Status,
  Table,
  Td,
  Th,
  Toolbar,
  Tr,
} from '@/components/admin/primitives';
import { posts } from '@/lib/data/posts';
import { blurDataURL, formatDate, slugify } from '@/lib/utils';

export default function AdminBlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const allCategories = Array.from(new Set(posts.map((p) => p.category)));

  const rows = useMemo(() => {
    const q = slugify(search.trim());
    return posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (q.length >= 2 && !slugify(`${p.title} ${p.excerpt}`).includes(q)) return false;
      return true;
    });
  }, [search, category]);

  const avgReading = Math.round(
    posts.reduce((s, p) => s + p.readingTime, 0) / (posts.length || 1),
  );

  return (
    <>
      <AdminPageHeader
        title="Blog Yönetimi"
        description={`${posts.length} yazı yayında`}
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950">
            <Plus className="size-4" strokeWidth={2.4} />
            Yeni Yazı
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Toplam Yazı" value={String(posts.length)} Icon={FileText} accent="olive" />
        <StatCard
          label="Kategori"
          value={String(allCategories.length)}
          Icon={FileText}
          accent="gold"
        />
        <StatCard
          label="Ortalama Okuma"
          value={`${avgReading} dk`}
          Icon={FileText}
          accent="blue"
        />
      </div>

      <DemoNotice>
        Yazılar <code className="rounded bg-foreground/8 px-1">src/lib/data/posts.ts</code> içinde
        tipli sabitler olarak tutulur. Bir başlık CMS’i bağlandığında bu ekran onu yönetir.
      </DemoNotice>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <Toolbar search={search} onSearch={setSearch} placeholder="Başlık veya özet…">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Kategori filtresi"
              className="h-10 shrink-0 rounded-xl border border-border bg-surface px-3 text-sm transition-colors hover:border-gold-500/45 focus:border-gold-500 focus:outline-none"
            >
              <option value="">Tüm kategoriler</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Toolbar>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Yazı bulunamadı" description="Arama terimini değiştirin." />
        ) : (
          <div className="px-5 pb-5">
            <Table>
              <thead>
                <tr>
                  <Th>Yazı</Th>
                  <Th>Kategori</Th>
                  <Th>Yazar</Th>
                  <Th>Tarih</Th>
                  <Th>Durum</Th>
                  <Th align="right">İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((post) => (
                  <Tr key={post.slug}>
                    <Td>
                      <span className="flex items-center gap-3">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                          <Image
                            src={post.cover}
                            alt=""
                            fill
                            sizes="64px"
                            placeholder="blur"
                            blurDataURL={blurDataURL()}
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-1 font-medium text-foreground">
                            {post.title}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {post.readingTime} dk okuma · /{post.slug}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <Status tone="gold">{post.category}</Status>
                    </Td>
                    <Td>
                      <span className="text-sm whitespace-nowrap">{post.author.name}</span>
                      <span className="block text-xs text-muted-foreground">{post.author.role}</span>
                    </Td>
                    <Td>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                    </Td>
                    <Td>
                      <Status tone="success">Yayında</Status>
                    </Td>
                    <Td align="right">
                      <span className="flex items-center justify-end gap-1">
                        <Link
                          href={`/blog/${post.slug}`}
                          aria-label="Yazıyı gör"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
                        >
                          <Eye className="size-4" strokeWidth={1.9} />
                        </Link>
                        <button
                          aria-label="Düzenle"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-gold-600"
                        >
                          <Pencil className="size-4" strokeWidth={1.9} />
                        </button>
                        <button
                          aria-label="Sil"
                          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/8 hover:text-red-600"
                        >
                          <Trash2 className="size-4" strokeWidth={1.9} />
                        </button>
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Panel>
    </>
  );
}
