import { notFound } from 'next/navigation';
import { PageHero } from '@/components/site/page-hero';
import { getPage, getCompany } from '@/lib/cms';

export const metadata = {
  title: 'Terms of Service | Ocean Tune',
  description: 'The terms and conditions governing the use of Ocean Tune services and website.',
};

export default async function TermsOfServicePage() {
  const [page, company] = await Promise.all([getPage('terms-of-service'), getCompany()]);
  if (!page) notFound();

  const lastUpdated = page.lastUpdated
    ? page.lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <PageHero
        breadcrumb="Home / Terms of Service"
        title={page.heroTitle}
        description={page.heroDescription}
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide max-w-3xl">
          <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

          <div className="space-y-10">
            {page.sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="font-heading text-xl font-semibold mb-3">
                  {idx + 1}. {section.heading}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}

            <div className="pt-6 border-t border-border">
              <h2 className="font-heading text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                  {company.email}
                </a>{' '}
                or call{' '}
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                  {company.phone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}