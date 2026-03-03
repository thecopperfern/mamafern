"use client";

import { useState } from "react";
import type { BlogPostMeta } from "@/lib/blog";
import BlogCard from "./BlogCard";

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
                {filtered.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
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
