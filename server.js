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

process.env.NODE_ENV = "production";

console.log(`> Starting Next.js on port ${port}...`);

const child = spawn(process.execPath, [nextBin, "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: "production" },
});

child.on("error", (err) => {
  console.error("❌ Failed to start Next.js:", err);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code || 0);
});

