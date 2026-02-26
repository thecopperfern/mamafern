/**
 * Production server for Hostinger Node.js panel.
 *
 * Runs Next.js in-process (no child process spawning) to ensure all
 * environment variables from Hostinger's panel are available to route
 * handlers and server components.
 */

process.env.NODE_ENV = "production";

// Load .env.local FIRST — persist-env.js writes Shopify credentials here
// during build. This ensures env vars survive Hostinger's process restarts
// even if hPanel doesn't inject them into the runtime environment.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env.local") });

const next = require("next");
const { createServer } = require("http");

const port = parseInt(process.env.PORT || "3000", 10);

// Log env var availability for diagnostics
console.log(`> NODE_ENV=${process.env.NODE_ENV}`);
console.log(`> PORT=${port}`);
console.log(`> SHOPIFY_STORE_API_URL=${process.env.SHOPIFY_STORE_API_URL ? "set" : "MISSING"}`);
console.log(`> SHOPIFY_STOREFRONT_ACCESS_TOKEN=${process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "set" : "MISSING"}`);

const app = next({ dev: false, dir: __dirname, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res))
    .listen(port, "0.0.0.0", () => {
      console.log(`> Mama Fern ready on http://0.0.0.0:${port}`);
    });
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

