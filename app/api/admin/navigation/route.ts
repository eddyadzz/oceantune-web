import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ nav: [], footer: [] });
  try {
    const rows = await prisma.menuItem.findMany({ orderBy: { order: 'asc' } });
    const nav = rows.filter((r) => r.placement === 'NAV').map((r) => ({ id: r.id, href: r.href, label: r.label }));
    const footer = rows.filter((r) => r.placement === 'FOOTER').map((r) => ({ id: r.id, href: r.href, label: r.label }));
    return NextResponse.json({ nav, footer });
  } catch {
    return NextResponse.json({ nav: [], footer: [] });
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const { nav = [], footer = [] } = (await req.json()) as {
      nav: { href: string; label: string }[];
      footer: { href: string; label: string }[];
    };
    await prisma.menuItem.deleteMany();
    await prisma.menuItem.createMany({
      data: [
        ...nav.map((item, i) => ({ placement: 'NAV' as const, href: item.href, label: item.label, order: i })),
        ...footer.map((item, i) => ({ placement: 'FOOTER' as const, href: item.href, label: item.label, order: i })),
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT navigation failed:', err);
    return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
  }
}