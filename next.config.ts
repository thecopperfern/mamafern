import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for self-hosted Node.js (Hostinger)
  // Produces a minimal .next/standalone folder with all deps bundled
  output: "standalone",

  // Transpile CVA to fix ESM/CJS interop issue in server builds
  transpilePackages: ["class-variance-authority"],

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
};

export default nextConfig;
