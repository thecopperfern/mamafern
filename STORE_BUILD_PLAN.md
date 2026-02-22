# Mama Fern — Store Build Plan
### Headless Shopify + Next.js 15 · High-Conversion Custom Build

> Synthesizes competitive research (Mama X Brand), CRO data, and the existing codebase audit.
> Everything here is custom-coded — no drag-and-drop builders.
> Priority order = conversion impact × effort.

---

## What the Research Told Us

### Mama X Brand — The Playbook to Learn From

Mama X Brand (est. 2016, in Vogue + PEOPLE) is the closest direct comp. Key patterns:

| What They Do | Why It Works | Our Version |
|---|---|---|
| Mama X / Dada X / Mini X naming | Family coordination is instant and psychological | **Mama Fern / Papa Fern / Little Fern** |
| "From one MAMA to another" brand language | Sells community + validation first, product second | Lead with emotional positioning, specs second |
| Peach/tan background, navy accent | Warm, not clinical | Cream + fern green + terracotta (already planned) |
| Out-of-stock items kept visible | Creates demand signal, normalizes popularity | Never hide OOS — show "Notify Me" instead |
| "Last Chance" collection | Urgency without aggressive countdown timers | **Garden Sale** or **Last Drop** collection |
| Free shipping threshold just above single-item AOV | Pushes one more item into cart every time | Set at **$65–$75** (above a solo mom tee, below a family set) |
| Judge.me with verified purchase badges | Credibility without platform-managed reviews | Install Judge.me, seed 5 real reviews before launch |
| Matching family collections page | One customer becomes 3 products per transaction | `/collections/family-sets` with complete look UI |
| Lifestyle photography only | Real moms, no stock photos | Require real family photography before launch |

### CRO Data Points That Drive Every Decision

- Average Shopify store: **1.4% CVR** · Top 10%: **4.8%+** · Women's apparel target: **3.6%**
- Mobile = **~80% of traffic**, **66% of orders** — mobile-first is non-negotiable
- **+1 second load time = -4.42% conversion** — Next.js is an advantage here
- Shop Pay = **+50% checkout-to-order** rate vs. guest checkout (43% of shoppers already have it)
- Size guides reduce returns by **64%**
- FAQ sections increase conversion by **75%** (eliminates pre-checkout doubt)
- **Sticky ATC bar** on mobile is the single highest-ROI UI feature to build

---

## Current Stack — What We Have

```
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Shadcn/ui
Jotai (cart state) · TanStack Query · graphql-request
Embla Carousel · Sonner (toasts) · react-hook-form + zod
```

### What's Working ✓
- Shopify Storefront API connection via GraphQL client
- Cart: add / update / remove / localStorage persist / checkout redirect
- Product detail: image carousel, variant selection, add to cart
- Collections page with pagination
- Auth: login + signup with cookie management
- All Shadcn base UI components

### What's Missing (Build List)
- Brand styling (colors, fonts, logo text)
- Cart **drawer** (currently just a checkout link — no in-page experience)
- **Sticky ATC bar** on mobile product pages
- "Complete the Family Look" cross-sell
- **Fabric & Feel** metafield block
- Email capture popup
- Collection filter + sort UI
- Quick-add on product cards
- Review section (Judge.me embed)
- Free shipping progress bar in cart
- Predictive search
- "Notify Me" for out-of-stock variants
- Account / order history page

---

## Build Priority Order

Ranked by: conversion impact × development speed.

```
TIER 1 — Build First (Before Any Marketing Traffic)
  1. Brand styling (colors, fonts, logo)
  2. Cart drawer with shipping progress bar
  3. Sticky ATC bar on mobile
  4. "Complete the Family Look" cross-sell on product pages
  5. Fabric & Feel metafield block on product pages
  6. Email capture popup (Klaviyo webhook)

TIER 2 — Build Before Launch (Week 4 deadline)
  7. Collection filter + sort UI
  8. Quick-add button on product cards
  9. "Notify Me" for OOS variants (Klaviyo back-in-stock)
  10. Shop Pay button on product + cart pages
  11. Free shipping threshold badge (on product pages)

TIER 3 — Build During Campaign (Week 5-8)
  12. Gift bundle product pages with bundle builder
  13. Mother's Day gift guide collection page (custom layout)
  14. Review section (Judge.me script embed)
  15. "Last Drop" / Garden Sale collection with countdown
  16. Predictive search
  17. Account / order history page
```

