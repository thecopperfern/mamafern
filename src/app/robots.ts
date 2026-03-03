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
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/account", "/api", "/auth", "/analytics", "/wishlist", "/cart", "/lookadmin"],
      },
    ],
    sitemap: "https://mamafern.com/sitemap.xml",
  };
}
