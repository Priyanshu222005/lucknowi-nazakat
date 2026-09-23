import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    if (!adminToken || adminToken !== 'authenticated_admin') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ['/admin/:path*'],
};