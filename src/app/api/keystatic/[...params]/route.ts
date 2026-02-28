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

const INTERNAL_HOSTS = new Set(['0.0.0.0', '127.0.0.1', 'localhost']);

function firstHeaderValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const first = value.split(',')[0]?.trim();
  return first || undefined;
}

function getConfiguredSiteHost(): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  try {
    return new URL(siteUrl).host;
  } catch {
    return undefined;
  }
}

function ensureAbsoluteUrl(request: Request): Request {
  let parsed: URL;
  try {
    parsed = new URL(request.url);
  } catch {
    const pathname = request.url.startsWith('/') ? request.url : `/${request.url}`;
    parsed = new URL(pathname, 'https://127.0.0.1');
  }

  const forwardedProto = firstHeaderValue(request.headers.get('x-forwarded-proto'));
  const forwardedHost = firstHeaderValue(request.headers.get('x-forwarded-host'));
  const hostHeader = firstHeaderValue(request.headers.get('host'));
  const parsedProtocol = parsed.protocol.replace(':', '');
  const parsedHost = parsed.host;
  const parsedHostname = parsed.hostname.toLowerCase();

  const desiredProtocol = forwardedProto || parsedProtocol || 'https';
  const desiredHost =
    forwardedHost ||
    (!INTERNAL_HOSTS.has(parsedHostname) ? parsedHost : undefined) ||
    hostHeader ||
    getConfiguredSiteHost() ||
    parsedHost;

  if (desiredProtocol === parsedProtocol && desiredHost === parsedHost) {
    return request;
  }

  const rewrittenUrl = `${desiredProtocol}://${desiredHost}${parsed.pathname}${parsed.search}`;
  return new Request(rewrittenUrl, request);
}

ensureKeystaticEnv();

const routeHandler = makeRouteHandler({ config });

export async function GET(request: Request) {
  return routeHandler.GET(ensureAbsoluteUrl(request));
}

export async function POST(request: Request) {
  return routeHandler.POST(ensureAbsoluteUrl(request));
}
