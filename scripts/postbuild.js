/**
 * Post-build script — copies static assets, server.js, and ecosystem.config.js
 * into the .next/standalone/ bundle so a single `npm run build` produces a
 * deployment-ready folder.
 *
 * Hostinger's Node.js hosting runs `npm run build` then `npm start`, so
 * everything must be self-contained after build.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const STANDALONE = path.join(ROOT, ".next", "standalone");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  ⚠ Skipping (not found): ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  ⚠ Skipping (not found): ${src}`);
    return;
  }
  fs.copyFileSync(src, dest);
}

console.log("📦 Post-build: packaging standalone bundle...");

// 1. Copy public/ → .next/standalone/public/
console.log("  → Copying public/");
copyDir(path.join(ROOT, "public"), path.join(STANDALONE, "public"));

// 2. Copy .next/static/ → .next/standalone/.next/static/
console.log("  → Copying .next/static/");
copyDir(
  path.join(ROOT, ".next", "static"),
  path.join(STANDALONE, ".next", "static")
);

// 3. Copy server.js
console.log("  → Copying server.js");
copyFile(path.join(ROOT, "server.js"), path.join(STANDALONE, "server.js"));

// 4. Copy ecosystem.config.js
console.log("  → Copying ecosystem.config.js");
copyFile(
  path.join(ROOT, "ecosystem.config.js"),
  path.join(STANDALONE, "ecosystem.config.js")
);

console.log("✅ Standalone bundle ready at .next/standalone/");
