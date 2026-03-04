import type { Metadata } from "next";
import type { CommerceProduct, CommerceCollection } from "@/lib/commerce";

// ─── Brand Configuration ─────────────────────────────────────────────────────

/**
 * Static fallback for SITE_CONFIG. Used synchronously in files that can't be
 * async. For dynamic CMS-driven values, use getSiteSettings() instead.
 */
export const SITE_CONFIG = {
  name: "Mama Fern",
  tagline: "Grounded Family Apparel",
  baseUrl: "https://mamafern.com",
  twitterHandle: "@mamafern",
  defaultOgImage: "/og-image.png",
  defaultDescription:
    "Grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs for moms, dads, and kids who love the outdoors.",
  defaultKeywords: [
    "mama fern",
    "family apparel",
    "crunchy mom clothing",
    "natural fabric kids clothes",
    "earthy family fashion",
    "grounded family clothing",
    "boho family apparel",
    "cottagecore kids clothing",
    "matching family outfits",
    "organic family clothing",
  ],
} as const;

/**
 * Reads site settings from the Keystatic siteSettings singleton, merging with
 * hardcoded SITE_CONFIG defaults. Use this in async server components/pages
 * that need CMS-driven brand values.
 */
export async function getSiteSettings() {
  try {
    const reader = (await import("@/lib/content")).default;
    const data = await reader.singletons.siteSettings.read();
    if (!data) return { ...SITE_CONFIG };
    return {
      name: data.brandName || SITE_CONFIG.name,
      tagline: data.tagline || SITE_CONFIG.tagline,
      baseUrl: data.baseUrl || SITE_CONFIG.baseUrl,
      twitterHandle: data.twitterHandle || SITE_CONFIG.twitterHandle,
      defaultOgImage: data.defaultOgImage || SITE_CONFIG.defaultOgImage,
      defaultDescription: data.defaultDescription || SITE_CONFIG.defaultDescription,
      defaultKeywords: data.defaultKeywords?.length ? data.defaultKeywords : [...SITE_CONFIG.defaultKeywords],
      instagramUrl: data.instagramUrl || "",
      tiktokUrl: data.tiktokUrl || "",
      pinterestUrl: data.pinterestUrl || "",
    };
  } catch {
    return { ...SITE_CONFIG, instagramUrl: "", tiktokUrl: "", pinterestUrl: "" };
  }
}

// ─── Generic Page Metadata Builder ───────────────────────────────────────────

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  imageUrl,
  type = "website",
  keywords = [],
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.baseUrl}${path}`;
  const ogImage = imageUrl || `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultOgImage}`;
  const allKeywords = [...new Set([...SITE_CONFIG.defaultKeywords, ...keywords])];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} – ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─── Product Metadata Builder ────────────────────────────────────────────────

export function buildProductMetadata(product: CommerceProduct): Metadata {
  const title = product.seo?.title || product.title;
  const description =
    product.seo?.description ||
    product.description?.slice(0, 160) ||
    `Shop ${product.title} at Mama Fern – grounded family apparel.`;
  const imageUrl = product.images[0]?.url || undefined;

  return buildMetadata({
    title,
    description,
    path: `/product/${product.handle}`,
    imageUrl,
    keywords: [
      product.title.toLowerCase(),
      product.productType?.toLowerCase(),
      "mama fern",
    ].filter(Boolean) as string[],
  });
}

// ─── Collection Metadata Builder ─────────────────────────────────────────────

export function buildCollectionMetadata(collection: CommerceCollection): Metadata {
  const title = collection.title;
  const description =
    collection.description?.slice(0, 160) ||
    `Shop the ${collection.title} collection at Mama Fern – grounded family apparel.`;
  const imageUrl = collection.image?.url || undefined;

  return buildMetadata({
    title,
    description,
    path: `/collections/${collection.handle}`,
    imageUrl,
    keywords: [
      collection.title.toLowerCase(),
      "family apparel collection",
      "mama fern",
    ],
  });
}

// ─── Strip HTML utility ──────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
