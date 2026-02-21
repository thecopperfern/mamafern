# Product Requirements Document (PRD)
## Mama Fern — Headless Shopify Storefront (Next.js)

> **Base Starter:** [chetanverma16/nextjs-shopify-starter](https://github.com/chetanverma16/nextjs-shopify-starter)
>
> This PRD is designed to be handed to Claude Code to scaffold the store in as few sessions as possible.

---

## 0. Overview

Mama Fern is a mom-owned, family apparel and accessories brand focused on **grounded, minimal, playful, natural, happy** designs. The store sells a limited number of SKUs (capsule-style and small drops), primarily organic cotton or similar skin-friendly materials, with cute patterns and sayings (text + graphics) for moms, dads, and kids.

**Goal:** Launch a custom-coded Next.js storefront using a headless Shopify backend, with a clearly separated commerce layer so the backend can be swapped later without rewriting the entire front end.

---

## 1. Goals and Constraints

### 1.1 Business Goals (Year 1)

- Launch mamafern.com as the primary sales channel
- Sell small, themed drops (holidays, seasons) plus a few evergreen staples
- Position as mid-premium to upper-mid-premium family apparel — not cheap fast fashion, not luxury

### 1.2 Technical Goals

- Use **Next.js App Router**, TypeScript, TailwindCSS via `nextjs-shopify-starter` as the base
- Use Shopify Storefront API as the commerce backend, but:
  - Encapsulate all Shopify API logic in a thin **commerce adapter layer**
  - Ensure that replacing Shopify later requires mostly adapter changes, not component rewrites
- Keep product, variant, image, pricing, and collection management entirely in Shopify admin

### 1.3 Constraints

- No paid visual builders (e.g., Builder.io); no recurring SaaS for drag-and-drop
- Must allow non-developer operations in Shopify admin:
  - Add/edit products and variants
  - Add images
  - Adjust prices
  - Create collections (e.g., "Spring Drop," "Evergreen Staples")
- Frontend should remain mostly unchanged if Shopify is replaced later

---

## 2. Brand and Experience Requirements

### 2.1 Brand Positioning

- **Brand name:** Mama Fern
- **Tagline (draft):** "Grounded family apparel for crunchy, cozy homes."
- **Key adjectives:** grounded, minimal, playful, natural, happy
- **Promise:** "Cute patterns and sayings in skin-friendlier fabrics (organic cotton where possible), designed for moms, dads, and kids."

### 2.2 Visual Direction

**Color Palette:**
| Role | Color |
|------|-------|
| Base | Cream / oat, warm white |
| Primary | Fern green, muted sage |
| Secondary accents | Soft terracotta, blush, warm brown |

**Typography:**
- **Primary UI font:** Clean, humanist sans-serif (Inter, Satoshi, or similar)
- **Display font:** Gentle serif or soft hand-drawn style for logo, headlines, and product sayings

**Photography / Imagery Style:**
- Lifestyle: homes with wood, antiques, cast iron, sourdough, cozy "crunchy" vibes
- Product: close-ups showing fabric texture, tags, and small graphic + text combinations

### 2.3 Tone of Voice

- Friendly, calm, and grounded
- Lightly "crunchy" (natural, wholesome) without being judgmental or preachy
- Emphasis on comfort, materials, and family moments

---

## 3. Product and Merchandising Model

### 3.1 Catalog Structure (Shopify Collections)

| Collection Handle | Display Name | Description |
|------------------|--------------|-------------|
| `moms` | Moms | Women's styles and mom-specific designs |
| `dads` | Dads | Men's styles and dad-specific designs |
| `kids` | Kids | Children's tees, onesies, bodysuits |
| `family` | Family | Coordinating family sets |
| `accessories` | Accessories | Totes, hats, beanies |
| `evergreen-staples` | Evergreen Staples | Always-available core SKUs |
| `[drop-handle]` | Seasonal Drops | One collection per drop (e.g., `valentines-2026`, `summer-play`) |

### 3.2 Product Types

**Adults:**
- Organic cotton tees (unisex and women's fits)
- Lightweight sweatshirts / crewnecks

**Kids:**
- Tees
- Onesies / bodysuits

**Accessories:**
- Tote bags
- Beanie or dad hat

**Variants:**
- Size, color (and possibly fit)

**Key Product Attributes (Shopify metafields or description blocks):**
- Fabric composition
- Care instructions
- "Feel" descriptor (e.g., "soft, mid-weight")

### 3.3 Design Principles

- Small graphics (ferns, homes, bread, coffee mugs, simple line drawings)
- Short phrases / sayings — no giant streetwear fonts
- Family coordination:
  - Same color palette across mom / dad / kid cuts
  - Some designs identical across adult/kid versions, others complementary

---

## 4. User Experience Requirements

### 4.1 Target Users

- **Primary:** Millennial / Gen-Z "crunchy" moms who value skin-friendlier fabrics and cozy aesthetics
- **Secondary:** Dads and gift-givers

### 4.2 Key User Journeys

1. Browse by category (Moms / Dads / Kids / Accessories) → view product → add to cart → checkout
2. Visit homepage → see seasonal drop and evergreen staples → click into featured collection
3. Discover coordinating items via "Complete the family look" suggestions on product pages

---

## 5. Information Architecture

### 5.1 Site Map

```
/                                   Home
/shop                               All products or shop landing (optional)
/collections/moms                   Moms collection
/collections/dads                   Dads collection
/collections/kids                   Kids collection
/collections/family                 Family / coordinating sets
/collections/accessories            Accessories
/collections/[handle]               Seasonal drops + evergreen staples
/products/[handle]                  Product detail page
/about                              Brand story
/faq                                Frequently asked questions
/community (or /journal)            Blog / updates / community posts
/contact                            Contact form or info
/cart                               Cart page
/account                            Customer account (when enabled)
```

---

## 6. Functional Requirements

### 6.1 Home Page

**Hero Section:**
- One or two hero banners (image or gradient background)
- Headline (Mama Fern value prop)
- Subheadline
- Primary CTA: "Shop Evergreen Staples" or current seasonal drop

**Sections:**
1. Featured collection (current seasonal drop)
2. Evergreen Staples preview (3-4 products)
3. Category cards: Moms / Dads / Kids / Accessories
4. Optional: small About snippet linking to `/about`

### 6.2 Collection Pages

- Product grid layout
- Sort options: relevance (default), price low-high, price high-low, newest
- Optional V2: size / color filter sidebar
- Collection description text block (for SEO and brand voice)

### 6.3 Product Detail Pages

**Gallery:**
- 3-6 images with thumbnail navigation (Embla carousel from starter)

**Core Information:**
- Title, price, variant selector (size, color)
- Stock status per variant (from Shopify availability data)

**Content Sections:**
- Short description
- "Fabric & Feel" block (organic cotton info, softness descriptor)
- Care instructions

**"Complete the Family Look" Section:**
- 3-6 related products from the same collection(s) — matching kids / partner version
- Pulled via Shopify collection or manual product metafield cross-references

### 6.4 Cart and Checkout

**Cart (slideout or page):**
- Line items with variant info, quantity controls, remove button
- Subtotal
- CTA: "Proceed to Checkout" → Shopify hosted checkout via `cart.checkoutUrl`

**Checkout:**
- Shopify's hosted checkout handles payment, address, confirmation
- No custom checkout required

### 6.5 Static / Content Pages

| Page | Implementation |
|------|---------------|
| `/about` | Static React component or MDX |
| `/faq` | Static React with accordion component |
| `/community` or `/journal` | Static React or MDX-based posts |
| `/contact` | Contact form (Formspree, or Shopify form app) |

Content pages should be editable via file changes (MDX or JSON), not requiring a CMS initially.

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Mobile-first responsive design
- Green Core Web Vitals (LCP, CLS, INP) on Home, Collection, and Product pages
- `next/image` for all product and lifestyle images
- ISR (`revalidate = 60`) on product and collection pages

### 7.2 Accessibility

- Semantic HTML structure throughout
- Alt text on all product images (sourced from Shopify product image alt text field)
- Keyboard navigable menus, modals, and cart interactions
- WCAG AA contrast compliance in the color palette

### 7.3 SEO

- Dynamic `<title>` and `<meta description>` using product/collection data via `generateMetadata`
- OpenGraph image tags on home, collection, and product pages
- JSON-LD structured data: Product schema, BreadcrumbList, Organization
- `sitemap.xml` — generated dynamically by Next.js App Router
- `robots.txt` — allow all, disallow `/api/`
- Canonical URLs on all pages

---

## 8. Architecture and Technical Design

### 8.1 Base Stack

- **Starter:** [`chetanverma16/nextjs-shopify-starter`](https://github.com/chetanverma16/nextjs-shopify-starter)
- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Commerce:** Shopify Storefront API (GraphQL via `graphql-request`)
- **State:** Jotai (cart) + TanStack Query (server state)

### 8.2 Commerce Adapter Layer

**All Shopify-specific logic must be isolated in `lib/commerce/shopify/`.** Components and pages import from `lib/commerce` only — never directly from Shopify helpers.

**Directory structure:**
```
src/lib/commerce/
├── types.ts              # Shared commerce types (CommerceProduct, etc.)
├── index.ts              # Exports active client (shopifyClient by default)
└── shopify/
    └── client.ts         # Shopify Storefront API implementation
```

**`lib/commerce/types.ts`:**
```ts
export type CommerceProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: { url: string; alt?: string }[];
  variants: {
    id: string;
    title: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    selectedOptions: { name: string; value: string }[];
    available: boolean;
  }[];
  collections: { id: string; handle: string; title: string }[];
  metafields?: Record<string, string | number | boolean>;
};

export type CommerceCollection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  products: CommerceProduct[];
};

export interface CommerceClient {
  getProductByHandle(handle: string): Promise<CommerceProduct | null>;
  getProducts(params?: { collectionHandle?: string; limit?: number }): Promise<CommerceProduct[]>;
  getCollectionByHandle(handle: string): Promise<CommerceCollection | null>;
  getCollections(params?: { limit?: number }): Promise<CommerceCollection[]>;
  createCart(initialLines?: { merchandiseId: string; quantity: number }[]): Promise<{ id: string }>;
  getCart(cartId: string): Promise<any>;
  addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<any>;
  updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<any>;
  removeFromCart(cartId: string, lineIds: string[]): Promise<any>;
  getCheckoutUrl(cartId: string): Promise<string>;
}
```

**`lib/commerce/index.ts`:**
```ts
import { shopifyClient } from "./shopify/client";
export const commerceClient = shopifyClient;
```

**Migration later:** Implement `lib/commerce/newBackend/client.ts` and update the `commerceClient` export. Frontend unchanged.

### 8.3 Environment Variables

```bash
# .env.local
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=your-storefront-access-token
SHOPIFY_STOREFRONT_API_VERSION=2025-01
```

These should be used only inside `lib/commerce/shopify/client.ts` — never in components.

---

## 9. Theming and Layout

### 9.1 Tailwind Config Updates

Update `tailwind.config.ts` with Mama Fern palette:

```ts
colors: {
  cream:      '#FAF7F2',
  oat:        '#F2EDE4',
  fern:       '#4A7C59',
  sage:       '#8FAF8B',
  terracotta: '#C97B5A',
  blush:      '#E8B4A0',
  brown:      '#7A5C44',
}
```

### 9.2 Global Layout

**Header:**
- Left: Mama Fern logo / wordmark (display font)
- Center: navigation — Shop, Moms, Dads, Kids, Accessories
- Right: cart icon with item count badge

**Footer:**
- Links: About, FAQ, Community/Journal, Contact, Policies
- Newsletter signup (V2)

### 9.3 Product Card Component

```
┌────────────────────────────┐
│  [Product Image]           │
│                            │
│  Product Name              │
│  From $XX.XX               │
│  [Category tag]            │
└────────────────────────────┘
```

- Soft corners
- Subtle hover state (scale or shadow)
- "Add to Cart" button visible on hover

---

## 10. Migration Considerations

### 10.1 Short Term (Shopify)

- Use Shopify's hosted checkout and Storefront API for all commerce operations
- Use Shopify CSV export for catalog backup snapshots
- All product/collection management stays in Shopify admin

### 10.2 Future Migration Path (Off Shopify)

Because all commerce access runs through `commerceClient`:

1. Implement `lib/commerce/newBackend/client.ts` matching the `CommerceClient` interface
2. Migrate product/catalog data via Shopify CSV export into the new backend
3. Update `lib/commerce/index.ts` to export the new client
4. Frontend components and pages require no changes

---

## 11. Deliverables for Claude Code

When handing this PRD to Claude Code, the expected output is:

### Step 1 — Commerce Adapter Setup
- Add `src/lib/commerce/types.ts`
- Add `src/lib/commerce/shopify/client.ts` (implementing `CommerceClient` using existing GraphQL queries from `src/graphql/`)
- Add `src/lib/commerce/index.ts`
- Refactor existing Shopify calls in pages/components to use `commerceClient`

### Step 2 — Theming
- Update `tailwind.config.ts` with Mama Fern palette
- Update `src/app/layout.tsx` metadata (title, description, OG)
- Update `src/components/view/Logo/index.tsx` to render "Mama Fern" with display font
- Set up Google Fonts or local font for display (Playfair Display, Cormorant, or similar gentle serif)

### Step 3 — Navigation + Collections
- Update Navbar: Moms, Dads, Kids, Accessories (replace current Men/Women)
- Add footer component with navigation links
- Ensure `/collections/[handle]` routes work for: moms, dads, kids, family, accessories, evergreen-staples

### Step 4 — Home Page
- Hero section (headline, subheadline, CTA)
- Featured collection section
- Category cards (Moms / Dads / Kids / Accessories)
- Evergreen Staples product preview row

### Step 5 — Product Detail Page Enhancements
- "Fabric & Feel" content block
- Care instructions block
- "Complete the Family Look" cross-sell section (related products from same collection)

### Step 6 — Checkout + Cart
- Checkout page (`/app/checkout/page.tsx`) with cart summary and Shopify checkout redirect
- Cart slideout or cart page with quantity update + remove

### Step 7 — Static Pages
- `/about` — brand story template
- `/faq` — accordion-based FAQ template
- `/community` — simple blog/journal listing page
- `/contact` — contact form

### Step 8 — SEO
- `generateMetadata` on product and collection pages
- JSON-LD structured data (Product, BreadcrumbList, Organization)
- `src/app/sitemap.ts` — dynamic sitemap
- `src/app/robots.ts`

### Step 9 — Documentation
- `docs/commerce-adapter.md` — how to swap the commerce backend
- `docs/shopify-operations.md` — how to add products, collections, and map handles to the site

---

## 12. Out of Scope (V1)

- Custom checkout UI (use Shopify hosted checkout)
- Customer accounts / order history (V2)
- Blog CMS with admin UI (static MDX files only in V1)
- Advanced filtering (size, color) on collection pages (V2)
- Newsletter app integration (V2)
- Paid analytics tools (V2)
- Multi-currency / multi-language (V2)

---

## Key External Links

- [Starter Repo](https://github.com/chetanverma16/nextjs-shopify-starter)
- [Shopify Storefront API Docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started)
- [Shopify Storefront API Reference](https://shopify.dev/docs/api/storefront/latest)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Shopify CSV Export Guide](https://help.shopify.com/en/manual/products/import-export/export-products)
