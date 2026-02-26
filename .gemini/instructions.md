# Google Gemini Instructions — Mama Fern

## Project Context
Mama Fern is a Next.js 15 headless e-commerce storefront for a family apparel brand. The store uses Shopify as the commerce backend through a custom adapter layer that enables future backend flexibility.

**Mission:** Sell grounded, minimal, playful family apparel in natural fabrics (organic cotton) for "crunchy" moms, dads, and kids.

## 🚨 CRITICAL: Shopify Connection Rule

### Most Important Rule in This Codebase
**NEVER use `export const revalidate = X` on pages that fetch Shopify data.**

#### The Problem
On Hostinger (production environment):
- Shopify API credentials are environment variables injected at **runtime**
- ISR (Incremental Static Regeneration) pre-renders pages at **build time**
- Build time = no credentials = API calls fail = broken pages

#### The Solution
**Always use dynamic rendering:**
```typescript
// ✅ CORRECT - Works on Hostinger
export const dynamic = "force-dynamic"

// ❌ WRONG - Breaks Shopify connection
export const revalidate = 60
```

#### Pages That MUST Use force-dynamic
- `src/app/page.tsx` (homepage)
- `src/app/shop/page.tsx` (shop page)
- `src/app/collections/[handle]/page.tsx` (all collections)
- `src/app/product/[handle]/page.tsx` (all products)
- Any page calling `commerceClient` methods

#### Reference
See `HOSTINGER_DEPLOYMENT_FIX.MD` for the full incident log and fix.

## Architecture Overview

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + shadcn/ui |
| State | Jotai (cart) + TanStack Query (server) |
| Commerce | Shopify Storefront API (GraphQL) |
| Deployment | Hostinger VPS (Node.js + PM2) |
| Testing | Vitest + React Testing Library |

### Commerce Adapter Pattern
**Core Principle:** Isolate all platform-specific code in `src/lib/commerce/[platform]/`

This allows swapping Shopify for another backend (WooCommerce, Medusa, etc.) without touching components.

**Structure:**
```
src/lib/commerce/
├── index.ts           # Exports commerceClient
├── types.ts           # Platform-agnostic types (CommerceProduct, etc.)
└── shopify/
    └── client.ts      # Shopify Storefront API implementation
```

**Usage Pattern:**
```typescript
// ✅ In all components and pages
import { commerceClient } from "@/lib/commerce"

// ❌ NEVER import directly from shopify/
import { shopifyClient } from "@/lib/commerce/shopify/client"
```

### Directory Organization
```
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, etc.)
│   ├── view/               # Feature components (ProductCard, Cart, Hero)
│   └── seo/                # SEO components (JsonLd, Breadcrumbs, etc.)
├── lib/
│   ├── commerce/           # ⚠️ Commerce adapter (Shopify abstraction)
│   ├── seo.ts              # SEO utilities (buildMetadata, etc.)
│   ├── blog.ts             # MDX blog engine
│   └── utils.ts            # General utilities (cn, etc.)
├── hooks/                  # React hooks (useCart, etc.)
├── types/                  # TypeScript type definitions
└── content/                # MDX content (blog posts)
```

## Brand Identity

### Color Palette
Use semantic Tailwind classes:
```typescript
'cream'      // #FAF7F2 - Base background
'oat'        // #F2EDE4 - Secondary background
'fern'       // #4A7C59 - Primary brand green
'sage'       // #8FAF8B - Muted green
'terracotta' // #C97B5A - Warm accent
'blush'      // #E8B4A0 - Soft accent
'warm-brown' // #7A5C44 - Accent/text
'charcoal'   // #2C2C2C - Primary text
```

### Typography
- **Body:** DM Sans (clean sans-serif)
- **Display:** Playfair Display (elegant serif for logo and headings)

### Brand Voice
- **Friendly** - Warm without being overly casual
- **Grounded** - Calm, natural, wholesome
- **Minimal** - Clear and straightforward
- **Lightly crunchy** - Natural materials emphasis, not preachy

## Code Standards

### Component Patterns

#### Server Components (Default)
Use for pages and data fetching:
```typescript
export const dynamic = "force-dynamic" // For Shopify pages

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await commerceClient.getProductByHandle(handle)

  if (!product) notFound()

  return <ProductDetail product={product} />
}
```

#### Client Components (Interactive)
Use only when needed:
```typescript
"use client"

export default function AddToCartButton({ variantId }: Props) {
  const { addItem } = useCart()

  const handleAdd = async () => {
    await addItem({ merchandiseId: variantId, quantity: 1 })
  }

  return <button onClick={handleAdd}>Add to Cart</button>
}
```

