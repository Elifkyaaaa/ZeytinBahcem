import { ArrowRight, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { OliveBranchIcon } from '@/components/ui/icons';
import { Container } from '@/components/ui/Section';
import { categories } from '@/lib/data/categories';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center py-20">
      <Container className="text-center">
        <span className="inline-grid size-20 place-items-center rounded-full bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/15 dark:bg-gold-400/10 dark:text-gold-400">
          <OliveBranchIcon className="size-10" />
        </span>

        <p className="mt-8 font-serif text-[5rem] leading-none font-semibold text-gold-600/25 tabular-nums sm:text-[7rem] dark:text-gold-400/25">
          404
        </p>

        <h1 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
          Bu dal boş çıktı
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Aşağıdaki bağlantılardan
          devam edebilirsiniz.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3.5 sm:flex-row">
          <Button href="/" variant="gold" size="lg">
            <Home className="size-5" strokeWidth={2} />
            Ana Sayfaya Dön
          </Button>
          <Button href="/urunler" variant="outline" size="lg">
            <Search className="size-5" strokeWidth={2} />
            Ürünleri İncele
          </Button>
        </div>

        <div className="mx-auto mt-14 max-w-2xl border-t border-border pt-9">
          <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Kategoriler
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/urunler?kategori=${category.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-foreground"
                >
                  {category.name}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
