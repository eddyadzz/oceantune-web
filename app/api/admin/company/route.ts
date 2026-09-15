import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { company as seedCompany } from '@/lib/site-data';

const shape = (row: {
  id: string;
  name: string;
  legalName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
}) => ({
  id: row.id,
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
});

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) {
    return NextResponse.json({
      ...seedCompany,
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      },
    });
  }
  try {
    const row = await prisma.company.findFirst();
    if (!row) return NextResponse.json({ ...seedCompany, social: { facebook: '', instagram: '', twitter: '', linkedin: '' } });
    return NextResponse.json(shape(row));
  } catch {
    return NextResponse.json(seedCompany);
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const body = await req.json();
    const data = {
      name: body.name ?? '',
      legalName: body.legalName ?? '',
      tagline: body.tagline ?? '',
      address: body.address ?? '',
      phone: body.phone ?? '',
      email: body.email ?? '',
      description: body.description ?? '',
      facebookUrl: body.social?.facebook ?? '',
      instagramUrl: body.social?.instagram ?? '',
      twitterUrl: body.social?.twitter ?? '',
      linkedinUrl: body.social?.linkedin ?? '',
    };
    const existing = await prisma.company.findFirst();
    const row = existing
      ? await prisma.company.update({ where: { id: existing.id }, data })
      : await prisma.company.create({ data });
    return NextResponse.json(shape(row));
  } catch (err) {
    console.error('PUT company failed:', err);
    return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
  }
}