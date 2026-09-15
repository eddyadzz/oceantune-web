import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_ONLY_PATHS = ['/admin/users'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let the public login page through.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not authenticated → redirect to login.
  if (!token) {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // ADMIN-only paths.
  if (ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p)) && token.role !== 'ADMIN') {
    const url = new URL('/admin', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};