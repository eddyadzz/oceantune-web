import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/site/page-hero';
import { getPortfolioItems, getPortfolioCategories, getSettings } from '@/lib/cms';
import { PortfolioGrid } from '@/components/site/portfolio-grid';

export const metadata = {
  title: 'Portfolio | Ocean Tune',
  description:
    'A selection of completed work across marine, construction, printing, design, and web.',
};

export default async function PortfolioPage() {
  const [items, categories, settings] = await Promise.all([
    getPortfolioItems(),
    getPortfolioCategories(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        breadcrumb="Home / Portfolio"
        title={settings['portfolio.hero.title']}
        description={settings['portfolio.hero.description']}
      />
      <PortfolioGrid items={items} categories={categories} />
    </>
  );
}