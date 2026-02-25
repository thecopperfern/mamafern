import type { MetadataRoute } from "next";
import { commerceClient } from "@/lib/commerce";

// ISR: regenerate sitemap every 5 minutes
export const revalidate = 300;

const BASE_URL = "https://mamafern.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
  ];

  try {
    const collections = await commerceClient.getCollections();
    const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
      url: `${BASE_URL}/collections/${c.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Fetch products from each collection
    const productUrls = new Set<string>();
    for (const collection of collections) {
      try {
        const result = await commerceClient.getCollectionByHandle(
          collection.handle,
          { first: 100 }
        );
        if (result) {
          result.products.forEach((p) => productUrls.add(p.handle));
        }
      } catch (err) {
        console.error(`[sitemap] Failed to fetch collection "${collection.handle}":`, err);
      }
    }

    const productPages: MetadataRoute.Sitemap = Array.from(productUrls).map(
      (handle) => ({
        url: `${BASE_URL}/product/${handle}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...collectionPages, ...productPages];
  } catch (err) {
    console.error("[sitemap] Failed to fetch from Shopify, returning static routes only:", err);
    return staticPages;
  }
}
