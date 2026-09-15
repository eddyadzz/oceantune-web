'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

export function PortfolioGrid({
  items,
  categories,
}: {
  items: PortfolioItem[];
  categories: string[];
}) {
  const [filter, setFilter] = useState<string>('All');

  const filtered =
    filter === 'All' ? items : items.filter((item) => item.category === filter);

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container-wide">
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                filter === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <Link
              key={`${item.title}-${idx}`}
              href={`/portfolio/${item.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-shadow-hard inline-block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  {item.category}
                </span>
                <h3 className="text-shadow-hard font-heading text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-shadow-hard text-sm text-white/70 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}