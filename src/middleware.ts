import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret-change-me';

export const config = {
  matcher: ['/admin/:path*', '/login'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adminSession = req.cookies.get('admin_session')?.value;

  // 1. If trying to access /login page
  if (pathname === '/login') {
    if (adminSession) {
      try {
        // Verify token. If valid, redirect to /admin
        await jwtVerify(adminSession, new TextEncoder().encode(AUTH_SECRET));
        return NextResponse.redirect(new URL('/admin', req.url));
      } catch (err) {
        // Token invalid/expired, let them stay on /login (and maybe clear cookie?)
        const response = NextResponse.next();
        response.cookies.delete('admin_session');
        return response;
      }
    }
    // No session, allow access to /login
    return NextResponse.next();
  }

  // 2. If trying to access protected /admin routes
  if (pathname.startsWith('/admin')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      await jwtVerify(adminSession, new TextEncoder().encode(AUTH_SECRET));
      return NextResponse.next();
    } catch (err) {
      // Token invalid/expired
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

