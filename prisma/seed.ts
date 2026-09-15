import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { iconNameOf, iconOptions } from '../lib/icons';
import { defaultSettings } from '../lib/defaults';
import { legalPageDefaults } from '../lib/pages-defaults';
import {
  company as seedCompany,
  services,
  carouselSlides,
  whyChooseFeatures,
  portfolioItems,
  companyValues,
  navLinks,
  footerLinks,
} from '../lib/site-data';

const prisma = new PrismaClient();

async function main() {
  // ---- Company ----
  await prisma.company.upsert({
    where: { id: 'seed-company' },
    create: {
      id: 'seed-company',
      name: seedCompany.name,
      legalName: seedCompany.legalName,
      tagline: seedCompany.tagline,
      address: seedCompany.address,
      phone: seedCompany.phone,
      email: seedCompany.email,
      description: seedCompany.description,
      facebookUrl: seedCompany.social.facebook,
      instagramUrl: seedCompany.social.instagram,
      twitterUrl: seedCompany.social.twitter,
      linkedinUrl: seedCompany.social.linkedin,
    },
    update: {
      name: seedCompany.name,
      legalName: seedCompany.legalName,
      tagline: seedCompany.tagline,
      address: seedCompany.address,
      phone: seedCompany.phone,
      email: seedCompany.email,
      description: seedCompany.description,
      facebookUrl: seedCompany.social.facebook,
      instagramUrl: seedCompany.social.instagram,
      twitterUrl: seedCompany.social.twitter,
      linkedinUrl: seedCompany.social.linkedin,
    },
  });

  // ---- Settings ----
  await prisma.setting.deleteMany();
  await prisma.setting.createMany({
    data: Object.entries(defaultSettings).map(([key, value]) => ({ key, value })),
  });

  // ---- Menu ----
  await prisma.menuItem.deleteMany();
  await prisma.menuItem.createMany({
    data: [
      ...navLinks.map((link, i) => ({
        placement: 'NAV' as const,
        href: link.href,
        label: link.label,
        order: i,
      })),
      ...footerLinks.map((link, i) => ({
        placement: 'FOOTER' as const,
        href: link.href,
        label: link.label,
        order: i,
      })),
    ],
  });

  // ---- Carousel ----
  await prisma.carouselSlide.deleteMany();
  await prisma.carouselSlide.createMany({
    data: carouselSlides.map((slide, i) => ({
      title: slide.title,
      headline: slide.headline,
      description: slide.description,
      image: slide.image,
      icon: iconNameOf(slide.icon) ?? 'Anchor',
      order: i,
    })),
  });

  // ---- Services ----
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: services.map((service, i) => ({
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      longDescription: service.longDescription,
      icon: iconNameOf(service.icon) ?? iconOptions[0],
      image: service.image,
      features: service.features,
      gallery: service.gallery,
      process: service.process,
      order: i,
    })),
  });

  // ---- Why features ----
  await prisma.whyFeature.deleteMany();
  await prisma.whyFeature.createMany({
    data: whyChooseFeatures.map((f, i) => ({
      title: f.title,
      description: f.description,
      icon: iconNameOf(f.icon) ?? 'Users',
      order: i,
    })),
  });

  // ---- Values ----
  await prisma.value.deleteMany();
  await prisma.value.createMany({
    data: companyValues.map((v, i) => ({
      title: v.title,
      description: v.description,
      icon: iconNameOf(v.icon) ?? 'ShieldCheck',
      order: i,
    })),
  });

  // ---- Stats ----
  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { value: '5', label: 'Core Services', order: 0 },
      { value: '3', label: 'Engine Brands Supported', order: 1 },
      { value: '100%', label: 'Customer Focused', order: 2 },
    ],
  });

  // ---- Brands ----
  await prisma.brand.deleteMany();
  await prisma.brand.createMany({
    data: ['YAMAHA', 'SUZUKI', 'Mercury'].map((name, i) => ({ name, image: '', order: i })),
  });

  // ---- Portfolio ----
  await prisma.portfolioItem.deleteMany();
  await prisma.portfolioItem.createMany({
    data: portfolioItems.map((item, i) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      gallery: item.gallery,
      client: item.client,
      scope: item.scope,
      outcome: item.outcome,
      order: i,
    })),
  });

  // ---- Pages ----
  for (const page of legalPageDefaults) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: {
        slug: page.slug,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        heroTitle: page.heroTitle,
        heroDescription: page.heroDescription,
        sections: page.sections,
      },
      update: {
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        heroTitle: page.heroTitle,
        heroDescription: page.heroDescription,
        sections: page.sections,
      },
    });
  }

  // ---- Admin user ----
  const email = process.env.ADMIN_EMAIL ?? 'admin@oceantune.com';
  const password = process.env.ADMIN_PASSWORD ?? 'changeme123';
  const passwordHash = await hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    create: { email, name: 'Admin', passwordHash, role: 'ADMIN' },
    update: { passwordHash, role: 'ADMIN' },
  });

  console.log('Seed complete.');
  console.log(`Admin user: ${email} / ${password} (change in production via ADMIN_* env vars)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });