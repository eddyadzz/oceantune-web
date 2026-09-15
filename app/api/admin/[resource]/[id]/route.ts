import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { isAdminResource, updateResource, deleteResource } from '@/lib/admin-router';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { resource: string; id: string } }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  if (!isAdminResource(params.resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }
  try {
    const body = await req.json();
    const row = await updateResource(params.resource, params.id, body);
    return NextResponse.json(row);
  } catch (err) {
    console.error(`PUT ${params.resource}/${params.id} failed:`, err);
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { resource: string; id: string } }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  if (!isAdminResource(params.resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }
  try {
    await deleteResource(params.resource, params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`DELETE ${params.resource}/${params.id} failed:`, err);
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}