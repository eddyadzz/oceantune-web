import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { deleteFile } from '@/lib/s3';
import { prisma } from '@/lib/prisma';

// The media library is tracked in the DB because the storage server does not
// enumerate objects (ListObjectsV2 returns NoSuchKey).

export async function GET() {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json([]);

  try {
    const rows = await prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(
      rows.map((r) => ({ key: r.key, url: r.url, name: r.name, createdAt: r.createdAt }))
    );
  } catch (err) {
    console.error('List media failed:', err);
    return NextResponse.json({ error: 'Could not list media.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { key } = await req.json();
    if (!key || typeof key !== 'string' || !key.startsWith('media/')) {
      return NextResponse.json({ error: 'Invalid key.' }, { status: 400 });
    }
    await deleteFile(key);
    if (prisma) {
      await prisma.mediaFile.deleteMany({ where: { key } });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete media failed:', err);
    return NextResponse.json({ error: 'Could not delete file.' }, { status: 500 });
  }
}