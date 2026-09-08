import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroCarousel } from '@/components/site/hero-carousel';
import { SectionHeading } from '@/components/site/section-heading';
import { services, whyChooseFeatures, portfolioItems, company } from '@/lib/site-data';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroCarousel />

      {/* Services Overview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Services"
            description="Five core service areas designed to support individuals and businesses across the Maldives."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.slug}
                  className="group relative overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <CardContent className="p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                      {service.shortDescription}
                    </p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-secondary group/link"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </CardContent>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
              );
            })}

            {/* CTA card */}
            <div className="flex flex-col justify-center items-center text-center p-8 rounded-xl gradient-ocean text-white">
              <h3 className="font-heading text-xl font-semibold mb-2">
                Need something else?
              </h3>
              <p className="text-white/80 text-sm mb-5">
                We offer more than what&apos;s listed here. Reach out and let&apos;s talk.
              </p>
              <Button asChild className="rounded-full bg-white text-primary hover:bg-white/90">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ocean Tune */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Why Choose Ocean Tune"
            description="We combine local knowledge with professional service to deliver real value."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-8 rounded-2xl bg-background border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-secondary/10 text-secondary mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Our Work"
            title="Featured Projects"
            description="A glimpse of the work we've delivered across marine, construction, printing, design, and web."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/portfolio">
                View Full Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 sm:py-28">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl gradient-ocean text-white p-10 sm:p-16 lg:p-20 text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-secondary blur-3xl animate-float" />
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-secondary blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Contact us today to discuss your requirements and discover how Ocean Tune
                can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/15 hover:text-white"
                >
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {company.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
