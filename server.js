/**
 * Production server for Hostinger Node.js panel.
 *
 * Runs Next.js in-process (no child process spawning) to ensure all
 * environment variables from Hostinger's panel are available to route
 * handlers and server components.
 */

process.env.NODE_ENV = "production";

const path = require("path");
const fs = require("fs");

// Load .env.local FIRST — persist-env.js writes Shopify credentials here
// during build. Fallback in case next.config.ts env inlining isn't enough.
try {
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });
} catch {
  // dotenv may not be installed — env vars are also inlined by next.config.ts
}

const next = require("next");
const { createServer } = require("http");

// MIME type map for static assets — Hostinger nginx sometimes serves as text/plain
const MIME_TYPES = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

const port = parseInt(process.env.PORT || "3000", 10);

// Write PID file so post-build-restart.js can kill this process after a new build.
// This is the reliable restart mechanism for Hostinger's auto-deploy.
const pidFile = path.join(__dirname, ".server.pid");
let pidFileWritten = false;
try {
  fs.writeFileSync(pidFile, process.pid.toString());
  pidFileWritten = true;
} catch (error) {
  console.warn(`⚠️ Could not write .server.pid: ${error.message}`);
}

// Log env var availability for diagnostics
console.log(`> NODE_ENV=${process.env.NODE_ENV}`);
console.log(`> PORT=${port}`);
console.log(`> PID=${process.pid}${pidFileWritten ? " (written to .server.pid)" : " (pid file unavailable)"}`);
console.log(`> SHOPIFY_STORE_API_URL=${process.env.SHOPIFY_STORE_API_URL ? "set" : "MISSING"}`);
console.log(`> SHOPIFY_STOREFRONT_ACCESS_TOKEN=${process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "set" : "MISSING"}`);

const app = next({ dev: false, dir: __dirname, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Serve /_next/static/ files directly from disk with correct MIME types.
    // This bypasses both Next.js handler and prevents Hostinger's nginx from
    // serving JS/CSS as text/plain (which causes ChunkLoadError / broken styles).
    if (req.url.startsWith("/_next/static/")) {
      const urlPath = req.url.split("?")[0]; // strip query string
      const filePath = path.join(__dirname, ".next", "static", urlPath.replace("/_next/static/", ""));

      // Security: prevent path traversal
      const normalizedPath = path.normalize(filePath);
      const staticDir = path.join(__dirname, ".next", "static");
      if (!normalizedPath.startsWith(staticDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      if (fs.existsSync(normalizedPath)) {
        const mimeType = getMimeType(normalizedPath);
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("X-Content-Type-Options", "nosniff");
        const stream = fs.createReadStream(normalizedPath);
        stream.pipe(res);
        return;
      }
    }

    // For all other requests, let Next.js handle them normally.
    // Still set Content-Type header as a fallback in case nginx passes through.
    if (req.url.startsWith("/_next/static/")) {
      res.setHeader("Content-Type", getMimeType(req.url));
    }
    handle(req, res);
  })
    .listen(port, "0.0.0.0", () => {
      console.log(`> Mama Fern ready on http://0.0.0.0:${port}`);
    });

  // Graceful shutdown — let in-flight requests finish before exiting
  function shutdown(signal) {
    console.log(`> ${signal} received — shutting down gracefully...`);
    server.close(() => {
      console.log("> Server closed. Exiting.");
      // Clean up PID file
      try { fs.unlinkSync(pidFile); } catch {}
      process.exit(0);
    });
    // Force exit after 10s if connections are hanging
    setTimeout(() => {
      console.error("> Forced exit after 10s timeout");
      process.exit(1);
    }, 10_000);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

