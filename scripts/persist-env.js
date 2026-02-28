/**
 * Persist runtime environment variables to .env.local so they survive
 * across Hostinger's build → start process boundary.
 *
 * Hostinger injects panel env vars during `npm run build` but may start
 * the app in a fresh process without them. Next.js automatically loads
 * .env.local at startup, so writing them here bridges the gap.
 *
 * Only writes vars that are currently set and non-empty.
 * Runs as part of the build script: "node scripts/persist-env.js && next build"
 */

const fs = require("fs");
const path = require("path");

const SERVER_VARS = [
  "SHOPIFY_STORE_API_URL",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_BACK_IN_STOCK_LIST_ID",
  "BREVO_SENDER_EMAIL",
  "CONTACT_TO_EMAIL",
  "PORT",
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
  "KEYSTATIC_PASSWORD",
  "NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
  "SITE_PASSWORD",
];

const envPath = path.join(__dirname, "..", ".env.local");

// Preserve any existing .env.local content we didn't write
let existing = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) existing[match[1]] = match[2];
  }
}

// Merge: current env vars take priority
let count = 0;
for (const key of SERVER_VARS) {
  if (process.env[key]) {
    existing[key] = process.env[key];
    count++;
  }
}

const lines = Object.entries(existing).map(([k, v]) => `${k}=${v}`);
fs.writeFileSync(envPath, lines.join("\n") + "\n");

console.log(`✅ persist-env: wrote ${count} env vars to .env.local`);
