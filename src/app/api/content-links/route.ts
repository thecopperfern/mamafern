import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { commerceClient } from "@/lib/commerce";

/**
 * GET /api/content-links
 *
 * Returns all blog slugs/titles, product handles/titles, and collection
 * handles/titles. Used as a reference while editing blog posts in Keystatic
 * to help the content team find the right slugs for relatedContent links.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const [posts, collections] = await Promise.all([
    Promise.resolve(getAllPosts()),
    commerceClient.getCollections().catch(() => []),
  ]);

  return NextResponse.json({
    blog: posts.map((p) => ({ slug: p.slug, title: p.title })),
    collections: collections.map((c) => ({ handle: c.handle, title: c.title })),
  });
}
