import type { Metadata } from "next";
import type { CommerceProduct, CommerceCollection } from "@/lib/commerce";

// ─── Brand Configuration ─────────────────────────────────────────────────────

export const SITE_CONFIG = {
  name: "Mama Fern",
  tagline: "Grounded Family Apparel",
  baseUrl: "https://mamafern.com",
  twitterHandle: "@mamafern",
  defaultOgImage: "/og-image.svg",
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
