import Image from 'next/image';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { companyValues, company } from '@/lib/site-data';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Ocean Tune | Maldivian Service Provider',
  description:
    'Ocean Tune Private Limited is a Maldivian company providing practical solutions across multiple industries — marine, construction, printing, design, and digital support.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="Home / About"
        title="About Ocean Tune"
        description="A Maldivian company committed to delivering dependable products and professional services across the islands."
      />

      {/* Company Overview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/2245278/pexels-photo-2245278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
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
                eyebrow="Company Overview"
                title="Serving Individuals & Businesses Across the Maldives"
              />
              <p className="text-muted-foreground leading-relaxed mb-5 text-lg">
                {company.legalName} is a Maldivian company providing practical solutions across
                multiple industries. We serve individuals, businesses, and organizations through
                reliable products and professional services.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                From marine spare parts and construction to photography, printing, and digital
                services, Ocean Tune is your trusted partner for getting things done — efficiently
                and professionally.
              </p>

              {/* Mission & Vision */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-xl bg-muted/50 border border-border/60">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Deliver dependable products and services that create value for customers.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-muted/50 border border-border/60">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Become a trusted service provider throughout the Maldives.
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
            eyebrow="Our Values"
            title="What Drives Us"
            description="The principles that guide every decision we make and every service we deliver."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, idx) => {
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
              {[
                { value: '5', label: 'Core Services' },
                { value: '3', label: 'Engine Brands Supported' },
                { value: '100%', label: 'Customer Focused' },
              ].map((stat) => (
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
