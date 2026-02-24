/**
 * Custom Node.js server for Hostinger deployment.
 *
 * Usage (after `npm run build`):
 *   node server.js
 *
 * The standalone output from Next.js bundles everything needed.
 * Copy this file into .next/standalone/ alongside the built output,
 * then copy the `public/` and `.next/static/` folders:
 *
 *   cp -r public .next/standalone/public
 *   cp -r .next/static .next/standalone/.next/static
 *   cd .next/standalone && node server.js
 */

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const fs = require("fs");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

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

// Base directory of the standalone bundle (where this server.js lives)
const STANDALONE_DIR = __dirname;

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve /_next/static/ files directly with explicit Content-Length.
      // Hostinger's nginx proxy drops large chunk streams mid-HTTP/2 when
      // the size is unknown. Sending Content-Length up-front prevents this.
      if (pathname && pathname.startsWith("/_next/static/")) {
        const filePath = path.join(
          STANDALONE_DIR,
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
});

