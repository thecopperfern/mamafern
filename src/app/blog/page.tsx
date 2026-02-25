import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/view/PageHero";

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

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div>
      <PageHero
        eyebrow="Journal"
        title="The Mama Fern Journal"
        subtitle="Style guides, natural living tips, and inspiration for grounded families."
      />

      <div className="mx-auto max-w-4xl px-4 py-14">
        {posts.length === 0 ? (
          <p className="text-warm-brown/60 text-center py-8">
            Posts are on the way — check back soon!
          </p>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-texture-linen rounded-2xl border border-oat overflow-hidden p-6 md:p-8 hover:border-fern/30 transition-colors"
              >
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
                <p className="text-warm-brown/70 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <time
                    dateTime={post.date}
                    className="text-xs text-warm-brown/40"
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
    </div>
  );
}
