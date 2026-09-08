import { PageHero } from '@/components/site/page-hero';
import { company } from '@/lib/site-data';

export const metadata = {
  title: 'Terms of Service | Ocean Tune',
  description: 'The terms and conditions governing the use of Ocean Tune services and website.',
};

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      body: 'By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.',
    },
    {
      title: 'Services',
      body: 'Ocean Tune provides marine spare parts, construction services, photography and printing, administrative support, and graphic and web design. The availability and scope of specific services may vary, and we reserve the right to modify our service offerings at any time.',
    },
    {
      title: 'Quotes and Pricing',
      body: 'Any quotes provided are estimates based on the information available at the time. Final pricing for services and products will be confirmed before work begins. Prices are subject to change based on material costs, scope adjustments, and other factors.',
    },
    {
      title: 'User Responsibilities',
      body: 'You agree to provide accurate and complete information when requesting services or using our contact form. You are responsible for ensuring that any content or materials you provide to us for use in design, printing, or other services does not infringe on the rights of any third party.',
    },
    {
      title: 'Intellectual Property',
      body: 'All content on this website, including text, graphics, logos, and design elements, is the property of Ocean Tune or its content creators and is protected by applicable intellectual property laws. You may not reproduce or distribute our content without prior written permission.',
    },
    {
      title: 'Limitation of Liability',
      body: 'Ocean Tune is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service in question.',
    },
    {
      title: 'Third-Party Links',
      body: 'Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.',
    },
    {
      title: 'Changes to Terms',
      body: 'We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the new terms.',
    },
  ];

  return (
    <>
      <PageHero
        breadcrumb="Home / Terms of Service"
        title="Terms of Service"
        description="The terms and conditions that govern your use of our website and services."
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide max-w-3xl">
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="font-heading text-xl font-semibold mb-3">
                  {idx + 1}. {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}

            <div className="pt-6 border-t border-border">
              <h2 className="font-heading text-xl font-semibold mb-3">
                Contact Us
              </h2>
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
