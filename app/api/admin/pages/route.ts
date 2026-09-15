import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { legalPageDefaults } from '@/lib/pages-defaults';

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json(legalPageDefaults);
  try {
    const rows = await prisma.page.findMany({ orderBy: { slug: 'asc' } });
    if (rows.length === 0) return NextResponse.json(legalPageDefaults);
    return NextResponse.json(
      rows.map((r) => ({
        slug: r.slug,
        metaTitle: r.metaTitle,
        metaDescription: r.metaDescription,
        heroTitle: r.heroTitle,
        heroDescription: r.heroDescription,
        sections: r.sections,
        lastUpdated: r.lastUpdated,
      }))
    );
  } catch {
    return NextResponse.json(legalPageDefaults);
  }
}