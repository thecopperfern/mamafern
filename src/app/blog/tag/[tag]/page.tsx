import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

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

export default async function BlogTagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const allPosts = getAllPosts();
  const taggedPosts = allPosts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === decoded.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-fern hover:text-fern-dark mb-4 inline-block"
        >
          ← Back to Journal
        </Link>
        <h1 className="font-display font-bold text-3xl text-charcoal">
          Articles tagged &ldquo;{decoded}&rdquo;
        </h1>
        <p className="text-warm-brown/70 mt-2">
          {taggedPosts.length} {taggedPosts.length === 1 ? "article" : "articles"} found
        </p>
      </div>

      {taggedPosts.length === 0 ? (
        <p className="text-warm-brown/70 text-center py-8">
          No articles with this tag yet.
        </p>
      ) : (
        <div className="grid gap-6">
          {taggedPosts.map((post) => (
            <article
              key={post.slug}
              className="group bg-texture-linen rounded-2xl border border-oat p-6 hover:border-fern/30 transition-colors"
            >
              <h2 className="font-display font-bold text-xl text-charcoal mb-2 group-hover:text-fern transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-warm-brown/70 text-sm leading-relaxed mb-3">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <time
                  dateTime={post.date}
                  className="text-xs text-warm-brown/70"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-fern hover:text-fern-dark transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