---

## TIER 1 — Detailed Build Specs

---

### 1. Brand Styling

**Files to change:**

**`src/app/globals.css`** — Add CSS variables:
```css
:root {
  --cream: #F5EFE0;
  --fern: #4A7C59;
  --sage: #8FAF8B;
  --terracotta: #C4622D;
  --blush: #C49B8A;
  --ink: #2C2C2C;
  --radius: 0.5rem;
}
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--cream);
  color: var(--ink);
}
```

**`tailwind.config.ts`** — Add brand tokens:
```ts
colors: {
  cream: '#F5EFE0',
  fern: { DEFAULT: '#4A7C59', light: '#8FAF8B' },
  terracotta: '#C4622D',
  blush: '#C49B8A',
  ink: '#2C2C2C',
}
```

**`src/app/layout.tsx`** — Load fonts via `next/font`:
```ts
import { Inter } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
// Inter for UI, Cormorant Garamond for headlines/display
```

**`src/components/view/Logo/index.tsx`** — Change "Minimal Store" → "Mama Fern"

**`src/app/layout.tsx`** metadata:
```ts
export const metadata = {
  title: 'Mama Fern — Grounded Family Apparel',
  description: 'Organic cotton tees and sets for moms, dads, and kids. Grounded family apparel for crunchy, cozy homes.',
  openGraph: { images: ['/og-image.jpg'] }
}
```

---

### 2. Cart Drawer

The biggest UX gap. Currently clicking cart redirects to Shopify checkout. Instead:

**New component:** `src/components/view/CartDrawer/index.tsx`

```tsx
// Structure:
<Sheet open={isOpen} onOpenChange={setIsOpen}>        // Radix Sheet (slide-in drawer)
  <SheetContent side="right" className="w-[400px]">
    <ShippingProgressBar />                            // "Add $X for free shipping"
    <CartLineItems />                                  // list of items with qty stepper
    <CartCrossSells />                                 // 2-3 "Complete the look" products
    <CartFooter>
      <Subtotal />
      <CheckoutButton href={cart.checkoutUrl} />       // → Shopify checkout
      <ShopPayButton />                                // → cart.checkoutUrl + shop_pay param
    </CartFooter>
  </SheetContent>
</Sheet>
```

**`ShippingProgressBar`** — Custom component:
```tsx
// Free shipping at $70
const threshold = 70
const remaining = threshold - subtotal
const progress = Math.min((subtotal / threshold) * 100, 100)

// UI: Progress bar + text
// "You're $18 away from free shipping"
// "You've unlocked free shipping! 🌿"
```

**Cart state update** in `src/lib/atoms/cart.tsx`:
- Add `isCartOpen` atom (boolean)
- Trigger drawer open on `addItem()` success

**Navbar update:** Cart button toggles `isCartOpen` atom instead of linking to checkout.

---

### 3. Sticky ATC Bar (Mobile)

**File:** `src/components/view/StickyATC/index.tsx`

Appears when the main ATC button scrolls out of view on mobile. Stays at the bottom of the viewport.

```tsx
// Behavior:
// - Hidden when main ATC button is in viewport
// - Slides up from bottom when user scrolls past ATC
// - Contains: condensed product name + selected variant + price + CTA

const StickyATC = ({ product, selectedOptions, onAddToCart }) => {
  const [visible, setVisible] = useState(false)
  const atcRef = useRef(null)  // ref on the main ATC button

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (atcRef.current) observer.observe(atcRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-fern
      transition-transform md:hidden
      ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium truncate">{product.title}</p>
          <p className="text-xs text-ink/60">{selectedVariant}</p>
        </div>
        <span className="text-sm font-semibold">${price}</span>
        <Button onClick={onAddToCart} className="bg-fern text-white">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
```

---

### 4. "Complete the Family Look" Cross-Sell

**File:** `src/components/view/FamilyLook/index.tsx`

Displayed below-fold on every product page. Fetches 3 related products by Shopify collection tag.

**Shopify setup required:**
- Each product tagged with: `family-set-{handle}` (e.g., `family-set-fern-logo`)
- Related products share the same tag
- Query by tag to fetch the full family

