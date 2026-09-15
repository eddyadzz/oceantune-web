import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin';
import { uploadFile, publicUrl } from '@/lib/s3';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    // Server-side size guard (8MB).
    if (buf.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 8MB limit.' }, { status: 400 });
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
    const key = `media/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await uploadFile(key, buf, file.type || 'application/octet-stream');

    // Track the file in the DB (this server cannot enumerate S3 objects).
    if (prisma) {
      await prisma.mediaFile.upsert({
        where: { key },
        create: { key, url: publicUrl(key), name: file.name },
        update: {},
      });
    }

    return NextResponse.json({ key, url: publicUrl(key), name: file.name });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}