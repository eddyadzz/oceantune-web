import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await requireAuth('ADMIN');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        createdAt: r.createdAt,
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Read failed.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth('ADMIN');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const { name, email, password, role } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      role: 'ADMIN' | 'EDITOR';
    };
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    if (role !== 'ADMIN' && role !== 'EDITOR') {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (exists) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }
    const created = await prisma.user.create({
      data: {
        name: name?.trim() || email.split('@')[0],
        email: email.toLowerCase().trim(),
        passwordHash: await hash(password, 10),
        role,
      },
    });
    return NextResponse.json(
      { id: created.id, name: created.name, email: created.email, role: created.role, createdAt: created.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST user failed:', err);
    return NextResponse.json({ error: 'Create failed.' }, { status: 500 });
  }
}