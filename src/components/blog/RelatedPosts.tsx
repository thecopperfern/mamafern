import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

/**
 * Displays up to 3 related blog posts by shared tags.
 * Server component — rendered at bottom of individual blog posts.
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
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-texture-linen rounded-xl border border-oat p-5 hover:border-sage transition-colors"
          >
            <time
              dateTime={post.date}
              className="text-xs text-warm-brown/70"
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
            <p className="text-warm-brown/70 text-xs leading-relaxed line-clamp-2">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
