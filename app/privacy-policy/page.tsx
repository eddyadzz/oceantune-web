import { PageHero } from '@/components/site/page-hero';
import { company } from '@/lib/site-data';

export const metadata = {
  title: 'Privacy Policy | Ocean Tune',
  description: 'How Ocean Tune collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      body: 'We collect information you provide directly to us, such as your name, phone number, email address, and any details you share through our contact form. We may also collect non-personal data about how you use our website, such as pages visited and browser type.',
    },
    {
      title: 'How We Use Your Information',
      body: 'We use the information we collect to respond to your enquiries, provide the services you request, communicate with you about our offerings, and improve our website and services. We do not sell or rent your personal information to third parties.',
    },
    {
      title: 'Information Sharing',
      body: 'We may share your information with trusted service providers who help us operate our business (such as email delivery or analytics), but only to the extent necessary and under appropriate confidentiality agreements.',
    },
    {
      title: 'Data Security',
      body: 'We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure.',
    },
    {
      title: 'Cookies',
      body: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though some features of the site may not function properly without them.',
    },
    {
      title: 'Your Rights',
      body: 'You may request access to, correction of, or deletion of your personal information at any time. To exercise these rights, please contact us using the details provided on our contact page.',
    },
    {
      title: 'Changes to This Policy',
      body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
    },
  ];

  return (
    <>
      <PageHero
        breadcrumb="Home / Privacy Policy"
        title="Privacy Policy"
        description="Your privacy matters to us. This policy explains how we handle your information."
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
                If you have any questions about this Privacy Policy, please contact us at{' '}
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
