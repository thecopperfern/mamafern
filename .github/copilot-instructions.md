# GitHub Copilot Instructions — Mama Fern

## Project Overview
Mama Fern is a Next.js 15 (App Router) headless e-commerce storefront for a family apparel brand. The store uses Shopify Storefront API as the backend, with a custom commerce adapter layer for future backend flexibility.

**Brand:** Grounded, minimal, playful, natural family apparel in organic cotton and skin-friendly fabrics.

## Critical Rules ⚠️

### Shopify Connection (CRITICAL)
**DO NOT USE ISR (Incremental Static Regeneration) ON SHOPIFY PAGES**

- ❌ **NEVER** use `export const revalidate = X` on pages that fetch Shopify data
- ✅ **ALWAYS** use `export const dynamic = "force-dynamic"` instead
- **Why:** On Hostinger deployment, env vars are injected at runtime. ISR tries to pre-render pages at build time when env vars aren't available, causing Shopify API connection failures.

**Pages requiring `force-dynamic`:**
- `src/app/page.tsx` (homepage)
- `src/app/shop/page.tsx`
- `src/app/collections/[handle]/page.tsx`
- `src/app/product/[handle]/page.tsx`
- Any other page that calls `commerceClient` methods

### Commerce Adapter Pattern
**ALWAYS import from the adapter layer, NEVER directly from Shopify:**
```typescript
✅ import { commerceClient } from "@/lib/commerce"
❌ import { shopifyClient } from "@/lib/commerce/shopify/client"
```

This abstraction allows swapping the backend (e.g., to WooCommerce, custom API) without changing components.

## Architecture

### Tech Stack
- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State:** Jotai (cart) + TanStack Query (server state)
- **Commerce:** Shopify Storefront API (GraphQL)
- **Deployment:** Hostinger VPS with Node.js + PM2

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── view/              # Feature components (ProductCard, Cart, etc.)
│   └── seo/               # SEO components (JsonLd, Breadcrumbs)
├── lib/
│   ├── commerce/          # ⚠️ Commerce adapter layer (all Shopify logic here)
│   │   ├── index.ts       # Exports commerceClient
│   │   ├── types.ts       # Platform-agnostic commerce types
│   │   └── shopify/       # Shopify-specific implementation
│   ├── seo.ts             # SEO utilities
│   └── blog.ts            # MDX blog engine
├── hooks/                 # React hooks
└── types/                 # TypeScript types
```

### Commerce Adapter Layer
**All Shopify-specific code MUST stay in `src/lib/commerce/shopify/`**

Components should only import from `@/lib/commerce` using the platform-agnostic `commerceClient` interface.

**Key Types:**
- `CommerceProduct` - Platform-agnostic product
- `CommerceCollection` - Platform-agnostic collection
- `CommerceClient` - Interface with methods like `getProductByHandle`, `addToCart`, etc.

## Brand Guidelines

### Color Palette
```typescript
colors: {
  cream: '#FAF7F2',      // Base background
  oat: '#F2EDE4',        // Secondary background
  fern: '#4A7C59',       // Primary green
  sage: '#8FAF8B',       // Muted green
  terracotta: '#C97B5A', // Accent
  blush: '#E8B4A0',      // Soft accent
  'warm-brown': '#7A5C44', // Text/accent
  charcoal: '#2C2C2C',   // Primary text
}
```

### Typography
- **Body:** DM Sans (sans-serif)
- **Display/Headings:** Playfair Display (serif)
- Logo text: "Mama Fern" in display font

### Tone
Friendly, calm, grounded, lightly "crunchy" (natural, wholesome) without being preachy.

## Code Standards

### TypeScript
- Use strict TypeScript
- Prefer type inference where clear
- Define types in `types.ts` files, not inline

### React Components
- Server Components by default (for data fetching)
- Client Components only when needed (`"use client"` for interactivity)
- Use Suspense boundaries for async data

### Styling
- Use Tailwind utility classes
- Extract repeated patterns into components
- Use `cn()` helper from `lib/utils` for conditional classes
- Prefer semantic color names from palette (e.g., `text-charcoal` not `text-gray-800`)

### File Naming
- Components: PascalCase folders with `index.tsx` (e.g., `ProductCard/index.tsx`)
- Utilities: camelCase (e.g., `seo.ts`)
- Pages: Next.js convention (`page.tsx`, `layout.tsx`, `loading.tsx`)

## Environment Variables

### Server-Only (NEVER expose to client)
```bash
SHOPIFY_STORE_API_URL=https://mama-fern.myshopify.com/api/2026-04/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
BREVO_API_KEY=xxx
BREVO_LIST_ID=xxx
BREVO_SENDER_EMAIL=hello@mamafern.com
CONTACT_TO_EMAIL=hello@mamafern.com
```

### Public (prefixed with NEXT_PUBLIC_)
```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mama-fern.myshopify.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Common Patterns

