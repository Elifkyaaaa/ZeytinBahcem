import { Droplets, Leaf, Lock, ShieldCheck, Sprout, Truck, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { features } from '@/lib/data/content';
import { whyUsText } from '@/lib/data/text/home';

const icons: Record<string, LucideIcon> = {
  Leaf,
  ShieldCheck,
  Sprout,
  Droplets,
  Truck,
  Lock,
};

export function WhyUsSection() {
  return (
    <Section id="neden-biz" tone="muted">
      <Container>
        <SectionHeading
          eyebrow={whyUsText.eyebrow}
          title={whyUsText.title}
          description={whyUsText.description}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = icons[feature.icon] ?? Leaf;
            return (
              <Reveal key={feature.id} delay={(i % 3) * 0.07} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/35 hover:shadow-lift">
                  {/* Sol üstten yayılan sıcak parıltı */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -left-16 size-48 rounded-full bg-gold-400/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />

                  <span className="relative grid size-14 place-items-center rounded-2xl bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/12 transition-all duration-500 group-hover:-rotate-6 group-hover:bg-gold-500/12 group-hover:text-gold-600 group-hover:ring-gold-500/30 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/20">
                    <Icon className="size-6.5" strokeWidth={1.5} />
                  </span>

                  <h3 className="relative mt-5 font-display text-xl text-foreground">
                    {feature.title}
                  </h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  <span
                    aria-hidden
                    className="hairline-gold relative mt-6 block h-px w-0 transition-all duration-600 group-hover:w-16"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
