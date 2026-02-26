# Claude Agent Instructions — Mama Fern

This file provides persistent instructions for Claude (Claude Code, Projects, and Chat) when working on the Mama Fern codebase.

## Project Identity
**Mama Fern** is a headless Next.js e-commerce storefront for a family apparel brand focused on grounded, minimal, natural clothing in organic cotton and skin-friendly fabrics.

**Target audience:** Millennial/Gen-Z "crunchy" moms, dads, and families who value natural materials and cozy aesthetics.

## ⚠️ CRITICAL: Shopify Connection Rules

### The Golden Rule: NEVER Use ISR on Shopify Pages
**This is the most important rule in this codebase.**

#### DO NOT:
```typescript
// ❌ WRONG - This BREAKS Shopify connection
export const revalidate = 60
export const revalidate = 300
export const revalidate = 3600
```

#### ALWAYS DO:
```typescript
// ✅ CORRECT - This works on Hostinger
export const dynamic = "force-dynamic"
```

#### Why This Matters
On Hostinger deployment:
1. Environment variables (Shopify API credentials) are injected at runtime
2. ISR (Incremental Static Regeneration) tries to pre-render pages at **build time**
3. Build time = no env vars = Shopify API calls fail = "Couldn't load collection" errors
4. `force-dynamic` = render on each request = env vars available = works ✅

#### Affected Pages (ALL require `force-dynamic`)
- `src/app/page.tsx` - Homepage
- `src/app/shop/page.tsx` - Shop page
- `src/app/collections/[handle]/page.tsx` - Collection pages
- `src/app/product/[handle]/page.tsx` - Product pages
- **Any page that uses `commerceClient` methods**

#### Historical Context
The SEO implementation (Phase 5) initially converted these pages to ISR for performance. This immediately broke the Shopify connection. We reverted to `force-dynamic` and documented the fix in `HOSTINGER_DEPLOYMENT_FIX.MD`.

**If you ever see Shopify connection errors, check these pages first.**

## Architecture Principles

### 1. Commerce Adapter Layer (Critical Pattern)
All Shopify-specific code MUST be isolated in `src/lib/commerce/shopify/`. This allows swapping the backend (e.g., to WooCommerce, Medusa, custom API) without rewriting components.

**Correct Pattern:**
```typescript
// ✅ In components/pages - platform agnostic
import { commerceClient } from "@/lib/commerce"

const product = await commerceClient.getProductByHandle(handle)
```

**Anti-Pattern:**
```typescript
// ❌ NEVER do this - tight coupling to Shopify
import { shopifyClient } from "@/lib/commerce/shopify/client"
```

### 2. Server Components by Default
- Use Server Components for data fetching (product pages, collections)
- Only use Client Components (`"use client"`) for interactivity (cart, form inputs)
- Always wrap async data in Suspense boundaries

### 3. Environment Variable Security
**Server-only secrets (NO `NEXT_PUBLIC_` prefix):**
- `SHOPIFY_STORE_API_URL`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `BREVO_API_KEY`
- Any other API keys

**Public variables (`NEXT_PUBLIC_` prefix):**
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_GA_ID`

**Never expose Shopify credentials to the client.**

## Tech Stack

### Core
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS + shadcn/ui
- **Commerce:** Shopify Storefront API (GraphQL)

### State Management
- **Server State:** TanStack Query (React Query)
- **Client State:** Jotai atoms (cart)
- **Forms:** React Hook Form + Zod

### Development
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + TypeScript
- **GraphQL Codegen:** Generates types from Shopify schema

### Deployment
- **Host:** Hostinger VPS
- **Runtime:** Node.js 20+ with PM2
- **Build:** Custom `server.js` for HTTP/2 compatibility

## Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (force-dynamic)
│   ├── shop/page.tsx             # Shop page (force-dynamic)
│   ├── collections/[handle]/     # Collections (force-dynamic)
│   ├── product/[handle]/         # Products (force-dynamic)
│   ├── blog/                     # MDX-based blog
│   ├── about/                    # Static pages
│   └── api/                      # API routes
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── view/                     # Feature components
│   └── seo/                      # SEO components (JsonLd, Breadcrumbs)
├── lib/
│   ├── commerce/                 # ⚠️ Commerce adapter layer
│   │   ├── index.ts              # Exports commerceClient
│   │   ├── types.ts              # Platform-agnostic types
│   │   └── shopify/              # Shopify implementation
│   ├── seo.ts                    # SEO utilities
│   ├── blog.ts                   # Blog/MDX utilities
│   └── utils.ts                  # General utilities
├── hooks/                        # React hooks
│   └── useCart.ts                # Cart state (Jotai)
├── types/                        # TypeScript types
└── styles/                       # Global CSS
```

