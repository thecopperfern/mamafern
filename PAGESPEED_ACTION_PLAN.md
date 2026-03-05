# Mama Fern — PageSpeed & Core Web Vitals Action Plan
**Generated:** March 4, 2026  
**Data Source:** Lighthouse 12.6.1 via Edge, PageSpeed Insights API (Mar 3-4, 2026)  
**Integration:** Weaves into existing AUDIT_ACTION_PLAN.md Sprint 1

---

## Current Scores (Baseline)

| Metric | Mobile | Desktop | Target | Weight |
|--------|--------|---------|--------|--------|
| **Performance** | **75** | **97** | 90+ / 98+ | — |
| Accessibility | 100 | 100 | 100 | — |
| Best Practices | **71** | **70** | 95+ | — |
| SEO | 100 | 100 | 100 | — |

### Core Web Vitals (Mobile — the ranking signal)

| Metric | Value | Threshold | Status | LH Weight |
|--------|-------|-----------|--------|-----------|
| LCP | **4,716ms** | <2,500ms | 🔴 POOR | 25% |
| FCP | 1,268ms | <1,800ms | 🟢 Good | 10% |
| TBT | **351ms** | <200ms | 🟡 Needs work | 30% |
| CLS | 0 | <0.1 | 🟢 Perfect | 25% |
| Speed Index | 2,062ms | <3,400ms | 🟢 Good | 10% |

### LCP Phase Breakdown (Mobile — where the 4.7s goes)

| Phase | Time | % | Root Cause |
|-------|------|---|------------|
| TTFB | 630ms | 13% | Hostinger server + Shopify API calls in layout |
| **Load Delay** | **1,138ms** | **24%** | `/linen.jpeg` not discoverable by preload scanner (CSS bg-image) |
| **Load Time** | **1,744ms** | **37%** | `/linen.jpeg` is **11MB** (11,208 KB) raw JPEG texture |
| **Render Delay** | **1,204ms** | **26%** | framer-motion JS must load + hydrate before Hero content paints (initial="hidden") |

---

## Critical Discovery: Broken JS/CSS on Production

Lighthouse found **11 JS chunks + 1 CSS file** being served with MIME type `text/plain` by Hostinger's nginx, causing browsers to **refuse to execute them**:

```
Refused to execute script from '.../_next/static/chunks/1430-c38ebef53d263cd3.js'
  because its MIME type ('text/plain') is not executable
Refused to apply style from '.../_next/static/css/2360369649d85331.css'
  because its MIME type ('text/plain') is not a supported stylesheet MIME type
```

**Also found:** React hydration error #418 (server/client HTML mismatch) and a Shopify GraphQL error logged to console.

These broken resources are the **#1 reason Best Practices = 71** and contribute to TBT/TTI degradation.

---

## The Plan: 6 Phases, Priority Order

### Phase 0: DEPLOYMENT FIX — MIME Types (CRITICAL)
**Est: 1-2 hours | Impact: Best Practices 71→90+, fixes broken JS/CSS**

The `server.js` MIME type fix only works when Node.js serves the request directly. Hostinger's nginx reverse proxy intercepts `/_next/static/` requests BEFORE they reach Node.js and serves them as `text/plain`.

**Fix options (pick one):**

**Option A — nginx config** (preferred if you have SSH access):
Add to Hostinger nginx config (`/etc/nginx/conf.d/` or site config):
```nginx
location /_next/static/ {
    types {
        application/javascript js;
        text/css css;
    }
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

**Option B — Next.js `headers()` config** (if no nginx access):
Add explicit Content-Type headers for static assets in `next.config.ts`:
```typescript
{
  source: "/_next/static/:path*",
  headers: [
    { key: "Content-Type", value: "application/javascript" }
  ]
}
```
Note: This may not work since nginx intercepts before Next.js. Option A is strongly preferred.

**Option C — Serve static files through Node.js**:
Modify `server.js` to handle `/_next/static/` directly by reading files from `.next/static/` and setting MIME types, bypassing nginx for these paths.

**Files to modify:**
- Hostinger nginx config (Option A) or `server.js` (Option C)

**Verification:**
- `curl -I https://mamafern.com/_next/static/chunks/[any-chunk].js | grep Content-Type`
- Should return `application/javascript`, not `text/plain`

---

### Phase 1: LCP — Image Optimization (CRITICAL)
**Est: 2-3 hours | Impact: LCP 4.7s → ~2.0s (mobile), Performance 75→85+**

