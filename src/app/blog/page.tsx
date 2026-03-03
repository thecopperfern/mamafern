// force-dynamic: Keystatic writes blog files to disk at runtime.
// ISR would cache stale content for up to 1 hour after a CMS edit.
// force-dynamic ensures Keystatic changes are immediately visible.
export const dynamic = "force-dynamic";

import { getAllPosts, getTagCounts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/view/PageHero";
import Pagination from "@/components/blog/Pagination";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogCard from "@/components/blog/BlogCard";
import TagCloud from "@/components/blog/TagCloud";

const POSTS_PER_PAGE = 6;

export const metadata = buildMetadata({
  title: "Journal",
  description:
    "Style guides, parenting tips, and natural living inspiration from Mama Fern. Explore our journal for family fashion ideas and fabric education.",
  path: "/blog",
  keywords: [
    "mama fern blog",
    "family fashion journal",
    "crunchy mom tips",
    "natural fabric guide",
    "cottagecore family style",
  ],
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogIndex({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const allPosts = getAllPosts();
  const tagCounts = getTagCounts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div>
      <PageHero
        eyebrow="Journal"
        title="The Mama Fern Journal"
        subtitle="Style guides, natural living tips, and inspiration for grounded families."
      />

      <div className="mx-auto max-w-4xl px-4 py-14">
        {/* Client-side search — filters all posts by title, description, tags */}
        <BlogSearch posts={allPosts} />

        {/* Tag cloud — browse by topic */}
        <TagCloud tags={tagCounts} />

        {allPosts.length === 0 ? (
          <p className="text-warm-brown text-center py-8">
            Posts are on the way — check back soon!
          </p>
        ) : (
          <>
            <section aria-label="Blog posts">
              <div className="grid gap-8">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
            />
          </>
        )}
      </div>
    </div>
  );
}