## Brand Guidelines

### Visual Identity
**Color Palette:**
| Name | Hex | Usage |
|------|-----|-------|
| `cream` | #FAF7F2 | Base background |
| `oat` | #F2EDE4 | Secondary background |
| `fern` | #4A7C59 | Primary brand green |
| `sage` | #8FAF8B | Muted green |
| `terracotta` | #C97B5A | Warm accent |
| `blush` | #E8B4A0 | Soft accent |
| `warm-brown` | #7A5C44 | Text/details |
| `charcoal` | #2C2C2C | Primary text |

**Typography:**
- **Body:** DM Sans (clean, readable sans-serif)
- **Headings/Display:** Playfair Display (elegant serif)
- **Logo:** "Mama Fern" in Playfair Display

### Voice & Tone
- **Friendly and calm** - Not corporate or overly casual
- **Grounded and natural** - Emphasize materials, comfort, family
- **Lightly "crunchy"** - Natural, wholesome, organic vibes without being preachy
- **Minimal and clear** - No fluff, straightforward product info

### Content Style
- Use natural, warm language
- Highlight fabric quality (organic cotton, skin-friendly)
- Focus on family moments and comfort
- Avoid aggressive sales language

## Coding Standards

### TypeScript
```typescript
// ✅ Prefer type inference for simple cases
const products = await commerceClient.getProducts()

// ✅ Explicit types for complex structures
type ProductPageProps = {
  params: Promise<{ handle: string }>
}

// ✅ Define reusable types in types.ts
import type { CommerceProduct } from "@/lib/commerce/types"
```

### Component Patterns
```typescript
// Server Component (default)
export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await commerceClient.getProductByHandle(handle)

  return <ProductDetail product={product} />
}

// Client Component (interactivity)
"use client"
export default function AddToCartButton({ variantId }: Props) {
  const { addItem } = useCart()
  // ...
}
```

### Styling Conventions
```typescript
// ✅ Use semantic color names
<div className="bg-cream text-charcoal">

// ✅ Use cn() for conditional classes
import { cn } from "@/lib/utils"
<button className={cn("btn", isPrimary && "btn-primary")}>

// ✅ Extract repeated patterns
const CardWrapper = ({ children, className }) => (
  <div className={cn("rounded-lg bg-oat p-6", className)}>
    {children}
  </div>
)
```

## Common Tasks

### Adding a New Product Page Feature
1. Keep Server Component for data fetching
2. Use `force-dynamic` if fetching from Shopify
3. Extract interactive parts to Client Components
4. Import from `@/lib/commerce` (never `@/lib/commerce/shopify`)

### Modifying SEO
1. Update `src/lib/seo.ts` for shared logic
2. Use `buildMetadata()` helper in pages
3. Add JSON-LD schema via `<JsonLd />` component
4. Test sitemap generation: `http://localhost:3000/sitemap.xml`

### Adding a Blog Post
1. Create MDX file in `src/content/blog/`
2. Add frontmatter (title, date, description, tags)
3. Blog engine (`src/lib/blog.ts`) handles parsing
4. RSS feed auto-updates at `/blog/feed.xml`

