# Analytics Complete Setup Summary — Mama Fern

This document summarizes the complete analytics setup for your website.

---

## ✅ What's Been Completed

### 1. Google Analytics GA4 — Web Tracking ✅

**Status:** Infrastructure complete, ready for Measurement ID

**Location:** `src/components/view/Analytics/index.tsx`

**What's tracked:**
- ✅ **Page views** (automatic, including SPA navigation)
- ✅ **Product views** (`view_item` event in ProductDetail)
- ✅ **Add to cart** (`add_to_cart` event in ProductDetail)
- ✅ **View cart** (`view_cart` event in CartSlideout when opened)
- ✅ **Begin checkout** (`begin_checkout` event in CartSlideout)
- ✅ **Enhanced measurement** (scroll, clicks, downloads) via GA4 settings

**What you need to do:**
1. Create GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Copy your Measurement ID (looks like `G-XXXXXXXXXX`)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Rebuild and restart: `npm run build && pm2 restart mamafern`

**Documentation:** `GA4_SETUP_GUIDE.md`

---

### 2. Google Analytics MCP Server — Claude Integration ✅

**Status:** pipx installed, ready for OAuth credentials

**Purpose:** Lets Claude Code query your GA4 data directly (view reports, analyze traffic, check conversions)

**What's installed:**
- ✅ Python 3.14.0
- ✅ pipx 1.8.0
- ✅ Path configured (restart terminal for full effect)

**What you need to do:**
1. Set up Google Cloud Project and OAuth credentials
2. Authenticate with `gcloud auth application-default login`
3. Run the setup script:
   ```powershell
   cd C:\Dev_Land\mamafern
   .\scripts\setup-ga-mcp.ps1 -ProjectId "your-project-id"
   ```

**Documentation:** `GOOGLE_ANALYTICS_MCP_SETUP.md`

---

### 3. Plausible Analytics — Already Active ✅

**Status:** Fully operational

**Location:** Self-hosted at `http://72.61.12.97:48435`, proxied through `/stats/api/event`

**Benefits:**
- Privacy-focused (no cookies)
- Not blocked by ad blockers (as much)
- Lightweight (~1KB script)
- Real-time dashboard

**Dashboard:** Check with your Plausible admin

---

## Analytics Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            │ Track Events                    │ Track Events
            │                                 │
            ▼                                 ▼
┌───────────────────────┐         ┌──────────────────────────┐
│   Google Analytics    │         │  Plausible Analytics     │
│   (GA4)               │         │  (Self-hosted)           │
├───────────────────────┤         ├──────────────────────────┤
│ • Page views          │         │ • Page views             │
│ • Product views       │         │ • Traffic sources        │
│ • Add to cart         │         │ • Real-time users        │
│ • Begin checkout      │         │ • Goals (if configured)  │
│ • View cart           │         │                          │
│ • Enhanced tracking   │         │ NO COOKIES               │
└───────────────────────┘         └──────────────────────────┘
            │
            │ Query via API
            │
            ▼