### TypeScript Conventions
- Use strict mode
- Prefer type inference for simple cases
- Define reusable types in `types.ts` files
- Export types alongside components when needed

### Styling Guidelines
```typescript
// ✅ Use semantic color names from palette
<div className="bg-cream text-charcoal">

// ✅ Use cn() helper for conditional classes
import { cn } from "@/lib/utils"
<button className={cn("base-styles", isActive && "active-styles")}>

// ✅ Extract repeated patterns into components
const Card = ({ children, className }) => (
  <div className={cn("rounded-lg bg-oat p-6 shadow-sm", className)}>
    {children}
  </div>
)
```

### File Naming
- **Components:** PascalCase folders with `index.tsx` (e.g., `ProductCard/index.tsx`)
- **Utilities:** camelCase (e.g., `seo.ts`, `utils.ts`)
- **Pages:** Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)

## Environment Variables

### Server-Only (NO NEXT_PUBLIC_ prefix)
These MUST remain secret:
```bash
SHOPIFY_STORE_API_URL
SHOPIFY_STOREFRONT_ACCESS_TOKEN
BREVO_API_KEY
BREVO_LIST_ID
BREVO_SENDER_EMAIL
CONTACT_TO_EMAIL
```

### Public (NEXT_PUBLIC_ prefix)
Safe to expose to browser:
```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
NEXT_PUBLIC_GA_ID
```

**Never expose Shopify API credentials to the client.**

## SEO Implementation

### Key Features
- Dynamic metadata via `generateMetadata`
- JSON-LD structured data (Product, Organization, BreadcrumbList, Article)
- Dynamic sitemap.xml with ISR (5-min cache)
- robots.txt with AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot)
- OpenGraph images for sharing
- RSS feed for blog
- GEO (Generative Engine Optimization) via `llms.txt` and API endpoints

### SEO Utilities
```typescript
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Page Title",
  description: "SEO description",
  path: "/page-path",
  keywords: ["keyword1", "keyword2"]
})
```

### JSON-LD Structured Data
```typescript
import JsonLd from "@/components/seo/JsonLd"

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  // ... more schema
}

return (
  <>
    <JsonLd data={productSchema} />
    {/* page content */}
  </>
)
```

## Common Development Tasks

### Fetching Products
```typescript
import { commerceClient } from "@/lib/commerce"

// Get single product
const product = await commerceClient.getProductByHandle("product-handle")

// Get collection
const collection = await commerceClient.getCollectionByHandle("collection-handle")

// Get multiple products
const products = await commerceClient.getProducts({ limit: 12 })
```

### Cart Operations
```typescript
"use client"
import { useCart } from "@/hooks/useCart"

function CartComponent() {
  const { items, addItem, updateItem, removeItem } = useCart()

  // Cart operations...
}
```

### Adding a Blog Post
1. Create `src/content/blog/post-slug.mdx`
2. Add frontmatter:
```yaml
---
title: "Post Title"
date: "2026-02-25"
description: "Post description for SEO"
tags: ["tag1", "tag2"]
---
```
3. Write content in MDX (Markdown + JSX)
4. Blog engine auto-generates listing and RSS feed

## Testing

### Commands
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Testing Pattern
- Test files: `*.test.tsx` or `__tests__/*.tsx`
- Mock `commerceClient` for component tests
- Use React Testing Library utilities

## Build & Deployment

### Local Development
```bash
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
```

### Production Deployment (Hostinger)
1. Build: `npm run build` (runs `persist-env.js` + Next.js build)
2. Upload project via SFTP to Hostinger
3. Configure env vars in hPanel or `.env.local`
4. Start with PM2: `pm2 start ecosystem.config.js`
5. Full guide: `HOSTINGER_DEPLOY.md`

### Build Configuration Notes
- Custom `server.js` for HTTP/2 compatibility
- Webpack: 150KB max chunk size (Hostinger nginx requirement)
- Compression disabled in `next.config.ts` (prevents double-gzip)
- `persist-env.js` copies env vars to `.env.local` at build time

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| "Couldn't load collection" | ✅ Ensure pages use `force-dynamic`, not `revalidate` |
| Port conflicts | ✅ Set `PORT=3000` in env vars |
| Missing env vars | ✅ Check `.env.local` or Hostinger hPanel settings |
| ChunkLoadError | ✅ Rebuild with current `next.config.ts` settings |
| SQLite errors (analytics) | ✅ Ensure persistent filesystem (works on VPS, not shared hosting) |
| 502 Bad Gateway | ✅ Check PM2 logs: `pm2 logs mamafern` |

