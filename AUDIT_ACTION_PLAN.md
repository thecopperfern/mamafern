# Mama Fern Audit - Quick Reference & Next Steps
**Last Updated:** March 2, 2026  
**Audit Status:** Complete  
**Total Issues:** 79 (7 critical, 8 high, 30+ medium, 35+ low)

---

## Current State

✅ **What's Working:**
- Commerce adapter pattern fully implemented (14 methods)
- All Shopify pages correctly use `force-dynamic`
- GEO optimization in place (llms.txt, product feed, AI meta tags)
- Structured data for SEO (Product, Article, BreadcrumbList, Organization)
- Accessibility foundations (skip nav, focus-visible, reduced-motion)
- Image optimization (AVIF/WebP, 30-day cache)
- Auth uses `httpOnly` + `sameSite: lax` cookies

❌ **What Needs Fixing:**
- **Security:** Shopify credentials leaked to client bundle, 11 CVEs in Next.js, analytics endpoints unauthenticated, no rate limiting, missing security headers
- **Commerce:** Auth/customer/orders bypass adapter pattern, no product filters, reviews non-functional, cart error handling incomplete
- **A11y:** Cart modal not accessible (no dialog role, focus trap), ProductCard not keyboard accessible, nested `<main>` landmarks
- **SEO:** OG image is SVG (not supported), Google Search Console placeholder, product schema missing star ratings
- **Deployment:** No graceful shutdown, PM2 config incomplete, no log rotation, scripts have security issues

---

## SPRINT PRIORITIZATION

### Sprint 0: Emergency Security (Today - 48 hours)
**Must fix before ANY code ships to production**

