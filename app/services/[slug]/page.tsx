import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { services, company } from '@/lib/site-data';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service Not Found | Ocean Tune' };
  return {
    title: `${service.title} | Ocean Tune`,
    description: service.shortDescription,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const Icon = service.icon;
  const currentIndex = services.findIndex((s) => s.slug === params.slug);
  const otherServices = services.filter((s) => s.slug !== params.slug);

  return (
    <>
      <PageHero
        breadcrumb={`Home / Services / ${service.title}`}
        title={service.title}
        description={service.shortDescription}
      />

      {/* Overview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md text-primary shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
                Service Overview
              </span>
              <h2 className="font-heading text-3xl font-bold mb-5">
                What We Offer
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
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
                <Button asChild className="rounded-full">
                  <Link href="/contact">
                    Enquire About This Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="How It Works"
            title="Our Process"
            description="A straightforward, step-by-step approach to get you from enquiry to delivery."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, idx) => (
              <Card
                key={step.step}
                className="border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {step.step}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Gallery"
            title="Service in Action"
            description="A look at the work we deliver in this area."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md group"
              >
                <Image
                  src={img}
                  alt={`${service.title} gallery ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Explore More"
            title="Other Services"
            description="See what else Ocean Tune can help you with."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherServices.map((s) => {
              const OtherIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group"
                >
                  <Card className="border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <OtherIcon className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading text-base font-semibold mb-2">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {s.shortDescription}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="py-10 bg-background">
        <div className="container-wide">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>
        </div>
      </div>
    </>
  );
}
