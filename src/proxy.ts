import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/auth/secret';

const ADMIN_COOKIE_NAME = 'mkm_admin_token';
const USER_COOKIE_NAME = 'mkm_user_token';

// Security Headers definition
function applySecurityHeaders(response: NextResponse): NextResponse {
  // 1. Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.facebook.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: blob: https://www.facebook.com https://maps.google.com;
    frame-src 'self' https://www.youtube.com https://www.google.com https://maps.google.com;
    connect-src 'self' https://connect.facebook.net https://www.facebook.com https://api.resend.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check for Admin protected routes
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  if (isAdminRoute || isAdminApiRoute) {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    let isAuthorizedAdmin = false;

    if (adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, getJwtSecret(), {
          algorithms: ['HS256']
        });
        if (payload.role === 'admin' && payload.id && payload.email) {
          isAuthorizedAdmin = true;
        }
      } catch {
        isAuthorizedAdmin = false;
      }
    }

    if (!isAuthorizedAdmin) {
      if (isAdminApiRoute) {
        return applySecurityHeaders(
          NextResponse.json(
            { success: false, error: 'Unauthorized: Administrative authentication required' },
            { status: 401 }
          )
        );
      }
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // 2. Check for Protected Client Data routes: /projects and /documents
  // Business rule: Only authenticated and approved clients or admins can access full project data & documents
  const isProtectedClientPage =
    pathname.startsWith('/projects') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/dashboard');

  if (isProtectedClientPage) {
    const userToken = req.cookies.get(USER_COOKIE_NAME)?.value;
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    let isAuthorized = false;

    // A. Check user token
    if (userToken) {
      try {
        const { payload } = await jwtVerify(userToken, getJwtSecret(), {
          algorithms: ['HS256']
        });
        if (
          (payload.status === 'APPROVED' || payload.role === 'admin') &&
          payload.id &&
          payload.email
        ) {
          isAuthorized = true;
        }
      } catch {
        isAuthorized = false;
      }
    }

    // B. Check admin token
    if (!isAuthorized && adminToken) {
      try {
        const { payload } = await jwtVerify(adminToken, getJwtSecret(), {
          algorithms: ['HS256']
        });
        if (payload.role === 'admin' && payload.id) {
          isAuthorized = true;
        }
      } catch {
        isAuthorized = false;
      }
    }

    if (!isAuthorized) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('unauthorized', 'true');
      loginUrl.searchParams.set('redirect', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

// Keep export for backward compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)'
  ]
};
