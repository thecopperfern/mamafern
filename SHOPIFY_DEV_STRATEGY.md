# MamaFern — Headless Shopify Dev Strategy (No AI Integration)

> Development roadmap for completing the headless Shopify storefront using AI tools (Claude Code) during development only. The live storefront has no AI components — just a clean, fast, hand-crafted e-commerce experience.

---

## The Approach

You build the store. AI helps you write the code faster. The customer never interacts with an AI — they get a normal, well-designed shopping experience.

This is a traditional headless e-commerce build. The advantage is full control: predictable behavior, no API costs per customer interaction, no hallucinated product info, and a simpler codebase to maintain long-term.

---

## 1. Current Codebase State

### What You Have (Strong Foundation)

| Area | Status | Notes |
|------|--------|-------|
| Next.js 15 + App Router | Complete | React 19, TypeScript strict |
| Shopify Storefront GraphQL | Complete | graphql-request + codegen |
| Cart CRUD | Complete | Jotai atoms + localStorage |
| Customer Auth | Complete | Login/Signup + nookies cookies |
| Collections + Pagination | Complete | Cursor-based pagination |
| Product Detail + Variants | Complete | Embla carousel, option selection |
| UI System | Complete | shadcn/ui + Tailwind |
| TanStack Query | Complete | 60s stale time, typed hooks |

### What Is Missing

| Area | Priority | Effort |
|------|----------|--------|
| Checkout page | Critical | Low — checkoutUrl already exists |
| Server-side API proxy | Critical (security) | Low |
| Customer profile page | High | Medium |
| Order history page | High | Medium |
| Search | High | Medium |
| SEO meta tags (dynamic) | High | Low |
| Error boundaries + loading states | Medium | Low |
| Wishlist / saved items | Medium | Medium |
| Product reviews | Medium | Medium |
| Rate limiting on API proxy | Medium | Low |

---

## 2. Critical Security Issue: Fix First

### Problem

Your Shopify Storefront token is exposed to the browser:

```
NEXT_PUBLIC_SHOPIFY_STORE_API_URL
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

`NEXT_PUBLIC_` variables are bundled into client-side JavaScript. Anyone can open DevTools → Network → see the token in request headers. While the Storefront API token has limited scope, exposing it enables:

- Competitors scraping your full product catalog and pricing automatically
- Abuse of your API quota (rate limits hit on your account, not theirs)
- Token rotation forcing a full redeploy every time

### Fix: Next.js Route Handler Proxy

Create `/src/app/api/shopify/route.ts` as a server-side proxy. Move the credentials to server-only environment variables (no `NEXT_PUBLIC_` prefix). All GraphQL calls route through this handler, which adds the auth header server-side before forwarding to Shopify.

```
.env.local (server-only):
  SHOPIFY_STORE_API_URL=https://your-store.myshopify.com/api/2024-10/graphql.json
  SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here

.env.local (client-safe, for display only):
  NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
  NEXT_PUBLIC_SITE_URL=https://mamafern.com
