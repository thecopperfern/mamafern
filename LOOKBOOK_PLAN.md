# Shop the Look -- Merge Plan for Claude Code

## Context

The `lookbook` branch has a working "Shop the Look" feature built in Bolt. This document tells Claude Code exactly what exists, what needs attention, and what to build next. The feature was built across two sessions and combined -- some cleanup and improvements are needed before it's production-ready.

---

## Current File Inventory (lookbook branch)

### Frontend Components (`src/components/shop-the-look/`)

| File | Purpose | Status |
|------|---------|--------|
| `ShopTheLook.tsx` | Main section wrapper. Receives `initialLooks` as server-side props. Renders heading, LookTabs, LookHero, and product grid. | Working |
| `LookTabs.tsx` | Tab switcher using shadcn Tabs. Render-prop pattern -- takes `children: (look) => ReactNode`. | Working |
| `LookHero.tsx` | Hero image display with fern SVG decorations and title overlay gradient. Shows placeholder if no image set. Has inline `FernSvg()` helper. | Working |
| `ProductSpot.tsx` | Product card with 3:4 aspect ratio image, Coming Soon badge overlay, hover scale, opens QuickViewModal on click. | Working |
| `QuickViewModal.tsx` | shadcn Dialog modal. Two-column layout with product image, title, price, Coming Soon badge (amber), and "View Full Details" / "Preview Product" button. | Working |

### Admin Panel (`src/app/lookadmin/`)

| File | Purpose | Status |
|------|---------|--------|
| `page.tsx` | Single-file admin page (~700 lines). Password gate, three-tab editor, Shopify product loader, image selector, Coming Soon toggle, save to JSON. | Working but oversized |
| `data/route.ts` | GET reads `data/looks.json`, POST writes it (auth via Bearer token). | Working |
| `shopify/route.ts` | GET proxies Shopify Storefront API. Returns simplified product list with images. Auth via Bearer token. | Working |

### Data

| File | Purpose |
|------|---------|
| `data/looks.json` | Seed data with 3 looks (moms/dads/family). Moms has 3 placeholder products using Unsplash URLs. Dads and Family are empty templates. |

### Homepage Integration

`src/app/page.tsx` reads `data/looks.json` server-side via `fs.readFileSync` and passes `initialLooks` prop to `<ShopTheLook />`. Renders below the Hero and above CategoryCards.

### Environment Variables

In `.env`:
```
LOOK_ADMIN_PASS=mamafern-admin-2026
NEXT_PUBLIC_LOOK_ADMIN_PASS=mamafern-admin-2026
```

### shadcn Components Added

- `src/components/ui/dialog.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/tabs.tsx`

### CSS Addition

`src/app/globals.css` has an `admin-input` class in `@layer components` -- this is orphaned and unused (the admin page uses shadcn Input instead). Remove it.

---

## Known Issues to Fix

### 1. Remove orphaned CSS class

The `.admin-input` class in `globals.css` is not used anywhere. Remove the entire `@layer components { ... }` block that was added.

**File:** `src/app/globals.css`

### 2. Remove orphaned `.env.example` if it was created

An `.env.example` may have been created in Bolt. Check if it exists. If so, verify its contents match the real env vars the project needs. The original repo did not have one -- check if one should be added per the CLAUDE.md instructions (it says "use `.env.example` instead" when referencing env patterns).

### 3. Admin page is too large (700+ lines)

`src/app/lookadmin/page.tsx` is a single 700-line file. Per the project's coding standards, files should stay under 200-300 lines. Split it:

- `src/app/lookadmin/page.tsx` -- Shell with auth gate and loading state (~60 lines)
- `src/app/lookadmin/AdminPanel.tsx` -- Main admin UI with tabs and save (~250 lines)
- `src/app/lookadmin/HeroEditor.tsx` -- Step 1 hero image editing section (~80 lines)
- `src/app/lookadmin/ProductSelector.tsx` -- Step 2 Shopify product loading and checkbox list (~120 lines)
- `src/app/lookadmin/ProductConfigurator.tsx` -- Image gallery, Coming Soon toggle, URL editor per selected product (~100 lines)
- `src/app/lookadmin/types.ts` -- Shared interfaces (Product, Look, LooksData, ShopifyProduct) (~30 lines)

### 4. Duplicated types across components

The `Product` and `Look` interfaces are copy-pasted into ShopTheLook.tsx, LookTabs.tsx, ProductSpot.tsx, and QuickViewModal.tsx. Extract them to a shared types file:

- Create `src/components/shop-the-look/types.ts` with the shared interfaces
- Update all 4 components to import from `./types`

### 5. QuickViewModal has unused import

`QuickViewModal.tsx` imports `useState` from React but never uses it. Remove the import.

### 6. Homepage `page.tsx` has inline type annotation

Line 61 of `src/app/page.tsx` has a massive inline type annotation for `looksData`. Extract this to use the shared Look type or import from the types file.

---

## Next Steps / New Features to Build

### Priority 1 -- Production Readiness

#### A. Replace placeholder images with real product photos

The Moms look in `data/looks.json` uses Unsplash placeholder URLs. Once the admin panel is deployed:
1. Go to `/lookadmin`
2. Click "Load Products from Shopify" to pull real inventory
3. Select products, choose images, toggle Coming Soon status
4. Save

No code changes needed -- just admin usage.

#### B. Add `LOOK_ADMIN_PASS` to Hostinger environment