## Key Documentation

### Essential Reading
- **`HOSTINGER_DEPLOYMENT_FIX.MD`** - Shopify connection fix (CRITICAL)
- **`PRD.md`** - Full product requirements and architecture
- **`SEO_IMPLEMENTATION_LOG.md`** - SEO strategy and implementation
- **`SETUP.md`** - Development environment setup

### Reference Docs
- **`MARKETING_PLAN.md`** - Marketing strategy
- **`SHOPIFY_DEV_STRATEGY.md`** - Shopify development guidelines
- **`HOSTINGER_DEPLOY.md`** - Deployment guide

## Development Workflow & Preferences

### Git Workflow
- **Commits:** Larger commits per feature (~1 hour of work)
- **Branching:** Direct to `main` for most changes
- **Feature branches:** Only for side projects or experimental work
- **Commit messages:** Descriptive, explain WHY not just WHAT

Example commit message:
```
feat(checkout): Add express checkout option for returning customers

- Implemented one-click checkout using saved Shopify customer data
- Added address validation with graceful fallback
- Includes accessibility improvements for keyboard navigation

Why: 40% of customers are returning - reducing friction increases conversion
```

### Error Handling Philosophy

**Strict (Throw Errors) - Critical Paths:**
- Product data loading
- Cart operations (add/remove/update)
- Checkout process
- Authentication
- Payment flows

**Graceful (Degrade) - Nice-to-Haves:**
- Product recommendations
- Analytics tracking
- Newsletter signups
- Related products
- Social sharing

**ALWAYS Log Errors (Even When Graceful):**
```typescript
// ✅ Graceful but visible
try {
  recommendations = await commerceClient.getProductRecommendations(id)
} catch (error) {
  console.warn('Recommendations failed:', error) // Must log!
  // Continue without recommendations
}

// ✅ Strict on critical path
const product = await commerceClient.getProductByHandle(handle)
if (!product) notFound() // Must throw
```

### Performance vs. Maintainability

**Default: Prioritize Maintainability**
- Simple, clear, maintainable code
- Easy to modify without breaking
- Avoid clever optimizations that obscure logic

**Optimize When:**
- Unique competitive features
- Identified bottlenecks (via profiling)
- Core user flows (homepage, product, checkout)
- Clear competitive advantage

### Documentation Style (EXTENSIVE)

**Inline documentation is REQUIRED and preferred:**

```typescript
/**
 * Handles adding items to cart with optimistic updates.
 *
 * Flow:
 * 1. Optimistically update UI (instant feedback)
 * 2. Call Shopify API to persist cart changes
 * 3. Revert if API call fails (show error toast)
 *
 * Why optimistic: User research showed perceived performance
 * is more important than actual speed for cart interactions.
 *
 * Related: useCart hook manages cart state (Jotai)
 * Related: CartDrawer component displays the cart UI
 */
async function addToCart(item: CartItem) {
  // Implementation with inline comments explaining WHY
}
```

**Document:**
- WHY decisions were made
- How components relate to each other
- Complex logic and business rules
- Non-obvious behavior
- Future considerations

### Component Architecture

**Prefer: Small, single-purpose components**
```typescript
// ✅ Composable, reusable, maintainable
<ProductPage>
  <ProductGallery images={images} />
  <ProductInfo product={product} />
  <AddToCartButton variant={selectedVariant} />
  <RelatedProducts products={recommendations} />
</ProductPage>
```

**But use what makes sense:**
```typescript
// ✅ Complex feature in single component when appropriate
<CheckoutFlow cart={cart} customer={customer} />
```

**Always document relationships:**
```typescript
/**
 * ProductOptions - Size and color selector component
 *
 * Manages variant selection and communicates with:
 * - ProductInfo (updates price when variant changes)
 * - AddToCartButton (passes selected variant)
 * - ProductGallery (updates images for selected color)
 *
 * State: Local state for selection, lifted to parent on confirm
 */
```

### Managing Dependencies

**Use well-maintained libraries:**
- ✅ Small utilities (date-fns, validator)
- ✅ Established tools (Tailwind, Radix UI, TanStack Query)
- ✅ Focused packages (zod for validation)

**ASK before adding:**
- ❓ New state management (Redux, Zustand, etc.)
- ❓ New UI frameworks (Material UI, Chakra, etc.)
- ❓ Major architectural changes
- ❓ Large packages that significantly change repo

**When in doubt, ask:**
```
"Considering [package] for [feature].
Affects: [what changes].
Alternatives: [other options].
Proceed?"
```