#### 1a. Compress linen.jpeg from 11MB to ~50KB

The `/linen.jpeg` texture is **11,208 KB** (11 MB). It's the LCP element background and loads on EVERY page. This single file accounts for 37% of mobile LCP time.

**Action:**
1. Resize to 800×800 pixels (it tiles at `background-size: 800px auto`)
2. Convert to WebP at quality 75 (lossy): `linen.jpeg` → `linen.webp`
3. Target file size: ~30-50KB (a 99.5% reduction)
4. Update all CSS references in `globals.css`
5. Add `<link rel="preload" href="/linen.webp" as="image" type="image/webp">` in layout.tsx `<head>`

**Also compress paper.jpeg** (8,038 KB → target ~30KB):
1. Same treatment: resize to 600×600, convert to WebP quality 75

**Files to modify:**
- `public/linen.jpeg` → replace with `public/linen.webp`
- `public/paper.jpeg` → replace with `public/paper.webp`
- `src/app/globals.css` — update all `url('/linen.jpeg')` → `url('/linen.webp')`
- `src/components/view/Hero/index.tsx` — update inline style
- `src/app/layout.tsx` — add `<link rel="preload">`

**Expected LCP improvement:** Load Delay -1,100ms, Load Time -1,500ms

#### 1b. Resize logo from 19,333×7,150 to ~800×296

The logo PNG is **2,381 KB** with intrinsic dimensions of 19,333×7,150 pixels. Even optimized by Next.js to 640w, it's still 28KB on mobile for a logo rendered at ~200px.

**Action:**
- You resize the source PNG to ~800px wide (maintains aspect ratio at ~296px tall)
- Replace `public/mamafern_logo_transparent.png`
- Update `width`/`height` props in `Logo/index.tsx` to match new dimensions
- This also fixes the **"incorrect aspect ratio"** Best Practices failure

**Files to modify:**
- `public/mamafern_logo_transparent.png` — replace with resized version
- `src/components/view/Logo/index.tsx` — update `width`/`height` props

#### 1c. Add bigcommerce.com to remotePatterns and remove `unoptimized`

The "Shop the Look" feature loads images from `cdn11.bigcommerce.com` with the `unoptimized` prop because that domain isn't in `next.config.ts` `remotePatterns`. This bypasses ALL Next.js image optimization — no AVIF/WebP, no responsive srcsets, no compression.

Two BigCommerce images account for **249KB** of the total **807KB** page weight (31%).

**Action:**
1. Add to `next.config.ts` `images.remotePatterns`:
   ```typescript
   { protocol: "https", hostname: "cdn11.bigcommerce.com" }
   ```
2. Remove `unoptimized` prop from all 6 components:
   - `src/components/shop-the-look/LookHero.tsx`
   - `src/components/shop-the-look/ProductSpot.tsx`
   - `src/components/shop-the-look/QuickViewModal.tsx`
   - `src/components/shop-the-look/ProductLookBanner.tsx`
   - `src/components/shop-the-look/LookHotspot.tsx`
   - `src/app/lookadmin/AdminContent.tsx`
3. Also add to CSP `img-src`: `https://cdn11.bigcommerce.com`

**Expected savings:** ~158KB (AVIF/WebP) + ~186KB (responsive sizing) = **~250KB on mobile**

---

### Phase 2: LCP — Render Delay Fix (CRITICAL)
**Est: 2-3 hours | Impact: LCP -1,200ms, TBT -100ms**

#### 2a. Fix Hero `initial="hidden"` killing LCP

The Hero `<h1>` is the LCP element. It starts at `opacity: 0, y: 20` via framer-motion `initial="hidden"`, meaning the browser CANNOT paint it until:
1. framer-motion JS downloads (~30-50KB gzipped)
2. React hydrates the component
3. framer-motion triggers the animation

This adds ~1,200ms to LCP on mobile.

**Action — Render visible first, animate after:**
```tsx
// BEFORE (broken for LCP):
<motion.h1 variants={fadeInUp} initial="hidden" animate="visible">

// AFTER (LCP-safe):
<h1 className="animate-fade-in-up">
```

Use CSS `@keyframes` for the initial appearance animation. The content is visible in the server-rendered HTML immediately (no JS dependency), and the CSS animation provides the fade-in effect.

```css
/* In globals.css */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}
```

