import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CommerceClient } from "../types";

// Mock the fetchGraphQL function
const mockFetchGraphQL = vi.fn();
vi.mock("@/shopify/client", () => ({
  fetchGraphQL: (...args: unknown[]) => mockFetchGraphQL(...args),
}));

// Import after mock setup so the module picks up the mocked fetchGraphQL
import { shopifyClient } from "./client";

describe("shopifyClient (commerce adapter)", () => {
  beforeEach(() => {
    mockFetchGraphQL.mockClear();
  });

  describe("getCollections", () => {
    it("returns mapped collections", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        collections: {
          edges: [
            {
              node: {
                id: "gid://shopify/Collection/1",
                handle: "kids",
                title: "Kids",
                description: "Kids apparel",
                descriptionHtml: "<p>Kids apparel</p>",
                image: {
                  url: "https://cdn.shopify.com/kids.jpg",
                  altText: "Kids",
                  width: 800,
                  height: 400,
                },
              },
            },
          ],
        },
      });

      const collections = await shopifyClient.getCollections();
      expect(collections).toHaveLength(1);
      expect(collections[0].handle).toBe("kids");
      expect(collections[0].title).toBe("Kids");
    });

    it("returns empty array when no collections", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        collections: { edges: [] },
      });
      const collections = await shopifyClient.getCollections();
      expect(collections).toEqual([]);
    });
  });

  describe("getProductByHandle", () => {
    it("returns mapped product", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        product: {
          id: "gid://shopify/Product/1",
          handle: "organic-onesie",
          title: "Organic Onesie",
          description: "Soft organic cotton",
          productType: "Apparel",
          vendor: "Mama Fern",
          images: { edges: [] },
          options: [],
          variants: { edges: [] },
          priceRange: {
            minVariantPrice: { amount: "24.99", currencyCode: "USD" },
            maxVariantPrice: { amount: "24.99", currencyCode: "USD" },
          },
          compareAtPriceRange: null,
          featuredImage: null,
          seo: null,
        },
      });

      const product = await shopifyClient.getProductByHandle("organic-onesie");
      expect(product?.handle).toBe("organic-onesie");
      expect(product?.title).toBe("Organic Onesie");
    });

    it("returns null when product not found", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({ product: null });
      const product = await shopifyClient.getProductByHandle("nonexistent");
      expect(product).toBeNull();
    });
  });

  describe("searchProducts", () => {
    it("returns mapped products from search", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        products: {
          edges: [
            {
              node: {
                id: "gid://shopify/Product/1",
                handle: "fern-tee",
                title: "Fern Tee",
                description: "A tee with fern print",
                productType: "Apparel",
                vendor: "Mama Fern",
                images: { edges: [] },
                options: [],
                variants: { edges: [] },
                priceRange: {
                  minVariantPrice: { amount: "19.99", currencyCode: "USD" },
                  maxVariantPrice: { amount: "19.99", currencyCode: "USD" },
                },
                compareAtPriceRange: null,
                featuredImage: null,
                seo: null,
              },
            },
          ],
        },
      });

      const results = await shopifyClient.searchProducts("fern");
      expect(results).toHaveLength(1);
      expect(results[0].handle).toBe("fern-tee");
    });

    it("returns empty array when no results", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        products: { edges: [] },
      });
      const results = await shopifyClient.searchProducts("nonexistent");
      expect(results).toEqual([]);
    });
  });

  describe("createCart", () => {
    it("creates and returns a mapped cart", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        cartCreate: {
          cart: {
            id: "gid://shopify/Cart/1",
            checkoutUrl: "https://shop.com/cart/c/1",
            lines: { edges: [] },
            cost: {
              subtotalAmount: { amount: "0.00", currencyCode: "USD" },
              totalAmount: { amount: "0.00", currencyCode: "USD" },
            },
            totalQuantity: 0,
            discountCodes: [],
          },
        },
      });

      const cart = await shopifyClient.createCart();
      expect(cart.id).toBe("gid://shopify/Cart/1");
      expect(cart.totalQuantity).toBe(0);
      expect(cart.lines).toEqual([]);
    });
  });

  describe("getCart", () => {
    it("returns mapped cart", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        cart: {
          id: "gid://shopify/Cart/1",
          checkoutUrl: "https://shop.com/cart/c/1",
          lines: {
            edges: [
              {
                node: {
                  id: "line-1",
                  quantity: 2,
                  merchandise: {
                    id: "gid://shopify/ProductVariant/1",
                    title: "S / Sage",
                    product: {
                      title: "Organic Onesie",
                      handle: "organic-onesie",
                      vendor: "Mama Fern",
                      description: "Soft",
                    },
                    image: { url: "https://img.com/1.jpg", altText: "Onesie" },
                    price: { amount: "24.99", currencyCode: "USD" },
                    selectedOptions: [{ name: "Size", value: "S" }],
                  },
                  cost: {
                    totalAmount: { amount: "49.98", currencyCode: "USD" },
                  },
                },
              },
            ],
          },
          cost: {
            subtotalAmount: { amount: "49.98", currencyCode: "USD" },
            totalAmount: { amount: "49.98", currencyCode: "USD" },
          },
          totalQuantity: 2,
          discountCodes: [],
        },
      });

      const cart = await shopifyClient.getCart("gid://shopify/Cart/1");
      expect(cart.id).toBe("gid://shopify/Cart/1");
      expect(cart.totalQuantity).toBe(2);
      expect(cart.lines).toHaveLength(1);
      expect(cart.lines[0].productTitle).toBe("Organic Onesie");
      expect(cart.lines[0].quantity).toBe(2);
    });
  });

  // Verify the type signature matches CommerceClient
  it("satisfies the CommerceClient interface", () => {
    const client: CommerceClient = shopifyClient;
    expect(client).toBeDefined();
    expect(typeof client.getCollections).toBe("function");
    expect(typeof client.getProductByHandle).toBe("function");
    expect(typeof client.createCart).toBe("function");
    expect(typeof client.getCart).toBe("function");
    expect(typeof client.addToCart).toBe("function");
    expect(typeof client.updateCartItems).toBe("function");
    expect(typeof client.removeFromCart).toBe("function");
    expect(typeof client.searchProducts).toBe("function");
    expect(typeof client.applyDiscountCode).toBe("function");
    expect(typeof client.removeDiscountCode).toBe("function");
    expect(typeof client.getProductRecommendations).toBe("function");
    expect(typeof client.associateBuyer).toBe("function");
  });
});
