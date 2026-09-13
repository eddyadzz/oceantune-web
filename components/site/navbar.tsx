'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { navLinks, company } from '@/lib/site-data';
import { Logo } from '@/components/site/logo';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="container-wide flex items-center justify-between">
        <Link href="/" className="group">
          <Logo variant={scrolled ? 'dark' : 'light'} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  scrolled
                    ? isActive
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-primary'
                    : isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white',
                  isActive && 'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-6 after:rounded-full after:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${company.phone.replace(/\s/g, '')}`}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              scrolled ? 'text-foreground/70 hover:text-primary' : 'text-white/80 hover:text-white'
            )}
          >
            <Phone className="h-4 w-4" />
            {company.phone}
          </a>
          <Button asChild className="rounded-full">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                'lg:hidden flex items-center justify-center h-10 w-10 rounded-lg transition-colors',
                scrolled ? 'text-primary hover:bg-muted' : 'text-white hover:bg-white/15'
              )}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2.5 text-left">
                <Logo size="sm" />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-primary hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </a>
                <Button asChild className="w-full mt-4 rounded-full">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
