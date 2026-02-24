/**
 * Custom Node.js server for Hostinger deployment.
 *
 * Serves the Next.js production build with explicit Content-Length headers
 * on static assets so Hostinger's nginx HTTP/2 proxy never drops a large
 * chunk stream mid-transfer.
 *
 * Usage: NODE_ENV=production node server.js
 */

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const fs = require("fs");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
// Use HOST (not HOSTNAME) — Linux sets $HOSTNAME to the machine name
// (e.g. srv-123.hostinger.com) which isn't a bindable address.
const hostname = process.env.HOST || "0.0.0.0";
const dev = process.env.NODE_ENV === "development";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MIME types for static JS/CSS chunks
const MIME_TYPES = {
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

// Base directory (where this server.js lives, i.e. project root)
const BASE_DIR = __dirname;

app.prepare().then(() => {
  console.log(`> Preparing Next.js (dev=${dev})...`);
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve /_next/static/ files directly with explicit Content-Length.
      // Hostinger's nginx proxy drops large chunk streams mid-HTTP/2 when
      // the size is unknown. Sending Content-Length up-front prevents this.
      if (pathname && pathname.startsWith("/_next/static/")) {
        const filePath = path.join(
          BASE_DIR,
          ".next",
          "static",
          pathname.replace("/_next/static/", "")
        );
        const ext = path.extname(filePath);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath);
          const mime = MIME_TYPES[ext] || "application/octet-stream";
          res.writeHead(200, {
            "Content-Type": mime,
            "Content-Length": content.byteLength,
            // Immutable cache — Next.js chunk names include a content hash
            "Cache-Control": "public, max-age=31536000, immutable",
          });
          res.end(content);
          return;
        }
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, () => {
    console.log(
      `> Mama Fern ready on http://${hostname}:${port} (${dev ? "dev" : "production"})`
    );
  });
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

