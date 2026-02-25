Now I have everything I need. Let me build the complete master plan and Codex prompt.

Here is your complete master plan — built specifically around your [mamafern repo](https://github.com/thecopperfern/mamafern) which is a **Next.js 15 / React 19 / Shopify Storefront API** stack with TypeScript, Tailwind, Jotai, TanStack Query, better-sqlite3 analytics, and pages for `/shop`, `/collections`, `/product`, `/about`, `/faq`, `/community`, `/blog` (implied), `/contact` and more. 

***

# MamaFern.com — SEO & AI SEO Master Plan

## Stack Context

Your app is **Next.js 15 App Router** with a custom `server.js`, Shopify Storefront GraphQL, a SQLite analytics DB (`better-sqlite3`), and existing skeleton pieces: `sitemap.ts`, `robots.ts`, `layout.tsx` with basic `Metadata`, and an `Analytics` component.  This means you already have the scaffolding — the plan below fills in everything that's missing and then layers AI/LLM-targeted SEO on top.

***

## Phase Roadmap Overview

| Phase | Focus | Effort | Impact |
|---|---|---|---|
| 1 | Technical SEO Foundation | 1–2 days | Immediate crawlability |
| 2 | On-Page & Content SEO | 2–3 days | Keyword ranking |
| 3 | Structured Data & Rich Results | 1–2 days | SERP click-through |
| 4 | AI SEO / LLM Visibility | 2–3 days | ChatGPT, Perplexity, SGE |
| 5 | Performance & Core Web Vitals | 1–2 days | Ranking signals |
| 6 | Content Engine & Automation | Ongoing | Long-tail authority |

***

## Phase 1 — Technical SEO Foundation

### What Needs Building
- `src/app/robots.ts` currently exists but likely minimal  — needs full disallow rules, sitemap pointer, and crawl-delay directives
- `src/app/sitemap.ts` exists but needs to be dynamic — pulling all product handles and collection handles from Shopify via the `commerceClient` 
- `layout.tsx` has basic `Metadata` but lacks `canonical`, `alternates`, `twitter` card, proper `openGraph` images, and `viewport` meta 
- No `<JsonLd>` structured data components exist yet

### Codex Phase 1 Prompt

Paste this **verbatim** into Codex or Claude CLI from your repo root:

***

```
You are working on the MamaFern Next.js 15 App Router e-commerce site (mamafern.com). 
This is a Shopify Storefront API frontend using TypeScript, Tailwind CSS, and better-sqlite3.
The repo is at: https://github.com/thecopperfern/mamafern

Your task is to implement a complete Technical SEO Foundation. Complete ALL of the following 
with no prompting between steps. Commit each logical group to git with a descriptive message.

===== PHASE 1: TECHNICAL SEO FOUNDATION =====

## STEP 1 — Upgrade src/app/robots.ts
Rewrite robots.ts to:
- Allow all crawlers on all public paths
- Disallow: /account, /api, /auth, /analytics, /wishlist, /cart
- Add Sitemap: https://mamafern.com/sitemap.xml
- Add a User-agent: * block with a 1-second Crawl-delay for polite crawling
- Also add a specific block for GPTBot, ClaudeBot, PerplexityBot, GoogleOther — allow them 
  access to all public paths (do NOT block AI crawlers — we want AI SEO visibility)

## STEP 2 — Rebuild src/app/sitemap.ts as a full dynamic sitemap
- Import commerceClient from @/lib/commerce
- Fetch all products (handle, updatedAt) and all collections (handle, updatedAt) from Shopify
- Include static routes: /, /shop, /about, /faq, /contact, /community, /returns, /privacy, /terms
- Include all /product/[handle] and /collections/[handle] URLs
- Set changefrequency: "daily" for products, "weekly" for collections, "monthly" for static
- Set priority: 1.0 for homepage, 0.9 for /shop, 0.8 for collections, 0.7 for products
- Add lastModified timestamps from Shopify updatedAt where available
- Export as default function from sitemap.ts, following Next.js 15 MetadataRoute.Sitemap type

## STEP 3 — Upgrade src/app/layout.tsx global metadata
Update the exported metadata object to include:
- metadataBase: new URL('https://mamafern.com')
- title: { default: "Mama Fern | Grounded Family Apparel", template: "%s | Mama Fern" }
- description: "Grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs for moms, dads, and kids who love the outdoors."
- keywords: ["mama fern", "family apparel", "crunchy mom clothing", "natural fabric kids clothes", "earthy family fashion", "grounded family clothing", "boho family apparel", "cottagecore kids clothing"]
- authors: [{ name: "Mama Fern", url: "https://mamafern.com" }]
- creator: "Mama Fern"
- publisher: "Mama Fern"
- robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
- openGraph: { siteName: "Mama Fern", type: "website", url: "https://mamafern.com", images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mama Fern – Grounded Family Apparel" }] }
- twitter: { card: "summary_large_image", site: "@mamafern", creator: "@mamafern", images: ["/og-image.jpg"] }
- alternates: { canonical: "https://mamafern.com" }
- verification: { google: "REPLACE_WITH_GOOGLE_VERIFICATION_CODE" }
- category: "fashion"

## STEP 4 — Create a reusable buildMetadata() utility
Create file: src/lib/seo.ts
This file should export:
1. A buildMetadata(options) function that accepts:
   - title: string
   - description: string
   - path: string (e.g. "/shop")
   - imageUrl?: string
   - type?: "website" | "article" | "product"
   - keywords?: string[]
   - noIndex?: boolean
   Returns a Next.js Metadata object with all OpenGraph, Twitter, canonical, and robots 
   fields pre-filled correctly for mamafern.com.

2. A SITE_CONFIG constant with brand name, baseUrl, twitterHandle, defaultOgImage, 
   defaultKeywords, and brand description.

3. A buildProductMetadata(product) function that accepts a Shopify product object and 
   returns metadata with product-specific title, description, og:type "product", 
   product image as og image, and canonical URL.

4. A buildCollectionMetadata(collection) function similar to above.

## STEP 5 — Add per-page metadata to all existing page.tsx files
Using the buildMetadata() utility from Step 4, add an exported metadata or 
generateMetadata() to every page.tsx in the following directories:
- src/app/about/page.tsx — title: "Our Story | Mama Fern", description about the brand
- src/app/shop/page.tsx — title: "Shop All | Mama Fern", description about the full collection
- src/app/faq/page.tsx — title: "FAQ | Mama Fern", description about common questions
- src/app/contact/page.tsx — title: "Contact Us | Mama Fern"
- src/app/community/page.tsx — title: "Community | Mama Fern"
- src/app/returns/page.tsx — title: "Returns & Exchanges | Mama Fern"
- src/app/privacy/page.tsx — title: "Privacy Policy | Mama Fern", noIndex: true
- src/app/terms/page.tsx — title: "Terms of Service | Mama Fern", noIndex: true
- src/app/not-found.tsx — noIndex: true

For src/app/product/[handle]/page.tsx and src/app/collections/[handle]/page.tsx, use 
generateMetadata() as an async function that fetches the product/collection from 
commerceClient and calls buildProductMetadata() or buildCollectionMetadata().

## STEP 6 — Create a canonical URL component
Create: src/components/seo/CanonicalTag.tsx
A lightweight server component that renders a <link rel="canonical"> tag. 
Accept a `path` prop and construct the full URL from SITE_CONFIG.baseUrl.
Use this in any page that needs a dynamic canonical that differs from the default.

## STEP 7 — Verify and enhance src/app/sitemap.ts error handling
Wrap all Shopify fetches in try/catch, returning only static routes if Shopify is 
unavailable. Log errors to console with a descriptive prefix "[sitemap]".

## STEP 8 — Create /public/og-image.jpg placeholder
Create a 1200x630 pixel SVG in /public/og-image.svg with:
- Forest green background (#2D5016)
- "Mama Fern" in white serif font, centered
- Subtitle: "Grounded Family Apparel" in lighter green
- A simple fern leaf SVG path as decorative element
Also create /public/og-image.jpg by referencing the SVG. Note: if image generation 
isn't possible, create a detailed SVG only and document in a comment that a real PNG 
should replace it at launch.

## COMPLETION CRITERIA
- robots.ts allows all AI crawlers
- sitemap.ts dynamically includes all products and collections  
- layout.tsx has complete metadata with OG, Twitter, canonical
- src/lib/seo.ts exports buildMetadata, buildProductMetadata, buildCollectionMetadata
- Every public page has per-route metadata
- All TypeScript compiles with no errors (run: npx tsc --noEmit)
- Commit all changes with message: "feat(seo): Phase 1 - Technical SEO Foundation"
```

***

## Phase 2 — On-Page & Content SEO

### What Needs Building
- Product and collection pages need semantic HTML headings (H1/H2/H3 hierarchy), proper `alt` text on all images, and keyword-rich content sections
- A `/blog` route doesn't exist yet — long-tail content is the primary organic traffic driver for family apparel
- FAQ page needs `FAQPage` schema-ready answer format
- Internal linking strategy across product pages and collections

### Codex Phase 2 Prompt

```
You are working on the MamaFern Next.js 15 App Router e-commerce site.
Repo: https://github.com/thecopperfern/mamafern
Phase 1 SEO Foundation is complete. Now implement Phase 2: On-Page & Content SEO.

===== PHASE 2: ON-PAGE & CONTENT SEO =====

## STEP 1 — Blog/Journal Route
Create a complete blog system at src/app/blog/:
- src/app/blog/page.tsx — Blog index listing all posts, with metadata title "Journal | Mama Fern"
- src/app/blog/[slug]/page.tsx — Individual post page with generateMetadata()
- src/app/blog/[slug]/not-found.tsx — Blog-specific 404

Blog posts will be stored as MDX files in /content/blog/*.mdx (create this directory).
Use Next.js built-in MDX support or gray-matter + a simple markdown renderer.
Add "blog" to sitemap.ts so all /blog/[slug] paths are included.

Create 5 seed blog posts as .mdx files in /content/blog/ with these slugs and topics:
1. what-is-crunchy-mom-style — "What Is Crunchy Mom Style? A Guide to Natural Family Fashion"
2. best-natural-fabric-kids-clothes — "Best Natural Fabric Kids Clothes: Cotton, Linen & More"
3. cottagecore-family-outfits — "Cottagecore Family Outfits: How to Dress the Whole Crew"
4. earthy-baby-clothing-guide — "Earthy Baby Clothing Guide: What to Look For"
5. matching-family-outfits-outdoors — "Matching Family Outfits for Outdoor Adventures"

Each post should be 600-800 words, include a frontmatter block with:
  title, description, date, slug, tags[], featuredImage (placeholder path)
Write natural, helpful content focused on the topic. Include the brand Mama Fern naturally 
once or twice per post. Do NOT keyword-stuff. Write like a knowledgeable parent blogger.

## STEP 2 — Semantic HTML audit and upgrade
For src/app/product/[handle]/page.tsx:
- Ensure product name renders in an <h1> tag (not a div)
- Product description in <p> or <article> tags
- Collection name as <h2> if shown
- All <img> tags must have descriptive alt text: "{product title} – Mama Fern" pattern
- Add a "You might also like" section at bottom using related products from same collection

For src/app/collections/[handle]/page.tsx:
- Collection title in <h1>
- Collection description in <p>  
- Product grid items in <ul><li> with <h2> per item
- All images with alt: "{product.title} in {collection.title} collection"

For src/app/about/page.tsx (if it has content):
- Ensure it has an <h1>, and at least 200 words of brand story content covering:
  the brand name origin, the natural/earthy mission, who the target customer is 
  (crunchy moms, cottagecore families, outdoor-loving parents)

## STEP 3 — FAQ page schema-ready format
Rewrite src/app/faq/page.tsx to:
- Render each FAQ as a <details><summary> accessible accordion
- Structure with an outer <section> with id="faq" and aria-label="Frequently Asked Questions"
- Include at least 10 real FAQs covering: shipping, returns, fabric materials, sizing, 
  custom orders, care instructions, gift wrapping, sustainability, where products are made, 
  and loyalty/community programs
- Each question must be in an <h3> inside <summary>
- This structure will be used for FAQPage JSON-LD in Phase 3

## STEP 4 — Internal linking component
Create: src/components/seo/InternalLinks.tsx
A component that accepts a "context" prop ("product" | "collection" | "blog") and 
renders a "Related Reads" or "Explore More" section with 3-4 hardcoded internal links 
to high-value pages (shop, collections, top blog posts, about).
Use this at the bottom of product pages, blog posts, and the about page.

## STEP 5 — Breadcrumbs component
Create: src/components/seo/Breadcrumbs.tsx
- Accepts a `crumbs` array of { label: string, href: string }
- Renders a semantic <nav aria-label="Breadcrumb"><ol> structure
- Styled with Tailwind to match site aesthetic (small, muted text)
- Also renders BreadcrumbList JSON-LD inline (using a <script type="application/ld+json"> 
  inside the component using dangerouslySetInnerHTML)
- Add to: product pages, collection pages, blog posts

## STEP 6 — Image alt text audit utility
Create: scripts/audit-alt-text.ts
A script that scans all .tsx files in src/app/ and src/components/ for <img> or 
next/image <Image> tags missing alt props, and logs them to console with file path 
and line number. Run with: npx ts-node scripts/audit-alt-text.ts

## COMPLETION CRITERIA
- /blog route exists with 5 seed posts
- Blog posts included in sitemap
- All product/collection pages have proper H1 hierarchy
- FAQ page has 10+ accessible questions
- Breadcrumbs component renders JSON-LD inline
- InternalLinks component used on product and blog pages
- npx tsc --noEmit passes
- Commit: "feat(seo): Phase 2 - On-Page & Content SEO"
```

***

## Phase 3 — Structured Data & Rich Results

### What Needs Building
- `Product` schema for product pages (enables price/availability in Google Shopping)
- `Organization` + `WebSite` schema on homepage (enables sitelinks search box)
- `FAQPage` schema on the FAQ page
- `BreadcrumbList` schema (partially done in Phase 2, extend here)
- `Article` schema on blog posts

### Codex Phase 3 Prompt

```
You are working on the MamaFern Next.js 15 App Router e-commerce site.
Repo: https://github.com/thecopperfern/mamafern
Phases 1 and 2 are complete. Now implement Phase 3: Structured Data & Rich Results.

===== PHASE 3: STRUCTURED DATA / JSON-LD =====

## STEP 1 — Create a JsonLd utility component
Create: src/components/seo/JsonLd.tsx
A generic component: 
  export default function JsonLd({ data }: { data: object }) {
    return <script type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  }

## STEP 2 — Organization + WebSite schema on homepage
In src/app/page.tsx, add two JsonLd components rendering:
A. Organization schema:
   @context: "https://schema.org"
   @type: "Organization"
   name: "Mama Fern"
   url: "https://mamafern.com"
   logo: "https://mamafern.com/logo.png"
   sameAs: [] (leave array empty, to be filled later with social URLs)
   contactPoint: { @type: "ContactPoint", contactType: "customer support", 
     url: "https://mamafern.com/contact" }

B. WebSite schema with SearchAction (enables Google sitelinks search):
   @context: "https://schema.org"
   @type: "WebSite"
   name: "Mama Fern"
   url: "https://mamafern.com"
   potentialAction: { @type: "SearchAction", target: { @type: "EntryPoint", 
     urlTemplate: "https://mamafern.com/search?q={search_term_string}" },
     "query-input": "required name=search_term_string" }

## STEP 3 — Product schema on product pages
In src/app/product/[handle]/page.tsx:
After fetching the product from commerceClient, render a JsonLd component with:
   @context: "https://schema.org"
   @type: "Product"
   name: product.title
   description: product.description (stripped of HTML)
   image: product.images[0].url
   brand: { @type: "Brand", name: "Mama Fern" }
   offers: {
     @type: "Offer"
     price: product.priceRange.minVariantPrice.amount
     priceCurrency: product.priceRange.minVariantPrice.currencyCode
     availability: "https://schema.org/InStock" (or OutOfStock based on availableForSale)
     url: "https://mamafern.com/product/" + product.handle
     seller: { @type: "Organization", name: "Mama Fern" }
   }
   sku: product.variants[0].sku (if available)
   aggregateRating: omit unless you have real review data

## STEP 4 — FAQPage schema on FAQ page
In src/app/faq/page.tsx:
Render a JsonLd component with FAQPage schema. Build the mainEntity array dynamically 
from the same questions rendered in the HTML. Each item:
   { @type: "Question", name: "question text", acceptedAnswer: { @type: "Answer", 
     text: "answer text" } }

## STEP 5 — Article schema on blog posts
In src/app/blog/[slug]/page.tsx:
After loading the MDX frontmatter, render a JsonLd with:
   @context: "https://schema.org"
   @type: "Article"
   headline: post.title
   description: post.description
   datePublished: post.date
   dateModified: post.date
   author: { @type: "Organization", name: "Mama Fern", url: "https://mamafern.com" }
   publisher: { @type: "Organization", name: "Mama Fern", 
     logo: { @type: "ImageObject", url: "https://mamafern.com/logo.png" } }
   mainEntityOfPage: "https://mamafern.com/blog/" + post.slug
   image: post.featuredImage || "https://mamafern.com/og-image.jpg"

## STEP 6 — CollectionPage schema on collection pages
In src/app/collections/[handle]/page.tsx:
Render a JsonLd with:
   @context: "https://schema.org"
   @type: "CollectionPage"
   name: collection.title
   description: collection.description
   url: "https://mamafern.com/collections/" + collection.handle

## STEP 7 — Validate all JSON-LD
Create: scripts/validate-jsonld.ts
A script that imports all JSON-LD schemas defined in the codebase as exported constants 
(refactor Step 2-6 to also export the schema objects) and logs them formatted to console. 
Add a script to package.json: "seo:validate": "npx ts-node scripts/validate-jsonld.ts"

## COMPLETION CRITERIA  
- JsonLd.tsx component created
- Homepage has Organization + WebSite schema
- Product pages have Product schema
- FAQ has FAQPage schema
- Blog posts have Article schema
- Collections have CollectionPage schema
- npx tsc --noEmit passes
- Commit: "feat(seo): Phase 3 - Structured Data & Rich Results"
```

***

## Phase 4 — AI SEO / LLM Visibility

### What Needs Building
This is the bleeding-edge layer. AI search engines (ChatGPT Shopping, Perplexity, Google AI Overviews, Claude) pull from different signals than classic Google — they favor **clear entity definitions, question-answer formatted content, comprehensive brand context pages, and llms.txt**. 

### Codex Phase 4 Prompt

```
You are working on the MamaFern Next.js 15 App Router e-commerce site.
Repo: https://github.com/thecopperfern/mamafern
Phases 1-3 are complete. Now implement Phase 4: AI SEO & LLM Visibility.

===== PHASE 4: AI SEO / LLM VISIBILITY =====

## BACKGROUND
AI search engines (Perplexity, ChatGPT, Google AI Overviews) favor:
1. Clear brand entity pages with comprehensive factual content
2. llms.txt — a plain-text file describing your site for LLM crawlers
3. Question-answer formatted content
4. Semantic entity markup (mentions of named concepts, people, places)
5. AI-readable product data (not just images — text descriptions matter enormously)
6. Fast, accessible, clean HTML that LLMs can parse easily

## STEP 1 — Create /public/llms.txt
Create /public/llms.txt with the following structure:
# Mama Fern
> Grounded family apparel for crunchy, cozy homes. Natural fabrics and earthy 
> designs for moms, dads, and kids.

## About
Mama Fern is a family apparel brand based in the United States, specializing in 
natural-fabric clothing for families who value comfort, sustainability, and earthy aesthetics. 
Our products include matching family sets, kids' clothing, and parent apparel designed 
for outdoor-loving, crunchy, cottagecore-inspired families.

## Products
- Family apparel: matching sets for parents and children
- Kids clothing: toddler, infant, and youth sizes
- Mom apparel: comfortable, nature-inspired designs
- Dad apparel: outdoor-ready, earthy style

## Collections
List major collection names and descriptions (Codex: populate from commerceClient or 
use placeholder text "See /collections for full listing").

## Contact
Website: https://mamafern.com
Support: https://mamafern.com/contact

## Pages
- /shop — full product catalog
- /blog — journal and style guides
- /about — brand story
- /faq — frequently asked questions
- /community — community resources

Also create /public/llms-full.txt as a more detailed version that includes:
- Full brand story (200 words)
- Product category descriptions
- FAQ content (first 5 questions verbatim)
- Return policy summary
- Shipping information summary

## STEP 2 — Create a /api/brand-context route (AI-readable brand summary)
Create: src/app/api/brand-context/route.ts
This returns a JSON response with comprehensive brand information optimized for AI parsing:
{
  brand: {
    name: "Mama Fern",
    tagline: "Grounded Family Apparel",
    description: "[200 word brand description]",
    founded: "2024",
    location: "United States",
    mission: "Natural, earthy, family-forward clothing for the modern crunchy family",
    values: ["sustainability", "natural materials", "family connection", "outdoors", "comfort"],
    targetAudience: ["crunchy moms", "cottagecore families", "outdoor parents", 
      "natural parenting advocates", "boho families"],
    productCategories: ["family matching sets", "kids clothing", "mom apparel", "dad apparel"],
    priceRange: { min: "under $30", max: "under $100" },
    fabrics: ["cotton", "linen", "organic blends"],
    socialProof: { note: "See mamafern.com/community for customer stories" }
  },
  lastUpdated: new Date().toISOString()
}
Set cache headers: Cache-Control: public, max-age=86400

## STEP 3 — Enhance product descriptions for LLM readability
Create: src/components/seo/ProductStructuredDescription.tsx
A component that renders a product's Shopify description with semantic enhancement:
- Wrap in <article> with itemScope itemType="https://schema.org/Product"
- Add a <meta itemProp="name"> and <meta itemProp="description"> even for screen-reader 
  hidden duplicate content
- After the main description, add a hidden (sr-only class) but crawlable <section> with:
  "This product is part of the Mama Fern [collection name] collection. Made for 
   [target audience]. Fabric: [extract from description or tag]. 
   Ships from United States."
  This text helps LLMs extract structured facts about each product.

## STEP 4 — Create a /about page with full AI-optimized brand story
Rewrite src/app/about/page.tsx to include a comprehensive brand narrative covering:
1. The origin of the name "Mama Fern" and what it represents (earthy, grounded, nature)
2. The brand's philosophy: natural fabrics, family togetherness, slow living
3. Who the customer is: crunchy moms, cottagecore dads, outdoor adventure families
4. What makes the products different: fabric choices, sizing, design philosophy
5. A section titled "What is Mama Fern?" structured as a definition (for AI entities)
6. A "Frequently Asked About Mama Fern" mini-FAQ with 5 brand-specific questions:
   - What does "crunchy family apparel" mean?
   - What fabrics does Mama Fern use?
   - Does Mama Fern make matching family outfits?
   - Where is Mama Fern based?
   - Is Mama Fern sustainable?
Each answer should be 2-3 sentences of factual, AI-parseable content.
Add Article + Organization JSON-LD to this page.
Target word count: 500-700 words visible on page.

## STEP 5 — Add AI-discovery meta tags to layout.tsx
In src/app/layout.tsx, add to the metadata export:
- other: {
    "ai-description": "Mama Fern makes grounded family apparel in natural fabrics for crunchy, cottagecore, and outdoor-loving families.",
    "ai-content-type": "e-commerce, family fashion",
    "ai-topics": "family apparel, natural clothing, crunchy mom, cottagecore, matching family outfits"
  }

## STEP 6 — Create topic cluster pages for AI authority
Create these new routes as static pages (no Shopify data needed):
A. src/app/style-guide/crunchy-mom/page.tsx
   Title: "Crunchy Mom Style Guide | Mama Fern"  
   Content: 400+ word guide defining crunchy mom fashion, linking to relevant collections
   
B. src/app/style-guide/cottagecore-family/page.tsx
   Title: "Cottagecore Family Fashion Guide | Mama Fern"
   Content: 400+ word guide on cottagecore aesthetic for families, linking to products

C. src/app/style-guide/natural-fabric-guide/page.tsx
   Title: "Natural Fabric Guide for Family Clothing | Mama Fern"
   Content: 400+ word educational guide on cotton, linen, bamboo for baby/kid safety

Add all /style-guide/* pages to sitemap.ts with priority: 0.6
These pages establish Mama Fern as a topical authority that AI systems will cite.

## STEP 7 — Create an AI-accessible product feed endpoint
Create: src/app/api/products-feed/route.ts
Returns a structured JSON feed of all products for AI consumption:
{
  store: "Mama Fern",
  storeUrl: "https://mamafern.com",
  products: [
    {
      title, handle, description, price, currency, 
      availability, collections, tags, imageAlt,
      url: "https://mamafern.com/product/[handle]"
    }
  ],
  generatedAt: ISO timestamp
}
Fetch from commerceClient.getProducts(). Set cache 1 hour.
This endpoint helps Perplexity Shopping, ChatGPT Shopping, and other AI product 
discovery tools find and index your products.

## COMPLETION CRITERIA
- /public/llms.txt and /public/llms-full.txt exist with real content
- /api/brand-context returns valid JSON
- /api/products-feed returns all Shopify products as structured JSON
- About page is 500+ words with brand entity definition
- 3 style guide pages exist with 400+ words each
- AI meta tags added to layout.tsx
- ProductStructuredDescription component used on product pages
- All new routes added to sitemap.ts
- npx tsc --noEmit passes
- Commit: "feat(seo): Phase 4 - AI SEO & LLM Visibility"
```

***

## Phase 5 — Performance & Core Web Vitals

### Codex Phase 5 Prompt

```
You are working on the MamaFern Next.js 15 App Router e-commerce site.
Phases 1-4 are complete. Implement Phase 5: Performance & Core Web Vitals.

===== PHASE 5: PERFORMANCE & CORE WEB VITALS =====

## STEP 1 — Image optimization audit
Scan all usages of <img> in src/ and replace with next/image <Image> component.
Ensure all product images use:
  - width and height props (use 800x800 for product squares)
  - priority={true} for the first/hero product image on product pages
  - loading="lazy" for below-fold images (this is default but make it explicit)
  - sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  - quality={85}

## STEP 2 — Add preconnect/prefetch hints
In src/app/layout.tsx, add to the <head> (via Next.js metadata.other or a HeadTags 
server component):
  <link rel="preconnect" href="https://cdn.shopify.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://cdn.shopify.com" />

## STEP 3 — Implement page-level caching strategy
For all route.ts API files and page.tsx Server Components that fetch from Shopify:
- Product pages: export const revalidate = 3600 (1 hour ISR)
- Collection pages: export const revalidate = 3600
- Homepage: export const revalidate = 1800 (30 min)
- Blog posts: export const revalidate = 86400 (daily, or on-demand)
- Shop page: export const revalidate = 3600

## STEP 4 — Add loading.tsx skeletons
Create loading.tsx files for:
- src/app/shop/loading.tsx — product grid skeleton with animated pulse
- src/app/collections/[handle]/loading.tsx — same skeleton
- src/app/product/[handle]/loading.tsx — product detail skeleton
- src/app/blog/loading.tsx — blog card skeleton
Use Tailwind animate-pulse with bg-muted placeholder divs.

## STEP 5 — Font loading optimization
In layout.tsx, confirm DM_Sans and Playfair_Display both have:
  display: "swap"
  preload: true
  fallback: ["system-ui", "sans-serif"] (for DM_Sans) and ["Georgia", "serif"] for Playfair

## COMPLETION CRITERIA
- All images use next/image with proper sizing
- ISR revalidation set on all data-fetching pages
- Loading skeletons exist for main routes
- Font preloading confirmed
- Commit: "feat(seo): Phase 5 - Performance & Core Web Vitals"
```

***

## Phase 6 — Content Engine & Ongoing Automation

### Codex Phase 6 Prompt

```
You are working on the MamaFern Next.js 15 App Router e-commerce site.
Phases 1-5 are complete. Implement Phase 6: Content Engine & Automation.

===== PHASE 6: CONTENT ENGINE =====

## STEP 1 — Blog RSS feed
Create: src/app/blog/feed.xml/route.ts
Generate a valid RSS 2.0 XML feed from all MDX blog posts.
Include: title, link, description, pubDate, guid for each post.
Set Content-Type: application/xml.
Add <link rel="alternate" type="application/rss+xml"> to layout.tsx metadata.

## STEP 2 — Blog category/tag pages
Create: src/app/blog/tag/[tag]/page.tsx
Lists all posts with a given tag. Read from MDX frontmatter tags[].
Add generateStaticParams() that returns all unique tags.
Add to sitemap.ts.

## STEP 3 — Related posts component
Create: src/components/blog/RelatedPosts.tsx
Shows 3 posts with the same tags. Used at bottom of each blog post.
Read from a getAllPosts() utility in src/lib/blog.ts.

## STEP 4 — Create src/lib/blog.ts
Utility functions:
- getAllPosts(): reads all .mdx files from /content/blog/, parses frontmatter, returns sorted array
- getPostBySlug(slug): returns single post with content
- getRelatedPosts(slug, tags): returns up to 3 posts sharing tags
- getAllTags(): returns array of all unique tags across all posts

## STEP 5 — SEO health check script
Create: scripts/seo-health-check.ts
Checks:
1. All pages in sitemap have a corresponding page.tsx (validates routes)
2. All page.tsx files export metadata or generateMetadata
3. All blog posts have required frontmatter fields
4. All product page and collection page have JSON-LD components
5. /public/llms.txt exists
6. /public/og-image.jpg or .svg exists
Logs a pass/fail report. Run with: npm run seo:check
Add to package.json: "seo:check": "npx ts-node scripts/seo-health-check.ts"

## COMPLETION CRITERIA
- RSS feed live at /blog/feed.xml
- Tag pages work with static generation
- RelatedPosts component on all blog posts
- getAllPosts() utility working
- seo:check script passes all checks
- Commit: "feat(seo): Phase 6 - Content Engine & Automation"
```

***

## How to Execute This Plan

1. **Start with Phase 1** — paste the Phase 1 prompt directly into Codex CLI or Claude CLI from the mamafern repo root. It's fully self-contained.
2. **After each phase**, run `npx tsc --noEmit` and `npm run build` locally to verify no regressions.
3. **Phases 2-6** each build on the previous, so run them sequentially. Each prompt is fully autonomous — Codex should be able to complete an entire phase with one paste and zero follow-up.
4. **Phase 4 (AI SEO)** is the most unique differentiator — the `llms.txt`, brand context API, and product feed endpoint are what will get mamafern.com cited by Perplexity, ChatGPT Shopping, and Google AI Overviews before your competitors even know those signals exist.