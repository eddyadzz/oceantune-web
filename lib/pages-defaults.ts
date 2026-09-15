export type PageSection = { heading: string; body: string };

export type PageContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  sections: PageSection[];
  lastUpdated?: Date;
};

export const legalPageDefaults: PageContent[] = [
  {
    slug: 'privacy-policy',
    metaTitle: 'Privacy Policy | Ocean Tune',
    metaDescription:
      'How Ocean Tune collects, uses, and protects your personal information.',
    heroTitle: 'Privacy Policy',
    heroDescription: 'Your privacy matters to us. This policy explains how we handle your information.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We collect information you provide directly to us, such as your name, phone number, email address, and any details you share through our contact form. We may also collect non-personal data about how you use our website, such as pages visited and browser type.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use the information we collect to respond to your enquiries, provide the services you request, communicate with you about our offerings, and improve our website and services. We do not sell or rent your personal information to third parties.',
      },
      {
        heading: 'Information Sharing',
        body: 'We may share your information with trusted service providers who help us operate our business (such as email delivery or analytics), but only to the extent necessary and under appropriate confidentiality agreements.',
      },
      {
        heading: 'Data Security',
        body: 'We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure.',
      },
      {
        heading: 'Cookies',
        body: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though some features of the site may not function properly without them.',
      },
      {
        heading: 'Your Rights',
        body: 'You may request access to, correction of, or deletion of your personal information at any time. To exercise these rights, please contact us using the details provided on our contact page.',
      },
      {
        heading: 'Changes to This Policy',
        body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
      },
    ],
  },
  {
    slug: 'terms-of-service',
    metaTitle: 'Terms of Service | Ocean Tune',
    metaDescription:
      'The terms and conditions governing the use of Ocean Tune services and website.',
    heroTitle: 'Terms of Service',
    heroDescription: 'The terms and conditions that govern your use of our website and services.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.',
      },
      {
        heading: 'Services',
        body: 'Ocean Tune provides marine spare parts, construction services, photography and printing, administrative support, and graphic and web design. The availability and scope of specific services may vary, and we reserve the right to modify our service offerings at any time.',
      },
      {
        heading: 'Quotes and Pricing',
        body: 'Any quotes provided are estimates based on the information available at the time. Final pricing for services and products will be confirmed before work begins. Prices are subject to change based on material costs, scope adjustments, and other factors.',
      },
      {
        heading: 'User Responsibilities',
        body: 'You agree to provide accurate and complete information when requesting services or using our contact form. You are responsible for ensuring that any content or materials you provide to us for use in design, printing, or other services does not infringe on the rights of any third party.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All content on this website, including text, graphics, logos, and design elements, is the property of Ocean Tune or its content creators and is protected by applicable intellectual property laws. You may not reproduce or distribute our content without prior written permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'Ocean Tune is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service in question.',
      },
      {
        heading: 'Third-Party Links',
        body: 'Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.',
      },
      {
        heading: 'Changes to Terms',
        body: 'We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the new terms.',
      },
    ],
  },
];