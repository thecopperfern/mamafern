import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Shopify Storefront API proxy.
 *
 * All GraphQL requests from the client are routed through this endpoint so the
 * Storefront access token is NEVER exposed in the browser bundle.
 *
 * Environment variables (server-only, no NEXT_PUBLIC_ prefix):
 *   SHOPIFY_STORE_API_URL          – e.g. https://mama-fern.myshopify.com/api/2026-04/graphql.json
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN – Storefront API token
 */

// --- Simple in-memory rate limiter ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per IP

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export async function POST(req: NextRequest) {
  try {
    // Read env vars at request time (not module-load time)
    const shopifyUrl = process.env.SHOPIFY_STORE_API_URL || "";
    const shopifyToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

    // Rate limiting by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { errors: [{ message: "Too many requests. Please try again later." }] },
        { status: 429 }
      );
    }

    if (!shopifyUrl || !shopifyToken) {
      console.error(
        "[Shopify Proxy] Missing env vars —",
        `SHOPIFY_STORE_API_URL=${shopifyUrl ? "set" : "EMPTY"},`,
        `SHOPIFY_STOREFRONT_ACCESS_TOKEN=${shopifyToken ? "set" : "EMPTY"}`
      );
      return NextResponse.json(
        { errors: [{ message: "Shopify API is not configured" }] },
        { status: 500 }
      );
    }

    const body = await req.json();

    const response = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": shopifyToken,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Shopify Proxy Error]", error);
    return NextResponse.json(
      { errors: [{ message: "Internal proxy error" }] },
      { status: 500 }
    );
  }
}