### Updating Commerce Backend (Future)
1. Create new adapter in `src/lib/commerce/newbackend/`
2. Implement `CommerceClient` interface
3. Update `src/lib/commerce/index.ts` export
4. Frontend requires NO changes (if interface is maintained)

## SEO Strategy

### Implemented Features
- Dynamic metadata on all pages (`generateMetadata`)
- JSON-LD structured data (Product, Organization, BreadcrumbList)
- Dynamic sitemap.xml (ISR cached for 5 minutes)
- robots.txt with AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot)
- OpenGraph images
- Blog RSS feed
- AI-specific endpoints (`/api/brand-context`, `/api/products-feed`)
- `llms.txt` and `llms-full.txt` for GEO (Generative Engine Optimization)

### Key Files
- `src/lib/seo.ts` - SEO utilities
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - robots.txt
- `src/components/seo/JsonLd.tsx` - Schema markup renderer

## Testing

### Run Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Patterns
- Component tests in `__tests__/` or co-located `.test.tsx`
- Mock `commerceClient` for unit tests
- Use React Testing Library patterns

## Build & Deployment

### Local Development
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production server
```

### Deployment to Hostinger
1. Build locally: `npm run build`
2. Upload entire project via SFTP
3. Set env vars in Hostinger hPanel or `.env.local`
4. Start with PM2: `pm2 start ecosystem.config.js`
5. See `HOSTINGER_DEPLOY.md` for full guide

### Build Notes
- `scripts/persist-env.js` copies env vars to `.env.local` at build time
- Custom `server.js` handles HTTP/2 compatibility issues
- Webpack configured for 150KB max chunk size (Hostinger nginx compatibility)

## Troubleshooting

### "Couldn't load collection" Error
✅ **Fix:** Check all Shopify pages use `force-dynamic`, NOT `revalidate`

### Port Conflicts
✅ **Fix:** Ensure `PORT=3000` in env vars matches Hostinger expectations

### Missing Env Vars
✅ **Fix:** Verify `.env.local` exists or hPanel env vars are set

### ChunkLoadError / HTTP/2 Errors
✅ **Fix:** Rebuild with current `next.config.ts` (compression disabled, chunk size limits)

## Key Documentation Files
- `PRD.md` - Product requirements document
- `HOSTINGER_DEPLOYMENT_FIX.MD` - Critical Shopify connection fix
- `SEO_IMPLEMENTATION_LOG.md` - SEO strategy and implementation log
- `SETUP.md` - Development environment setup
- `MARKETING_PLAN.md` - Marketing strategy
- `SHOPIFY_DEV_STRATEGY.md` - Shopify development guidelines

## Development Workflow & Preferences

### Git Workflow
**Commit Strategy:**
- Larger commits per feature (~1 hour of work)
- Commits should represent a complete, working feature or fix
- Direct to `main` for most changes
- Feature branches only for side projects or experimental work (Claude Code may create these)

**Commit Message Style:**
```
feat(product): Add fabric details section with care instructions

- Added ProductFabricDetails component with organic cotton info
- Integrated care instructions from Shopify product metafields
- Includes icon set for washing/drying symbols
- Fully accessible with ARIA labels for icon meanings

Why: Customer research showed fabric composition is a key purchase decision factor
```

### Error Handling Strategy

**Critical Paths (Strict - Throw Errors):**
- Product data fetching (404 if product not found)
- Cart operations (user MUST know if add-to-cart failed)
- Checkout process (any failure must be visible)
- Authentication/account operations
- Payment-related functionality

**Nice-to-Have Features (Graceful, but NOTIFY):**
- Product recommendations (continue without if API fails)
- Analytics tracking (log error, don't break page)
- Newsletter signup (show error to user, page continues)
- Related products (hide section if fetch fails)

**Golden Rule: ALWAYS notify of errors, even when handling gracefully**
```typescript
// ✅ Graceful degradation with visibility
try {
  recommendations = await commerceClient.getProductRecommendations(product.id)
} catch (error) {
  console.warn('Product recommendations failed:', error) // ALWAYS log!
  // Continue without recommendations - non-critical feature
}

