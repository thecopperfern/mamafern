/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/shopify/client.ts
//
// Unified Shopify GraphQL client.
//  – Server-side (RSC / Route Handlers): calls Shopify directly using
//    server-only env vars (SHOPIFY_STORE_API_URL, SHOPIFY_STOREFRONT_ACCESS_TOKEN).
//  – Client-side: routes through /api/shopify proxy so the token is never
//    exposed in the browser.

import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/graphql/products";
import { DocumentNode, print } from "graphql";

const isServer = typeof window === "undefined";

/**
 * Server-side: direct Shopify fetch with token.
 * Supports both the new env var names and the legacy NEXT_PUBLIC_ names for
 * backward compatibility during migration.
 */
function getServerConfig() {
  return {
    url:
      process.env.SHOPIFY_STORE_API_URL ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL ||
      "",
    token:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      "",
  };
}

export const fetchGraphQL = async <T = any>(
  query: DocumentNode,
  variables?: Record<string, any>
): Promise<T> => {
  const queryString = print(query);

  if (isServer) {
    // Direct Shopify call — token stays on the server
    const { url, token } = getServerConfig();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: queryString, variables }),
    });
    const json = await res.json();
    if (json.errors) {
      // Only log errors in development, or if they're not auth-related
      const isAuthError = json.errors.some(
        (e: any) => e.extensions?.code === "UNAUTHORIZED"
      );
      if (!isAuthError || process.env.NODE_ENV !== "development") {
        console.error("Shopify GraphQL errors:", json.errors);
      }
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }
    return json.data as T;
  } else {
    // Client-side — go through the secure proxy
    const res = await fetch("/api/shopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryString, variables }),
    });
    const json = await res.json();
    if (json.errors) {
      // Only log errors in development, or if they're not auth-related
      const isAuthError = json.errors.some(
        (e: any) => e.extensions?.code === "UNAUTHORIZED"
      );
      if (!isAuthError || process.env.NODE_ENV !== "development") {
        console.error("Shopify GraphQL errors:", json.errors);
      }
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }
    return json.data as T;
  }
};

export const getProduct = async (handle: string) => {
  const data = await fetchGraphQL(GET_PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.product;
};
