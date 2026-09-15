import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const body = await req.json();
    const data = {
      metaTitle: String(body.metaTitle ?? ''),
      metaDescription: String(body.metaDescription ?? ''),
      heroTitle: String(body.heroTitle ?? ''),
      heroDescription: String(body.heroDescription ?? ''),
      sections: Array.isArray(body.sections) ? body.sections : [],
    };
    const page = await prisma.page.upsert({
      where: { slug: params.slug },
      create: { slug: params.slug, ...data },
      update: { ...data, lastUpdated: new Date() },
    });
    return NextResponse.json(page);
  } catch (err) {
    console.error(`PUT page ${params.slug} failed:`, err);
    return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
  }
}