// ✅ Strict error handling on critical path
const product = await commerceClient.getProductByHandle(handle)
if (!product) {
  notFound() // Critical - must throw
}
```

### Performance vs. Maintainability

**Default Approach: Maintainability First**
- Write simple, clear, maintainable code
- Avoid clever optimizations that make code hard to understand
- Code should be resilient to small modifications
- Prioritize readability over micro-optimizations

**When to Optimize for Performance:**
- Unique competitive features (e.g., virtual try-on, custom product builder)
- Known bottlenecks identified through profiling
- Core user flows (homepage, product pages) where speed matters
- When it's a clear differentiator for the brand

**Balance:**
```typescript
// ✅ Simple, maintainable (default)
const products = items.filter(item => item.available)

// ✅ Optimized for special feature (when justified)
// This custom matching algorithm is a key differentiator
// for our "Complete the Family Look" feature
const matches = useOptimizedFamilyMatcher(product, catalog)
```

### Documentation Standards

**EXTENSIVE inline documentation is preferred and expected:**

```typescript
// ✅ Good - Explains WHY and relationships
/**
 * Fetches product recommendations from Shopify.
 * This uses Shopify's built-in recommendation engine which considers:
 * - Products from same collection
 * - Products frequently bought together
 * - Similar price points
 *
 * Note: This is a non-critical feature. If it fails, we gracefully
 * hide the "Complete the Family Look" section rather than breaking
 * the page, but we still log the error for monitoring.
 *
 * Related: ProductDetail component renders this section
 * Related: RelatedProducts component displays the results
 */
async function getRecommendations(productId: string) {
  // implementation
}
```

**Documentation helps with:**
- Understanding the codebase quickly
- Explaining component relationships
- Documenting WHY decisions were made
- Making maintenance easier months later

### Component Architecture

**Preferred: Small, single-purpose components**
```typescript
// ✅ Good - Small, focused, reusable
<ProductCard product={product} />
<AddToCartButton variantId={variant.id} />
<ProductImages images={product.images} />
```

**But use what makes sense:**
```typescript
// ✅ Also fine - Complex feature needs more context in one place
<CheckoutFlow cart={cart} onComplete={handleComplete} />
```

**Document component relationships:**
```typescript
/**
 * ProductDetail - Main product page component
 *
 * Composed of:
 * - ProductGallery (image carousel)
 * - ProductInfo (title, price, description)
 * - ProductOptions (size/color selectors) -> communicates with cart
 * - ProductFabricDetails (organic cotton info, care instructions)
 * - RelatedProducts (fetched separately, gracefully fails)
 *
 * This is a Server Component that fetches product data, then
 * passes it down to client components for interactivity.
 */
```

### Managing Dependencies

**Use well-maintained libraries to move faster:**
- Date libraries (date-fns, dayjs)
- Validation (zod - already included)
- UI utilities (clsx, tailwind-merge - already included)
- Small focused packages

**ASK BEFORE adding large dependencies:**
- New state management libraries (Redux, Zustand, MobX)
- New UI frameworks (Chakra, Ant Design, etc.)
- Major build tool changes
- Database/ORM libraries
- Authentication providers
- Any package that significantly changes architecture

**How to ask:**
```
"I'm considering adding [package name] for [feature].
This would change [what it affects].
Alternatives: [other options considered].
Should I proceed?"
```

### Feature Development & Deployment

**Feature Flags (Preferred for WIP features):**
```typescript
// Deploy incomplete features hidden behind flags
const ENABLE_VIRTUAL_TRYON = process.env.NEXT_PUBLIC_ENABLE_VIRTUAL_TRYON === 'true'

