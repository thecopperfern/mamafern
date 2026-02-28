import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: Site-wide password gate + Keystatic CMS guard
 *
 * 1. SITE_PASSWORD (optional): When set, protects the ENTIRE site behind
 *    HTTP Basic Auth. Great for pre-launch. Remove the env var to go live.
 *    Username can be anything (e.g. "admin"), password must match SITE_PASSWORD.
 *
 * 2. KEYSTATIC_PASSWORD: Protects /keystatic routes behind a cookie-based
 *    password gate. Marketing team logs in once and gets a 30-day cookie.
 */

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check HTTP Basic Auth against SITE_PASSWORD.
 * Returns a 401 response if auth fails, or null if auth passes.
 */
function checkSitePassword(request: NextRequest, sitePassword: string): NextResponse | null {
  const authHeader = request.headers.get('authorization');

  if (authHeader?.startsWith('Basic ')) {
    const base64 = authHeader.slice(6);
    const decoded = atob(base64);
    // Accept any username — only the password matters
    const password = decoded.includes(':') ? decoded.split(':').slice(1).join(':') : decoded;

    if (password === sitePassword) {
      return null; // Auth passed
    }
  }

  // Auth failed — prompt for credentials
  return new NextResponse('Site is under construction. Enter password to continue.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Mama Fern (Pre-Launch)"',
    },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Gate 1: Site-wide password (pre-launch) ---
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const blocked = checkSitePassword(request, sitePassword);
    if (blocked) return blocked;
  }

  // --- Gate 2: Keystatic CMS password (cookie-based) ---
  const isKeystatic = pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic');
  if (isKeystatic) {
    const ksPassword = process.env.KEYSTATIC_PASSWORD;
    const secret = process.env.KEYSTATIC_SECRET ?? '';

    // If no password is configured, allow through (local dev fallback)
    if (!ksPassword) {
      return NextResponse.next();
    }

    const expectedCookie = await sha256(`${ksPassword}:${secret}`);
    const authCookie = request.cookies.get('ks_auth')?.value;

    if (authCookie === expectedCookie) {
      return NextResponse.next();
    }

    // Not authenticated — redirect to the login page
    const loginUrl = new URL('/keystatic-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|images/).*)'],
};
