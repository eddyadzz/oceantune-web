import { prisma } from './prisma';

export const RESOURCE_MODELS = {
  carousel: 'carouselSlide',
  services: 'service',
  why: 'whyFeature',
  values: 'value',
  stats: 'stat',
  brands: 'brand',
  portfolio: 'portfolioItem',
  menu: 'menuItem',
} as const;

export type AdminResource = keyof typeof RESOURCE_MODELS;

export function isAdminResource(value: string): value is AdminResource {
  return value in RESOURCE_MODELS;
}

export const createDefaults: Partial<Record<AdminResource, Record<string, unknown>>> = {
  services: { features: [], gallery: [], process: [], active: true, order: 0 },
  portfolio: { gallery: [], active: true, order: 0 },
  carousel: { active: true, order: 0 },
  menu: { order: 0 },
  why: { order: 0 },
  values: { order: 0 },
  stats: { order: 0 },
  brands: { order: 0 },
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type Row = Record<string, unknown>;

async function ensureSlug(resource: AdminResource, body: Row): Promise<Row> {
  if (resource !== 'services' && resource !== 'portfolio') return body;
  if (!body.slug || typeof body.slug !== 'string' || !body.slug.trim()) {
    body.slug = slugify(typeof body.title === 'string' ? body.title : 'untitled');
  }
  return body;
}

export async function listResource(resource: AdminResource): Promise<Row[]> {
  const model = RESOURCE_MODELS[resource];
  return (prisma as any)[model].findMany({ orderBy: { order: 'asc' } });
}

export async function createResource(resource: AdminResource, body: Row): Promise<Row> {
  const model = RESOURCE_MODELS[resource];
  delete body.id;
  delete body.updatedAt;
  body = await ensureSlug(resource, body);
  const data = { ...createDefaults[resource], ...body };
  return (prisma as any)[model].create({ data });
}

export async function updateResource(resource: AdminResource, id: string, body: Row): Promise<Row> {
  const model = RESOURCE_MODELS[resource];
  delete body.id;
  delete body.updatedAt;
  return (prisma as any)[model].update({ where: { id }, data: body });
}

export async function deleteResource(resource: AdminResource, id: string): Promise<void> {
  const model = RESOURCE_MODELS[resource];
  await (prisma as any)[model].delete({ where: { id } });
}