import { Award, Droplets, Leaf, Sprout, Users } from 'lucide-react';
import Image from 'next/image';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { site } from '@/lib/data/site';
import { AVATAR, IMG } from '@/lib/images';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { blurDataURL } from '@/lib/utils';

const trail = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hakkımızda', path: '/about' },
];

export const metadata = buildMetadata({
  title: 'Hakkımızda',
  description:
    '1889’dan bu yana Orhangazi’de zeytin yetiştiriyor, her sezon dalından topladığımız meyveyi soğuk sıkım yöntemiyle zeytinyağına dönüştürüyoruz.',
  path: '/about',
  image: IMG.groveHill,
});

const timeline = [
  {
    year: '1889',
    title: 'İlk ağaçlar',
    text: 'Kurucumuz Hüseyin Elmora, Orhangazi Ortaköy’de İznik Gölü’ne bakan yamaca ilk 120 zeytin fidanını dikti. O ağaçların bir kısmı bugün hâlâ meyve veriyor.',
  },
  {
    year: '1928',
    title: 'Kendi değirmenimiz',
    text: 'Zeytinlerimizi başkasının değirmeninde sıktırmayı bıraktık. Granit taş değirmenini kurduk; taş baskı üretimimiz o gün başladı.',
  },
  {
    year: '1963',
    title: 'Üçüncü kuşak',
    text: 'Bahçe altmış dönüme genişledi. Ayvalık ve Gemlik çeşitleri yan yana dikildi; bugünkü harmanımızın temeli o yıllarda atıldı.',
  },
  {
    year: '1996',
    title: 'Soğuk sıkım hattı',
    text: 'Nesrin ve Kerem Elmora işi devraldı. Soğuk sıkım hattı kuruldu, hasat–sıkım arası süre sekiz saate indirildi.',
  },
  {
    year: '2011',
    title: 'Organik sertifika',
    text: 'Bahçelerimizin tamamında sentetik girdi kullanımını bıraktık. Üç yıllık geçiş sürecinin ardından organik tarım sertifikamızı aldık.',
  },
  {
    year: '2019',
    title: 'Uluslararası ödül',
    text: 'Erken hasat serimiz, uluslararası bir zeytinyağı yarışmasında gümüş madalya kazandı. Aynı yıl ilk sınırlı üretim serimizi çıkardık.',
  },
  {
    year: '2026',
    title: 'Doğrudan sofranıza',
    text: 'Aracıyı tamamen çıkardık. Artık ürünlerimizi yalnızca kendi kanallarımızdan, hasat bilgisi etikette yazılı olarak satıyoruz.',
  },
];

const values = [
  {
    Icon: Leaf,
    title: 'Toprağa saygı',
    text: 'Bahçelerimizde on iki yıldır sentetik gübre ve pestisit kullanılmıyor. Toprağı baklagil ekimiyle besliyor, zararlıyı feromon tuzağıyla yönetiyoruz.',
  },
  {
    Icon: Droplets,
    title: 'Sabırlı üretim',
    text: 'Sıkım sıcaklığı hiçbir zaman 27 °C’yi geçmez. Verimi artıran ama aromayı bozan hiçbir kısayolu kullanmıyoruz.',
  },
  {
    Icon: Sprout,
    title: 'Doğru zaman',
    text: 'Hasat takvimini pazarın değil, meyvenin belirlemesine izin veriyoruz. Erken hasat için litre başına daha çok zeytin harcamayı göze alıyoruz.',
  },
  {
    Icon: Award,
    title: 'Şeffaflık',
    text: 'Her şişenin arkasında hasat tarihi, asit oranı ve parti numarası yazar. Söylediğimiz her sayının arkasında laboratuvar raporu vardır.',
  },
];

