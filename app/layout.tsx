import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

// CMS content is served from the database at request time, so every page is
// rendered dynamically (never cached at build time).
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oceantune.com'),
  title: 'Ocean Tune | Practical Solutions for Modern Maldives',
  description:
    'Ocean Tune Private Limited provides marine spare parts, construction services, photography & printing, administrative support, and graphic & web design across the Maldives.',
  keywords: [
    'Ocean Tune',
    'Maldives',
    'marine spare parts',
    'construction',
    'printing',
    'graphic design',
    'web design',
    'administrative support',
  ],
  openGraph: {
    title: 'Ocean Tune | Practical Solutions for Modern Maldives',
    description:
      'Marine supplies, construction, printing, design, and digital support — all through a single trusted Maldivian provider.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ocean Tune | Practical Solutions for Modern Maldives',
    description:
      'Marine supplies, construction, printing, design, and digital support — all through a single trusted Maldivian provider.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
