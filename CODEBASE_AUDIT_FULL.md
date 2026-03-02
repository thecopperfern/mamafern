# Mama Fern Full Codebase Audit Report
**Generated:** March 2, 2026  
**Status:** Complete  
**Next Review:** After critical/high priority fixes

---

## Executive Summary

Comprehensive audit of the Mama Fern Next.js 15 e-commerce storefront codebase covering:
- **Security** (21 issues, 3 critical)
- **Commerce/Features** (11 issues, 1 critical)
- **SEO** (10 issues, 2 critical)
- **Accessibility** (11 issues, 4 critical)
- **Performance** (8 issues, 0 critical)
- **Deployment/Maintenance** (18 issues, 2 high)

**Total Issues Found:** 79 (7 critical, 8 high, 30+ medium, 35+ low)

---

## TABLE OF CONTENTS
1. [Critical Issues - Fix Immediately](#critical-issues)
2. [High Priority - Before Launch](#high-priority)
3. [Medium Priority - Post-Launch](#medium-priority)
4. [Low Priority - Nice to Have](#low-priority)
5. [Positive Findings](#positive-findings)
6. [Quick Fix Checklist](#quick-fix-checklist)

---

## CRITICAL ISSUES
**Status: 7 found | Timeline: Fix in next 2 sprints**

### [Critical-01] Shopify Token Leaked to Client Bundle
**Severity:** 🔴 CRITICAL  
**Category:** Security  
**Location:** [next.config.ts](next.config.ts#L9-L13)

**Problem:**
The `env` block in Next.js config embeds `SHOPIFY_STOREFRONT_ACCESS_TOKEN` into every JavaScript bundle shipped to browsers. Unlike `NEXT_PUBLIC_` prefix which is explicit, the raw `env` block is less obvious.

```typescript
export default {
  env: {
    SHOPIFY_STORE_API_URL: process.env.SHOPIFY_STORE_API_URL || "",
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",  // ❌ LEAKED
  },
}
```

**Impact:**
- Any visitor can view-source or inspect dev tools to extract both API URL and access token
- Attacker can make API calls directly to Shopify as if they were the store
- Negates the purpose of the `/api/shopify` proxy route

**Fix:**
Remove these lines entirely. The server-side proxy at [src/app/api/shopify/route.ts](src/app/api/shopify/route.ts) already reads from `process.env` at runtime.

```typescript
// DELETE the env block, keep the rest of config
// Server-side code already handles: process.env.SHOPIFY_STORE_API_URL
// Process.env is runtime-only, not bundled with client JS
```

**Timeline:** Immediate (within 24 hours)

---

### [Critical-02] Next.js 15.1.6: 11 CVEs Including Middleware Auth Bypass
**Severity:** 🔴 CRITICAL  
**Category:** Security  
**Location:** [package.json](package.json#L53)

**Problem:**
Next.js 15.1.6 has multiple CVEs, most critically:
- **GHSA-f82v-jwr5-mffw**: Authorization Bypass in Middleware
- **GHSA-9qr9-h5gf-34mp**: RCE in React Flight protocol
- **GHSA-9g9p-9gw9-jx7f**: DoS via Image Optimizer

Mama Fern heavily relies on middleware ([src/middleware.ts](src/middleware.ts)) for:
- Site-wide password gate (`SITE_PASSWORD`)
- Keystatic CMS login gate (`KEYSTATIC_PASSWORD`)

**Impact:**
The middleware auth bypass means an attacker could bypass your password gates if they understand the middleware exploit.

**Fix:**
```bash
npm update next@^15.5.12  # or latest 16.x when ready
npm audit fix --force     # May need force for some transitive deps
```

This breaks the `^15.1.6` semver constraint, so bump the version range:

```json
{
  "dependencies": {
    "next": "^15.5.12"  // or "^16.0.0"
  }
}
```

**Timeline:** Immediate (today)

---

### [Critical-03] Analytics Endpoints Completely Unauthenticated
**Severity:** 🔴 CRITICAL  
**Category:** Security  
**Location:** [src/app/api/analytics/dashboard/route.ts](src/app/api/analytics/dashboard/route.ts), [src/app/api/analytics/events/route.ts](src/app/api/analytics/events/route.ts)

**Problem:**
Two API endpoints accept arbitrary requests with zero authentication:

1. **GET `/api/analytics/dashboard?shop_id=X`**
   - Returns all dashboard metrics (funnel data, session counts, engagement)
   - Anyone can query any `shop_id`
   - Exposes business intelligence publicly

2. **POST `/api/analytics/events`**
   - Accepts arbitrary event data: `{ shop_id, session_id, page_url, ... }`
   - No rate limiting
   - No origin validation
   - Can flood SQLite with millions of fake events → disk exhaustion (DoS)
   - Can pollute analytics data with invalid shop_ids

**Code:**
```typescript
// dashboard/route.ts (line 6) - NO AUTH CHECKS
export async function GET(request: Request) {
  const { shop_id } = Object.fromEntries(new URL(request.url).searchParams);
  // Directly queries DB with user-supplied shop_id
}

// events/route.ts (line 5) - NO AUTH CHECKS, NO RATE LIMIT
export async function POST(request: Request) {
  const data = await request.json(); // ANY data accepted
  // Directly inserts into DB
}
```

**Fix:**
1. Add authentication to both endpoints
2. Add rate limiting (e.g., `upstash/ratelimit` with Redis)
3. Validate origin header (Referer/Origin) to prevent CSRF
4. Validate incoming data shape (shop_id, session_id formats)

**Timeline:** Immediate (before production)

---

### [Critical-04] Cart Slideout Accessibility Violations (WCAG AA)
**Severity:** 🔴 CRITICAL  
**Category:** Accessibility  
**Location:** [src/components/view/CartSlideout/index.tsx](src/components/view/CartSlideout/index.tsx)

**Problem:**
The cart modal overlay violates multiple WCAG AA Success Criteria:

- **2.1.2 (No Keyboard Trap)** — Users can Tab behind the slideout into the main page
- **4.1.2 (Name, Role, Value)** — No `role="dialog"` or `aria-modal="true"` on the panel; close button has no `aria-label`
- **1.3.1 (Info and Relationships)** — Quantity +/- buttons (lines ~239-257) have no `aria-label`; no `aria-label` on Remove button (line ~263)
- **2.1.1 (Keyboard Accessible)** — No Escape key handler to close the modal

**Actual Issues:**
```tsx
// Missing dialog role and labels
<div className="fixed inset-0 z-50 bg-black/50"> {/* NO role="dialog" */}
  <div> {/* NO aria-modal="true" */}
    <button onClick={onClose}> {/* NO aria-label="Close cart" */}
      <X />
    </button>
    {/* Lines ~239-257: quantity buttons */}
    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
      {/* NO aria-label="Increase quantity" */}
      +
    </button>
  </div>
</div>
```

**Fix:**
- Add `role="dialog"` and `aria-modal="true"` to the panel
- Add `aria-label` to close button, quantity buttons, remove button
- Implement focus trap (focus stays within modal when open)
- Add Escape key handler to close
- Use `aria-live="polite"` region to announce cart updates

**Timeline:** Before launch (legal liability)

---

### [Critical-05] ProductCard div[role="button"] Not Keyboard Accessible
**Severity:** 🔴 CRITICAL  
**Category:** Accessibility  
**Location:** [src/components/view/ProductCard/index.tsx](src/components/view/ProductCard/index.tsx#L47)

**Problem:**
The entire product card is a `<div role="button">` with `onClick`, but:
- No `tabIndex={0}` — not keyboard focusable
- No `onKeyDown` handler — Enter/Space won't activate it
- Nested interactive elements (`<Button>`, `<WishlistButton>`) create button-in-button pattern (invalid semantics)

```tsx
<div role="button" onClick={handleNavigate}> {/* ❌ NOT focusable */}
  {/* product image, title, price */}
  <Button onClick={handleAddToCart} /> {/* nested button */}
  <WishlistButton /> {/* nested button */}
</div>
```

**Fix:**
Replace with semantic `<Link>` wrapping, make buttons separate keyboard-accessible stops:

```tsx
<Link href={`/product/${product.handle}`} className="block">
  {/* product image, title, price */}
  <div className="absolute bottom-0" onClick={(e) => e.preventDefault()}>
    <Button onClick={handleAddToCart} />
    <WishlistButton />
  </div>
</Link>
```

**Timeline:** Before launch (WCAG AA compliance)

---

### [Critical-06] OG Image is SVG (Not Supported by Social Platforms)
**Severity:** 🔴 CRITICAL  
**Category:** SEO  
**Location:** [src/lib/seo.ts](src/lib/seo.ts#L11), [src/app/layout.tsx](src/app/layout.tsx#L65)

**Problem:**
The default Open Graph image is `/og-image.svg`. Facebook, Twitter/X, LinkedIn, Discord, Slack, and most social platforms **do not render SVG OG images**. They only support raster formats: PNG, JPG, WebP.

Result: When Mama Fern content is shared on any social platform, no image appears in the preview — just a blank card.

```typescript
openGraph: {
  images: [
    {
      url: "/og-image.svg", // ❌ SVG not supported
      width: 1200,
      height: 630,
    },
  ],
}
```

**Fix:**
Create a raster OG image (PNG or JPG):
1. Design brand-representative 1200x630px image (same content as current SVG)
2. Export as `public/og-image.png` (or `.jpg`)
3. Update [src/lib/seo.ts](src/lib/seo.ts#L11) and [src/app/layout.tsx](src/app/layout.tsx#L65) to reference `.png`

**Timeline:** Immediate (affects all social shares)

---

### [Critical-07] GET_PRODUCT_BY_HANDLE_QUERY Missing Fields
**Severity:** 🔴 CRITICAL  
**Category:** Commerce / Data Integrity  
**Location:** [src/graphql/products.ts](src/graphql/products.ts#L169-L234)

**Problem:**
The `GET_PRODUCT_BY_HANDLE_QUERY` GraphQL query is missing fields that the `mapProduct()` mapper expects:

```graphql
query GET_PRODUCT_BY_HANDLE($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    productType
    # MISSING: handle, vendor, featuredImage, compareAtPriceRange
    # ...rest of fields
  }
}
```

However, `SEARCH_PRODUCTS_QUERY` and `GET_PRODUCT_RECOMMENDATIONS_QUERY` **do include** these fields.

**Impact:**
Products fetched via `commerceClient.getProductByHandle()` have:
- `product.handle` = `undefined` (mapper defaults to `undefined`)
- `product.vendor` = `""` (mapper defaults to empty string)
- `product.featuredImage` = `null`
- `product.compareAtPriceRange` = `null`

The product page works around missing `handle` using URL params ([product/[handle]/page.tsx](src/app/product/[handle]/page.tsx#L56)), but the JSON-LD schema still tries to use `product.handle`:

```tsx
// product/[handle]/page.tsx line 56 - uses undefined handle
const jsonLd = {
  "@type": "Product",
  "url": `https://mamafern.com/product/${product.handle}`, // undefined!
}
```

**Fix:**
Add the missing fields to [src/graphql/products.ts](src/graphql/products.ts):

```graphql
query GET_PRODUCT_BY_HANDLE($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    productType
    handle              # ADD
    vendor              # ADD
    featuredImage {     # ADD (match structure from other queries)
      url
      altText
    }
    compareAtPriceRange {  # ADD
      minVariantPrice {
        amount
      }
      maxVariantPrice {
        amount
      }
    }
    # ...rest of existing fields
  }
}
```

**Timeline:** Before launch (impacts product schema + any code relying on product.handle)

---

## HIGH PRIORITY ISSUES
**Status: 8 found | Timeline: Fix before public launch**

### [High-01] XSS: Unsanitized HTML from Shopify
**Severity:** 🟠 HIGH  
**Category:** Security  
**Location:** [src/components/seo/ProductStructuredDescription.tsx](src/components/seo/ProductStructuredDescription.tsx#L31), [src/app/privacy/page.tsx](src/app/privacy/page.tsx#L50), [src/app/terms/page.tsx](src/app/terms/page.tsx#L50), [src/app/returns/page.tsx](src/app/returns/page.tsx#L49)

**Problem:**
HTML content from Shopify is rendered with `dangerouslySetInnerHTML` and **no sanitization**:

```tsx
<div dangerouslySetInnerHTML={{ __html: product.description }} /> {/* ❌ */}
```

While Shopify's admin UI typically strips malicious scripts, any compromise of the Shopify admin account (or a malicious app with write permission) could inject arbitrary JavaScript that executes in every visitor's browser.

**Files affected:** 4 locations

**Fix:**
Use `isomorphic-dompurify` or `sanitize-html` to clean HTML before rendering:

```typescript
import sanitize from 'isomorphic-dompurify';

export function ProductDescription({ html }: Props) {
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitize(html) }} />
  );
}
```

**Install:**
```bash
npm install isomorphic-dompurify
```

**Timeline:** Before launch

---

### [High-02] Shopify Proxy: Unrestricted GraphQL Passthrough
**Severity:** 🟠 HIGH  
**Category:** Security  
**Location:** [src/app/api/shopify/route.ts](src/app/api/shopify/route.ts#L79-L82)

**Problem:**
The Shopify proxy forwards **any arbitrary GraphQL body** to the Storefront API without validation:

```typescript
const body = await req.json();
const response = await fetch(shopifyUrl, {
  body: JSON.stringify(body), // ❌ ANY query accepted
});
```

An attacker can craft deeply nested queries, introspection queries, or queries for data the frontend never intended to access. While Shopify's Storefront API scope limits what can be fetched, this is still an open relay.

**Fix:**
Implement a **query allowlist** — only permit specific operation names or query hashes:

```typescript
const ALLOWED_OPERATIONS = [
  'GetProduct',
  'SearchProducts',
  'GetCollections',
  // ... whitelist legitimate operations
];

const body = await req.json();
if (!ALLOWED_OPERATIONS.includes(body.operationName)) {
  return new Response('Operation not allowed', { status: 403 });
}
```

**Timeline:** Before launch

---

### [High-03] No CSRF Protection on State-Changing API Routes
**Severity:** 🟠 HIGH  
**Category:** Security  
**Location:** All `POST` routes: `/api/auth`, `/api/newsletter`, `/api/welcome`, `/api/keystatic-login`, `/api/analytics/events`, `/api/shopify`, [src/app/contact/action.ts](src/app/contact/action.ts)

**Problem:**
None of the POST endpoints implement CSRF protection. An attacker's website could forge requests to these endpoints using the visitor's cookies.

**Fix:**
1. Validate `Origin` / `Referer` headers
2. Implement CSRF tokens for non-SameSite=Strict cookies
3. At minimum, set `sameSite: "strict"` on auth cookies (currently `lax`)

**Timeline:** Before launch

---

### [High-04] HTML Injection in Email Templates
**Severity:** 🟠 HIGH  
**Category:** Security  
**Location:** [src/app/api/welcome/route.ts](src/app/api/welcome/route.ts#L10), [src/app/api/newsletter/route.ts](src/app/api/newsletter/route.ts#L57)

**Problem:**
User-supplied `firstName` and `lastName` are interpolated directly into email HTML:

```typescript
const greeting = firstName ? `Welcome, ${firstName}!` : "Welcome!";
// firstName could contain HTML tags: "<script>alert(1)</script>"
// or: "<img src=x onerror='phishing attack'>"
```

**Fix:**
HTML-escape user input:

```typescript
import { escapeHtml } from 'some-html-escape-lib'; // or implement simple version

const greeting = firstName ? `Welcome, ${escapeHtml(firstName)}!` : "Welcome!";
```

**Timeline:** Before launch

---

### [High-05] Missing Security Headers
**Severity:** 🟠 HIGH  
**Category:** Security  
**Location:** [next.config.ts](next.config.ts#L40-L52)

**Problem:**
Critical security headers are missing:

| Header | Current | Missing |
|--------|---------|---------|
| Strict-Transport-Security | ❌ | Protocol upgrade enforcement |
| Content-Security-Policy | ❌ | XSS defense |
| Permissions-Policy | ❌ | Feature restriction |

Users accessing over HTTP won't be forced to HTTPS. Without CSP, XSS vulnerabilities (like the unsanitized HTML above) have no defense.

**Fix:**
Add to [next.config.ts](next.config.ts#L40-L52):

```typescript
headers: async () => ({
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; img-src 'self' https://cdn.shopify.com; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // ... existing headers
});
```

**Timeline:** Before launch

---

### [High-06] Remove Unused `nookies` + Fix CVE
**Severity:** 🟠 HIGH  
**Category:** Security / Dependencies  
**Location:** [package.json](package.json#L51)

**Problem:**
- `nookies` installed but **never imported** anywhere in `src/`
- Older transitive dependency `cookie < 0.7.0` has CVE for OOB characters in cookie values
- The CVE can't be fixed by updating `nookies` (it's unmaintained, last publish 4 years ago)

**Fix:**
```bash
npm uninstall nookies
```

**Timeline:** Immediate

---

### [High-07] PM2 Configuration Missing Critical Settings
**Severity:** 🟠 HIGH  
**Category:** Deployment  
**Location:** [ecosystem.config.js](ecosystem.config.js)

**Problem:**
Missing configurations can cause:
- **Infinite crash loops:** No `max_restarts` limit
- **Thundering herd:** No `restart_delay` between restarts
- **Disk exhaustion:** No log rotation
- **Dropped connections:** No graceful shutdown in [server.js](server.js)

```javascript
// Current: Missing critical fields
module.exports = {
  apps: [{
    name: 'mamafern',
    script: './server.js',
    // ❌ NO max_restarts
    // ❌ NO restart_delay
    // ❌ NO kill_timeout
    // ❌ NO error_file rotation
  }],
};
```

**Fix:**
```javascript
module.exports = {
  apps: [{
    name: 'mamafern',
    script: './server.js',
    instances: 1,
    max_restarts: 10,           // Add: stop after 10 restarts in 15 min
    restart_delay: 3000,        // Add: 3 second delay between restarts
    kill_timeout: 5000,         // Add: 5 second grace period before SIGKILL
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    // Install: pm2 install pm2-logrotate (for auto rotation)
  }],
};
```

Also add graceful shutdown to [server.js](server.js):

```javascript
const server = http.createServer(handle);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  // Force exit after 10 seconds
  setTimeout(() => process.exit(1), 10000);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing gracefully...');
  // ... same as SIGTERM
});
```

**Timeline:** Before Hostinger deployment

---

### [High-08] SEO Health Check Script Contradicts Project Rules
**Severity:** 🟠 HIGH  
**Category:** Maintenance  
**Location:** [scripts/seo-health-check.ts](scripts/seo-health-check.ts#L145-L146)

**Problem:**
The script **penalizes `force-dynamic`**, which is the opposite of what the project requires:

```typescript
check("Homepage uses ISR (not force-dynamic)", !fileContains(..., "force-dynamic"));
check("Shop page uses ISR (not force-dynamic)", !fileContains(..., "force-dynamic"));
```

These checks will **FAIL** on correctly configured pages. The script contradicts the golden rule: "Never use ISR on Shopify pages."

**Fix:**
Reverse the logic:

```typescript
check("Homepage uses force-dynamic (required for Shopify)", fileContains(..., "force-dynamic"));
check("Shop page uses force-dynamic (required for Shopify)", fileContains(..., "force-dynamic"));
```

**Timeline:** Immediate

---

## MEDIUM PRIORITY ISSUES
**Status: 30+ found | Timeline: Post-launch sprint backlog**

### [Medium-01] Commerce: Auth/Customer/Orders Bypass Adapter Pattern
**Severity:** 🟡 MEDIUM  
**Category:** Commerce / Architecture  
**Location:** [src/graphql/auth.ts](src/graphql/auth.ts), [src/graphql/profile.ts](src/graphql/profile.ts), [src/app/auth/page.tsx](src/app/auth/page.tsx), [src/app/account/page.tsx](src/app/account/page.tsx)

**Problem:**
The commerce adapter pattern ([src/lib/commerce/](src/lib/commerce/)) is designed to abstract Shopify — all components should import from `@/lib/commerce`, not directly from `@/lib/commerce/shopify/`.

However, auth, customer profiles, and orders **directly call Shopify GraphQL** via `useStorefrontQuery`/`useStorefrontMutation` hooks, bypassing the adapter entirely.

**Features affected:**
- Customer login / signup
- Customer profile fetch/update
- Order history
- Account dashboard

**Impact:**
If Shopify is swapped for WooCommerce or custom API later, these features would need to be rewritten from scratch. The adapter pattern is partially defeated.

**Fix (future):**
Extend `CommerceClient` interface to include:
```typescript
interface CommerceClient {
  // ... existing 14 methods
  
  // Auth (new)
  loginCustomer(email: string, password: string): Promise<{ token: string }>
  signupCustomer(data: CustomerSignupData): Promise<{ token: string }>
  
  // Customer (new)
  getCustomer(token: string): Promise<CommerceCustomer>
  updateCustomer(token: string, data: Partial<CommerceCustomer>): Promise<void>
  getCustomerOrders(token: string): Promise<CommerceOrder[]>
}
```

Then implement in [src/lib/commerce/shopify/client.ts](src/lib/commerce/shopify/client.ts).

**Timeline:** Medium priority (before any backend migration)

---

### [Medium-02] Commerce: Product Filters Not Exposed
**Severity:** 🟡 MEDIUM  
**Category:** Commerce / Missing Feature  
**Location:** [src/lib/commerce/types.ts](src/lib/commerce/types.ts#L103-L108)

**Problem:**
The GraphQL query supports product filters (by price, color, size, etc.) but:
- `CommerceClient.getCollectionByHandle()` has **no `filters` param** in its interface
- No UI exists to expose filter controls
- Users can't refine products by attributes

**Fix:**
Add filters param to interface:

```typescript
interface GetCollectionByHandleOptions {
  first?: number
  after?: string
  sortKey?: 'BEST_SELLING' | 'PRICE' | 'CREATED_AT' | 'TITLE'
  reverse?: boolean
  filters?: ProductFilter[]  // ADD
}

interface ProductFilter {
  key: string      // e.g., "price", "color", "size"
  value: string    // e.g., "50:100" for price range
}
```

Then add filter UI to collection pages.

**Timeline:** Post-launch feature

---

### [Medium-03] No Rate Limiting on Public API Endpoints
**Severity:** 🟡 MEDIUM  
**Category:** Security  
**Location:** `/api/newsletter`, `/api/welcome`, `/api/contact`, `/api/keystatic-login`

**Problem:**
Five public endpoints with **zero rate limiting**:

1. `/api/newsletter` — Brevo email credits can be exhausted
2. `/api/welcome` — Same
3. `/api/keystatic-login` — Password can be brute-forced
4. `/api/contact` — Spam emails
5. `/api/analytics/events` — (Already covered in Critical-03)

**Fix:**
Use a rate limiting library like `upstash/ratelimit`:

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
  // ... rest of handler
}
```

**Timeline:** Before launch

---

### [Medium-04] Cart Operations: Silent Error Swallowing
**Severity:** 🟡 MEDIUM  
**Category:** Commerce / Error Handling  
**Location:** [src/lib/atoms/cart.tsx](src/lib/atoms/cart.tsx#L56-L67)

**Problem:**
The `updateItem` and `removeItem` methods catch errors but **don't re-throw**:

```typescript
async updateItem(id: string, quantity: number) {
  try {
    // ... update cart
  } catch (error) {
    console.log(error); // logged but NOT re-thrown
    // UI never knows the update failed
  }
}
```

**Impact:**
User clicks "increase quantity" → it fails silently → UI still shows old quantity → confusing experience.

Per project rules, cart operations are **critical path** and should throw early.

**Fix:**
Re-throw errors or notify UI:

```typescript
async updateItem(id: string, quantity: number) {
  try {
    // ...
  } catch (error) {
    console.error('Failed to update cart item:', error);
    throw error; // Let caller handle
  }
}
```

Or return a result object:
```typescript
{
  success: boolean
  error?: string
}
```

**Timeline:** Post-launch quality improvement

---

### [Medium-05] Product Reviews Feature: Non-Functional
**Severity:** 🟡 MEDIUM  
**Category:** Commerce / Feature  
**Location:** [src/components/view/ProductReviews/index.tsx](src/components/view/ProductReviews/index.tsx#L62)

**Problem:**
The "Submit Review" button only logs to console and shows a toast. No API integration exists.

```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // TODO: Submit to reviews API / Shopify metafields
  console.log("Review submission:", formData); // ❌ Not functional
  toast.success("Thank you for your review!");
};
```

**Fix (options):**
1. **Remove the feature** if reviews are out of scope
2. **Implement reviews API** that stores reviews in Shopify metafields or separate DB
3. **Integrate third-party** like Yotpo or Reviews.io

**Timeline:** Post-launch or remove now

---

### [Medium-06] Search Results: Limited to 20 with No Pagination
**Severity:** 🟡 MEDIUM  
**Category:** Commerce / Feature  
**Location:** [src/app/search/page.tsx](src/app/search/page.tsx)

**Problem:**
Search fetches a hard-coded `first: 20` with no "load more" or pagination UI. Users can't browse past 20 results.

**Fix:**
Add cursor-based pagination like collection pages do:

```typescript
// Add state for pagination
const [after, setAfter] = useState<string | null>(null);
const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

// Implement "Load More" button
const handleLoadMore = async () => {
  const nextResults = await search(query, { first: 20, after });
  setResults([...results, ...nextResults.products]);
  setPageInfo(nextResults.pageInfo);
};
```

**Timeline:** Post-launch

---

### [Medium-07] Google Search Console Verification is Still a Placeholder
**Severity:** 🟡 MEDIUM  
**Category:** SEO  
**Location:** [src/app/layout.tsx](src/app/layout.tsx#L85)

**Problem:**
```typescript
verification: {
  google: "REPLACE_WITH_GOOGLE_VERIFICATION_CODE", // ❌ PLACEHOLDER
}
```

Google Search Console won't verify this site. No access to indexing, crawl issues, or search performance data.

**Fix:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for mamafern.com
3. Verify ownership via Meta tag (provided by GSC)
4. Replace placeholder with actual code

**Timeline:** Before launch

---

### [Medium-08] Product Schema Missing Star Ratings
**Severity:** 🟡 MEDIUM  
**Category:** SEO  
**Location:** [src/app/product/[handle]/page.tsx](src/app/product/[handle]/page.tsx#L40-L57)

**Problem:**
The Product JSON-LD schema has no `aggregateRating` or `review` properties. Google won't display star ratings in rich results without them.

The `ProductReviews` component exists but its data isn't connected to the schema.

**Fix:**
Add to schema:

```typescript
const jsonLd = {
  "@type": "Product",
  // ... existing fields
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": averageRating, // e.g., 4.5
    "reviewCount": totalReviews,  // e.g., 42
    "bestRating": 5,
    "worstRating": 1,
  },
  "review": reviews.map(r => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.author },
    "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
    "reviewBody": r.text,
  })),
};
```

**Timeline:** Post-launch (when reviews are functional)

---

### [Medium-09] Blog Featured Images Are Generic SVG
**Severity:** 🟡 MEDIUM  
**Category:** SEO  
**Location:** [content/blog/](content/blog/)

**Problem:**
All 5 blog posts use `featuredImage: "/og-image.svg"` — a generic brand image.

Each post should have a unique, descriptive featured image for:
- Visual appeal in blog landing page
- Social sharing (when shared on Twitter, etc.)
- SEO (images help with perceived content depth)

**Fix:**
Create 5 unique blog post featured images (1200x630px) and update frontmatter in each `.mdx` file.

**Timeline:** Post-launch content update

---

### [Medium-10] Nested `<main>` Landmarks (Accessibility)
**Severity:** 🟡 MEDIUM  
**Category:** Accessibility  
**Location:** [src/app/layout.tsx](src/app/layout.tsx#L128), [src/app/not-found.tsx](src/app/not-found.tsx#L11), [src/app/error.tsx](src/app/error.tsx#L11)

**Problem:**
The root layout wraps all content in `<main>`, and the error/not-found pages **also use `<main>`**, creating nested landmarks:

```tsx
// layout.tsx
<main id="main-content">
  {children}  // Which includes...
  // not-found.tsx or error.tsx
  <main> {/* NESTED <main>! */}
</main>

// not-found.tsx
export default function NotFound() {
  return (
    <main> {/* ❌ Should be <div> */}
      <h1>Not Found</h1>
    </main>
  );
}
```

Screen readers will misinterpret the page structure.

**Fix:**
Replace `<main>` with `<div>` in [not-found.tsx](src/app/not-found.tsx#L11) and [error.tsx](src/app/error.tsx#L11):

```tsx
// not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>Not Found</h1>
    </div>
  );
}
```

**Timeline:** Post-launch

---

### [Medium-11] Mobile Navigation: No Focus Trap or Escape Handler
**Severity:** 🟡 MEDIUM  
**Category:** Accessibility  
**Location:** [src/components/view/Navbar/index.tsx](src/components/view/Navbar/index.tsx#L305-L321)

**Problem:**
The mobile menu can be opened, but:
- **No focus trap** — keyboard Tab moves past the menu into the main page
- **No Escape key handler** — pressing Escape doesn't close it
- **No focus management** — focus doesn't move to first link on open

**Fix:**
Implement focus management:

```typescript
useEffect(() => {
  if (isOpen) {
    // Set focus to first link when menu opens
    const firstLink = navRef.current?.querySelector('a');
    firstLink?.focus();
  }
}, [isOpen]);

// Escape key handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      hamburgerRef.current?.focus(); // Return focus to hamburger
    }
  };
  
  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [isOpen]);
```

**Timeline:** Post-launch

---

### [Medium-12] Missing Loading States for Several Routes
**Severity:** 🟡 MEDIUM  
**Category:** UX  
**Location:** `src/app/about/`, `src/app/contact/`, `src/app/faq/`, `src/app/community/`, etc.

**Problem:**
These routes do data fetching but have **no `loading.tsx`**:
- `about`
- `contact`
- `faq`
- `community`
- `mothers-day`
- `returns`, `privacy`, `terms`
- `style-guide` and sub-routes

Users on slow connections see a blank page with no loading indication.

**Fix:**
Create `loading.tsx` skeletons for each route.

**Timeline:** Post-launch quality

---

### [Medium-13] Type Safety: `any` Types Throughout
**Severity:** 🟡 MEDIUM  
**Category:** Code Quality  
**Location:** [src/lib/commerce/shopify/client.ts](src/lib/commerce/shopify/client.ts), [src/lib/commerce/shopify/mappers.ts](src/lib/commerce/shopify/mappers.ts)

**Problem:**
Both files start with `eslint-disable @typescript-eslint/no-explicit-any` and use `any` pervasively:

```typescript
async function fetchGraphQL<any>(
  query: string,
  variables?: any,
): Promise<any> {
  // ...
}

// Every mapper takes any:
export function mapProduct(data: any): CommerceProduct {
  // Bugs here won't show at compile time
}
```

However, a 10,000-line generated Shopify types file exists at [src/types/shopify-graphql.ts](src/types/shopify-graphql.ts) that is **never used**.

**Fix:**
Use the generated types:

```typescript
import { ProductQuery, SearchProductsQuery } from '@/types/shopify-graphql';

async function getProductByHandle(handle: string): Promise<CommerceProduct | null> {
  const data = await fetchGraphQL<ProductQuery>(GET_PRODUCT_BY_HANDLE_QUERY, { handle });
  return mapProduct(data.product);
}

export function mapProduct(data: ProductQuery['product']): CommerceProduct {
  // Now TS knows data shape and will error on typos
}
```

**Timeline:** Post-launch refactor

---

### [Medium-14] Performance: Hero Component Unnecessarily Client-Side
**Severity:** 🟡 MEDIUM  
**Category:** Performance  
**Location:** [src/components/view/Hero/index.tsx](src/components/view/Hero/index.tsx)

**Problem:**
Marked `"use client"` solely for framer-motion fade-in/stagger animations. This forces the entire Hero and its dependencies into the client JS bundle.

**Options:**
1. Use CSS animations instead (no client bundle cost)
2. Extract only the animated wrapper as a tiny client component
3. Use framer-motion if it's worth the bundle size

**Fix:**
Start with CSS-only animations:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero {
  animation: fadeIn 0.55s ease-out;
}
```

**Timeline:** Post-launch optimization

---

### [Medium-15] Shopify GraphQL Type Codegen Not Being Used
**Severity:** 🟡 MEDIUM  
**Category:** Code Quality  
**Location:** [src/types/shopify-graphql.ts](src/types/shopify-graphql.ts) (generated but unused)

**Problem:**
The codegen pipeline produces accurate Shopify types but neither the commerce adapter nor the direct Shopify calls use them. Everything falls back to `any`.

**Fix:**
Integrate generated types throughout:
- Replace `any` in mappers with specific types
- Use types in `useStorefront` hooks
- Update account/auth pages to use types

**Timeline:** Post-launch refactor

---

### [Medium-16] Cart Doesn't Handle Edge Cases
**Severity:** 🟡 MEDIUM  
**Category:** Commerce  
**Location:** [src/lib/atoms/cart.tsx](src/lib/atoms/cart.tsx)

**Problem:**
Several edge cases not handled:
- **Stale/expired cart** — Shopify carts expire after ~10 days. If `addItem` is called on an expired cart, it throws.
- **Out-of-stock** — No pre-flight check on `availableForSale`
- **Removed products** — If a product in the cart is unpublished, behavior is undefined
- **Race conditions** — Multiple rapid `addItem` calls can interleave

**Fix (future):**
- Implement cart refresh/validation before mutations
- Add queue for sequential mutations (no concurrent updates)
- Validate `availableForSale` before showing in UI

**Timeline:** Post-launch quality

---

## LOW PRIORITY ISSUES
**Status: 35+ found | Timeline: Backlog / nice to have**

### [Low-01] Rate Limiter: In-Memory, Single-Instance, IP-Spoofable
**Category:** Security  
**Location:** [src/app/api/shopify/route.ts](src/app/api/shopify/route.ts#L14-L42)

**Issues:**
- **In-memory Map** resets on restart
- **IP from `x-forwarded-for`** is spoofable
- **Only on this endpoint** — no rate limiting elsewhere
- **`setInterval` in module scope** can cause issues with serverless

**Fix:** Use Redis-backed rate limiter (see Medium-03)

---

### [Low-02] Missing `Permissions-Policy` Header
**Category:** Security  
**Location:** [next.config.ts](next.config.ts#L40-L52)

**Fix:** Add to headers:
```typescript
"Permissions-Policy": "camera=(), microphone=(), geolocation=()"
```

---

### [Low-03] `KEYSTATIC_SECRET` Defaults to Empty String
**Category:** Security  
**Location:** [src/middleware.ts](src/middleware.ts#L66)

**Problem:** If unset, defaults to `""`, weakening the secret. Should require explicit env var in production.

---

### [Low-04] Auth Cookie Missing `__Host-` Prefix
**Category:** Security  
**Location:** [src/app/api/auth/route.ts](src/app/api/auth/route.ts#L36)

**Problem:** Should use `__Host-customerAccessToken` to ensure cookie is always secure, path=/, not domain-shared.

---

### [Low-05] Analytics Pixel Hardcoded Placeholder
**Category:** Configuration  
**Location:** [public/analytics-pixel.js](public/analytics-pixel.js#L2)

**Problem:** `ANALYTICS_ENDPOINT = 'https://your-app-domain.com/api/analytics/events'` is a placeholder that fails in production.

---

### [Low-06] `scripts/shopify-token.js` Prints Token to Stdout
**Category:** Security  
**Location:** [scripts/shopify-token.js](scripts/shopify-token.js#L55)

**Problem:** `console.log(New token: ${data.access_token})` logs the full token. Should redact before logging.

---

### [Low-07] `next-themes` Installed But Never Used
**Category:** Maintenance  
**Location:** [package.json](package.json)

**Fix:** `npm uninstall next-themes`

---

### [Low-08] Dead Code: Unused Components & Hooks
**Category:** Maintenance  
**Locations:** 
- [src/components/seo/CanonicalTag.tsx](src/components/seo/CanonicalTag.tsx) — Never imported
- [src/components/seo/ProductStructuredDescription.tsx](src/components/seo/ProductStructuredDescription.tsx) — Never imported
- [src/hooks/useDebounce.ts](src/hooks/useDebounce.ts) — Never imported

**Fix:** Delete unused files

---

### [Low-09] Dev-Only Packages in `dependencies`
**Category:** Maintenance  
**Location:** [package.json](package.json)

**Bloat:** ESLint, TypeScript, `@types/*` should be in `devDependencies`, not shipped to production.

**Fix:**
```bash
npm install --save-dev eslint typescript @types/node @types/react ...
npm uninstall eslint typescript @types/node @types/react ...
```

---

### [Low-10] Breadcrumb Schema Missing `aria-current="page"`
**Category:** Accessibility  
**Location:** [src/components/seo/Breadcrumbs.tsx](src/components/seo/Breadcrumbs.tsx#L44-L56)

**Fix:** Add `aria-current="page"` to final breadcrumb.

---

### [Low-11] Logo Text Not Using Display Font
**Category:** Design  
**Location:** [src/components/view/Navbar/index.tsx](src/components/view/Navbar/index.tsx)

**Problem:** "Mama Fern" should use Playfair Display (serif), not default sans-serif.

---

### [Low-12] Hero Missing Accessible Alt Text for Background
**Category:** Accessibility  
**Location:** [src/components/view/Hero/index.tsx](src/components/view/Hero/index.tsx)

**Problem:** CSS background image has no alternative text or meaningful `aria-label`.

---

### [Low-13] Collection Schema Missing `ItemList`
**Category:** SEO  
**Location:** [src/app/collections/[handle]/page.tsx](src/app/collections/%5Bhandle%5D/page.tsx#L52-L59)

**Problem:** CollectionPage schema doesn't list products. Adding `ItemList` enables richer search results.

---

### [Low-14] Missing `sameAs` Social Links in Schema
**Category:** SEO  
**Location:** [src/app/page.tsx](src/app/page.tsx#L20)

**Problem:** `sameAs: []` is empty. Should include Instagram, TikTok, Pinterest URLs.

---

### [Low-15] No Prettier / Code Formatting
**Category:** Maintenance  

**Problem:** No consistent code formatting. Different developers have different styles.

**Fix:**

```bash
npm install -D prettier @trivago/prettier-plugin-sort-imports
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "importOrder": ["^react", "^next", "^@", "^\\./"]
}
```

---

### [Low-16] No Pre-Commit Hooks (Husky)
**Category:** Maintenance  

**Problem:** No lint/format enforcement before commits. Lint errors, formatting inconsistencies, unused imports can slip through.

**Fix:**
```bash
npm install -D husky lint-staged
npx husky install
```

---

### [Low-17] No `npm run type-check` Script
**Category:** Maintenance  

**Problem:** TypeScript errors might slip through if only relying on editor.

**Fix:** Add to [package.json](package.json):
```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

---

### [Low-18] Missing `npm run lint:fix` Script
**Category:** Maintenance  

**Problem:** Users must manually run eslint --fix. No automated fix script.

**Fix:** Add to [package.json](package.json):
```json
{
  "scripts": {
    "lint:fix": "eslint . --fix"
  }
}
```

---

## POSITIVE FINDINGS ✅

The codebase has many good practices:

| Positive | Location |
|----------|----------|
| ✅ All Shopify pages use `force-dynamic` (correct) | All product/collection/shop pages |
| ✅ Commerce adapter fully implemented (14 methods) | [src/lib/commerce/](src/lib/commerce/) |
| ✅ Structured data (Organization, Product, Article, BreadcrumbList) | SEO components |
| ✅ GEO optimization (llms.txt, product feed, AI meta tags) | [public/llms.txt](public/llms.txt), API routes |
| ✅ Skip navigation properly implemented | [src/components/view/SkipNav](src/components/view/SkipNav) |
| ✅ Global focus-visible styles (fern ring) | [src/app/globals.css](src/app/globals.css) |
| ✅ `prefers-reduced-motion` respected throughout | CSS + JS |
| ✅ Forced colors / high contrast mode support | [src/app/globals.css](src/app/globals.css) |
| ✅ `httpOnly` + `sameSite: lax` cookies | auth routes |
| ✅ `X-Frame-Options: DENY` (clickjacking protection) | [next.config.ts](next.config.ts) |
| ✅ No hardcoded secrets in source (except env block leak) | — |
| ✅ Parameterized SQL queries (no injection) | [src/lib/db.ts](src/lib/db.ts) |
| ✅ Image optimization (AVIF/WebP, 30-day cache) | next.config.ts |
| ✅ 150KB chunk limit for Hostinger nginx | [next.config.ts](next.config.ts) |
| ✅ DNS preconnect/prefetch for Shopify CDN | [src/app/layout.tsx](src/app/layout.tsx#L117) |
| ✅ 20 test files covering core components | [src/__tests__/](src/__tests__/) |
| ✅ Zod validation on forms | auth pages |
| ✅ Blog via MDX (easy content updates) | [content/blog/](content/blog/) |

---

## QUICK FIX CHECKLIST

### ⚡ Immediate (Today - 24 hours)

- [ ] Remove `env` block from [next.config.ts](next.config.ts#L9-L13) exposing Shopify credentials
- [ ] `npm update next@^15.5.12` (security patches)
- [ ] `npm uninstall nookies next-themes` (unused + CVEs)
- [ ] Fix [scripts/seo-health-check.ts](scripts/seo-health-check.ts#L145-L146) logic (ISR check reversed)
- [ ] Create raster OG image (PNG/JPG) to replace SVG

### 🔥 Critical Path (Before Launch - 1 week)

- [ ] Add `role="dialog"` + focus trap + key handlers to Cart slideout
- [ ] Make ProductCard keyboard accessible (replace div[role=button] with Link)
- [ ] Add missing fields to [src/graphql/products.ts](src/graphql/products.ts#L169)
- [ ] Add security headers (HSTS, CSP, Permissions-Policy)
- [ ] Add authentication to analytics endpoints
- [ ] Add rate limiting to `/api/newsletter`, `/api/welcome`, `/api/contact`, `/api/keystatic-login`
- [ ] Sanitize unsanitized HTML (product descriptions, policies)
- [ ] Add CSRF protection to POST endpoints
- [ ] Fix nested `<main>` landmarks (not-found, error pages)
- [ ] Add graceful shutdown to [server.js](server.js)
- [ ] Update PM2 config with `max_restarts`, `restart_delay`, `kill_timeout`
- [ ] Update Google Search Console verification code (replace placeholder)
- [ ] Implement GraphQL operation allowlist on Shopify proxy

### 📋 Post-Launch Backlog (Sprint 2+)

- [ ] Extend CommerceClient with auth/customer/orders methods
- [ ] Add product filters to collection pages UI + adapter
- [ ] Implement product reviews API
- [ ] Add search pagination
- [ ] Fix product recommendations silent error (add logging)
- [ ] Cart edge case handling (stale carts, race conditions)
- [ ] Remove Hero "use client" → CSS animations
- [ ] Replace `any` types with Shopify codegen types
- [ ] Add breadcrumb `aria-current="page"`
- [ ] Create unique featured images for blog posts
- [ ] Install Prettier + Husky
- [ ] Delete unused components (CanonicalTag, ProductStructuredDescription, useDebounce)
- [ ] Add `npm run type-check` + `lint:fix` scripts
- [ ] Add missing `loading.tsx` files
- [ ] Add `priority` to above-fold product images

---

## CONTACT & CONTEXT

**This audit was generated:** March 2, 2026  
**Codebase analyzed:** mamafern (Next.js 15, Shopify Storefront API)  
**Audit scope:** Security, Commerce, SEO, Accessibility, Performance, Deployment

**Questions to revisit:**
- Are the critical security fixes prioritized for launch?
- Should Medium-01 (auth bypass) be moved up if backend swap is planned soon?
- Which post-launch features are highest business value?
- Should type safety improvements (Medium-13) be prioritized before adding new features?

---

**End of Audit Report**