const team = [
  {
    name: 'Nesrin Elmora',
    role: 'Kurucu Ortak',
    avatar: AVATAR.a1,
    bio: 'Dördüncü kuşağın büyük kızı. Bahçe planlaması ve organik geçiş sürecini yürüttü.',
  },
  {
    name: 'Kerem Elmora',
    role: 'Üretim Sorumlusu',
    avatar: AVATAR.a7,
    bio: 'Hasat takvimi, sıkım süreci ve kalite kontrolden sorumlu. Her partiyi kendisi tadar.',
  },
  {
    name: 'Tolga Bayram',
    role: 'Gıda Mühendisi',
    avatar: AVATAR.a5,
    bio: 'Laboratuvar analizleri, sertifikasyon ve raf ömrü çalışmalarını yürütüyor.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Est. ${site.founded}`}
        title="Beş Kuşaktır Aynı Yamaçtayız"
        description="Orhangazi’de, İznik Gölü’ne bakan altmış dönümlük bir bahçede başlayan hikâye. Değişen çok şey oldu; zeytini ne zaman toplayacağımıza karar verme biçimimiz hariç."
        image={IMG.groveHill}
        trail={trail}
      />

      {/* Intro */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Biz kimiz"
                title="Zeytinyağı, aceleye gelmeyen bir iştir"
                align="left"
              />
              <div className="mt-7 space-y-5 text-base leading-[1.85] text-muted-foreground">
                <p>
                  Bir zeytinyağının kalitesi, şişelendiği gün değil; hasadın hangi sabah
                  başladığına karar verildiği gün belirlenir. Meyve bir hafta geç toplanırsa verim
                  artar, polifenol düşer. Kasalar fabrikaya bir gün geç ulaşırsa asit yükselir.
                  Sıkım sıcaklığı beş derece artarsa aroma buharlaşır.
                </p>
                <p>
                  Bu üç kararın hiçbirinde bize kolaylık sağlayacak tarafı seçmedik. 1889’dan bu
                  yana aynı yamaçta, aynı ağaçlarla çalışıyoruz ve her yıl aynı soruyu soruyoruz:
                  bu sezon meyve ne zaman hazır?
                </p>
                <p>
                  Bugün ürettiğimiz her şişenin arkasında hasat tarihi, asit oranı ve parti
                  numarası yazıyor. Çünkü iyi zeytinyağı almak, aslında bir üreticiye güvenmektir —
                  ve güven, doğrulanabilir bilgiyle başlar.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3.5">
                <Button href="/products" variant="primary" size="lg">
                  Ürünlerimizi İnceleyin
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Bahçeyi Ziyaret Edin
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={IMG.harvestCrate}
                    alt="Hasat sırasında kasalara toplanan zeytinler"
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="object-cover"
                  />
                </div>
                <div className="mt-8 grid gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-soft">
                    <Image
                      src={IMG.branchClose}
                      alt="Dalında olgunlaşan zeytinler"
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-soft">
                    <Image
                      src={IMG.cruetOlives}
                      alt="Cam sürahide yeni sıkılmış zeytinyağı"
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section tone="muted">
        <Container>
          <SectionHeading
            eyebrow="Yolculuk"
            title="Altmış Üç Yılın Kilometre Taşları"
            description="Her biri, o gün alınmış bir kararın sonucu."
          />

          <ol className="relative mx-auto mt-14 max-w-3xl">
            {/* Dikey hat */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-[1.4rem] w-px bg-gradient-to-b from-gold-500/50 via-olive-500/30 to-transparent sm:left-1/2"
            />

            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.06}>
                <li
                  className={`relative flex gap-6 pb-10 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <span
                    className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 border-gold-500/40 bg-background font-display text-xs font-semibold text-gold-700 sm:absolute sm:top-1 sm:left-1/2 sm:-translate-x-1/2 dark:text-gold-400`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className={`min-w-0 flex-1 sm:w-1/2 sm:flex-none ${i % 2 === 0 ? 'sm:pr-14 sm:text-right' : 'sm:pl-14'}`}>
                    <p className="font-display text-2xl font-semibold text-gold-700 dark:text-gold-400">
                      {item.year}
                    </p>
                    <h3 className="mt-1 font-display text-xl text-foreground">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Değerlerimiz"
            title="Kısayol Kullanmadığımız Dört Yer"
            description="Bunlar pazarlama cümlesi değil; her sezon bize maliyeti olan tercihler."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {values.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 2) * 0.08} className="h-full">
                <article className="group flex h-full gap-5 rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/35 hover:shadow-lift">
                  <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-olive-600/8 text-olive-600 ring-1 ring-olive-600/12 transition-all duration-500 group-hover:-rotate-6 group-hover:bg-gold-500/12 group-hover:text-gold-600 dark:bg-gold-400/10 dark:text-gold-400 dark:ring-gold-400/20">
                    <Icon className="size-6" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-foreground">{title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Ekip */}
      <Section tone="muted">
        <Container>
          <SectionHeading
            eyebrow="Ekip"
            title="Bahçedeki İnsanlar"
            description="Küçük bir ekibiz. Hasatta hepimiz aynı yamaçtayız."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <article className="group text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-56 overflow-hidden rounded-2xl shadow-soft transition-shadow duration-500 group-hover:shadow-lift">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="(min-width: 640px) 224px, 70vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-foreground">{member.name}</h3>
                  <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase dark:text-gold-400">
                    {member.role}
                  </p>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface p-8 text-center shadow-soft sm:flex-row sm:text-left">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
                <Users className="size-6" strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl text-foreground">Bahçemizi ziyaret edin</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Ekim–Kasım aylarında hasada katılabilir, sıkım sürecini yerinde izleyebilir ve
                  tadım yapabilirsiniz. Randevu için bize yazmanız yeterli.
                </p>
              </div>
              <Button href="/contact" variant="gold" size="lg" className="shrink-0">
                Randevu Alın
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
