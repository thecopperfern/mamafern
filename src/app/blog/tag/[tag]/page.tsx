import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Pagination from "@/components/blog/Pagination";
import BlogCard from "@/components/blog/BlogCard";

// force-dynamic: Tag pages filter blog posts read from disk at runtime.
// generateStaticParams would require a build for new tags to appear.
export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 6;

type Props = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return buildMetadata({
    title: `${decoded} Articles`,
    description: `Browse Mama Fern journal articles tagged "${decoded}" — style guides, tips, and inspiration for grounded families.`,
    path: `/blog/tag/${tag}`,
    keywords: [decoded, "mama fern blog"],
  });
}

export default async function BlogTagPage({ params, searchParams }: Props) {
  const { tag } = await params;
  const { page } = await searchParams;
  const decoded = decodeURIComponent(tag);
  const allPosts = getAllPosts();
  const taggedPosts = allPosts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === decoded.toLowerCase())
  );

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const totalPages = Math.ceil(taggedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = taggedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-fern hover:text-fern-dark mb-4 inline-block"
        >
          <span aria-hidden="true">&larr;</span> Back to Journal
        </Link>
        <h1 className="font-display font-bold text-3xl text-charcoal">
          Articles tagged &ldquo;{decoded}&rdquo;
        </h1>
        <p className="text-warm-brown mt-2">
          {taggedPosts.length} {taggedPosts.length === 1 ? "article" : "articles"} found
        </p>
      </div>

      {taggedPosts.length === 0 ? (
        <p className="text-warm-brown text-center py-8">
          No articles with this tag yet.
        </p>
      ) : (
        <>
          <section aria-label="Blog posts">
            <div className="grid gap-6">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/blog/tag/${tag}`}
          />
        </>
      )}
    </div>
  );
}
