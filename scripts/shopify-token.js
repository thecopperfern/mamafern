#!/usr/bin/env node
/**
 * Refreshes the Shopify Admin API access token in .env.local
 * Tokens expire every 24 hours.
 *
 * Usage: node scripts/shopify-token.js
 */

const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(__dirname, "../.env.local");

function readEnv() {
  return fs.readFileSync(ENV_PATH, "utf8");
}

function getEnvVar(content, key) {
  const match = content.match(new RegExp(`^${key}=(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

async function refreshToken() {
  const env = readEnv();
  const clientId = getEnvVar(env, "SHOPIFY_CLIENT_ID");
  const clientSecret = getEnvVar(env, "SHOPIFY_CLIENT_SECRET");
  const domain = "mama-fern.myshopify.com";

  if (!clientId || !clientSecret) {
    console.error("Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET in .env.local");
    process.exit(1);
  }

  console.log("Requesting new Shopify Admin API token...");

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("Failed to get token:", data);
    process.exit(1);
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
  const updated = env.replace(
    /^SHOPIFY_ADMIN_ACCESS_TOKEN=.+$/m,
    `SHOPIFY_ADMIN_ACCESS_TOKEN=${data.access_token}`
  );

  fs.writeFileSync(ENV_PATH, updated, "utf8");

  console.log(`Token refreshed successfully.`);
  console.log(`New token: ${data.access_token}`);
  console.log(`Expires:   ${expiresAt}`);
}

refreshToken().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
