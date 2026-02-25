import { NextResponse } from "next/server";
import { commerceClient } from "@/lib/commerce";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const collections = await commerceClient.getCollections();

    // Fetch all products from all collections
    const allProducts = new Map<string, {
      title: string;
      handle: string;
      description: string;
      price: string;
      currency: string;
      availability: string;
      collections: string[];
      productType: string;
      imageAlt: string;
      url: string;
    }>();

    for (const collection of collections) {
      try {
        const result = await commerceClient.getCollectionByHandle(
          collection.handle,
          { first: 100 }
        );
        if (result) {
          for (const product of result.products) {
            const existing = allProducts.get(product.handle);
            if (existing) {
              existing.collections.push(collection.title);
            } else {
              allProducts.set(product.handle, {
                title: product.title,
                handle: product.handle,
                description: product.description?.slice(0, 300) || "",
                price: product.priceRange.minVariantPrice.amount,
                currency: product.priceRange.minVariantPrice.currencyCode,
                availability: product.variants.some((v) => v.availableForSale)
                  ? "in stock"
                  : "out of stock",
                collections: [collection.title],
                productType: product.productType || "",
                imageAlt: product.images[0]?.altText || `${product.title} – Mama Fern`,
                url: `https://mamafern.com/product/${product.handle}`,
              });
            }
          }
        }
      } catch {
        // Skip failed collection fetches
      }
    }

    const feed = {
      store: "Mama Fern",
      storeUrl: "https://mamafern.com",
      storeDescription:
        "Grounded family apparel in natural fabrics for crunchy, cottagecore, and outdoor-loving families.",
      productCount: allProducts.size,
      products: Array.from(allProducts.values()),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(feed, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[products-feed] Failed to generate feed:", error);
    return NextResponse.json(
      {
        store: "Mama Fern",
        storeUrl: "https://mamafern.com",
        products: [],
        error: "Product feed temporarily unavailable",
        generatedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
