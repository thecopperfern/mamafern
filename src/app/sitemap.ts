import type { MetadataRoute } from "next";
import { commerceClient } from "@/lib/commerce";

// ISR: regenerate sitemap every 5 minutes
export const revalidate = 300;

const BASE_URL = "https://mamafern.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/community`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const collections = await commerceClient.getCollections();
    const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
      url: `${BASE_URL}/collections/${c.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Fetch products from each collection
    const productUrls = new Set<string>();
    for (const collection of collections) {
      const result = await commerceClient.getCollectionByHandle(
        collection.handle,
        { first: 100 }
      );
      if (result) {
        result.products.forEach((p) => productUrls.add(p.handle));
      }
    }

    const productPages: MetadataRoute.Sitemap = Array.from(productUrls).map(
      (handle) => ({
        url: `${BASE_URL}/product/${handle}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...collectionPages, ...productPages];
  } catch {
    return staticPages;
  }
}
