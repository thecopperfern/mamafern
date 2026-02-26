# Shopify Connection Setup Guide

## Issue
Your Shopify credentials are missing from the `.env` file, which breaks all product/collection pages.

## Required Steps

### 1. Get Your Shopify Storefront Access Token

1. Log in to your Shopify Admin: `https://mama-fern.myshopify.com/admin`
2. Go to **Settings** > **Apps and sales channels**
3. Click **Develop apps**
4. Select your app (or create one if needed):
   - Click "Create an app"
   - Name it: "Headless Storefront"
   - Click "Create app"
5. Go to **Configuration** tab
6. Under **Storefront API**, click "Configure"
7. Select the following permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_customers`
   - `unauthenticated_write_checkouts`
8. Click **Save**
9. Go to **API credentials** tab
10. Click **Install app**
11. Copy the **Storefront API access token**

### 2. Add Token to Your .env File

Open `.env` file in your project root and add:

```bash
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_YOUR_TOKEN_HERE
```

**Complete .env example:**
```bash
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mama-fern.myshopify.com
SHOPIFY_STORE_API_URL=https://mama-fern.myshopify.com/api/2026-04/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef  # ADD YOUR REAL TOKEN

# Cart Settings
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=70

# Site URL
NEXT_PUBLIC_SITE_URL=https://mamafern.com
```

### 3. Restart Development Server

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

### 4. Test the Connection

Visit: `http://localhost:3000/shop`

You should now see:
- ✅ Collections loading
- ✅ Products displaying
- ✅ No "Couldn't load collection" errors

## Why This Happened

The `.env.local` file was created by the build script but was empty. Next.js prioritizes `.env.local` over `.env`, so even though you have a `.env` file, it's being overridden by the empty `.env.local`.

**Solution options:**
1. Delete `.env.local` and use only `.env` (recommended for dev)
2. Copy credentials to `.env.local`
3. Add `.env.local` to `.gitignore` (already done)

## Security Note

⚠️ **NEVER commit real credentials to git!**
- `.env.local` should be in `.gitignore`
- Only commit `.env.example` with empty values
- For production (Hostinger), set env vars in the hosting panel

