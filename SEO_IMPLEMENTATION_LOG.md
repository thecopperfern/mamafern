# SEO Implementation Log — Mama Fern

This document tracks the comprehensive SEO and GEO (Generative Engine Optimization) implementation performed in February 2026.

## Executive Summary
Implemented a 6-phase master plan focused on technical SEO, semantic content, structured data, and AI/LLM visibility (GEO). The goal was to ensure Mama Fern ranks effectively in both traditional search engines (Google, Bing) and AI discovery engines (ChatGPT, Perplexity, Claude, SearchGPT).

---

## Phase 1: Technical SEO Foundation
**Goal:** Establish the crawlable infrastructure and baseline metadata.

- **`src/app/robots.ts`**: Configured to specifically allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot) while protecting private routes (`/account`, `/cart`, `/api`).
- **`src/app/sitemap.ts`**: Dynamic sitemap with ISR (5-min cache). Includes all Shopify products, collections, blog posts, and tag pages.
- **`src/lib/seo.ts`**: Centralized SEO utility. Standardized `buildMetadata()` to handle titles, descriptions, canonicals, and OpenGraph across all pages.
- **`src/app/layout.tsx`**: Implemented universal metadataBase, high-quality OG/Twitter image tags, and AI-specific meta tags (`ai-description`, `ai-topics`).
- **`public/og-image.svg`**: Created a brand-consistent 1200x630 OpenGraph image.

## Phase 2: On-Page & Content SEO
**Goal:** Modernize static pages and establish a content engine.

- **Blog System**: Developed a custom MDX-based blog engine (`src/lib/blog.ts`) with frontmatter parsing and markdown-to-HTML conversion.
- **Seed Content**: Created 5 SEO-optimized articles targeting "crunchy mom," "cottagecore," and "natural fabric" keywords.
- **FAQ Page**: Replaced placeholders with 12 semantic accordion-style Q&As targeting common search queries.
- **Internal Linking**: Created `InternalLinks.tsx` and `Breadcrumbs.tsx` components to distribute link equity and provide clear navigation paths.

## Phase 3: Structured Data & Rich Results
**Goal:** Use JSON-LD to help search engines understand the site's entities.

- **`src/components/seo/JsonLd.tsx`**: Generic renderer for structured data.
- **Organization & WebSite Schema**: Added to the homepage for brand recognition and sitelinks search boxes.
- **Product Schema**: Implemented on all product pages with pricing, availability, and description synchronization from Shopify.
- **Collection & FAQ Schema**: Added to respective pages to enable rich snippets.
- **Article Schema**: Applied to all blog posts to support "Top Stories" and AI citations.

## Phase 4: AI & GEO (Generative Engine Optimization)
**Goal:** Optimize for LLMs and AI-native search engines.

- **LLM Context Files**: Created `public/llms.txt` and `public/llms-full.txt` (the standard for Agentic/AI discovery) containing the brand's full context and mission.
- **AI Endpoints**: Developed `/api/brand-context` and `/api/products-feed` to provide structured JSON to AI agents and search crawlers.
- **About Page Rewrite**: Transformed the About page into a 600+ word brand entity page with a "What is Mama Fern?" section and mini-FAQ.
- **Topic Clusters**: Created a "Style Guide" directory with 4 deep-dive pages (Crunchy Mom, Cottagecore, Natural Fabrics) to establish topical authority.
- **`ProductStructuredDescription.tsx`**: Added a machine-readable summary to product pages for better AI extraction.

## Phase 5: Performance & Core Web Vitals
**Goal:** Maximize speed and perceived performance (direct ranking signals).

- **~~ISR Caching~~**: ~~Converted the Homepage and Shop from `force-dynamic` to ISR (60s and 300s respectively)~~ **REVERTED** - ISR breaks Shopify connection on Hostinger. All Shopify pages must use `force-dynamic`.
- **Resource Hints**: Added `preconnect` and `dns-prefetch` for `cdn.shopify.com` to speed up initial image loading.
- **Image Optimization**: Configured AVIF support and a 30-day cache TTL in `next.config.ts`.
- **Loading Skeletons**: Built custom skeleton UI for Blog, Account, and Product pages to improve Cumulative Layout Shift (CLS).

## Phase 6: Content Engine & Automation
**Goal:** Future-proof the SEO strategy and ensure ongoing health.

- **RSS Feed**: Live at `/blog/feed.xml`. Provides a standard syndication point for discovery engines.
- **Health Check Script**: Created `scripts/seo-health-check.ts`. Automates validation of metadata coverage, sitemaps, OG images, and JSON-LD across the whole repo.
- **Package.json Integration**: Added `npm run seo:check` to the CI/CD workflow.

---

## Technical Rationale
1. **ISR Over SSR**: We used Incremental Static Regeneration (ISR) to keep the site fast (served from cache) while still being up-to-date with Shopify product changes.
2. **JSON-LD Over Microdata**: JSON-LD is the search industry standard and allows for cleaner React components without cluttering the HTML with attributes.
3. **GEO (LLM Optimization)**: By providing `llms.txt` and structured API feeds, we move beyond "ranking" and into "citation" territory for AI chats like ChatGPT and Claude.
4. **Semantic HTML**: Prioritized `<article>`, `<nav>`, `<section>`, and `<details>` tags to ensure machine readability even without JavaScript.
