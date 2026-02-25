/**
 * SEO Health Check — validates the Mama Fern site's SEO implementation.
 * Run: npm run seo:check
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const APP = path.join(SRC, "app");
const PUBLIC = path.join(ROOT, "public");
const CONTENT_BLOG = path.join(ROOT, "content", "blog");

let passed = 0;
let failed = 0;
const issues: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    const msg = detail ? `${name} — ${detail}` : name;
    console.log(`  ❌ ${msg}`);
    issues.push(msg);
    failed++;
  }
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function fileContains(filePath: string, text: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, "utf-8").includes(text);
}

function findPageFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(fullPath));
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      results.push(fullPath);
    }
  }
  return results;
}

console.log("\n🔍 Mama Fern SEO Health Check\n");

// 1. Public assets
console.log("📁 Public Assets");
check("OG image exists", fileExists(path.join(PUBLIC, "og-image.svg")) || fileExists(path.join(PUBLIC, "og-image.jpg")) || fileExists(path.join(PUBLIC, "og-image.png")));
check("llms.txt exists", fileExists(path.join(PUBLIC, "llms.txt")));
check("llms-full.txt exists", fileExists(path.join(PUBLIC, "llms-full.txt")));
check("robots.ts exists", fileExists(path.join(APP, "robots.ts")));
check("sitemap.ts exists", fileExists(path.join(APP, "sitemap.ts")));

// 2. Core SEO files
console.log("\n📄 Core SEO Infrastructure");
check("seo.ts utility exists", fileExists(path.join(SRC, "lib", "seo.ts")));
check("blog.ts utility exists", fileExists(path.join(SRC, "lib", "blog.ts")));
check("JsonLd component exists", fileExists(path.join(SRC, "components", "seo", "JsonLd.tsx")));
check("Breadcrumbs component exists", fileExists(path.join(SRC, "components", "seo", "Breadcrumbs.tsx")));

// 3. Metadata checks on all page files
console.log("\n📝 Page Metadata Coverage");
const pageFiles = findPageFiles(APP);
for (const pageFile of pageFiles) {
  const relative = path.relative(APP, pageFile);
  const content = fs.readFileSync(pageFile, "utf-8");
  const hasMetadata =
    content.includes("export const metadata") ||
    content.includes("export async function generateMetadata") ||
    content.includes("export function generateMetadata");

  // Check for layout.tsx in same directory that might define metadata
  const layoutFile = path.join(path.dirname(pageFile), "layout.tsx");
  const layoutHasMetadata = fs.existsSync(layoutFile) && fs.readFileSync(layoutFile, "utf-8").includes("metadata");

  const clientComponent = content.includes('"use client"') || content.includes("'use client'");

  if (clientComponent && layoutHasMetadata) {
    check(`${relative} metadata (via layout)`, true);
  } else if (relative === "page.tsx") {
    // Root page inherits metadata from root layout.tsx
    check(`${relative} metadata (via root layout)`, true);
  } else if (!hasMetadata && layoutHasMetadata) {
    // Server component without own metadata, but layout provides it
    check(`${relative} metadata (via layout)`, true);
  } else if (clientComponent && !layoutHasMetadata) {
    // Client components in app/ root that have layout.tsx above them still get metadata
    const parentLayout = path.join(path.dirname(path.dirname(pageFile)), "layout.tsx");
    const parentHas = fs.existsSync(parentLayout) && fs.readFileSync(parentLayout, "utf-8").includes("metadata");
    check(`${relative} metadata`, parentHas || hasMetadata, "Client component without metadata export or layout metadata");
  } else {
    check(`${relative} metadata`, hasMetadata);
  }
}

// 4. Blog frontmatter checks
console.log("\n📰 Blog Post Frontmatter");
if (fs.existsSync(CONTENT_BLOG)) {
  const blogFiles = fs.readdirSync(CONTENT_BLOG).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  if (blogFiles.length === 0) {
    check("Blog posts exist", false, "No .mdx/.md files in content/blog/");
  }
  for (const file of blogFiles) {
    const content = fs.readFileSync(path.join(CONTENT_BLOG, file), "utf-8");
    const hasTitle = content.includes("title:");
    const hasDescription = content.includes("description:");
    const hasDate = content.includes("date:");
    const hasTags = content.includes("tags:");
    check(
      `${file} frontmatter`,
      hasTitle && hasDescription && hasDate && hasTags,
      !hasTitle ? "missing title" : !hasDescription ? "missing description" : !hasDate ? "missing date" : "missing tags"
    );
  }
} else {
  check("Blog content directory exists", false, "content/blog/ not found");
}

// 5. JSON-LD on key pages
console.log("\n🏷️  Structured Data (JSON-LD)");
check("Homepage has JSON-LD", fileContains(path.join(APP, "page.tsx"), "JsonLd"));
check("Product page has JSON-LD", fileContains(path.join(APP, "product", "[handle]", "page.tsx"), "JsonLd"));
check("Blog post page has JSON-LD", fileContains(path.join(APP, "blog", "[slug]", "page.tsx"), "JsonLd"));
check("FAQ page has JSON-LD", fileContains(path.join(APP, "faq", "page.tsx"), "JsonLd"));
check("About page has JSON-LD", fileContains(path.join(APP, "about", "page.tsx"), "JsonLd"));
const collectionPage = path.join(APP, "collections", "[handle]", "page.tsx");
check("Collection page has JSON-LD", fileExists(collectionPage) && fileContains(collectionPage, "JsonLd"));

// 6. Performance checks
console.log("\n⚡ Performance");
check("Layout has preconnect for Shopify CDN", fileContains(path.join(APP, "layout.tsx"), "preconnect"));
check("Homepage uses ISR (not force-dynamic)", !fileContains(path.join(APP, "page.tsx"), "force-dynamic"));
check("Shop page uses ISR (not force-dynamic)", !fileContains(path.join(APP, "shop", "page.tsx"), "force-dynamic"));
check("RSS feed exists", fileExists(path.join(APP, "blog", "feed.xml", "route.ts")));

// Summary
console.log("\n" + "─".repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} checks\n`);

if (issues.length > 0) {
  console.log("⚠️  Issues to fix:");
  issues.forEach((issue) => console.log(`   • ${issue}`));
  console.log("");
}

process.exit(failed > 0 ? 1 : 0);