if (ENABLE_VIRTUAL_TRYON) {
  return <VirtualTryOn product={product} />
}
```

**Branches (For experimentation):**
- Create separate branch for experimental features
- Merge when stable and tested
- Claude Code may create feature branches for side projects

**Testing:**
- Build tests alongside features, don't wait
- Test critical paths thoroughly
- Nice-to-have features can have lighter testing

### Accessibility Requirements (CRITICAL)

**Legal Context:** E-commerce sites can be sued on day 1 for accessibility violations.

**Required Standards: WCAG AA compliance**

**Must-haves:**
```typescript
// ✅ Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/shop">Shop</a></li>
  </ul>
</nav>

// ✅ Alt text on images (from Shopify)
<Image
  src={image.url}
  alt={image.altText || product.title}
/>

// ✅ Keyboard navigation
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>

// ✅ ARIA labels for icons
<button aria-label="Add to cart">
  <ShoppingCart aria-hidden="true" />
</button>

// ✅ Color contrast from palette (all colors are AA compliant)
<p className="text-charcoal bg-cream"> // High contrast
```

**Checklist for new components:**
- [ ] Semantic HTML elements
- [ ] Keyboard accessible
- [ ] Screen reader friendly (ARIA labels)
- [ ] Sufficient color contrast
- [ ] Focus states visible
- [ ] Form labels properly associated
- [ ] Error messages announced

### Commerce Adapter Maintenance

**Timeline:** Backend migration likely in 6-12 months

**Priority Balance:**
1. **Primary:** Shopify MUST work flawlessly for launch and first few months
2. **Secondary:** Keep adapter layer clean for future migration

**Approach:**
```typescript
// ✅ Maintain abstraction, but don't over-engineer
export interface CommerceClient {
  getProductByHandle(handle: string): Promise<CommerceProduct | null>
  // Keep interface clean and stable
}

// ✅ Shopify implementation can be Shopify-specific internally
// lib/commerce/shopify/client.ts
async getProductByHandle(handle: string) {
  // Shopify-specific GraphQL queries are fine here
  // This is isolated and swappable
}
```

**Don't sacrifice Shopify stability for theoretical future migration.**

## Working with Claude Code

When using Claude Code specifically:
1. **Always check for Shopify connection issues first** if pages aren't loading
2. **Reference this file** when uncertain about patterns
3. **Ask before** converting pages to ISR - it will break Shopify
4. **Maintain the commerce adapter layer** - never bypass it
5. **Update memory files** when learning new patterns or fixing bugs
6. **Commit strategy:** Work for ~1 hour on a feature, then commit when working
7. **Ask before adding large dependencies** that change repo architecture
8. **Document extensively** - inline comments help everyone understand the code
9. **Accessibility is non-negotiable** - legal liability if skipped
10. **Prefer simple, maintainable code** over clever optimizations

## Anti-Patterns (Things to Avoid)

❌ Using ISR (`revalidate`) on Shopify pages
❌ Importing from `@/lib/commerce/shopify/` in components
❌ Exposing server-only env vars to client
❌ Hardcoding Shopify-specific IDs outside adapter layer
❌ Creating Client Components for non-interactive features
❌ Skipping Suspense boundaries for async components
❌ Writing inline styles instead of Tailwind classes
❌ Bypassing SEO utilities (`buildMetadata`, `JsonLd`)
❌ Committing `.env.local` (use `.env.example` instead)
❌ Silent error handling (always log errors, even when graceful)
❌ Skipping accessibility features (legal liability!)
❌ Adding large dependencies without asking
❌ Over-engineering for hypothetical future requirements
❌ Optimizing before identifying actual bottlenecks
❌ Sacrificing Shopify stability for theoretical backend migration

## Questions? Check These First
1. Shopify not connecting → `HOSTINGER_DEPLOYMENT_FIX.MD`
2. SEO implementation → `SEO_IMPLEMENTATION_LOG.md`
3. Commerce patterns → `PRD.md` Section 8
4. Deployment issues → `HOSTINGER_DEPLOY.md`
5. Brand guidelines → `PRD.md` Section 2
