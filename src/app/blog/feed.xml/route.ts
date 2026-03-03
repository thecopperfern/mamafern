import { getAllPosts, markdownToHtml } from "@/lib/blog";
import { SITE_CONFIG } from "@/lib/seo";

/**
 * Enhanced RSS feed for the Mama Fern Journal.
 *
 * Includes:
 * - Channel <image> element (Mama Fern logo)
 * - content:encoded with full HTML (via marked)
 * - <enclosure> for featured images
 * - Standard RSS 2.0 + Atom self-link + content namespace
 */
export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post) => {
      const fullHtml = markdownToHtml(post.content);
      const hasFeaturedImage =
        post.featuredImage && post.featuredImage !== "/og-image.svg";
      const imageUrl = hasFeaturedImage
        ? post.featuredImage.startsWith("/")
          ? `${SITE_CONFIG.baseUrl}${post.featuredImage}`
          : post.featuredImage
        : null;

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_CONFIG.baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_CONFIG.baseUrl}/blog/${post.slug}</guid>
      ${post.tags.map((t) => `<category>${t}</category>`).join("\n      ")}${
        imageUrl
          ? `\n      <enclosure url="${imageUrl}" type="image/jpeg" length="0" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Mama Fern Journal</title>
    <link>${SITE_CONFIG.baseUrl}/blog</link>
    <description>Style guides, parenting tips, and natural living inspiration from Mama Fern.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_CONFIG.baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_CONFIG.baseUrl}/mamafern_logo.png</url>
      <title>Mama Fern Journal</title>
      <link>${SITE_CONFIG.baseUrl}/blog</link>
    </image>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
