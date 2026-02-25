import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/api",
          "/auth",
          "/analytics",
          "/wishlist",
          "/cart",
        ],
        crawlDelay: 1,
      },
      // Explicitly allow AI crawlers on all public paths
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart"],
      },
    ],
    sitemap: "https://mamafern.com/sitemap.xml",
  };
}
