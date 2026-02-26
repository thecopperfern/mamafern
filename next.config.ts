import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline critical env vars at build time so they're ALWAYS available,
  // even if Hostinger's runtime process doesn't have them in process.env.
  // persist-env.js writes these to .env.local before `next build` runs,
  // and next.config.ts reads them here during build.
  // This is the permanent fix for "Couldn't load collection" on Hostinger.
  env: {
    SHOPIFY_STORE_API_URL: process.env.SHOPIFY_STORE_API_URL || "",
    SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
  },

  // Skip ESLint during build — Hostinger's production-only npm install
  // sometimes misses ESLint plugins, causing build failures. Lint locally instead.
  eslint: { ignoreDuringBuilds: true },

  // Transpile CVA to fix ESM/CJS interop issue in server builds
  transpilePackages: ["class-variance-authority"],

  // Disable Next.js gzip compression — Hostinger's nginx already compresses.
  // Double-compression causes ERR_HTTP2_PROTOCOL_ERROR on large chunks.
  compress: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      // Split chunks to ≤150 KB so Hostinger's nginx HTTP/2 proxy never
      // drops a large stream mid-transfer (ERR_HTTP2_PROTOCOL_ERROR).
      config.optimization.splitChunks = {
        ...(config.optimization.splitChunks as object),
        chunks: "all",
        maxSize: 150_000,
        minSize: 20_000,
      };
    }
    return config;
  },
};

export default nextConfig;
