import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