```tsx
// Component fetches products where tag matches current product's family-set tag
// Displays as horizontal scroll on mobile, 3-col grid on desktop

<section>
  <h2 className="font-display text-2xl">Complete the Family Look</h2>
  <p className="text-sm text-ink/60">Mama Fern · Papa Fern · Little Fern</p>
  <div className="grid grid-cols-3 gap-4">
    {familyProducts.map(p => (
      <FamilyLookCard
        key={p.id}
        product={p}
        label={p.tags.includes('mama') ? 'Mama Fern' : p.tags.includes('papa') ? 'Papa Fern' : 'Little Fern'}
      />
    ))}
  </div>
  <Button variant="outline">Shop Family Sets →</Button>
</section>
```

---

### 5. Fabric & Feel Block

**File:** `src/components/view/FabricBlock/index.tsx`

Mama Fern's #1 purchase justification for the crunchy mom customer. Powered by Shopify metafields.

**Shopify metafields to create** (in admin → Settings → Custom data):
```
Namespace: custom
fabric_composition  →  "100% GOTS-certified organic cotton"
fabric_weight       →  "150 gsm — lightweight, breathable"
fabric_feel         →  "Butter-soft — pre-washed for immediate wear"
fit_notes           →  "True to size | runs slightly relaxed"
care_instructions   →  "Machine wash cold, tumble dry low"
certifications      →  "GOTS | OEKO-TEX Standard 100"
```

**GraphQL query update** — add to `GET_PRODUCT_BY_HANDLE_QUERY`:
```graphql
metafields(identifiers: [
  { namespace: "custom", key: "fabric_composition" },
  { namespace: "custom", key: "fabric_weight" },
  { namespace: "custom", key: "fabric_feel" },
  { namespace: "custom", key: "fit_notes" },
  { namespace: "custom", key: "care_instructions" },
  { namespace: "custom", key: "certifications" }
]) {
  namespace
  key
  value
}
```

**UI — displayed as a clean spec table:**
```
┌─────────────────────────────────────────────┐
│  🌿  Fabric & Feel                          │
├──────────────┬──────────────────────────────┤
│  Material    │  100% GOTS-certified organic  │
│  Weight      │  150 gsm · lightweight        │
│  Feel        │  Butter-soft, pre-washed      │
│  Fit         │  True to size, relaxed cut    │
│  Care        │  Cold wash, low tumble        │
│  Certified   │  GOTS · OEKO-TEX              │
└──────────────┴──────────────────────────────┘
```

---

### 6. Email Capture Popup

**File:** `src/components/view/EmailPopup/index.tsx`

- Triggers 8 seconds after page load OR on exit intent (mouseleave on desktop)
- Offers 10% off first order in exchange for email
- Sends email to Klaviyo via their Subscribe API (no Shopify app required)
- Stores dismissal in `localStorage` so it doesn't re-show for 7 days

**Klaviyo integration** — POST to:
```
https://a.klaviyo.com/client/subscriptions/?company_id=YOUR_PUBLIC_API_KEY
```
Body: `{ data: { type: 'subscription', attributes: { profile: { email }, list_id: 'LIST_ID' } } }`

This is a public-facing API — safe to call from the browser with the public key.

---

## TIER 2 — Build Specs

---

### 7. Collection Filter + Sort UI

**File:** `src/components/view/CollectionFilters/index.tsx`

The GraphQL query already supports `sortKey`, `reverse`, and `filters` — just need the UI.

**Sort options:** Featured | Newest | Price: Low → High | Price: High → Low | Best Selling
**Filter options:** Size (from product options) | Color (from product options) | In Stock only

```tsx
// URL-driven filters (search params)
// /collections/moms?sort=PRICE_ASC&filter.v.availability=1&filter.v.option.size=M

// Uses Next.js useSearchParams + useRouter for URL state
// No external filter library needed
```

---

### 8. Quick-Add on Product Cards

**File:** Update `src/components/view/ProductCard/index.tsx`

**Behavior:**
- Desktop: hover reveals a quick-add CTA
- Mobile: always-visible small "+" button
- If product has variants: clicking opens a size/color mini-selector sheet
- If single variant: adds directly with toast confirmation

---

### 9. Notify Me (OOS Variants)

**File:** `src/components/view/NotifyMe/index.tsx`

Replaces the ATC button when selected variant is out of stock.
Submits email to Klaviyo back-in-stock list.
Keeps demand visible, builds email list, reduces bounce.

---

### 10. Shop Pay Button

Add `<ShopPayButton />` component to:
- Product detail page (below ATC)
- Cart drawer footer

