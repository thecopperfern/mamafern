# Mama Fern — Progress Log

> Auto-updated during implementation sprint. Tracks every completed item, decision, and blocker.

---

## Sprint: Pre-Launch Readiness (Started 2026-02-22)

### Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Email provider | **Brevo** (not Resend) | Code already uses Brevo; .env.example was stale |
| Hosting | **Hostinger** (Node.js) | User preference; standalone Next.js output mode |
| Analytics | **Keep SQLite** + migrate to hosted DB later | Maximize analytics; GA4 as supplement |
| Product reviews | Keep stub, populate post-launch | No reviews backend yet |
| Legal pages | Embed Shopify policy content in Next.js pages | Best of both worlds |
| Accessibility | **ADA compliant** — skip nav, ARIA, focus mgmt | Required from start |
| Social/About/FAQ | **Obvious placeholders** for now | Content pending |

---

### Completed Items

| # | Item | Notes |
|---|------|-------|
| — | *Sprint started* | Initial assessment complete |
| 1 | Create PROGRESS_LOG.md | This file |
| 2 | Fix .env.example | Removed Resend vars, added Brevo vars, removed NEXT_PUBLIC_ prefix from Shopify tokens |
| 3 | Clean hardcoded credentials | Removed store URL + token from `shopify-graphql.ts` dead `fetcher` function |
| 4 | Create server-side API proxy | `src/app/api/shopify/route.ts` — all client GraphQL routes through here; token never reaches browser |
| 5 | Refactor GraphQL clients | `shopify/client.ts` + `useStorefront.ts` — removed `graphql-request` client, server calls direct, client calls proxy |
| 6 | Setup Hostinger deployment | `output: "standalone"` in next.config.ts, `server.js`, `ecosystem.config.js`, `HOSTINGER_DEPLOY.md` |
| 7 | Add ADA accessibility | SkipNav component, ARIA labels on Navbar (all 10+ interactive elements), focus-visible outlines, reduced-motion, high-contrast, semantic landmarks |
| 8 | Update Footer | Legal links (privacy, terms, returns), social icon placeholders with ⚠️ warning, `<nav>` wrappers with aria-labels |
| 9 | Placeholder About & FAQ | Yellow dashed border ⚠️ banners, specific replacement instructions in each placeholder block |
| 10 | Legal pages created | `/privacy`, `/terms`, `/returns` — all with Shopify policy embed instructions |
| 11 | ISR / performance tuning | Homepage + shop + collection → `revalidate=60`, sitemap → `revalidate=300`, removed all unnecessary `force-dynamic` |
| 12 | Verify build & tests | Build: ✅ clean. Tests: 92/92 pass (16 files). Fixed 13 pre-existing test failures (Navbar mocks, IntersectionObserver polyfill, multi-element assertions) |

---

### In Progress

*None — sprint complete.*

---

### Backlog (Post-Sprint)

- [ ] Migrate SQLite analytics to Turso (hosted)
- [ ] Connect product reviews to real data source
- [ ] Rate limiting on API routes
- [ ] Image optimization (sizes prop, Shopify CDN transforms)
- [ ] Full accessibility audit with axe-core
- [ ] Cookie security (httpOnly auth token via server route)
- [ ] Remove `eslint-disable` for `any` types — type the commerce adapter properly
- [ ] Populate real content for About, FAQ, social links
- [ ] Shopify store: create products, collections, policies
- [ ] Brevo: automation flows (welcome, back-in-stock, abandoned cart)
- [ ] Mother's Day campaign operational tasks (ACTION_PLAN.md)
