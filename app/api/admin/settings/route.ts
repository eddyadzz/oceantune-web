import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { defaultSettings, settingsGroups } from '@/lib/defaults';

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) {
    return NextResponse.json({ settings: defaultSettings, groups: settingsGroups });
  }
  try {
    const rows = await prisma.setting.findMany();
    const settings = { ...defaultSettings };
    for (const row of rows) settings[row.key] = row.value;
    return NextResponse.json({ settings, groups: settingsGroups });
  } catch {
    return NextResponse.json({ settings: defaultSettings, groups: settingsGroups });
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  try {
    const { entries } = (await req.json()) as { entries: Record<string, string> };
    for (const [key, value] of Object.entries(entries)) {
      await prisma.setting.upsert({
        where: { key },
        create: { key, value: String(value ?? '').trim() },
        update: { value: String(value ?? '').trim() },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT settings failed:', err);
    return NextResponse.json({ error: 'Save failed.' }, { status: 500 });
  }
}