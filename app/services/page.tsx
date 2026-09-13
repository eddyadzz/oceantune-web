import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { services } from '@/lib/site-data';

export const metadata = {
  title: 'Our Services | Ocean Tune',
  description:
    'Marine spare parts, construction services, photography & printing, administrative support, and graphic & web design — professional services for individuals and businesses in the Maldives.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Home / Services"
        title="Our Services"
        description="Professional services designed to support individuals and businesses across the Maldives."
      />

      {/* Service sections */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide space-y-20 sm:space-y-28">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={service.slug}
                id={service.slug}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center scroll-mt-24"
              >
                {/* Image */}
                <div className={isReversed ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md text-primary shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={isReversed ? 'lg:order-1' : ''}>
                  <span className="inline-block text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                    Service {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {service.longDescription}
                  </p>

                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">
                    What&apos;s Included
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild variant="outline" className="rounded-full group">
                      <Link href={`/services/${service.slug}`}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button asChild className="rounded-full">
                      <Link href="/contact">Enquire</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
