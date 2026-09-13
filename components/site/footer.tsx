import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { company, footerLinks } from '@/lib/site-data';
import { Logo } from '@/components/site/logo';

export function Footer() {
  return (
    <footer className="relative gradient-ocean-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-48 w-48 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="container-wide relative py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company info */}
          <div className="lg:col-span-2 max-w-sm">
            <Link href="/" className="mb-5 block">
              <Logo variant="light" />
            </Link>
            <p className="text-white/70 leading-relaxed mb-6">
              {company.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: company.social.facebook, label: 'Facebook' },
                { icon: Instagram, href: company.social.instagram, label: 'Instagram' },
                { icon: Twitter, href: company.social.twitter, label: 'Twitter' },
                { icon: Linkedin, href: company.social.linkedin, label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:bg-secondary hover:scale-110"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <span className="text-white/70">{company.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="text-white/70 hover:text-secondary transition-colors"
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-white/70 hover:text-secondary transition-colors"
                >
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-white/50 hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white/50 hover:text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
