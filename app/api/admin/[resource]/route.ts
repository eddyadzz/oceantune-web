import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { isAdminResource, listResource, createResource } from '@/lib/admin-router';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { resource: string } }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdminResource(params.resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }
  try {
    return NextResponse.json(await listResource(params.resource));
  } catch (err) {
    console.error(`GET ${params.resource} failed:`, err);
    return NextResponse.json({ error: 'Read failed.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { resource: string } }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  if (!isAdminResource(params.resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }
  try {
    const body = await req.json();
    const row = await createResource(params.resource, body);
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error(`POST ${params.resource} failed:`, err);
    return NextResponse.json({ error: 'Create failed.' }, { status: 500 });
  }
}