**Alternative (keep framer-motion but fix LCP):**
Make the initial state visible and only use framer-motion for subsequent interactions:
```tsx
<motion.h1 
  initial={{ opacity: 1, y: 0 }}  // Visible immediately
  // Use whileInView or other triggers for animation instead
>
```

**Files to modify:**
- `src/components/view/Hero/index.tsx` — replace motion.h1/motion.p with CSS-animated elements (or fix initial state)
- `src/app/globals.css` — add `@keyframes fade-in-up` (if going CSS route)

#### 2b. Lazy-load framer-motion from non-critical layout components

framer-motion is in the initial critical JS bundle because `EmailCaptureModal` and `CartSlideout` (via Navbar) import it, and both load on every page in the root layout.

**Action:**
1. Wrap `EmailCaptureModal` with `next/dynamic`:
   ```tsx
   // In layout.tsx
   const EmailCaptureModal = dynamic(
     () => import("@/components/view/EmailCaptureModal"),
     { ssr: false }
   );
   ```
2. Wrap `CartSlideout` with `next/dynamic` inside Navbar:
   ```tsx
   // In Navbar/index.tsx
   const CartSlideout = dynamic(
     () => import("../CartSlideout"),
     { ssr: false }
   );
   ```

**Expected impact:** Defers ~30-50KB of framer-motion JS from the critical path. TBT should drop significantly since framer-motion JS no longer blocks the main thread during initial load.

---

### Phase 3: TBT — Main Thread Optimization (HIGH)
**Est: 2-3 hours | Impact: TBT 351ms → <200ms, Performance +5-8 points**

#### 3a. Address long tasks

Lighthouse found **8 long tasks** (>50ms), the worst being:
- `207-*.js`: **395ms** (!) — likely framer-motion or a large client component
- `479-*.js`: **234ms** — another heavy chunk
- Document parsing: **229ms** — initial HTML processing

Fixing Phase 2 (lazy-loading framer-motion) will likely eliminate the 395ms task. For the remaining:

**Action:**
1. Add `optimizePackageImports` to `next.config.ts`:
   ```typescript
   experimental: {
     optimizePackageImports: ["lucide-react", "framer-motion", "recharts"]
   }
   ```
2. This enables automatic barrel-file optimization for these packages, reducing the amount of code that needs to be parsed and compiled.

#### 3b. Remove legacy JavaScript (~16-19KB)

Lighthouse flagged `8269-*.js` containing 16-19KB of unnecessary polyfills.

**Action:**
1. Add `browserslist` to `package.json`:
   ```json
   "browserslist": [
     "last 2 Chrome versions",
     "last 2 Firefox versions", 
     "last 2 Safari versions",
     "last 2 Edge versions"
   ]
   ```
2. This tells Next.js/SWC to skip outdated polyfills for IE11, old Safari, etc.

#### 3c. Reduce unused CSS (~14KB)

The single CSS file `e0e65c68dbd00fdb.css` has 14KB unused.

**Action:**
1. Move Keystatic admin CSS from `globals.css` to a Keystatic-specific page/layout
2. Audit `.bg-texture-*` utility classes — remove any unused from `globals.css`
3. Verify Tailwind `content` paths are correctly scoped (they appear to be)

---

### Phase 4: Best Practices Fixes (HIGH)
**Est: 2-3 hours | Impact: Best Practices 71→95+**

#### 4a. Fix React hydration error #418

Console shows: `Minified React error #418` — this is a server/client HTML mismatch. React error 418 specifically means "Hydrated HTML didn't match server-rendered HTML."

**Action:**
1. Run in dev mode to get the full error with component stack trace
2. Common causes: browser extensions injecting HTML, `Date.now()` or `Math.random()` in render, conditional rendering based on `window` object
3. Wrap dynamic-only content in `useEffect` or `suppressHydrationWarning`

#### 4b. Fix Shopify GraphQL error in console

Console shows: `Shopify GraphQL errors: Array(1)` — a Shopify API call is failing silently.

**Action:**
1. Check network tab for the specific GraphQL query that fails
2. Likely a missing field in a query or a stale product/collection handle
3. Fix the query or add error handling that doesn't log to console in production

#### 4c. Fix 404 resources (11 network errors)

Lighthouse logged **11 failed network requests** (404s) + 1 forbidden (403).

**Action:**
1. Identify which resources return 404 — likely old chunk filenames cached in service workers or stale references
2. After a fresh build + deploy, these may resolve naturally
3. Check for any hardcoded `/_next/static/` URLs in the codebase

