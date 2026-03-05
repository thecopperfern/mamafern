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

  // Tree-shake barrel files for these packages — reduces parsed JS and TBT
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "date-fns",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
    ],
  },

  // Disable Next.js gzip compression — Hostinger's nginx already compresses.
  // Double-compression causes ERR_HTTP2_PROTOCOL_ERROR on large chunks.
  compress: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Proxy Plausible analytics through Next.js to avoid mixed-content blocking.
  // mamafern.com is served over HTTPS; the self-hosted Plausible VPS runs on HTTP.
  // Browsers block HTTP requests (scripts, XHR) from HTTPS pages, so we route
  // everything through /stats/* on the same origin. The script and event API are
  // forwarded to the VPS internally (server → server, no browser restriction).
  //
  // Plausible tracker npm package is then configured with endpoint: '/stats/api/event'
  // so all analytics traffic stays on the same origin.
  async rewrites() {
    const plausibleHost =
      process.env.PLAUSIBLE_HOST || "http://72.61.12.97:48435";
    return [
      {
        // Proxy the Plausible JS bundle (for script-tag approach / bindToWindow)
        source: "/stats/js/script.js",
        destination: `${plausibleHost}/js/pa-Sh7STIEagH-sll0zVYBcb.js`,
      },
      {
        // Proxy the Plausible event API — this is what the npm tracker uses
        source: "/stats/api/event",
        destination: `${plausibleHost}/api/event`,
      },
    ];
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Plausible is now proxied through /stats/* (same origin) — no external HTTP needed
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://cdn11.bigcommerce.com https://www.google-analytics.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Plausible events go to /stats/api/event (same origin) — no external HTTP needed
              "connect-src 'self' https://cdn.shopify.com https://www.google-analytics.com https://api.brevo.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
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
