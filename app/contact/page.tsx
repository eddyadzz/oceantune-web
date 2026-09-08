import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/components/site/contact-form';
import { company } from '@/lib/site-data';

export const metadata = {
  title: 'Contact Ocean Tune | Get in Touch',
  description:
    'Contact Ocean Tune for marine spare parts, construction, printing, design, and digital services in the Maldives. Call +960 966 6469 or email info@oceantune.com.',
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: company.address,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: company.email,
      href: `mailto:${company.email}`,
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Sun — Thu: 8:00 AM — 6:00 PM',
    },
  ];

  return (
    <>
      <PageHero
        breadcrumb="Home / Contact"
        title="Contact Us"
        description="Have a question or need a quote? Send us a message and we'll get back to you as soon as possible."
      />

      <section className="py-20 sm:py-28 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Contact info */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you need marine spare parts, construction services, printing, or
                digital support, our team is ready to help. Reach out using any of the
                methods below.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <Card key={info.label} className="border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-0.5">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <Card className="border-border/60 shadow-lg">
                <CardContent className="p-8 sm:p-10">
                  <h2 className="font-heading text-2xl font-bold mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we&apos;ll respond within one business day.
                  </p>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