Shopify Storefront API provides a `paymentSettings` query that returns the Shop Pay client ID.
Or simply use the standard Shopify Pay URL format:
```
https://shop.app/checkout?shop_pay=1&cart={cartId}
```

---

### 11. Free Shipping Badge on Product Pages

Small contextual nudge under the price:
```
🌿 Free shipping on orders over $70 — add a Little Fern to qualify
```
Shown only when current product price is below $70.

---

## TIER 3 — Detailed Specs

---

### 12. Gift Bundle Builder

**File:** `src/components/view/BundleBuilder/index.tsx`

Custom component (no Shopify Bundles app needed for MVP).

**Implementation:** Create a bundle as a Shopify product with a variant per bundle configuration. The bundle product page renders a "choose your sizes" UI that maps to a specific variant.

OR (more flexible): Use a draft order via Shopify Storefront API — add 3 line items to cart simultaneously with a bundle discount applied via a `discountCode`.

**MVP approach:**
- Create bundles as regular Shopify products
- Use product description to list what's included
- Add a cart note with bundle contents
- Apply bundle discount code at checkout (simpler than draft orders)

---

### 13. Mother's Day Gift Guide Page

**File:** `src/app/mothers-day/page.tsx`

Custom layout (not the standard collection grid):
- Hero: "For every kind of mama" — full-width, lifestyle photography
- Sections: "For the New Mama" | "For the Mama of Many" | "The Family Set"
- Each section pulls from Shopify collection filtered by product tag
- Prominent gift wrapping callout
- Shipping cutoff countdown (May 7)
- Shares URL: `/mothers-day` — memorable, shareable, linkable

---

### 14. Review Section (Judge.me)

Judge.me provides a JavaScript embed script. In a headless setup:

```tsx
// In product page, add a Client Component that loads Judge.me
'use client'
useEffect(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.judge.me/assets/shopify-widget.js'
  script.async = true
  document.body.appendChild(script)
  window.jdgm = window.jdgm || {}
  window.jdgm.SHOP_DOMAIN = 'mamafern.myshopify.com'
  window.jdgm.PLATFORM = 'shopify'
}, [])

// Add data attributes to the div where reviews render
<div
  data-id={product.id}
  data-handle={product.handle}
  className="jdgm-widget jdgm-review-widget"
/>
```

Stars on product cards use Judge.me's `data-jdgm-widget="star-rating"` attribute.

---

### 15. Predictive Search

**File:** `src/components/view/SearchDrawer/index.tsx`

Shopify Storefront API has a `predictiveSearch` query:
```graphql
query PredictiveSearch($query: String!, $limit: Int!) {
  predictiveSearch(query: $query, limit: $limit, types: [PRODUCT, COLLECTION]) {
    products { id, handle, title, priceRange, featuredImage }
    collections { id, handle, title, image }
  }
}
```

Use `useDebounce` (already exists in codebase) to debounce input at 300ms.
Render results in a dropdown or full-screen overlay on mobile.

---

## Product Page Anatomy — Target Layout

```
┌─────────────────────────────────────────────────┐
│  [IMAGE GALLERY]           [PRODUCT INFO]        │
│  5–7 images                Title                 │
│  Swipeable mobile          ⭐⭐⭐⭐⭐ 42 reviews   │
│  Pinch-to-zoom             $XX.XX                │
│                            🌿 Free shipping $70+ │
│                            ─────────────────     │
│                            Color: [swatches]     │
│                            Size: [S][M][L][XL]   │
│                            [Size Guide link]     │
│                            ─────────────────     │
│                            [  ADD TO CART  ]     │
│                            [  SHOP PAY     ]     │
│                            ─────────────────     │
│                            ✓ Ships in 2–3 days   │
│                            ✓ Easy 30-day returns  │
│                            ✓ Organic cotton       │
├─────────────────────────────────────────────────┤
│  FABRIC & FEEL (metafield block)                │
├─────────────────────────────────────────────────┤
│  DESCRIPTION (benefit-first, short)             │
├─────────────────────────────────────────────────┤
│  FAQ (accordion — size, shipping, returns)      │
├─────────────────────────────────────────────────┤
│  COMPLETE THE FAMILY LOOK                       │
│  [Mama Fern]  [Papa Fern]  [Little Fern]        │
├─────────────────────────────────────────────────┤
│  REVIEWS (Judge.me embed)                       │
└─────────────────────────────────────────────────┘

MOBILE ONLY: Sticky ATC bar (fixed bottom)
```

---

