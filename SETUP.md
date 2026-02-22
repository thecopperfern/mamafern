# Mama Fern — Setup Guide

Everything you need to provide or configure to take this storefront live.
Follow the sections in order — Shopify must be done before Brevo or analytics.

---

## 1. Shopify

### 1a. Storefront API (required — nothing works without this)

| What you need | Where to get it |
|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Your `.myshopify.com` domain, e.g. `mama-fern.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STORE_API_URL` | `https://<domain>/api/2026-04/graphql.json` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | See below |

**Getting the Storefront Access Token:**
1. Shopify Admin → **Settings → Apps and sales channels → Develop apps**
2. Click **Create an app**, name it `Storefront`
3. Under **API credentials → Storefront API access scopes**, enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
4. **Install app** → copy the **Storefront API access token**

### 1b. Customer Accounts (required for login, account page, order history)

Customer accounts are handled through the Storefront API using the same token above.
No additional key is needed, but **Customer Accounts must be enabled**:

1. Shopify Admin → **Settings → Customer accounts**
2. Set to **Classic customer accounts** (the Storefront API uses the classic flow)
3. Ensure **Self-serve returns** and **Edit order** are enabled if you want those flows later

### 1c. Products & Collections to create

The navbar, homepage, and footer currently reference these collection handles.
Create them in Shopify Admin → **Products → Collections**:

| Handle | Suggested name | Notes |
|---|---|---|
| `new-arrivals` | New Arrivals | Homepage featured section |
| `staples` | Evergreen Staples | Homepage featured section |
| `moms` | Moms | Navbar + footer link |
| `dads` | Dads | Navbar + footer link |
| `kids` | Kids | Navbar + footer link |
| `accessories` | Accessories | Navbar + footer link |

> The navbar auto-populates from live Shopify collections, so once these exist the links will appear automatically. The hardcoded fallback names in `Navbar/index.tsx` can stay as-is.

### 1d. Free Shipping Threshold

The cart progress bar is hardcoded to **$70**. To change it:

```
src/components/view/CartSlideout/index.tsx
Line ~55: const FREE_SHIPPING_THRESHOLD = 70;
```

Set this to whatever your actual free shipping threshold is, or expose it as
`NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` in `.env.local` if you want it configurable.

### 1e. Shopify App (optional — only needed if you use the Shopify CLI or OAuth apps)

| Variable | Value |
|---|---|
| `SHOPIFY_API_KEY` | `73ffb226cd593c5dd453de5f1dcb7e1a` (already set in `.env.example`) |
| `SHOPIFY_API_SECRET` | Generate in the same app under **API credentials** |

---

## 2. Brevo (email marketing & transactional)

### 2a. API Key

1. Sign up / log in at **https://app.brevo.com**
2. Go to **Settings (top right) → API Keys**
3. Click **Generate a new API key**, name it `Mama Fern Storefront`
4. Copy the key — it is shown only once

```
BREVO_API_KEY=xkeysib-...
```

### 2b. Newsletter Contact List

1. Brevo dashboard → **Contacts → Lists → Create a list**
2. Name it `Newsletter` (or whatever you prefer)
3. The list ID is the **integer** shown in the list row (e.g. `3`)

```
BREVO_LIST_ID=3
```

### 2c. Back-in-Stock Contact List (optional)

If you want back-in-stock subscribers in a separate list for targeted flows:

1. Create another list named `Back in Stock`
2. Copy its integer ID

```
BREVO_BACK_IN_STOCK_LIST_ID=4
```

If you leave this blank, back-in-stock subscribers go into the main newsletter list
with a `BACK_IN_STOCK_REQUESTED=true` attribute you can filter on.

### 2d. Sender Email (for contact form)

The contact form sends email via Brevo SMTP. The sender address must be
**verified in Brevo** before messages will deliver.

1. Brevo → **Settings → Senders & IP → Senders**
2. Click **Add a sender**, enter the email you want to send from
3. Verify it via the email Brevo sends

```
BREVO_SENDER_EMAIL=hello@mamafern.com
CONTACT_TO_EMAIL=hello@mamafern.com
```

> `BREVO_SENDER_EMAIL` = what appears in the "From" field
> `CONTACT_TO_EMAIL` = where contact form submissions are delivered (can be the same address or a different inbox)

### 2e. Brevo Automation flows to create (manual work in Brevo dashboard)

These are not built in code — you create them in Brevo's automation editor:

| Flow | Trigger | What it does |
|---|---|---|
| **Welcome email** | Contact added to Newsletter list | Sends a branded welcome email |
| **Back-in-stock alert** | `BACK_IN_STOCK_REQUESTED = true` attribute set OR added to back-in-stock list | Notifies customer when product is available (you'll need to trigger this from Shopify webhook or manually) |
| **Abandoned cart** | Future — requires Shopify webhook integration | Not yet implemented |

---

## 3. Content to fill in

The following pages contain placeholder or generic copy. Replace with real brand content:

### `src/app/about/page.tsx`
- The brand story paragraph is a generic placeholder starting _"Mama Fern started with a simple idea..."_
- Replace with the real founding story
- The `blockquote` on line 50 should be a real brand quote

### `src/app/faq/page.tsx`
- All 7 FAQs are reasonable placeholders but should be verified against your actual policies:
  - Confirm the **30-day return window** matches your policy
  - Confirm **5–7 business day** shipping estimate
  - Confirm whether you're US-only for shipping
  - Add/remove FAQs as needed

### `src/app/community/page.tsx`
- The welcome post is dated **Feb 2026** — update the date
- Replace with an actual first post once the brand has content

### `src/components/view/Hero/index.tsx`
- Two CTA buttons: "Shop All" and "Shop Kids" — adjust if `kids` isn't a primary collection

### `src/components/view/Footer/index.tsx`
- Social links are not included — add Instagram/TikTok icons and links once you have handles

---

## 4. Legal pages (not yet built)

The footer has no Privacy Policy, Terms of Service, or Shipping & Returns links.
These are required for Shopify checkout and consumer compliance.

**Recommended approach:** Use Shopify's built-in policy pages:
1. Shopify Admin → **Settings → Policies**
2. Use the auto-generated templates for Privacy Policy, Refund Policy, Terms of Service, Shipping Policy
3. Shopify hosts these at `https://<store>.myshopify.com/policies/...`

**To add links to the footer**, edit `src/components/view/Footer/index.tsx`
and add them to the bottom bar:

```tsx
// In the bottom bar <div>:
<div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
  <p className="text-xs text-white/40">© {new Date().getFullYear()} Mama Fern. All rights reserved.</p>
  <div className="flex gap-4">
    <a href="https://mama-fern.myshopify.com/policies/privacy-policy" className="text-xs text-white/40 hover:text-white/70">Privacy</a>
    <a href="https://mama-fern.myshopify.com/policies/terms-of-service" className="text-xs text-white/40 hover:text-white/70">Terms</a>
    <a href="https://mama-fern.myshopify.com/policies/refund-policy" className="text-xs text-white/40 hover:text-white/70">Returns</a>
  </div>
</div>
```

---

## 5. Domain & Deployment

### 5a. Vercel (recommended)

1. Push the repo to GitHub (or it already is)
2. Import project at **https://vercel.com/new**
3. Add all environment variables from `.env.example` under **Project Settings → Environment Variables**
4. Deploy

### 5b. Environment variables checklist

Copy `.env.example` to `.env.local` and fill in:

```bash
# Required — nothing works without these
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STORE_API_URL=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=

# Required for email (newsletter + contact form)
BREVO_API_KEY=
BREVO_LIST_ID=
BREVO_SENDER_EMAIL=
CONTACT_TO_EMAIL=

# Optional
BREVO_BACK_IN_STOCK_LIST_ID=
SHOPIFY_API_SECRET=
```

### 5c. Custom domain

1. Vercel → **Project → Settings → Domains** → add your domain
2. Update DNS records as instructed by Vercel
3. Update `src/app/sitemap.ts` — change the `baseUrl` constant to your real domain:
   ```ts
   const baseUrl = "https://mamafern.com"; // update this
   ```

---

## 6. Analytics

The built-in analytics system (`/analytics`) uses a local SQLite database (`analytics.db`).
This works fine in development but **will not persist on Vercel** (ephemeral filesystem).

**Options:**
- **Keep it for dev/staging only** — remove the analytics route from production
- **Swap to Vercel Postgres or PlanetScale** — update `src/lib/db.ts` to use a hosted DB driver
- **Use a third-party service** — replace `src/components/view/Analytics/index.tsx` with
  a Plausible, PostHog, or GA4 snippet

The current pixel (`/analytics-pixel.js`) fires `page_view` and `add_to_cart` events.
Those events land in `src/app/api/analytics/events/route.ts` → SQLite.

---

## 7. Summary checklist

| # | Task | Who | Status |
|---|---|---|---|
| 1 | Create Shopify app, get Storefront API token | You | ⬜ |
| 2 | Enable Classic Customer Accounts in Shopify | You | ⬜ |
| 3 | Create the 6 required Shopify collections | You | ⬜ |
| 4 | Add products to Shopify with real images, variants, and descriptions | You | ⬜ |
| 5 | Set up Brevo account, create API key | You | ⬜ |
| 6 | Create Brevo Newsletter contact list, copy list ID | You | ⬜ |
| 7 | Verify sender email in Brevo | You | ⬜ |
| 8 | Fill in real brand story on `/about` | You | ⬜ |
| 9 | Review and update FAQ copy to match actual policies | You | ⬜ |
| 10 | Set up Shopify policy pages (Privacy, Terms, Returns) | You | ⬜ |
| 11 | Add footer policy links once policies exist | Dev | ⬜ |
| 12 | Set all env vars in Vercel and deploy | You + Dev | ⬜ |
| 13 | Update `baseUrl` in `sitemap.ts` to real domain | Dev | ⬜ |
| 14 | Create Brevo Welcome email automation | You | ⬜ |
| 15 | Add social links to footer (Instagram, TikTok) | Dev | ⬜ |
| 16 | Decide analytics approach (local SQLite vs hosted) | You + Dev | ⬜ |
| 17 | Update free shipping threshold from $70 if different | Dev | ⬜ |
