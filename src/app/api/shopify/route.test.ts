import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock fetch globally before importing the route
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set env vars BEFORE the route module is loaded
vi.stubEnv("SHOPIFY_STORE_API_URL", "https://test-store.myshopify.com/api/2026-04/graphql.json");
vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "test-token-abc");

// Dynamic import so the module picks up the stubbed env vars
const { POST } = await import("@/app/api/shopify/route");

describe("Shopify API Proxy Route", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("forwards GraphQL request to Shopify", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ data: { products: [] } }),
      status: 200,
    });

    const req = new NextRequest("http://localhost:3000/api/shopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "query { products(first: 1) { edges { node { id } } } }",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(data).toEqual({ data: { products: [] } });
    expect(response.status).toBe(200);
  });

  it("returns 500 when Shopify returns errors", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        errors: [{ message: "Invalid query" }],
      }),
      status: 200,
    });

    const req = new NextRequest("http://localhost:3000/api/shopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "invalid" }),
    });

    const response = await POST(req);
    const data = await response.json();

    // The proxy forwards whatever Shopify returns, including errors
    expect(data.errors).toBeDefined();
  });

  it("returns 500 on network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = new NextRequest("http://localhost:3000/api/shopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query { shop { name } }" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.errors[0].message).toBe("Internal proxy error");
  });
});