### Fetching Products in Server Component
```typescript
import { commerceClient } from "@/lib/commerce"

export const dynamic = "force-dynamic" // ⚠️ REQUIRED for Shopify pages

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await commerceClient.getProductByHandle(handle)
  // ...
}
```

### Adding to Cart (Client Component)
```typescript
"use client"
import { useCart } from "@/hooks/useCart"

export default function AddToCartButton({ variantId }: Props) {
  const { addItem } = useCart()

  const handleClick = async () => {
    await addItem({ merchandiseId: variantId, quantity: 1 })
  }
  // ...
}
```

### SEO Metadata
```typescript
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Page Title",
  description: "Description for SEO",
  path: "/page-path",
  keywords: ["keyword1", "keyword2"]
})
```

## Testing
- Use Vitest for unit tests
- Run tests: `npm run test`
- Coverage: `npm run test:coverage`

## Deployment Notes
- Build: `npm run build` (includes `persist-env.js` script)
- Start: `npm start` (uses custom `server.js`)
- Deploy to Hostinger via SFTP + PM2
- See `HOSTINGER_DEPLOY.md` for full deployment guide

## Key Documents
- `PRD.md` - Full product requirements
- `HOSTINGER_DEPLOYMENT_FIX.MD` - Shopify connection fix log
- `SEO_IMPLEMENTATION_LOG.md` - SEO strategy documentation
- `SETUP.md` - Development setup instructions

## Development Workflow Preferences

### Git & Commits
- **Commit strategy:** Larger commits per feature (~1 hour of work per commit)
- **Branching:** Direct to `main` for most changes
- **Side projects:** Claude Code may create feature branches for experimentation
- **Commit messages:** Descriptive, explain the "why" not just the "what"

### Error Handling Philosophy
- **Critical paths (checkout, cart, product data):** Strict error handling - throw early and loud
- **Nice-to-haves (analytics, recommendations):** Graceful degradation is acceptable
- **ALWAYS notify of errors** - even if gracefully handled, log warnings/errors for visibility
- **User-facing:** Show friendly messages, log detailed errors for debugging

### Code Complexity
- **Default:** Simple, maintainable, reliable code that won't break easily
- **Special features:** High performance optimization when feature is unique/competitive advantage
- **Tradeoff priority:** Maintainability > Performance (unless feature is critical differentiator)

### Documentation Style
**EXTENSIVE inline documentation is preferred:**
```typescript
// ✅ Document WHY and HOW, especially for complex logic
// This fetches recommendations but gracefully fails if Shopify is slow
// because product recommendations are non-critical to the user journey
try {
  recommendations = await commerceClient.getProductRecommendations(product.id)
} catch (error) {
  console.warn('Recommendations failed:', error) // Still notify!
  // Gracefully continue without recommendations
}
```

- Document complex logic inline
- Explain component relationships and dependencies
- Help future developers (and yourself) understand the codebase
- Explain WHY decisions were made, not just WHAT the code does

### Component Architecture
- **Prefer:** Small, single-purpose components (easier to maintain)
- **But:** Use whatever makes sense for the feature - don't over-engineer
- **Document:** If a component references other features, explain the relationship inline

### Dependencies
- **Use well-maintained libraries** to move faster
- **ASK BEFORE adding** large dependencies that significantly change the repo structure
- Examples that need approval: New state management lib, new UI framework, major build tool changes
- Examples that are fine: Small utilities, date formatters, validation helpers

### Feature Development
- **Feature flags:** Use for deploying incomplete features to production
- **Branches:** Create separate branches for experimental work
- **Testing:** Build alongside new features, don't wait until the end

### Accessibility (CRITICAL)
- **Level:** WCAG AA compliance is ESSENTIAL
- **Reason:** Legal liability - sites can be sued on day 1 for accessibility violations
- **Requirements:**
  - Semantic HTML throughout
  - ARIA labels where needed
  - Keyboard navigation for all interactive elements
  - Alt text on all images
  - Sufficient color contrast (use palette with AA compliance)
  - Screen reader friendly

### Commerce Adapter Priority
- **Timeline:** Backend migration likely in 6-12 months
- **Priority:** Keep adapter layer clean, but Shopify MUST work flawlessly
- **Approach:** Maintain flexibility without sacrificing Shopify stability
- **Reason:** First few months post-launch are critical for testing and customer validation

## Anti-Patterns ❌
- ❌ Using `revalidate` on Shopify pages
- ❌ Importing directly from `@/lib/commerce/shopify/*`
- ❌ Hardcoding Shopify-specific IDs in components
- ❌ Exposing server-only env vars to client
- ❌ Using ISR for pages that fetch Shopify data
- ❌ Bypassing the commerce adapter layer
- ❌ Adding large dependencies without asking first
- ❌ Skipping accessibility features (legal liability!)
- ❌ Silent failures on critical paths (cart, checkout, product loading)
- ❌ Over-engineering simple features with unnecessary abstractions