┌───────────────────────────────────────────────────────────┐
│         Google Analytics MCP Server                       │
│         (Claude Code Integration)                         │
├───────────────────────────────────────────────────────────┤
│ Claude can now:                                           │
│ • "Show me top 10 pages last week"                        │
│ • "What's my conversion rate from add_to_cart?"           │
│ • "How many active users right now?"                      │
│ • "Compare mobile vs desktop traffic"                     │
└───────────────────────────────────────────────────────────┘
```

---

## Quick Reference: What to Track Where

### Use GA4 for:
- E-commerce funnel analysis
- Conversion tracking
- Google Ads integration
- Search Console integration
- Detailed user journeys
- Device/browser breakdowns

### Use Plausible for:
- Quick daily traffic checks
- Real-time monitoring
- Privacy-friendly reporting
- Lightweight performance

### Use GA MCP (Claude) for:
- Quick queries without opening GA4 dashboard
- Automated reporting
- Ad-hoc analysis during development
- Comparing metrics across time periods

---

## Event Naming Conventions (GA4)

Current events follow Google's recommended e-commerce events:
- `view_item` — Product page viewed
- `add_to_cart` — Item added to cart
- `view_cart` — Cart opened/viewed
- `begin_checkout` — Checkout button clicked
- `purchase` — (Shopify hosted checkout handles this automatically)

**Custom events to consider adding:**
- `newsletter_signup` — Email capture modal submit
- `search` — If you add search functionality
- `remove_from_cart` — Item removed from cart (recommended in guide)
- `share_product` — Social share button clicked

---

## Files Created/Modified

### New Documentation:
- ✅ `GA4_SETUP_GUIDE.md` — Complete GA4 setup instructions
- ✅ `GOOGLE_ANALYTICS_MCP_SETUP.md` — MCP server setup guide
- ✅ `ANALYTICS_COMPLETE_SETUP.md` — This file

### New Scripts:
- ✅ `scripts/setup-ga-mcp.ps1` — Automated MCP server setup

### Code Changes:
- ✅ `src/components/view/ProductDetail/index.tsx` — Added `view_item` tracking
- ✅ `src/components/view/CartSlideout/index.tsx` — Added `view_cart` and `begin_checkout` tracking
- ✅ `src/components/view/Analytics/index.tsx` — Already had infrastructure (no changes)

---

## Testing Checklist

### GA4 Setup:
- [ ] GA4 property created
- [ ] Measurement ID added to `.env.local`
- [ ] Site rebuilt and restarted
- [ ] Verified in GA4 Realtime report (see active user)
- [ ] Tested add_to_cart event (add product to cart)
- [ ] Tested begin_checkout event (click checkout button)
- [ ] DevTools shows requests to `google-analytics.com`

### MCP Server Setup:
- [ ] Google Cloud project created
- [ ] Analytics Admin API enabled
- [ ] Analytics Data API enabled
- [ ] OAuth credentials created
- [ ] `gcloud auth application-default login` completed
- [ ] `setup-ga-mcp.ps1` script run successfully
- [ ] `claude mcp list` shows google-analytics as Connected
- [ ] Tested query: "What were my top 5 pages last week?"

### Plausible (Already Working):
- [x] Dashboard accessible
- [x] Events being tracked
- [x] Proxy configured in next.config.ts

---

## Next Steps (Optional Enhancements)

### 1. Add More E-commerce Events
See `GA4_SETUP_GUIDE.md` section "Recommended E-commerce Events to Add" for:
- Remove from cart
- Newsletter signup
- Product sharing

### 2. Configure GA4 Conversions
1. Go to GA4 → Admin → Events
2. Mark as conversions:
   - `add_to_cart`
   - `begin_checkout`
   - `purchase`

### 3. Set Up GA4 Custom Funnels
1. GA4 → Explore → Funnel exploration
2. Create funnel:
   - Step 1: `view_item`
   - Step 2: `add_to_cart`
   - Step 3: `begin_checkout`
   - Step 4: `purchase`

### 4. Add Cookie Consent Banner (GDPR/CCPA)
If you have EU/UK traffic, you legally need a consent banner.
- Option 1: Use [CookieYes](https://www.cookieyes.com/) (free tier)
- Option 2: Use [Osano](https://www.osano.com/)

### 5. Link Google Ads & Search Console
If running ads or SEO:
- GA4 → Admin → Product Links
- Link Google Ads for conversion tracking
- Link Search Console for keyword data

---

## Support & Resources

### GA4:
- [Setup Guide](./GA4_SETUP_GUIDE.md)
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [E-commerce Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

### MCP Server:
- [Setup Guide](./GOOGLE_ANALYTICS_MCP_SETUP.md)
- [MCP Server Repository](https://github.com/googleanalytics/google-analytics-mcp)
- [Setup Script](./scripts/setup-ga-mcp.ps1)

### Plausible:
- [Existing Setup Docs](./ANALYTICS_SETUP.md)

---

## Summary

**Status:** Ready for final configuration

**Time to complete:**
- GA4 basic setup: ~5 minutes
- MCP server setup: ~10-15 minutes

**What you'll get:**
- Complete e-commerce tracking funnel
- Real-time traffic monitoring
- Claude integration for quick queries
- Privacy-friendly analytics backup (Plausible)

**First task:** Add your GA4 Measurement ID to get live tracking!
