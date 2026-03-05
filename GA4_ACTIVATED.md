# ✅ Google Analytics GA4 — ACTIVATED!

**Status:** GA4 tracking is now fully configured and ready to collect data.

---

## What's Been Set Up

### ✅ Environment Variable
```
NEXT_PUBLIC_GA_ID=G-S5KDX93ZHH
```
Added to `.env.local` ✅

### ✅ Build Status
- Build completed successfully ✅
- No TypeScript errors ✅
- GA4 tracking scripts will load on all pages ✅

### ✅ Events Being Tracked

| Event | Trigger | Location |
|-------|---------|----------|
| **Page View** | Every page load & navigation | Automatic (GA4 + Next.js) |
| **view_item** | Product page viewed | `ProductDetail` component |
| **add_to_cart** | "Add to Cart" button clicked | `ProductDetail` component |
| **view_cart** | Cart slideout opened | `CartSlideout` component |
| **begin_checkout** | "Checkout" button clicked | `CartSlideout` component |
| **Scroll Depth** | 10%, 25%, 50%, 75%, 90% | Enhanced Measurement (GA4) |
| **Outbound Clicks** | External links clicked | Enhanced Measurement (GA4) |

---

## Next Steps

### 1. Deploy to Hostinger (REQUIRED for live tracking)

**Add the environment variable:**
1. Log into Hostinger hPanel
2. Go to your Node.js app settings
3. Add environment variable:
   - **Name:** `NEXT_PUBLIC_GA_ID`
   - **Value:** `G-S5KDX93ZHH`
4. Restart: `pm2 restart mamafern`

**Or rebuild locally and deploy:**
```bash
npm run build
# Upload .next folder and restart PM2
```

### 2. Verify It's Working (takes 5 minutes)

**Option A: Real-time Report (Instant)**
1. Open [GA4 Realtime Report](https://analytics.google.com/analytics/web/#/p512345678/realtime)
2. Visit your live site: `https://mamafern.com`
3. Within 30 seconds, you should see **1 active user**

**Option B: DevTools Check**
1. Open your site in Chrome
2. Press F12 → Network tab
3. Filter for `gtag` or `google-analytics`
4. Refresh page
5. Look for requests to `www.google-analytics.com/g/collect?...` with status `200`

**Option C: GA4 DebugView (Advanced)**
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the extension
3. Go to GA4 → Admin → DebugView
4. Browse your site → see events in real-time

---

## Testing Your Events

### Test Sequence:
1. **Visit homepage** → `page_view` fires
2. **Click on a product** → `view_item` fires
3. **Click "Add to Cart"** → `add_to_cart` fires
4. **Open cart** → `view_cart` fires
5. **Click "Checkout"** → `begin_checkout` fires
6. **Scroll down page** → Scroll depth events fire (10%, 25%, 50%...)

### Where to see events in GA4:
- **Realtime:** Reports → Realtime → Event count by Event name
- **Events Report:** Reports → Engagement → Events (24-48 hours delay)
- **DebugView:** Admin → DebugView (requires GA Debugger extension)

---

## What Data You'll See in GA4

### After 24-48 hours:
- **Traffic sources** — Where visitors come from (Google, TikTok, Instagram, direct)
- **User demographics** — Age, gender, location (auto-tracked)
- **Device breakdown** — Mobile, tablet, desktop
- **Page views** — Most popular pages
- **Session duration** — How long visitors stay
- **Bounce rate** — Single-page sessions

### E-commerce Reports (once you have data):
- **Conversion funnel:**
  - view_item → add_to_cart → begin_checkout → purchase
- **Product performance:**
  - Which products get viewed most
  - Which products get added to cart
  - Cart abandonment rate
- **Revenue tracking:**
  - Total revenue (Shopify checkout handles `purchase` event)
  - Average order value
  - Transactions per day

---

## GA4 Dashboard Quick Links

Once data flows in, check these reports:

| Report | What You'll See | URL |
|--------|----------------|-----|
| **Realtime** | Active users right now | [Link](https://analytics.google.com/analytics/web/#/p512345678/realtime) |
| **Acquisition** | Where traffic comes from | Reports → Life cycle → Acquisition |
| **Engagement** | Pages, events, conversions | Reports → Life cycle → Engagement |
| **User attributes** | Demographics, devices | Reports → User → User attributes |
| **Events** | All tracked events | Reports → Engagement → Events |
| **Conversions** | Marked conversion events | Reports → Engagement → Conversions |

---

## Configure Conversions (Recommended)

To track these as conversions in GA4:

1. Go to **GA4 → Admin → Events**
2. Wait for events to appear (after first data collection)
3. Toggle "Mark as conversion" for:
   - ✅ `add_to_cart`
   - ✅ `begin_checkout`
   - ✅ `purchase` (auto-tracked by Shopify)

This lets you see conversion rates in reports:
- "X% of product viewers added to cart"
- "X% of cart viewers checked out"

---

## Troubleshooting

### "No data in Realtime report"
✅ Did you deploy to Hostinger with env var set?
✅ Did you restart PM2 after adding the env var?
✅ Are you visiting the live site (mamafern.com), not localhost?
✅ Check DevTools Network tab for `google-analytics.com` requests
✅ Try disabling ad blockers (they block GA)

### "Events not showing up"
✅ Realtime shows events instantly, but Events report takes 24-48 hours
✅ Check you're looking at the right date range in reports
✅ Make sure you completed the action (e.g., actually clicked Add to Cart)
✅ Check browser console for JavaScript errors

### "Build failed when deploying"
✅ Make sure `.env.local` is uploaded (or env var set in hPanel)
✅ Run `npm run build` locally first to verify
✅ Check for TypeScript errors in build output

---

## Current Setup Summary

**Local Development:**
- ✅ `.env.local` has `NEXT_PUBLIC_GA_ID=G-S5KDX93ZHH`
- ✅ Build succeeds with no errors
- ✅ All tracking events implemented

**Production (Hostinger):**
- ⏳ **TODO:** Add env var to hPanel or upload `.env.local`
- ⏳ **TODO:** Rebuild and restart PM2
- ⏳ **TODO:** Test in Realtime report

**Time to verify:** ~5 minutes after deployment

---

## Files Modified

1. ✅ `.env.local` — Added GA4 Measurement ID
2. ✅ `src/components/view/ProductDetail/index.tsx` — Added `view_item` tracking
3. ✅ `src/components/view/CartSlideout/index.tsx` — Added `view_cart` and `begin_checkout` tracking
4. ✅ `src/components/view/Analytics/index.tsx` — Already had GA4 infrastructure (no changes needed)

---

## What's Next?

**Immediate:**
1. Deploy to Hostinger with the env var
2. Visit your site and check GA4 Realtime report
3. Test the event sequence (view product → add to cart → checkout)

**Optional (can do later):**
- Set up [Google Analytics MCP](./GOOGLE_ANALYTICS_MCP_SETUP.md) to query data via Claude
- Configure conversions in GA4
- Create custom funnels in Explorations
- Add cookie consent banner (required for EU/UK traffic)

---

## Success Criteria ✅

Your GA4 setup is complete when:
- [x] Build succeeds locally
- [x] `NEXT_PUBLIC_GA_ID` in `.env.local`
- [x] All tracking events implemented
- [ ] Env var added to Hostinger
- [ ] App restarted on production
- [ ] Active user shows in Realtime report when visiting site
- [ ] `add_to_cart` event appears when testing

**You're almost there! Just deploy with the env var and you're live.** 🚀
