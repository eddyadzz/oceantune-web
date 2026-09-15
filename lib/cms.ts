import { cache } from 'react';
import { prisma } from './prisma';
import { resolveIcon, iconNameOf } from './icons';
import { defaultSettings } from './defaults';
import { legalPageDefaults, type PageContent } from './pages-defaults';
import * as seed from './site-data';

// ---------------------------------------------------------------------------
// Public-facing content layer. Every getter falls back to the static seed
// data in lib/site-data.ts when the database is unreachable or unconfigured,
// so the site always renders.
// ---------------------------------------------------------------------------

const db = () => prisma;

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  if (!db()) return defaultSettings;
  try {
    const rows = await prisma!.setting.findMany();
    const map = { ...defaultSettings };
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    return defaultSettings;
  }
});

export const getCompany = cache(async (): Promise<typeof seed.company> => {
  if (!db()) return seed.company;
  try {
    const row = await prisma!.company.findFirst();
    if (!row) return seed.company;
    return {
      name: row.name,
      legalName: row.legalName,
      tagline: row.tagline,
      address: row.address,
      phone: row.phone,
      email: row.email,
      description: row.description,
      social: {
        facebook: row.facebookUrl,
        instagram: row.instagramUrl,
        twitter: row.twitterUrl,
        linkedin: row.linkedinUrl,
      },
    };
  } catch {
    return seed.company;
  }
});

export const getNavLinks = cache(async () => {
  if (!db()) return seed.navLinks;
  try {
    const rows = await prisma!.menuItem.findMany({
      where: { placement: 'NAV' },
      orderBy: { order: 'asc' },
    });
    if (rows.length === 0) return seed.navLinks;
    return rows.map((r) => ({ href: r.href, label: r.label }));
  } catch {
    return seed.navLinks;
  }
});

export const getFooterLinks = cache(async () => {
  if (!db()) return seed.footerLinks;
  try {
    const rows = await prisma!.menuItem.findMany({
      where: { placement: 'FOOTER' },
      orderBy: { order: 'asc' },
    });
    if (rows.length === 0) return seed.footerLinks;
    return rows.map((r) => ({ href: r.href, label: r.label }));
  } catch {
    return seed.footerLinks;
  }
});

export const getCarouselSlides = cache(async () => {
  if (!db()) {
    return seed.carouselSlides.map((s) => ({ ...s, icon: iconNameOf(s.icon) ?? 'Sparkles' }));
  }
  try {
    const rows = await prisma!.carouselSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    if (rows.length === 0) {
      return seed.carouselSlides.map((s) => ({ ...s, icon: iconNameOf(s.icon) ?? 'Sparkles' }));
    }
    return rows.map((r) => ({
      title: r.title,
      headline: r.headline,
      description: r.description,
      image: r.image,
      icon: r.icon,
    }));
  } catch {
    return seed.carouselSlides.map((s) => ({ ...s, icon: iconNameOf(s.icon) ?? 'Sparkles' }));
  }
});

export const getServices = cache(async () => {
  if (!db()) return seed.services;
  try {
    const rows = await prisma!.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    if (rows.length === 0) return seed.services;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      shortDescription: r.shortDescription,
      longDescription: r.longDescription,
      icon: resolveIcon(r.icon),
      image: r.image,
      features: (r.features as string[]) ?? [],
      gallery: (r.gallery as string[]) ?? [],
      process: (r.process as { step: string; description: string }[]) ?? [],
    }));
  } catch {
    return seed.services;
  }
});

export const getWhyChooseFeatures = cache(async () => {
  if (!db()) return seed.whyChooseFeatures;
  try {
    const rows = await prisma!.whyFeature.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return seed.whyChooseFeatures;
    return rows.map((r) => ({
      title: r.title,
      description: r.description,
      icon: resolveIcon(r.icon),
    }));
  } catch {
    return seed.whyChooseFeatures;
  }
});

export const getCompanyValues = cache(async () => {
  if (!db()) return seed.companyValues;
  try {
    const rows = await prisma!.value.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return seed.companyValues;
    return rows.map((r) => ({
      title: r.title,
      description: r.description,
      icon: resolveIcon(r.icon),
    }));
  } catch {
    return seed.companyValues;
  }
});

export const getPortfolioItems = cache(async () => {
  if (!db()) return seed.portfolioItems;
  try {
    const rows = await prisma!.portfolioItem.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    if (rows.length === 0) return seed.portfolioItems;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category,
      description: r.description,
      image: r.image,
      gallery: (r.gallery as string[]) ?? [],
      client: r.client,
      scope: r.scope,
      outcome: r.outcome,
    }));
  } catch {
    return seed.portfolioItems;
  }
});

export const getPortfolioCategories = cache(async (): Promise<string[]> => {
  const settings = await getSettings();
  return settings['portfolio.categories']
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
});

export const getStats = cache(async () => {
  if (!db()) {
    return [
      { value: '5', label: 'Core Services' },
      { value: '3', label: 'Engine Brands Supported' },
      { value: '100%', label: 'Customer Focused' },
    ];
  }
  try {
    const rows = await prisma!.stat.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) {
      return [
        { value: '5', label: 'Core Services' },
        { value: '3', label: 'Engine Brands Supported' },
        { value: '100%', label: 'Customer Focused' },
      ];
    }
    return rows.map((r) => ({ value: r.value, label: r.label }));
  } catch {
    return [
      { value: '5', label: 'Core Services' },
      { value: '3', label: 'Engine Brands Supported' },
      { value: '100%', label: 'Customer Focused' },
    ];
  }
});

export const getBrands = cache(async (): Promise<{ name: string; image: string }[]> => {
  const fallback = (): { name: string; image: string }[] =>
    ['YAMAHA', 'SUZUKI', 'Mercury'].map((name) => ({ name, image: '' }));
  if (!db()) return fallback();
  try {
    const rows = await prisma!.brand.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return fallback();
    return rows.map((r) => ({ name: r.name, image: r.image }));
  } catch {
    return fallback();
  }
});

export const getPage = cache(
  async (slug: string): Promise<PageContent | null> => {
    if (!db()) {
      return legalPageDefaults.find((p) => p.slug === slug) ?? null;
    }
    try {
      const row = await prisma!.page.findUnique({ where: { slug } });
      if (!row) return legalPageDefaults.find((p) => p.slug === slug) ?? null;
      return {
        slug: row.slug,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        heroTitle: row.heroTitle,
        heroDescription: row.heroDescription,
        sections: (row.sections as { heading: string; body: string }[]) ?? [],
        lastUpdated: row.lastUpdated,
      };
    } catch {
      return legalPageDefaults.find((p) => p.slug === slug) ?? null;
    }
  }
);

export const getPages = cache(async (): Promise<PageContent[]> => {
  if (!db()) return legalPageDefaults;
  try {
    const rows = await prisma!.page.findMany({ orderBy: { slug: 'asc' } });
    if (rows.length === 0) return legalPageDefaults;
    return rows.map((r) => ({
      slug: r.slug,
      metaTitle: r.metaTitle,
      metaDescription: r.metaDescription,
      heroTitle: r.heroTitle,
      heroDescription: r.heroDescription,
      sections: (r.sections as { heading: string; body: string }[]) ?? [],
      lastUpdated: r.lastUpdated,
    }));
  } catch {
    return legalPageDefaults;
  }
});