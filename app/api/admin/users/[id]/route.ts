import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth('ADMIN');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const body = await req.json();
    const data: { name?: string; email?: string; role?: 'ADMIN' | 'EDITOR'; passwordHash?: string } = {};
    if (typeof body.name === 'string') data.name = body.name.trim() || undefined;
    if (typeof body.email === 'string') data.email = body.email.toLowerCase().trim();
    if (body.role === 'ADMIN' || body.role === 'EDITOR') data.role = body.role;
    if (typeof body.password === 'string' && body.password) {
      data.passwordHash = await hash(body.password, 10);
    }
    if (data.role && data.role !== 'ADMIN') {
      if (user.id === params.id) {
        return NextResponse.json({ error: 'You cannot demote your own account.' }, { status: 400 });
      }
      const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } });
      if (target?.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          return NextResponse.json({ error: 'Cannot demote the last admin.' }, { status: 400 });
        }
      }
    }
    const row = await prisma.user.update({ where: { id: params.id }, data });
    return NextResponse.json({ id: row.id, name: row.name, email: row.email, role: row.role });
  } catch (err) {
    console.error(`PUT user ${params.id} failed:`, err);
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth('ADMIN');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    if (user.id === params.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }
    const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } });
    if (target?.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last admin.' }, { status: 400 });
      }
    }
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`DELETE user ${params.id} failed:`, err);
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}