import Image from 'next/image';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { getCompany, getCompanyValues, getSettings, getStats } from '@/lib/cms';

export const metadata = {
  title: 'About Ocean Tune | Maldivian Service Provider',
  description:
    'Ocean Tune Private Limited is a Maldivian company providing practical solutions across multiple industries — marine, construction, printing, design, and digital support.',
};

export default async function AboutPage() {
  const [company, values, settings, stats] = await Promise.all([
    getCompany(),
    getCompanyValues(),
    getSettings(),
    getStats(),
  ]);

  return (
    <>
      <PageHero
        breadcrumb="Home / About"
        title={settings['about.hero.title']}
        description={settings['about.hero.description']}
      />

      {/* Company Overview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={settings['about.overview.image']}
                  alt="Maldives aerial view"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl gradient-ocean flex items-center justify-center text-white shadow-xl hidden sm:flex">
                <div className="text-center">
                  <p className="font-heading text-3xl font-bold">5+</p>
                  <p className="text-xs uppercase tracking-wider">Services</p>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow={settings['about.overview.eyebrow']}
                title={settings['about.overview.title']}
              />
              <p className="text-muted-foreground leading-relaxed mb-5 text-lg">
                {company.legalName} {settings['about.overview.paragraph1']}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {settings['about.overview.paragraph2']}
              </p>

              {/* Mission & Vision */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-xl bg-muted/50 border border-border/60">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {settings['about.mission']}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-muted/50 border border-border/60">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {settings['about.vision']}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="container-wide">
          <SectionHeading
            eyebrow={settings['about.values.eyebrow']}
            title={settings['about.values.title']}
            description={settings['about.values.description']}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <CardContent className="p-7 text-center">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl gradient-ocean text-white p-10 sm:p-16">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary blur-3xl animate-float" />
            </div>
            <div className="relative grid sm:grid-cols-3 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-4xl sm:text-5xl font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/70 uppercase tracking-wider text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}