#### 4d. Fix label-content-name-mismatch (a11y)

A button with `aria-label="View Maxi Skirt"` doesn't match its visible text content.

**Action:**
- In `ProductSpot.tsx` or the component rendering the product hotspot button, ensure `aria-label` matches or supplements the visible text label
- If the button text says "Maxi Skirt", the aria-label should be "Maxi Skirt" or "View details for Maxi Skirt" (not a different phrasing)

#### 4e. Fix third-party cookies

BigCommerce CDN sets a third-party cookie when images load. This will be resolved when BigCommerce images go through Next.js image optimization (Phase 1c) — the proxy removes the cookie.

---

### Phase 5: Server Performance (MEDIUM)
**Est: 1-2 hours | Impact: TTFB 630ms → ~400ms**

#### 5a. Cache layout-level CMS reads

The root layout makes **6 parallel async calls** on every request. 5 of them are Keystatic CMS reads that change rarely:

```typescript
const [collectionLinks, navigation, footerData, announcement, popupSettings, socialUrls] =
  await Promise.all([
    commerceClient.getCollections(),    // Shopify — keep fresh
    getNavigation(),                     // CMS — cache this
    getFooterData(),                     // CMS — cache this
    getAnnouncementWithSchedule(),       // CMS — cache this
    getPopupSettings(),                  // CMS — cache this
    reader.singletons.siteSettings.read(), // CMS — cache this
  ]);
```

**Action:**
Use `unstable_cache` from Next.js (or a simple in-memory TTL cache) for the 5 CMS calls:
```typescript
import { unstable_cache } from "next/cache";

const getCachedNavigation = unstable_cache(
  () => getNavigation(),
  ["navigation"],
  { revalidate: 300 } // 5 minutes
);
```

**Expected impact:** Remove 5 CMS read latencies from TTFB on cached hits.

#### 5b. Add 1920px to deviceSizes

```typescript
deviceSizes: [640, 750, 828, 1080, 1200, 1920],
```

Ensures full-width images on large displays get a properly-sized srcset entry instead of upscaling the 1200px variant.

---

### Phase 6: Lighthouse CI Integration (LOW)
**Est: 1 hour | Impact: Prevents regressions**

#### 6a. Add LHCI config and npm script

`lighthouserc.json` already created. Add npm script:
```json
"lighthouse": "lhci collect --config=lighthouserc.json && lhci assert --config=lighthouserc.json"
```

#### 6b. Add to CI/CD (optional)

If using GitHub Actions, add a workflow that runs LHCI on PRs to catch performance regressions before merge.

---

## Expected Final Scores

| Metric | Current Mobile | After Phase 0-2 | After Phase 3-5 |
|--------|---------------|-----------------|-----------------|
| Performance | 75 | 88-92 | 93-97 |
| Best Practices | 71 | 85-90 | 95-100 |
| LCP | 4,716ms | ~2,000ms | ~1,500ms |
| TBT | 351ms | ~150ms | <100ms |
| Speed Index | 2,062ms | ~1,500ms | ~1,200ms |

---

## Priority Execution Order

| Order | Phase | Est. Hours | Impact Score |
|-------|-------|------------|-------------|
| 🔴 1st | Phase 0: MIME type fix | 1-2h | CRITICAL — fixes broken JS/CSS in production |
| 🔴 2nd | Phase 1a: Compress linen/paper textures | 1h | LCP -2,600ms |
| 🔴 3rd | Phase 2a: Fix Hero initial="hidden" | 1h | LCP -1,200ms |
| 🔴 4th | Phase 1c: BigCommerce remotePatterns + remove unoptimized | 30min | -250KB page weight |
| 🟠 5th | Phase 2b: Lazy-load EmailCaptureModal + CartSlideout | 1h | TBT -100ms, defer ~50KB JS |
| 🟠 6th | Phase 1b: Resize logo | 30min | Fixes aspect ratio, saves preload bandwidth |
| 🟠 7th | Phase 3a+3b: optimizePackageImports + browserslist | 30min | TBT -50ms, -19KB JS |
| 🟡 8th | Phase 4a-4c: Console errors + hydration fix | 2h | Best Practices 71→90+ |
| 🟡 9th | Phase 5a: Cache CMS reads | 1h | TTFB -200ms |
| 🟡 10th | Phase 3c+4d+4e: CSS cleanup + a11y + cookies | 1h | Polish |
| ⚪ 11th | Phase 5b+6: deviceSizes + LHCI CI | 1h | Future-proofing |

