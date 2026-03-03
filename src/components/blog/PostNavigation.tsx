import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

interface PostNavigationProps {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
}

/**
 * Previous / Next post navigation shown at the bottom of blog posts.
 * Displays two cards side-by-side on desktop, stacked on mobile.
 */
export default function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-oat" aria-label="Previous and next articles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex flex-col p-5 rounded-xl border border-oat bg-texture-linen hover:border-fern/30 transition-colors"
          >
            <span className="text-xs text-warm-brown/60 uppercase tracking-wider mb-1">
              <span aria-hidden="true">&larr;</span> Previous
            </span>
            <span className="font-display font-semibold text-charcoal group-hover:text-fern transition-colors text-sm leading-snug">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col p-5 rounded-xl border border-oat bg-texture-linen hover:border-fern/30 transition-colors md:text-right"
          >
            <span className="text-xs text-warm-brown/60 uppercase tracking-wider mb-1">
              Next <span aria-hidden="true">&rarr;</span>
            </span>
            <span className="font-display font-semibold text-charcoal group-hover:text-fern transition-colors text-sm leading-snug">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
