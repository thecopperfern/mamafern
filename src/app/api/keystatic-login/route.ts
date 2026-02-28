import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/keystatic-login
 *
 * Validates the submitted password against KEYSTATIC_PASSWORD.
 * On success, sets a 30-day HttpOnly cookie (`ks_auth`) whose value is
 * sha256(`${password}:${secret}`). The middleware reads and verifies this
 * same hash to gate access to /keystatic and /api/keystatic.
 *
 * Changing KEYSTATIC_PASSWORD or KEYSTATIC_SECRET in the env immediately
 * invalidates all existing sessions (old cookies no longer match).
 */
export async function POST(request: NextRequest) {
  let body: { password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { password } = body;
  const correctPassword = process.env.KEYSTATIC_PASSWORD;
  const secret = process.env.KEYSTATIC_SECRET ?? '';

  if (!correctPassword) {
    // No password configured — allow through (mirrors middleware behaviour)
    return NextResponse.json({ ok: true });
  }

  if (!password || password !== correctPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Sign the cookie: sha256(password:secret) — same hash the middleware checks
  const cookieValue = crypto
    .createHash('sha256')
    .update(`${correctPassword}:${secret}`)
    .digest('hex');

  const response = NextResponse.json({ ok: true });
  response.cookies.set('ks_auth', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