## Custom Apps to Code (No Third-Party Required)

| Feature | Third-Party App | Our Custom Build |
|---------|----------------|-----------------|
| Email capture | Privy / Klaviyo popup | Custom `EmailPopup` → Klaviyo Subscribe API |
| Notify Me | Back In Stock app | Custom `NotifyMe` → Klaviyo back-in-stock |
| Cross-sell | ReConvert | Custom `FamilyLook` component |
| Bundle pricing | Shopify Bundles | MVP: bundle products + discount codes |
| Free shipping bar | various | Custom `ShippingProgressBar` in cart drawer |
| Sticky ATC | various | Custom `StickyATC` with IntersectionObserver |
| Search | Searchanise | Shopify Storefront predictiveSearch API |
| Reviews display | Judge.me widget | Judge.me headless embed (JS snippet in client component) |

---

## Shopify Admin Setup Checklist

Before any frontend work is meaningful, these must exist in Shopify admin:

```
Products
  [ ] All products created with real photos, variants, pricing
  [ ] Each product tagged: mama-fern | papa-fern | little-fern
  [ ] Each product tagged with family-set handle: family-set-{name}
  [ ] Metafields filled: fabric_composition, fabric_feel, care_instructions, certifications

Collections
  [ ] moms          — evergreen
  [ ] kids          — evergreen
  [ ] family-sets   — coordinating looks
  [ ] mothers-day-2026
  [ ] last-drop     — (Garden Sale / limited availability)

Settings
  [ ] Shop Pay enabled in Shopify Payments settings
  [ ] Free shipping rate configured at $70+ in Shopify Shipping settings
  [ ] Judge.me app installed (generates reviews widget script)
  [ ] Klaviyo app installed in Shopify admin (connects purchase events)
  [ ] Gift cards enabled (Products → Gift cards)
```

---

## Tech Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Cart state | Jotai atom (existing) | Already built, extend it |
| Cart drawer | Radix `Sheet` (add to Shadcn) | Accessible, animates correctly |
| Email | Klaviyo Subscribe API (client-side) | Free tier, best Shopify integration |
| Reviews | Judge.me (JS embed in Client Component) | Headless-compatible, free plan |
| Search | Shopify predictiveSearch API | No third-party needed |
| Bundles MVP | Bundle product + discount code | Zero complexity, works immediately |
| Fonts | Inter (next/font) + Cormorant Garamond | Inter for UI, Cormorant for display |
| Images | `next/image` + Shopify CDN | Already configured in next.config.ts |
| Analytics | Shopify Analytics + Klaviyo events | Free, covers 90% of needs |

---

## Naming System

Apply consistently across all products, collections, copy, and navigation:

| Product Type | Shopify Tag | Display Name | URL |
|---|---|---|---|
| Women's | `mama-fern` | Mama Fern | `/collections/moms` |
| Men's | `papa-fern` | Papa Fern | `/collections/dads` |
| Kids/Baby | `little-fern` | Little Fern | `/collections/kids` |
| Matching sets | `family-set` | Family Sets | `/collections/family-sets` |

This makes "Complete the Family Look" cross-sells work automatically — query by `family-set-{handle}` tag and the system surfaces the full family automatically.

---

## What to Build in What Order (Concrete Next Steps)

```
SESSION 1 (today)
  → Brand styling: globals.css + tailwind.config.ts + Logo + layout metadata
  → Install Radix Sheet (for cart drawer)
  → Cart drawer: ShippingProgressBar + CartLineItems + CheckoutButton

SESSION 2
  → Sticky ATC bar with IntersectionObserver
  → Quick-add on ProductCard (desktop hover + mobile button)
  → "Notify Me" for OOS variants

SESSION 3
  → Fabric & Feel block (update GraphQL query + build component)
  → "Complete the Family Look" cross-sell
  → Product page layout restructure (match target anatomy above)

SESSION 4
  → Email capture popup → Klaviyo Subscribe API
  → Collection filter + sort UI (URL-driven)
  → Shop Pay button

SESSION 5
  → Mother's Day gift guide page (/mothers-day)
  → Gift bundle pages
  → Judge.me review embed

SESSION 6
  → Predictive search drawer
  → Account / order history page
  → Final mobile QA + performance audit
```

---

> Reference files: `RESEARCH_NOTES.md` · `MOTHERS_DAY_CAMPAIGN.md` · `ACTION_PLAN.md` · `PRD.md`
