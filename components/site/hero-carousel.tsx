'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { carouselSlides } from '@/lib/site-data';

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = carouselSlides.length;

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  return (
    <div
      className="relative h-[90vh] min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slides */}
      {carouselSlides.map((slide, idx) => (
        <div
          key={idx}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            idx === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container-wide">
          <div className="max-w-3xl">
            {/* Active slide badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 mb-6 animate-fade-in"
              key={active}
            >
              {(() => {
                const Icon = carouselSlides[active].icon;
                return <Icon className="h-4 w-4 text-secondary" />;
              })()}
              <span className="text-sm font-medium text-white/90">
                {carouselSlides[active].title}
              </span>
            </div>

            {/* Main headline (always visible, not changing per slide) */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] text-balance mb-6">
              Practical Solutions for{' '}
              <span className="gradient-text">Modern Maldives</span>
            </h1>

            {/* Slide-specific description */}
            <p
              key={`desc-${active}`}
              className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl animate-fade-in"
            >
              From marine supplies and construction services to design, printing, and digital
              support, Ocean Tune helps individuals and businesses get things done.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full group">
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators + controls */}
      <div className="absolute bottom-8 inset-x-0 z-10">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    idx === active
                      ? 'w-10 bg-secondary'
                      : 'w-4 bg-white/40 hover:bg-white/60'
                  )}
                />
              ))}
            </div>

            {/* Arrow controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
