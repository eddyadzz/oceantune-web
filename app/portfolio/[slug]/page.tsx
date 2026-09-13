import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft, Building2, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { portfolioItems } from '@/lib/site-data';

export function generateStaticParams() {
  return portfolioItems.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = portfolioItems.find((p) => p.slug === params.slug);
  if (!item) return { title: 'Project Not Found | Ocean Tune' };
  return {
    title: `${item.title} | Ocean Tune Portfolio`,
    description: item.description,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const item = portfolioItems.find((p) => p.slug === params.slug);
  if (!item) notFound();

  const otherProjects = portfolioItems.filter((p) => p.slug !== params.slug).slice(0, 3);

  return (
    <>
      <PageHero
        breadcrumb={`Home / Portfolio / ${item.title}`}
        title={item.title}
        description={item.description}
      />

      {/* Main image + details */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Main image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl mb-6">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Gallery thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {item.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group"
                  >
                    <Image
                      src={img}
                      alt={`${item.title} ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar details */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-muted/50 border border-border/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                    Client
                  </h3>
                </div>
                <p className="text-muted-foreground">{item.client}</p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/50 border border-border/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                    Scope of Work
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.scope}</p>
              </div>

              <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">
                    Outcome
                  </h3>
                </div>
                <p className="text-primary-foreground/90 leading-relaxed">{item.outcome}</p>
              </div>

              <Button asChild className="w-full rounded-full" size="lg">
                <Link href="/contact">
                  Start a Similar Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Other projects */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="More Work"
            title="Other Projects"
            description="Explore more of our completed work across different categories."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                    {p.category}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-white mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="py-10 bg-muted/40">
        <div className="container-wide">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    </>
  );
}
