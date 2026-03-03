// force-dynamic: Keystatic writes blog files to disk at runtime.
// ISR would cache stale content for up to 1 hour after a CMS edit.
// force-dynamic ensures Keystatic changes are immediately visible.
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/view/PageHero";
import Pagination from "@/components/blog/Pagination";
import BlogSearch from "@/components/blog/BlogSearch";

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

        {allPosts.length === 0 ? (
          <p className="text-warm-brown text-center py-8">
            Posts are on the way — check back soon!
          </p>
        ) : (
          <>
            <section aria-label="Blog posts">
              <div className="grid gap-8">
                {paginatedPosts.map((post) => {
                  const hasFeaturedImage =
                    post.featuredImage && post.featuredImage !== "/og-image.svg";

                  return (
                    <article
                      key={post.slug}
                      className="group bg-texture-linen rounded-2xl border border-oat overflow-hidden hover:border-fern/30 transition-colors"
                    >
                      {hasFeaturedImage && (
                        <div className="aspect-[3/1] relative">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 896px"
                          />
                        </div>
                      )}
                      <div className="p-6 md:p-8">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/blog/tag/${encodeURIComponent(tag)}`}
                              className="text-xs font-medium text-fern bg-fern/10 px-2.5 py-0.5 rounded-full hover:bg-fern/20 transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                        <h2 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-2 group-hover:text-fern transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="text-warm-brown text-sm leading-relaxed mb-4">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-warm-brown">
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                            {" · "}
                            {post.readTime} min read
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            aria-label={`Read full article: ${post.title}`}
                            className="text-sm font-medium text-fern hover:text-fern-dark transition-colors"
                          >
                            Read more <span aria-hidden="true">&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
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
