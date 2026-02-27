#!/usr/bin/env node

/**
 * Install & configure Shopify's Hydrogen Redirect Theme via Admin GraphQL API.
 *
 * This theme redirects ALL non-checkout traffic on mama-fern.myshopify.com
 * back to mamafern.com. Checkout pages (cart, checkout, orders) are left alone
 * so Shopify's hosted checkout works normally.
 *
 * Prerequisites:
 *   - SHOPIFY_ADMIN_API_URL and SHOPIFY_ADMIN_ACCESS_TOKEN in .env or .env.local
 *   - Admin API token needs scopes: write_themes, read_themes
 *
 * Usage:
 *   node scripts/install-redirect-theme.js
 *
 * What it does:
 *   1. Creates theme from the Hydrogen Redirect Theme GitHub zip
 *   2. Polls until the theme is processed and ready
 *   3. Configures storefront_hostname to mamafern.com
 *   4. Publishes the theme as the live theme
 *
 * Source: https://github.com/Shopify/hydrogen-redirect-theme
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Load env vars from .env.local or .env (same order Next.js uses)
// ---------------------------------------------------------------------------
function loadEnv() {
  const root = path.resolve(__dirname, "..");
  for (const file of [".env.local", ".env"]) {
    const fp = path.join(root, file);
    if (fs.existsSync(fp)) {
      const lines = fs.readFileSync(fp, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

loadEnv();

const ADMIN_URL = process.env.SHOPIFY_ADMIN_API_URL;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const STOREFRONT_HOSTNAME = "mamafern.com";
const THEME_NAME = "Hydrogen Redirect";
const THEME_SOURCE_URL =
  "https://github.com/Shopify/hydrogen-redirect-theme/archive/refs/heads/main.zip";

if (!ADMIN_URL || !ADMIN_TOKEN) {
  console.error(
    "Missing SHOPIFY_ADMIN_API_URL or SHOPIFY_ADMIN_ACCESS_TOKEN.\n" +
      "Set them in .env.local or as environment variables."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// GraphQL helper
// ---------------------------------------------------------------------------
async function adminQuery(query, variables = {}) {
  const res = await fetch(ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin API ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

// ---------------------------------------------------------------------------
// Step 1: Create theme from GitHub zip
// ---------------------------------------------------------------------------
async function createTheme() {
  console.log(`\n1. Creating theme "${THEME_NAME}" from GitHub zip...`);

  const data = await adminQuery(
    `mutation themeCreate($source: URL!, $name: String!) {
      themeCreate(source: $source, name: $name) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { source: THEME_SOURCE_URL, name: THEME_NAME }
  );

  const { theme, userErrors } = data.themeCreate;
  if (userErrors?.length) {
    throw new Error(
      `Failed to create theme: ${userErrors.map((e) => e.message).join(", ")}`
    );
  }

  console.log(`   Theme created: ${theme.id} (role: ${theme.role})`);
  return theme.id;
}

// ---------------------------------------------------------------------------
// Step 2: Poll until the theme is ready
// ---------------------------------------------------------------------------
async function waitForTheme(themeId) {
  console.log("\n2. Waiting for theme to finish processing...");

  const maxAttempts = 30;
  const delayMs = 3000;

  for (let i = 0; i < maxAttempts; i++) {
    const data = await adminQuery(
      `query getTheme($id: ID!) {
        theme(id: $id) {
          id
          name
          role
          processing
        }
      }`,
      { id: themeId }
    );

    const theme = data.theme;
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    if (!theme.processing) {
      console.log("   Theme is ready.");
      return;
    }

    process.stdout.write(`   Still processing (attempt ${i + 1}/${maxAttempts})...\r`);
    await new Promise((r) => setTimeout(r, delayMs));
  }

  throw new Error("Theme processing timed out after 90 seconds");
}

// ---------------------------------------------------------------------------
// Step 3: Configure storefront hostname
// ---------------------------------------------------------------------------
async function configureTheme(themeId) {
  console.log(`\n3. Setting storefront_hostname to "${STOREFRONT_HOSTNAME}"...`);

  const settingsData = JSON.stringify({
    current: {
      storefront_hostname: STOREFRONT_HOSTNAME,
      custom_redirects: "",
      integrate_with_customer_accounts: false,
    },
  });

  const data = await adminQuery(
    `mutation themeFilesUpsert($files: [OnlineStoreThemeFilesUpsertFileInput!]!, $themeId: ID!) {
      themeFilesUpsert(files: $files, themeId: $themeId) {
        upsertedThemeFiles { filename }
        userErrors { field message }
      }
    }`,
    {
      themeId,
      files: [
        {
          filename: "config/settings_data.json",
          body: { type: "TEXT", value: settingsData },
        },
      ],
    }
  );

  const { upsertedThemeFiles, userErrors } = data.themeFilesUpsert;
  if (userErrors?.length) {
    throw new Error(
      `Failed to configure theme: ${userErrors.map((e) => e.message).join(", ")}`
    );
  }

  console.log(`   Updated: ${upsertedThemeFiles.map((f) => f.filename).join(", ")}`);
}

// ---------------------------------------------------------------------------
// Step 4: Publish the theme
// ---------------------------------------------------------------------------
async function publishTheme(themeId) {
  console.log("\n4. Publishing theme as live...");

  const data = await adminQuery(
    `mutation themePublish($id: ID!) {
      themePublish(id: $id) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { id: themeId }
  );

  const { theme, userErrors } = data.themePublish;
  if (userErrors?.length) {
    throw new Error(
      `Failed to publish theme: ${userErrors.map((e) => e.message).join(", ")}`
    );
  }

  console.log(`   Published! Theme "${theme.name}" is now live (role: ${theme.role})`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== Shopify Hydrogen Redirect Theme Installer ===");
  console.log(`Store: ${ADMIN_URL}`);
  console.log(`Redirect target: ${STOREFRONT_HOSTNAME}`);

  const themeId = await createTheme();
  await waitForTheme(themeId);
  await configureTheme(themeId);
  await publishTheme(themeId);

  console.log("\n=== Done! ===");
  console.log(`All non-checkout traffic on your .myshopify.com domain`);
  console.log(`will now redirect to https://${STOREFRONT_HOSTNAME}`);
  console.log(`\nCheckout pages remain on Shopify (no redirect).`);
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
