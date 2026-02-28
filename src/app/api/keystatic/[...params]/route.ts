import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

function ensureKeystaticEnv(): void {
  const required = [
    'KEYSTATIC_GITHUB_CLIENT_ID',
    'KEYSTATIC_GITHUB_CLIENT_SECRET',
    'KEYSTATIC_SECRET',
  ];

  if (required.every((key) => Boolean(process.env[key]))) {
    return;
  }

  const candidates = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  }
}

function ensureAbsoluteUrl(request: Request): Request {
  try {
    new URL(request.url);
    return request;
  } catch {
    const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
    const host =
      request.headers.get('x-forwarded-host') ??
      request.headers.get('host') ??
      '127.0.0.1';
    const pathname = request.url.startsWith('/') ? request.url : `/${request.url}`;
    return new Request(`${protocol}://${host}${pathname}`, request);
  }
}

ensureKeystaticEnv();

const routeHandler = makeRouteHandler({ config });

export async function GET(request: Request) {
  return routeHandler.GET(ensureAbsoluteUrl(request));
}

export async function POST(request: Request) {
  return routeHandler.POST(ensureAbsoluteUrl(request));
}
