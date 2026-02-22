# Mama Fern – Commerce Adapter & Migration Guide

## Architecture Overview

All commerce logic is accessed through a single adapter layer at `src/lib/commerce/`. No component or page should import directly from `src/shopify/` or `src/graphql/`.

```
src/lib/commerce/
├── types.ts              # Provider-agnostic types & CommerceClient interface
├── index.ts              # Barrel export (re-exports types + active client)
└── shopify/
    ├── client.ts         # Shopify Storefront API implementation
    └── mappers.ts        # Shopify response → Commerce types transformers
```

## How to Swap Commerce Providers

1. **Create a new adapter directory**, e.g. `src/lib/commerce/custom/`
2. **Implement `CommerceClient`** interface (defined in `types.ts`) in a new `client.ts`
3. **Write mappers** to transform your backend's data into the `Commerce*` types
4. **Update `src/lib/commerce/index.ts`** to export your new client:

```ts
// Before (Shopify)
export { shopifyClient as commerceClient } from "./shopify/client";

// After (Custom)
export { customClient as commerceClient } from "./custom/client";
```

5. No changes needed in components, pages, or cart logic.

## CommerceClient Interface

Key methods to implement:

| Method | Description |
|--------|-------------|
| `getCollections()` | List all collections |
| `getCollectionByHandle(handle, opts)` | Collection + products with pagination |
| `getProductByHandle(handle)` | Single product detail |
| `getProductsByCollection(handle, opts)` | Products from a collection |
| `createCart()` | Initialize a new cart |
| `getCart(cartId)` | Fetch cart by ID |
| `addToCart(cartId, lines)` | Add items to cart |
| `updateCartItems(cartId, lines)` | Update line item quantities |
| `removeFromCart(cartId, lineIds)` | Remove items from cart |

## Managing Products & Collections in Shopify

### Adding Products
1. Go to Shopify Admin → Products → Add product
2. Fill in title, description, images, and variants (size, color)
3. Set pricing and inventory per variant
4. The product will automatically appear on the storefront via its handle

### Creating Collections
1. Go to Shopify Admin → Collections → Create collection
2. Use a handle that matches navigation expectations:
   - `moms`, `dads`, `kids`, `accessories` → category nav links
   - `new-arrivals` → featured on home page
   - `staples` → evergreen staples on home page
   - Any custom handle for seasonal drops (e.g., `valentines-2026`)
3. Add products to the collection manually or via automated rules

### Mapping Collections to Site Sections
- Navigation links in `src/components/view/Navbar/index.tsx` use collection handles
- Home page featured sections in `src/app/page.tsx` reference collection handles
- To add a new nav category, add to the `NAV_LINKS` array in the Navbar

## Theming

Colors and fonts are configured in `tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `cream` | `#FAF7F2` | Page background |
| `oat` | `#F0EBE3` | Borders, secondary backgrounds |
| `fern` | `#4A6741` | Primary brand color, CTAs |
| `sage` | `#A3B18A` | Accent backgrounds |
| `terracotta` | `#C4704B` | Warm accents, warnings |
| `blush` | `#E8C4B8` | Soft accents |
| `charcoal` | `#2C2C2C` | Text, dark backgrounds |

Fonts:
- `font-sans` (DM Sans) — body text, UI
- `font-display` (Playfair Display) — headings, brand text

## Cart Architecture

Cart state is managed client-side using Jotai atoms (`src/lib/atoms/cart.tsx`). All cart operations go through `commerceClient` methods. Cart ID is persisted in localStorage.
