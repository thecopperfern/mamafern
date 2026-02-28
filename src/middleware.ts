import { NextRequest, NextResponse } from 'next/server';

/**
 * Keystatic CMS Password Guard
 *
 * Protects /keystatic and /api/keystatic behind a shared password cookie.
 * Marketing team logs in once at /keystatic-login and gets a 30-day cookie.
 *
 * Cookie value = sha256(`${KEYSTATIC_PASSWORD}:${KEYSTATIC_SECRET}`)
 * This means the cookie can't be forged without knowing both secrets,
 * and changing either env var instantly invalidates all sessions.
 *
 * If KEYSTATIC_PASSWORD is not set, the middleware passes through
 * (safe for local dev where the env var isn't needed).
 */

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const password = process.env.KEYSTATIC_PASSWORD;
  const secret = process.env.KEYSTATIC_SECRET ?? '';

  // If no password is configured, allow through (local dev fallback)
  if (!password) {
    return NextResponse.next();
  }

  const expectedCookie = await sha256(`${password}:${secret}`);
  const authCookie = request.cookies.get('ks_auth')?.value;

  if (authCookie === expectedCookie) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to the login page, preserving the destination
  const loginUrl = new URL('/keystatic-login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
};
