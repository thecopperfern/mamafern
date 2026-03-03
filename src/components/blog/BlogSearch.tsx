"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogSearchProps {
  posts: BlogPostMeta[];
}

/**
 * Client-side blog search component.
 * Filters posts by title, description, and tags.
 * When the search input is empty, the component is hidden and the
 * paginated server-rendered grid is shown underneath.
 */
export default function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          p.tags.some((t) => t.toLowerCase().includes(trimmed))
      )
    : [];

  return (
    <div className="mb-10">
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <input
        id="blog-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full px-4 py-3 rounded-xl border border-oat bg-cream text-charcoal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition"
      />

      {trimmed && (
        <div className="mt-6">
          <p className="text-sm text-warm-brown mb-4">
            {filtered.length} {filtered.length === 1 ? "result" : "results"} for
            &ldquo;{query.trim()}&rdquo;
          </p>
          {filtered.length > 0 ? (
            <section aria-label="Search results">
              <div className="grid gap-6">
                {filtered.map((post) => {
                  const hasFeaturedImage =
                    post.featuredImage &&
                    post.featuredImage !== "/og-image.svg";

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
                      <div className="p-6">
                        <h2 className="font-display font-bold text-xl text-charcoal mb-2 group-hover:text-fern transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="text-warm-brown text-sm leading-relaxed mb-3">
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
          ) : (
            <p className="text-warm-brown text-center py-4">
              No articles found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
