import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

/**
 * Displays up to 3 related blog posts by shared tags.
 * Server component — rendered at bottom of individual blog posts.
 * Shows a small thumbnail when a featured image is available.
 */
export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-oat pt-10" aria-labelledby="related-posts-heading">
      <h2
        id="related-posts-heading"
        className="font-display font-bold text-xl text-charcoal mb-6"
      >
        You might also enjoy
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => {
          const hasFeaturedImage =
            post.featuredImage && post.featuredImage !== "/og-image.svg";

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-texture-linen rounded-xl border border-oat overflow-hidden hover:border-sage transition-colors"
            >
              {hasFeaturedImage && (
                <div className="aspect-[2/1] relative">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <time
                  dateTime={post.date}
                  className="text-xs text-charcoal/80"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <h3 className="font-semibold text-charcoal mt-1 mb-1 group-hover:text-fern transition-colors text-sm leading-snug">
                  {post.title}
                </h3>
                <p className="text-charcoal/80 text-xs leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
