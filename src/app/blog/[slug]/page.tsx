import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts, getAllPosts, markdownToHtml } from "@/lib/blog";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

import RelatedPosts from "@/components/blog/RelatedPosts";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug, post.tags);
  const htmlContent = markdownToHtml(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Mama Fern",
      url: SITE_CONFIG.baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Mama Fern",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
    image: post.featuredImage.startsWith("/")
      ? `${SITE_CONFIG.baseUrl}${post.featuredImage}`
      : post.featuredImage,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={articleSchema} />
      <Breadcrumbs
        items={[
          { label: "Journal", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="mt-6">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
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
          <h1 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-warm-brown text-sm">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {" · "}Mama Fern Team
          </p>
        </header>

        <div
          className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-charcoal prose-a:text-fern prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />

      {/* Internal Links */}
      <nav className="mt-12 pt-8 border-t border-oat" aria-label="Explore more">
        <h2 className="font-display font-bold text-lg text-charcoal mb-4">
          Explore More
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="text-sm text-fern hover:text-fern-dark border border-fern/20 px-4 py-2 rounded-full hover:bg-fern/5 transition-colors"
          >
            Shop All
          </Link>
          <Link
            href="/about"
            className="text-sm text-fern hover:text-fern-dark border border-fern/20 px-4 py-2 rounded-full hover:bg-fern/5 transition-colors"
          >
            Our Story
          </Link>
          <Link
            href="/blog"
            className="text-sm text-fern hover:text-fern-dark border border-fern/20 px-4 py-2 rounded-full hover:bg-fern/5 transition-colors"
          >
            More Articles
          </Link>
          <Link
            href="/community"
            className="text-sm text-fern hover:text-fern-dark border border-fern/20 px-4 py-2 rounded-full hover:bg-fern/5 transition-colors"
          >
            Community
          </Link>
        </div>
      </nav>
    </div>
  );
}
