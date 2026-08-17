import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin and /api/admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const userCookie = request.cookies.get('campus_pulse_user')?.value;

    let isAdmin = false;

    if (userCookie) {
      try {
        const profile = JSON.parse(decodeURIComponent(userCookie));
        if (profile && profile.role === 'admin') {
          isAdmin = true;
        }
      } catch (err) {
        isAdmin = false;
      }
    }

    if (!isAdmin) {
      // For API routes, return HTTP 403 Forbidden
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden. Administrative privileges required.' },
          { status: 403 }
        );
      }

      // For page routes, redirect unauthorized students/guests to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
