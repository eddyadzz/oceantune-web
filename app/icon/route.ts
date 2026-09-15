import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/cms';

export const dynamic = 'force-dynamic';

// Favicon served from the CMS logo (brand.logoImage). Falls back to the
// bundled public/logo.svg when no logo has been uploaded.
export async function GET() {
  const settings = await getSettings();
  const logo = settings['brand.logoImage'] ?? '';

  if (logo) {
    try {
      const res = await fetch(logo, { cache: 'no-store' });
      if (res.ok) {
        const headers = new Headers();
        headers.set('Content-Type', res.headers.get('content-type') ?? 'image/png');
        headers.set('Cache-Control', 'public, no-cache');
        return new NextResponse(res.body, { headers });
      }
    } catch {
      // fall through to the default logo
    }
  }

  const buf = await readFile(path.join(process.cwd(), 'public', 'logo.svg'));
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, no-cache',
    },
  });
}