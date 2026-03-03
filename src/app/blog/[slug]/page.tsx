import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  markdownToHtml,
  extractHeadings,
} from "@/lib/blog";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ShareButtons from "@/components/blog/ShareButtons";
import PostNavigation from "@/components/blog/PostNavigation";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogNewsletterCTA from "@/components/blog/BlogNewsletterCTA";

// force-dynamic: Keystatic writes blog files to disk at runtime.
// ISR would serve stale content for up to 1 hour after a CMS edit.
// force-dynamic ensures Keystatic changes appear immediately on save.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  // Pass featured image to OG/Twitter metadata (Fix 6)
  const imageUrl =
    post.featuredImage && post.featuredImage !== "/og-image.svg"
      ? post.featuredImage.startsWith("/")
        ? `${SITE_CONFIG.baseUrl}${post.featuredImage}`
        : post.featuredImage
      : undefined;

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: post.tags,
    imageUrl,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug, post.tags);
  const { prev, next } = getAdjacentPosts(post.slug);
  const htmlContent = markdownToHtml(post.content);
  const headings = extractHeadings(htmlContent);
  const showToc = headings.length >= 3;

  const hasFeaturedImage =
    post.featuredImage && post.featuredImage !== "/og-image.svg";

  const postUrl = `${SITE_CONFIG.baseUrl}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
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
    mainEntityOfPage: postUrl,
    image: hasFeaturedImage
      ? post.featuredImage.startsWith("/")
        ? `${SITE_CONFIG.baseUrl}${post.featuredImage}`
        : post.featuredImage
      : `${SITE_CONFIG.baseUrl}/og-image.png`,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={articleSchema} />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Journal", href: "/blog" },
            { label: post.title },
          ]}
        />

        {/* Featured Image */}
        {hasFeaturedImage && (
          <div className="mt-6 rounded-2xl overflow-hidden aspect-[2/1] relative">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

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
              {" · "}
              {post.readTime} min read
              {" · "}
              {post.author}
            </p>

            {/* Share buttons */}
            <ShareButtons
              url={postUrl}
              title={post.title}
              description={post.description}
            />
          </header>
        </article>
      </div>

      {/* Content area: TOC sidebar on desktop, inline on mobile */}
      {showToc ? (
        <div className="max-w-3xl mx-auto lg:max-w-5xl lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
          <div>
            {/* Mobile TOC (above content) */}
            <div className="lg:hidden">
              <TableOfContents headings={headings} />
            </div>
            <div
              className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-charcoal prose-a:text-fern prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          {/* Desktop TOC sidebar */}
          <TableOfContents headings={headings} />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-charcoal prose-a:text-fern prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}

      {/* Below-article sections */}
      <div className="max-w-3xl mx-auto">
        {/* Newsletter CTA */}
        <BlogNewsletterCTA />

        {/* Previous / Next navigation */}
        <PostNavigation prev={prev} next={next} />

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
    </div>
  );
}
