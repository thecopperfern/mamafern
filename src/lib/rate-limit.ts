import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

/**
 * Shared rate limiter for API routes.
 * Uses Upstash Redis sliding window: 10 requests per 60 seconds per IP.
 * Falls back to no rate limiting if env vars are missing (local dev).
 */

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
  });
  return ratelimit;
}

/**
 * Returns a 429 response if rate limited, or null if allowed.
 * Extracts IP from x-forwarded-for or x-real-ip headers.
 */
export async function checkRateLimit(
  req: NextRequest,
  prefix = "api"
): Promise<NextResponse | null> {
  const limiter = getRatelimit();
  if (!limiter) return null; // No rate limiting in dev without Redis

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { success, remaining, reset } = await limiter.limit(
    `${prefix}:${ip}`
  );

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return null;
}
