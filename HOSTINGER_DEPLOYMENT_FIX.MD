# Hostinger Deployment Fix — Shopify API Errors

## Problem

After deploying to Hostinger, collection and product pages showed "Couldn't load collection" with server component errors. The Shopify API calls were failing at runtime.

## Root Cause

Pages that fetch from Shopify were configured for **static generation (SSG/ISR)** using `generateStaticParams` and `revalidate = 60`. During the Hostinger build, Next.js tried to pre-render these pages by calling the Shopify API. The resulting static HTML was either stale or contained cached error states, so visitors saw broken pages even though env vars were correctly set at runtime.

## Fix Applied

Replaced static generation with dynamic rendering on all pages that call the Shopify API:

### Files Changed

1. **`src/app/collections/[handle]/page.tsx`**
   - Removed `generateStaticParams()` and `export const revalidate = 60`
   - Added `export const dynamic = "force-dynamic"`

2. **`src/app/product/[handle]/page.tsx`**
   - Removed `generateStaticParams()` and `export const revalidate = 60`
   - Added `export const dynamic = "force-dynamic"`

3. **`src/app/page.tsx`** (homepage)
   - Removed `export const revalidate = 60`
   - Added `export const dynamic = "force-dynamic"`

4. **`src/app/shop/page.tsx`**
   - Removed `export const revalidate = 60`
   - Added `export const dynamic = "force-dynamic"`

5. **`src/shopify/client.ts`**
   - Added runtime logging in `getServerConfig()` when env vars are missing

### Build Output Before vs After

| Route | Before | After |
|-------|--------|-------|
| `/` | `○` (Static) | `ƒ` (Dynamic) |
| `/shop` | `○` (Static) | `ƒ` (Dynamic) |
| `/collections/[handle]` | `●` (SSG) | `ƒ` (Dynamic) |
| `/product/[handle]` | `●` (SSG) | `ƒ` (Dynamic) |

## Key Takeaway

On Hostinger, env vars are injected at build time and persisted to `.env.local` via `scripts/persist-env.js`. While the vars are available at runtime, **static generation bakes API responses into HTML at build time**, which can produce stale or broken pages. Any page that depends on Shopify data should use `force-dynamic` to ensure fresh API calls on every request.

## Hostinger Runtime Environment

- **Working directory:** `/home/u918197117/domains/mamafern.com/nodejs`
- **`.env.local` location:** Same directory (confirmed present at runtime)
- **Env vars confirmed at runtime:** `SHOPIFY_STORE_API_URL`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, plus 7 others