### Feature Deployment

**Feature Flags (For WIP):**
```typescript
// Deploy incomplete features hidden behind env flags
if (process.env.NEXT_PUBLIC_ENABLE_AR_TRYON === 'true') {
  return <ARTryOn product={product} />
}
```

**Branches (For Experiments):**
- Create branch for experimental features
- Test thoroughly before merging
- Merge when stable

### Accessibility (CRITICAL - Legal Liability)

**Context:** E-commerce sites can be sued on day 1 for accessibility violations.

**Required: WCAG AA Compliance**

**Checklist:**
```typescript
// ✅ Semantic HTML
<nav aria-label="Main navigation">
<main>
<footer>

// ✅ Alt text (from Shopify)
<Image src={img.url} alt={img.altText || product.title} />

// ✅ Keyboard accessible
<button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>

// ✅ ARIA labels for icons
<button aria-label="Add to cart">
  <ShoppingCart aria-hidden="true" />
</button>

// ✅ Color contrast (palette is AA compliant)
<p className="text-charcoal bg-cream">

// ✅ Focus indicators
<button className="focus:ring-2 focus:ring-fern">
```

**Never ship without:**
- Keyboard navigation
- Screen reader support
- Proper ARIA labels
- Sufficient contrast
- Semantic HTML

### Commerce Adapter Strategy

**Timeline:** Backend migration in 6-12 months

**Priorities:**
1. **Shopify MUST work flawlessly** (launch is imminent)
2. Keep adapter layer clean for future flexibility

**Approach:**
- Maintain clean adapter interface
- Don't over-engineer for hypothetical migration
- Shopify stability > theoretical flexibility
- Document Shopify-specific quirks in adapter code

```typescript
// ✅ Clean interface, Shopify details hidden
export const commerceClient: CommerceClient = {
  getProductByHandle: shopifyGetProduct,
  // Interface stays stable even if implementation changes
}
```

## Code Patterns to Follow

### ✅ Good Patterns
- Server Components for data fetching
- `force-dynamic` on all Shopify pages
- Import from `@/lib/commerce` (adapter layer)
- Semantic Tailwind color names from palette
- Suspense boundaries for async components
- Type-safe environment variable access
- JSON-LD for structured data
- Platform-agnostic commerce types
- Extensive inline documentation
- Small, focused components
- ALWAYS log errors (even when handling gracefully)
- WCAG AA accessibility compliance
- Simple, maintainable code by default

### ❌ Anti-Patterns (Avoid These)
- Using `revalidate` on Shopify pages
- Importing directly from `@/lib/commerce/shopify/`
- Exposing server-only env vars to client
- Hardcoding Shopify IDs in components
- Client Components for non-interactive features
- Skipping Suspense boundaries
- Inline styles instead of Tailwind
- Bypassing SEO utilities
- Silent error handling (always notify!)
- Skipping accessibility features (legal risk!)
- Adding large dependencies without asking
- Over-engineering for future requirements
- Premature optimization
- Sacrificing Shopify stability

## Working with This Codebase

### Before Making Changes
1. Check if the change affects Shopify data fetching
2. If yes, ensure `force-dynamic` is used
3. Import from commerce adapter layer, not Shopify directly
4. Follow brand color palette and typography
5. Add SEO metadata for new pages

### When Adding Features
1. Determine if Server or Client Component is needed
2. Use commerce adapter for all backend operations
3. Follow existing component structure and naming
4. Add tests for new functionality
5. Update documentation if adding new patterns

### When Debugging
1. Shopify issues → Check `force-dynamic` first
2. Build errors → Check env vars and TypeScript
3. Deployment issues → Check `HOSTINGER_DEPLOY.md`
4. SEO issues → Check `SEO_IMPLEMENTATION_LOG.md`

## Quick Reference

### Import Paths
```typescript
@/components     // UI and view components
@/lib           // Utilities and commerce layer
@/hooks         // React hooks
@/types         // TypeScript types
@/app           // Next.js pages and routes
```

### Common Utilities
```typescript
cn()                    // Conditional classes (from @/lib/utils)
buildMetadata()         // SEO metadata (from @/lib/seo)
commerceClient         // Commerce operations (from @/lib/commerce)
useCart()              // Cart state (from @/hooks/useCart)
```

### Scripts
```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Production server
npm run lint           # ESLint
npm run test           # Vitest tests
npm run codegen        # GraphQL type generation
npm run seo:check      # SEO health check
npm run shopify:token  # Generate Shopify token
```
