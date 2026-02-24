/**
 * Startup wrapper for Hostinger Node.js panel.
 *
 * Hostinger expects a startup file (server.js). This spawns the built-in
 * Next.js production server (`next start`) which is more reliable than a
 * custom http.createServer wrapper.
 *
 * HTTP/2 chunk fixes are handled in next.config.ts:
 *   - compress: false  (prevents double-gzip with nginx)
 *   - maxSize: 150 KB  (keeps JS chunks small)
 */

const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || "3000";
const nextBin = path.join(__dirname, "node_modules", "next", "dist", "bin", "next");

// Ensure production mode
process.env.NODE_ENV = "production";

// Log env var availability for diagnostics
console.log(`> NODE_ENV=${process.env.NODE_ENV}`);
console.log(`> PORT=${port}`);
console.log(`> SHOPIFY_STORE_API_URL=${process.env.SHOPIFY_STORE_API_URL ? "set" : "MISSING"}`);
console.log(`> SHOPIFY_STOREFRONT_ACCESS_TOKEN=${process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "set" : "MISSING"}`);
console.log(`> Starting Next.js on port ${port}...`);

// Don't pass explicit `env` — inherit the parent process environment as-is
const child = spawn(process.execPath, [nextBin, "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  cwd: __dirname,
});

child.on("error", (err) => {
  console.error("❌ Failed to start Next.js:", err);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code || 0);
});

