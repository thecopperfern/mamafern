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

const SHOPIFY_API_URL = process.env.SHOPIFY_STORE_API_URL || process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL || "";
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    if (!SHOPIFY_API_URL || !SHOPIFY_TOKEN) {
      console.error("[Shopify Proxy] Missing SHOPIFY_STORE_API_URL or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
      return NextResponse.json(
        { errors: [{ message: "Shopify API is not configured" }] },
        { status: 500 }
      );
    }

    const body = await req.json();

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
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