**Total estimated work: ~11-14 hours**

---

## Key Files to Modify (Quick Reference)

| File | Changes |
|------|---------|
| Hostinger nginx config | Add MIME types for `/_next/static/` (Phase 0) |
| `next.config.ts` | Add bigcommerce remotePatterns, optimizePackageImports, 1920px deviceSize, CSP img-src |
| `src/app/globals.css` | Update texture URLs to .webp, add fade-in-up keyframes, remove Keystatic CSS |
| `src/app/layout.tsx` | Add `<link rel="preload">` for linen.webp, dynamic import EmailCaptureModal, cache CMS reads |
| `src/components/view/Hero/index.tsx` | Fix `initial="hidden"` → visible by default (CSS animation or framer-motion fix) |
| `src/components/view/Navbar/index.tsx` | Dynamic import CartSlideout |
| `src/components/view/Logo/index.tsx` | Update width/height after logo resize |
| `src/components/shop-the-look/LookHero.tsx` | Remove `unoptimized` |
| `src/components/shop-the-look/ProductSpot.tsx` | Remove `unoptimized`, fix aria-label |
| `src/components/shop-the-look/QuickViewModal.tsx` | Remove `unoptimized` |
| `src/components/shop-the-look/ProductLookBanner.tsx` | Remove `unoptimized` |
| `src/components/shop-the-look/LookHotspot.tsx` | Remove `unoptimized` |
| `public/linen.jpeg` | Replace with compressed `linen.webp` (~50KB) |
| `public/paper.jpeg` | Replace with compressed `paper.webp` (~30KB) |
| `public/mamafern_logo_transparent.png` | Replace with ~800px wide version |
| `package.json` | Add browserslist, lighthouse script |

---

## Integration with Existing AUDIT_ACTION_PLAN.md

This plan **overlaps** with existing audit items:
- **Audit #9** (security headers) — overlaps Phase 0 (nginx) + Phase 4e (CSP)
- **Audit #27** (Hero CSS animations) — same as Phase 2a
- **Audit #35** (priority on above-fold images) — addressed in Phase 1c

All other items are **new** and should be treated as Sprint 1 additions, executed in the priority order above.

---

## Lighthouse CI Setup (Completed)

**Installed:** `@lhci/cli` v0.15.1 (global)  
**Config:** `lighthouserc.json` in project root  
**Browser:** Microsoft Edge (Chromium) at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

**To run:**
```bash
# Set Edge as Chrome path (Windows)
$env:CHROME_PATH = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Collect (3 runs, desktop preset)
lhci collect --config=lighthouserc.json

# Or run lighthouse directly for mobile
npx lighthouse https://mamafern.com --output=json --output-path=tmp/lighthouse-mobile.json --form-factor=mobile --quiet
```

**Baseline JSON reports saved:**
- `tmp/lighthouse-mobile.json` (674KB, Mar 4 2026)
- `tmp/lighthouse-desktop.json` (712KB, Mar 4 2026)

---

## Raw Data Summary

### Resource Summary (Mobile)
| Type | Requests | Size |
|------|----------|------|
| Total | 64 | 807 KB |
| Images | 4 | 355 KB (44%) |
| Scripts | 47 | 326 KB (40%) |
| Fonts | 2 | 75 KB |
| Stylesheets | 3 | 19 KB |
| Document | 1 | 16 KB |
| Third-party | 2 | 249 KB (BigCommerce CDN) |

### Main Thread Work (Mobile)
| Category | Time |
|----------|------|
| Script Evaluation | 1,209ms |
| Other | 854ms |
| Style & Layout | 705ms |
| Script Parse/Compile | 171ms |
| Paint/Composite | 97ms |
| HTML Parsing | 47ms |
| **Total** | **3,083ms** |

### Top 5 Resources by Size (Mobile)
1. BigCommerce image 1: 132 KB (unoptimized JPEG)
2. BigCommerce image 2: 117 KB (unoptimized JPEG)
3. `/linen.jpeg`: 78 KB (served by CDN/proxy, but source is 11 MB)
4. React/Next.js framework chunk: 63 KB
5. DM Sans font: 38 KB

### DOM Size
- **254 elements** (well within the <1500 recommendation)
- **Max depth: 12** (good)
- **Max children: 36** (fine)