| # | Issue | File | Est. Time | Status |
|---|-------|------|-----------|--------|
| 1 | Shopify token leaked in next.config.ts | [next.config.ts](next.config.ts#L9-L13) | 15 min | ⚪ TODO |
| 2 | Next.js security patches (11 CVEs) | [package.json](package.json#L53) | 30 min | ⚪ TODO |
| 3 | Remove unused nookies + next-themes | [package.json](package.json) | 10 min | ⚪ TODO |
| 4 | Fix SEO health check script reversed logic | [scripts/seo-health-check.ts](scripts/seo-health-check.ts#L145-L146) | 10 min | ⚪ TODO |
| 5 | Create raster OG image (PNG/JPG not SVG) | [src/lib/seo.ts](src/lib/seo.ts#L11) | 1 hour | ⚪ TODO |

**Subtotal:** ~2.5 hours  
**Blocker:** These must complete before launch

---

### Sprint 1: Critical Features & A11y (Week 1)
**Website cannot launch without these**

| # | Issue | File | Est. Time | Status |
|---|-------|------|-----------|--------|
| 6 | Cart modal: add dialog role, focus trap, ARIA labels | [CartSlideout/index.tsx](src/components/view/CartSlideout/index.tsx) | 3 hours | ⚪ TODO |
| 7 | ProductCard: make keyboard accessible (Link instead of div) | [ProductCard/index.tsx](src/components/view/ProductCard/index.tsx#L47) | 2 hours | ⚪ TODO |
| 8 | Fix GET_PRODUCT_BY_HANDLE_QUERY missing fields | [src/graphql/products.ts](src/graphql/products.ts#L169) | 1.5 hours | ⚪ TODO |
| 9 | Add HSTS, CSP, Permissions-Policy headers | [next.config.ts](next.config.ts#L40-L52) | 1 hour | ⚪ TODO |
| 10 | Add authentication to analytics endpoints | [src/app/api/analytics/](src/app/api/analytics/) | 2 hours | ⚪ TODO |
| 11 | Add rate limiting to public endpoints | `/api/newsletter`, `/api/welcome`, etc. | 2 hours | ⚪ TODO |
| 12 | Sanitize Shopify HTML (product descriptions, policies) | [ProductStructuredDescription.tsx](src/components/seo/ProductStructuredDescription.tsx#L31) + 3 files | 2 hours | ⚪ TODO |
| 13 | Add CSRF protection to POST routes | All API routes | 2 hours | ⚪ TODO |
| 14 | Fix nested `<main>` landmarks (error.tsx, not-found.tsx) | [error.tsx](src/app/error.tsx#L11), [not-found.tsx](src/app/not-found.tsx#L11) | 30 min | ⚪ TODO |
| 15 | Add graceful shutdown to server.js | [server.js](server.js) | 45 min | ⚪ TODO |
| 16 | Update PM2 config (max_restarts, kill_timeout, log rotation) | [ecosystem.config.js](ecosystem.config.js) | 1 hour | ⚪ TODO |
| 17 | Replace Google Search Console verification placeholder | [src/app/layout.tsx](src/app/layout.tsx#L85) | 15 min | ⚪ TODO |
| 18 | Add GraphQL operation allowlist to Shopify proxy | [src/app/api/shopify/route.ts](src/app/api/shopify/route.ts#L79) | 1.5 hours | ⚪ TODO |

**Subtotal:** ~22 hours (3 developer days)  
**Outcome:** Site is secure, accessible, launches without breaking users

---

### Sprint 2: Commerce Polish (Week 2)
**Post-launch features & quality improvements**

| # | Issue | File | Est. Time | Status |
|---|-------|------|-----------|--------|
| 19 | Extend CommerceClient with auth/customer/orders | [src/lib/commerce/types.ts](src/lib/commerce/types.ts) | 6 hours | ⚪ TODO |
| 20 | Cart error handling: re-throw errors on updateItem/removeItem | [src/lib/atoms/cart.tsx](src/lib/atoms/cart.tsx#L56-L67) | 1.5 hours | ⚪ TODO |
| 21 | Product filters: add to adapter interface + UI | [src/lib/commerce/types.ts](src/lib/commerce/types.ts#L103) | 4 hours | ⚪ TODO |
| 22 | Search pagination: add "load more" | [src/app/search/page.tsx](src/app/search/page.tsx) | 2 hours | ⚪ TODO |
| 23 | Implement product reviews API (or remove feature) | [ProductReviews/index.tsx](src/components/view/ProductReviews/index.tsx#L62) | 6 hours or remove | ⚪ TODO |
| 24 | Add logging to silent error catches | [src/app/product/[handle]/page.tsx](src/app/product/[handle]/page.tsx#L33) + others | 2 hours | ⚪ TODO |
| 25 | Cart edge cases: handle stale carts, race conditions | [src/lib/atoms/cart.tsx](src/lib/atoms/cart.tsx) | 4 hours | ⚪ TODO |

**Subtotal:** ~25 hours (3 developer days)  
**Outcome:** Richer commerce experience, better error handling

---

### Sprint 3: Quality & Type Safety (Week 3)
**Technical debt, maintainability, performance**

| # | Issue | File | Est. Time | Status |
|---|-------|------|-----------|--------|
| 26 | Replace `any` types with Shopify codegen types | [client.ts](src/lib/commerce/shopify/client.ts), [mappers.ts](src/lib/commerce/shopify/mappers.ts) | 6 hours | ⚪ TODO |
| 27 | Remove Hero `use client`, implement CSS animations | [Hero/index.tsx](src/components/view/Hero/index.tsx) | 2 hours | ⚪ TODO |
| 28 | Add missing `loading.tsx` files (8 routes) | Various | 3 hours | ⚪ TODO |
| 29 | Delete dead code (CanonicalTag, ProductStructuredDescription, useDebounce) | 3 files | 30 min | ⚪ TODO |
| 30 | Install + configure Prettier + Husky + lint-staged | [package.json](package.json) | 2 hours | ⚪ TODO |
| 31 | Add `npm run type-check`, `lint:fix` scripts | [package.json](package.json) | 30 min | ⚪ TODO |
| 32 | Move dev-only packages to devDependencies | [package.json](package.json) | 1 hour | ⚪ TODO |
| 33 | Create unique blog post featured images | [content/blog/](content/blog/) | 3 hours | ⚪ TODO |
| 34 | Add breadcrumb `aria-current="page"` | [Breadcrumbs.tsx](src/components/seo/Breadcrumbs.tsx#L44-L56) | 30 min | ⚪ TODO |
| 35 | Add `priority` to above-fold product images | [ProductCard/index.tsx](src/components/view/ProductCard/index.tsx#L60) | 1 hour | ⚪ TODO |

**Subtotal:** ~19 hours (2.5 developer days)  
**Outcome:** Type-safe codebase, better performance, easier maintenance

---

### Backlog: Future Enhancements
**Nice to have, no launch blocker**

- [ ] Mobile nav focus trap + Escape handler
- [ ] Add `__Host-` prefix to auth cookie
- [ ] Product schema star ratings (when reviews are live)
- [ ] Breadcrumb ItemList in collection schema
- [ ] Wishlist server-side sync (instead of localStorage-only)
- [ ] Password reset flow
- [ ] Add `sameAs` social links to Organization schema
- [ ] Fix sitemap.ts `revalidate` (use `force-dynamic`)
- [ ] Redact token from shopify-token.js console.log
- [ ] Implement cart queue for sequential mutations
- [ ] TanStack Query for cart operations (instead of raw async)
- [ ] Lighthouse auto-audits in CI

---

## DEPENDENCIES TO FIX

### Immediate Updates
```bash
npm update next@^15.5.12
npm uninstall nookies next-themes
```

### Post-Launch
```bash
# Add rate limiting
npm install @upstash/ratelimit @upstash/redis

# Add HTML sanitization
npm install isomorphic-dompurify

# Add Prettier + hooks
npm install -D prettier @trivago/prettier-plugin-sort-imports husky lint-staged
```

---

## FILE CHANGES NEEDED

**Delete (dead code):**
- [ ] `src/components/seo/CanonicalTag.tsx`
- [ ] `src/components/seo/ProductStructuredDescription.tsx`
- [ ] `src/hooks/useDebounce.ts`

**Create (new security features):**
- [ ] Rate limiter middleware
- [ ] CSRF token utilities
- [ ] HTML sanitization wrapper
- [ ] Analytics auth check

**Modify (existing files - prioritized):**

| Priority | File | Change |
|----------|------|--------|
| 🔴 Critical | [next.config.ts](next.config.ts) | Remove `env` block with Shopify token (line 9-13) |
| 🔴 Critical | [package.json](package.json) | Update `next` to `^15.5.12`, remove `nookies` & `next-themes` |
| 🔴 Critical | [src/graphql/products.ts](src/graphql/products.ts) | Add missing fields to GET_PRODUCT_BY_HANDLE_QUERY |
| 🔴 Critical | [CartSlideout/index.tsx](src/components/view/CartSlideout/index.tsx) | Add dialog role, focus trap, ARIA labels, Escape handler |
| 🔴 Critical | [ProductCard/index.tsx](src/components/view/ProductCard/index.tsx) | Replace div[role=button] with Link, fix keyboard access |
| 🟠 High | [next.config.ts](next.config.ts) | Add HSTS, CSP, Permissions-Policy headers |
| 🟠 High | [server.js](server.js) | Add SIGTERM/SIGINT graceful shutdown |
| 🟠 High | [ecosystem.config.js](ecosystem.config.js) | Add max_restarts, restart_delay, kill_timeout |
| 🟠 High | [src/app/api/analytics/](src/app/api/analytics/) | Add authentication, rate limiting |
| 🟠 High | [scripts/seo-health-check.ts](scripts/seo-health-check.ts) | Fix reversed ISR check logic |

---

## TESTING CHECKLIST

After each sprint, verify:

**Sprint 0:**
- [ ] `npm audit --omit=dev` shows 0 critical/high vulnerabilities
- [ ] OG image renders in social share (test with Twitter Card Validator)
- [ ] Google Search Console can verify ownership

**Sprint 1:**
- [ ] Tab through ProductCard → keyboard accessible
- [ ] Open cart modal → focus trapped
- [ ] Close cart modal with Escape key
- [ ] Add to cart when quantity=0 should remove (not crash)
- [ ] Analytics endpoint returns 401 without auth
- [ ] Newsletter endpoint rejects after 5 requests/minute
- [ ] XSS payload in product description is escaped (no alert box)
- [ ] HSTS header present: `curl -I mamafern.com | grep Strict`
- [ ] CSP header present: `curl -I mamafern.com | grep Content-Security`

**Sprint 2:**
- [ ] Product page shows correct handle, vendor, compareAtPrice
- [ ] Update/remove cart items show errors in toast (don't fail silently)
- [ ] Search returns "load more" button after 20 results
- [ ] Recommendations still load even if API fails (logged to console)

**Sprint 3:**
- [ ] TypeScript strict check passes: `npm run type-check`
- [ ] No console errors on page load
- [ ] Hero animates with CSS (no framer-motion on client)
- [ ] All routes have loading skeleton
- [ ] ESLint passes: `npm run lint`

---

## ESTIMATED TIMELINE

| Phase | Timeline | Dev Days | Comms |
|-------|----------|----------|-------|
| Sprint 0 (Security hotfix) | 24-48 hours | 0.5 | "Security patches deployed" |
| Sprint 1 (Launch blocking) | Week 1 | 3 | "All A11y & commerce features ready for launch" |
| Sprint 2 (Polish) | Week 2 | 3 | "Advanced features and quality improvements" |
| Sprint 3 (Tech debt) | Week 3 | 2.5 | "Codebase refactored, type-safe, optimized" |
| **Total** | **3 weeks** | **9 days** | — |

---

## HOW TO USE THIS DOCUMENT

**When picking up work:**
1. Open [CODEBASE_AUDIT_FULL.md](CODEBASE_AUDIT_FULL.md) for full context
2. Refer to this file for quick reference
3. Click file links to jump to code
4. Use checkbox above to track progress
5. Update `Status` column as you go

**Handoff to new developer:**
- Start with Sprint 0 checklist
- Read relevant sections of `CODEBASE_AUDIT_FULL.md` for issues they're working on
- Link to this doc in PR descriptions for context

**Quarterly review:**
- Run `npm audit --omit=dev` again
- Check if all Sprint 1-3 issues are closed
- Identify new issues (update CODEBASE_AUDIT_FULL.md)

---

## QUESTIONS TO ANSWER BEFORE STARTING

- [ ] Is launch date fixed or flexible? (affects Sprint 0 timing)
- [ ] Should Sprint 1 be split across multiple developers?
- [ ] Is backend migration planned soon? (affects Sprint 2 priority)
- [ ] Should product reviews be implemented or removed?
- [ ] Is search pagination critical for launch?

---

**Document created:** March 2, 2026  
**Generated by:** Full codebase audit  
**Status:** Ready for implementation

Contact with questions or blockers.