```

**Client side:** POST GraphQL query body to `/api/shopify`
**Route handler:** Adds auth header + forwards to Shopify

---

## 3. Implementation Phases

### Phase 1: Security + Checkout (Unblock Purchases)

**Step 1 — Server-side proxy**
- Create `src/app/api/shopify/route.ts`
- Update `src/shopify/client.ts` to POST to `/api/shopify` instead of Shopify directly
- Rename env vars to remove `NEXT_PUBLIC_` prefix from secrets
- Add basic rate limiting (simple in-memory counter per session is fine to start)

**Step 2 — Checkout page**
- Create `src/app/checkout/page.tsx`
- Display cart summary: line items, quantities, subtotal, estimated total
- "Complete Purchase" button redirects to `cart.checkoutUrl` (already in your cart atom)
- Shopify handles payment, address, confirmation — no PCI scope for you
- Add loading state + empty cart redirect back to home

**Step 3 — Dynamic SEO**
- Add `generateMetadata` to `src/app/product/[handle]/page.tsx` using product title, description, and first image
- Add `generateMetadata` to `src/app/collections/[handle]/page.tsx`
- Add basic `robots.txt` and `sitemap.xml` (Next.js has built-in support for both)

---

### Phase 2: Account + Search

**Step 4 — Customer profile page**
- Create `src/app/account/page.tsx`
- Display: name, email, default address
- Edit form using existing `CUSTOMER_UPDATE` mutation in `src/graphql/profile.ts`
- Route guard: redirect to `/auth` if no `customerAccessToken` cookie

**Step 5 — Order history**
- Create `src/app/account/orders/page.tsx`
- Use existing `GET_CUSTOMER_ORDERS` query in `src/graphql/profile.ts`
- Display: order number, date, status, total, line items
- Cursor-based pagination (same pattern as collections page)
- Link back from Navbar for authenticated users

**Step 6 — Search**
- Add `search` GraphQL query to `src/graphql/products.ts`:
  ```graphql
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            id title handle
            images(first: 1) { edges { node { url altText } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  }
  ```
- Add search icon to Navbar that opens a search input
- Use existing `useDebounce` hook (already in `src/hooks/useDebounce.ts`)
- Results dropdown with product cards, or full `/search?q=` page

**Step 7 — Route guards + auth state**
- Add a `useAuthRedirect` hook to centralize token checks
- Handle token expiry: on 401 from Shopify, clear cookie + redirect to `/auth`
- Show login/logout in Navbar based on `customerAccessToken` cookie presence

---

### Phase 3: UI Polish + Reliability

**Step 8 — Error boundaries + loading states**
- Wrap key pages with React `ErrorBoundary` components
- Add proper skeleton loaders to product, collection, and account pages (shadcn `Skeleton` is already installed)
- Handle network errors gracefully with Sonner toast messages (already installed)
- Empty states: empty cart, no orders, no search results

**Step 9 — Wishlist**
- Jotai atom for wishlist (same pattern as cart atom)
- Persist to `localStorage` for guests
- For logged-in customers: use Shopify customer metafields to persist across devices
- Heart icon on `ProductCard` to toggle
- `/account/wishlist` page listing saved items

**Step 10 — Product reviews**
- Easiest path: install Judge.me or Shopify Product Reviews app in Shopify admin
- These apps expose review data via Shopify metafields
- Add reviews section to product detail page reading from metafields
- No new dependencies required if reading from GraphQL metafields

---

### Phase 4: Performance + Growth

**Step 11 — Image optimization**
- Audit `next/image` usage across product and collection pages
- Use Shopify CDN image transforms (`?width=400&crop=center`) in GraphQL image URLs
- Add `sizes` prop to all `next/image` for proper responsive loading
- Lazy-load below-the-fold images

**Step 12 — Performance**
- Enable Next.js static generation (`generateStaticParams`) for top collection and product pages
- Add `revalidate` to product and collection pages (ISR) — 60 seconds is reasonable for a store
- Review TanStack Query `staleTime` settings (currently 60s, may want longer for product data)

**Step 13 — Analytics**
- Add Vercel Analytics (one line, zero config if deploying to Vercel)
- Or add Google Analytics 4 via `next/script` in root layout
- Track: page views, add-to-cart events, checkout clicks, search queries

**Step 14 — Accessibility audit**
- Run axe-core or Lighthouse accessibility audit
- Ensure all interactive elements have proper `aria-` labels
- Keyboard navigation through product options and cart
- Focus management on modal/drawer open/close

---

## 4. Navbar Enhancements

The current Navbar has Logo + collection links + cart icon. Planned additions:

| Addition | Phase | Notes |
|----------|-------|-------|
| Search icon/input | 2 | Opens inline or navigates to search page |
| Account icon | 2 | Links to `/account` or `/auth` based on auth state |
| Logout button | 2 | Clears cookie, redirects to home |
| Mobile menu | 3 | Hamburger drawer for small screens |
| Active link styles | 3 | Highlight current collection in nav |

---

## 5. File Structure (Target State)

New files to add across all phases:

```
src/
├── app/
│   ├── api/
│   │   └── shopify/
│   │       └── route.ts              # Phase 1: GraphQL proxy
│   ├── checkout/
│   │   └── page.tsx                  # Phase 1: Cart summary + redirect
│   ├── search/
│   │   └── page.tsx                  # Phase 2: Full search results page
│   └── account/
│       ├── page.tsx                  # Phase 2: Profile overview
│       ├── orders/
│       │   └── page.tsx              # Phase 2: Order history
│       └── wishlist/
│           └── page.tsx              # Phase 3: Saved items
├── components/view/
│   ├── SearchBar/                    # Phase 2: Search input + dropdown
│   ├── OrderCard/                    # Phase 2: Single order display
│   ├── WishlistButton/               # Phase 3: Heart toggle on ProductCard
│   └── ReviewsSection/               # Phase 3: Product reviews display
├── hooks/
│   └── useAuthRedirect.ts            # Phase 2: Route guard hook
├── lib/
│   └── atoms/
│       └── wishlist.tsx              # Phase 3: Wishlist Jotai atom
└── graphql/
    └── search.ts                     # Phase 2: Search query
```

---

## 6. Environment Variables (Target State)

```bash
# .env.local — secrets are server-only (no NEXT_PUBLIC_ prefix)

# Shopify (server-only)
SHOPIFY_STORE_API_URL=https://your-store.myshopify.com/api/2024-10/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-public-storefront-token

# Public (safe to expose — no secrets)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SITE_URL=https://mamafern.com
```

No AI API keys needed. No new third-party services required to complete Phases 1–3.

---

## 7. Security Checklist

| Item | Current State | Action |
|------|--------------|--------|
| Storefront token exposed | `NEXT_PUBLIC_` (client-visible) | Move to server-only proxy (Phase 1) |
| Customer access token storage | `nookies` cookie | Add `httpOnly: true` flag to prevent JS access |
| Cart ID in localStorage | OK for Storefront API | No change needed |
| Input sanitization | Forms use Zod validation | Good — keep as is |
| Rate limiting | None | Add to `/api/shopify` route (Phase 1) |
| CORS | Not configured | Add to route handler in Phase 1 |
| HMAC verification | N/A | Only needed if using Shopify webhooks later |

---

## 8. No New Dependencies Needed

Phases 1–3 require zero new packages. Everything is already installed:

| Need | Already Have |
|------|-------------|
| Server route | Next.js App Router route handlers |
| State management | Jotai (cart atom pattern) |
| Data fetching | TanStack Query + graphql-request |
| Form validation | React Hook Form + Zod |
| UI components | shadcn/ui |
| Notifications | Sonner |
| Debounce | `useDebounce` hook |
| Skeleton loaders | shadcn Skeleton |
| Cookies | nookies |

Phase 4 (analytics) may add Vercel Analytics or GA4 — both are lightweight script tags.

---

## 9. Roadmap Summary

| Phase | What | Outcome |
|-------|------|---------|
| 1 — Security + Checkout | API proxy, checkout page, SEO | Store can take purchases |
| 2 — Account + Search | Profile, orders, search, auth guards | Full customer experience |
| 3 — Polish + Features | Error states, wishlist, reviews | Production-ready storefront |
| 4 — Performance + Growth | ISR, image opt, analytics, a11y | Fast, discoverable, measurable |

---

## 10. Key Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js ISR / revalidate](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Judge.me Reviews App](https://judge.me) — Product reviews Shopify app
- [Jotai Docs](https://jotai.org/docs/introduction) — For wishlist atom pattern

---

## Summary

This plan builds the same complete storefront without any AI features baked into the live site. You use AI (Claude Code) to write the code faster — but from the customer's perspective it's a standard, clean shopping experience.

The foundation is already strong. What remains is completing the revenue path (checkout), the customer account section, and the discovery layer (search + SEO). Each phase builds on what's already there rather than introducing new architecture.
