import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostMeta;
}

/**
 * Shared blog article card used across the blog index, tag pages, and search results.
 * Renders featured image, tags, title, description, date, read time, and a "Read more" link.
 */
export default function BlogCard({ post }: BlogCardProps) {
  const hasFeaturedImage =
    post.featuredImage && post.featuredImage !== "/og-image.svg";

  return (
    <article className="group bg-texture-linen rounded-2xl border border-oat overflow-hidden hover:border-fern/30 transition-colors">
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
}