Add both env vars to the Hostinger hPanel or `.env.local` on the VPS:
```
LOOK_ADMIN_PASS=<strong-passphrase>
NEXT_PUBLIC_LOOK_ADMIN_PASS=<same-passphrase>
```

The current default `mamafern-admin-2026` should be changed to something stronger for production.

#### C. Add `/lookadmin` to robots.txt disallow

Update `src/app/robots.ts` to disallow `/lookadmin` from crawlers:
```typescript
disallow: ['/lookadmin', '/lookadmin/*']
```

### Priority 2 -- UX Improvements

#### D. Mobile horizontal scroll for product grid

The spec called for horizontal scroll on mobile as an alternative to stacking. Currently it stacks to single column. Consider adding a horizontal scroll option:
```
grid grid-cols-1 sm:grid-cols-3
```
could become:
```
flex overflow-x-auto snap-x snap-mandatory gap-4 sm:grid sm:grid-cols-3 sm:overflow-visible
```

Each ProductSpot would need `snap-start flex-shrink-0 w-[75vw] sm:w-auto` on mobile.

#### E. Animate tab transitions

Add a subtle fade/slide animation when switching between look tabs. Use framer-motion (already in the project) to animate the tab content:
```tsx
<motion.div
  key={activeTab}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
  {children(look)}
</motion.div>
```

#### F. Add "Shop the Look" subtitle/description

The section currently shows just the title "Shop the Look" with no subtitle. Consider adding a brief description like "Curated outfits for the whole family" to match the site's other sections that have subtitle text.

### Priority 3 -- Admin Panel Enhancements

#### G. Add logout / lock button visibility

The admin panel has a "Lock" button but it's small and easy to miss. Consider adding visual feedback (e.g., a small lock icon) and making it more prominent.

#### H. Add drag-to-reorder for products

Allow reordering the 3 products within a look by drag-and-drop. This determines display order on the homepage. Use a lightweight DnD library or the HTML5 drag API.

#### I. Add image upload capability

The admin currently only supports image URLs (paste a CDN link). A future iteration could add direct file upload to `/public/images/looks/` or to a Supabase storage bucket. This is noted as a comment in the original spec.

#### J. Live preview in admin

Add a small preview panel in the admin that shows approximately how the look will appear on the homepage as you edit it. Reuse the existing frontend components (LookHero, ProductSpot) in a scaled-down preview mode.

### Priority 4 -- Data Layer Migration

#### K. Move from JSON file to Supabase

Currently looks data is stored in `data/looks.json` on the filesystem. This works for a single-server deployment on Hostinger but has limitations:
- Changes require a git commit or direct file write on the VPS
- No version history
- No multi-user support
- No backup/restore

Consider migrating to a Supabase table:

```sql
CREATE TABLE IF NOT EXISTS looks (
  id text PRIMARY KEY,
  label text NOT NULL,
  title text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  hero_image_alt text NOT NULL DEFAULT '',
  products jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE looks ENABLE ROW LEVEL SECURITY;
```

This would require:
1. A Supabase migration for the table
2. Update `/lookadmin/data/route.ts` to read/write from Supabase instead of the filesystem
3. Update `src/app/page.tsx` to fetch from Supabase server-side (using service role key)
4. Keep `data/looks.json` as a fallback/seed file

### Priority 5 -- Testing

#### L. Add component tests

The components have `data-testid` attributes already wired up. Write tests for:
- `ShopTheLook` -- renders looks, handles empty state
- `ProductSpot` -- renders product info, opens modal on click
- `QuickViewModal` -- shows correct button text based on Coming Soon
- `LookTabs` -- switches between tabs
- `LookHero` -- shows placeholder when no image, shows image when present

Use the existing Vitest + React Testing Library setup.

---

## Architecture Reference

```
Homepage (page.tsx)
  |-- reads data/looks.json server-side
  |-- passes initialLooks to <ShopTheLook />
      |-- <LookTabs /> (shadcn Tabs, render prop)
          |-- <LookHero /> (hero image + fern decorations)
          |-- <ProductSpot /> x3 (product cards)
              |-- <QuickViewModal /> (shadcn Dialog)

Admin (/lookadmin)
  |-- Password gate (NEXT_PUBLIC_LOOK_ADMIN_PASS)
  |-- Tabs: Moms | Dads | Family
  |-- Step 1: Hero image URL + title + alt
  |-- Step 2: Load Shopify products, select up to 3
  |-- Configure: Image gallery, Coming Soon toggle, URL
  |-- Save: POST to /lookadmin/data -> writes looks.json

API Routes:
  /lookadmin/data     GET/POST (looks.json read/write)
  /lookadmin/shopify  GET (Shopify product proxy)
```

## Files to Touch (Summary)

**Fix/Cleanup (do first):**
1. `src/app/globals.css` -- Remove `.admin-input` class
2. `src/components/shop-the-look/QuickViewModal.tsx` -- Remove unused `useState` import
3. `src/app/page.tsx` -- Clean up inline type annotation
4. Create `src/components/shop-the-look/types.ts` -- Extract shared interfaces
5. Update ShopTheLook, LookTabs, ProductSpot, QuickViewModal to import from `./types`
6. Split `src/app/lookadmin/page.tsx` into 5-6 smaller files
7. `src/app/robots.ts` -- Add `/lookadmin` to disallow

**New features (in priority order):**
8. Mobile horizontal scroll for product grid
9. Tab transition animations (framer-motion)
10. Component tests
11. Supabase migration for looks data (when ready)
