# Shopify Analytics App - Setup & Progress

## ✅ What's Been Built (Phase 1 - Day 1)

### Core Infrastructure
1. **Database Layer** (`src/lib/db.ts`)
   - SQLite database with event tracking
   - Schema: events table with shop_id, session_id, event_type, engagement metrics
   - Indexed for fast queries

2. **TypeScript Types** (`src/types/analytics.ts`)
   - EventType: page_view, product_view, add_to_cart, checkout_start, purchase, engagement
   - AnalyticsEvent interface
   - FunnelStep, EngagementMetrics, DashboardData interfaces

3. **Backend API**
   - **POST /api/analytics/events** - Receives events from tracking pixel
   - **GET /api/analytics/dashboard** - Returns funnel & engagement data
   - Query params: shop_id, days (7/30/90)

4. **Tracking Pixel** (`public/analytics-pixel.js`)
   - Client-side JavaScript that merchants embed
   - Tracks: page views, product views, cart adds, checkout, purchases
   - Engagement metrics: scroll depth, time on page
   - Uses localStorage for session tracking

5. **Dashboard UI**
   - **AnalyticsDashboard** - Main container with date filters
   - **FunnelChart** - Bar chart showing conversion funnel with drop-offs
   - **EngagementSummary** - 4 metric cards (time, scroll, bounce, sessions)
   - Route: `/analytics`

## 📊 How It Works

```
Merchant's Storefront
    ↓ (embed pixel script)
analytics-pixel.js
    ↓ (sends events via navigator.sendBeacon)
POST /api/analytics/events
    ↓ (stores in SQLite)
events table
    ↓ (queries & aggregates)
GET /api/analytics/dashboard
    ↓ (renders charts)
Dashboard UI at /analytics
```

## 🚀 Testing Locally

### 1. Generate Sample Data
Create `scripts/seed-data.ts`:
```typescript
import db from '../src/lib/db';

const shops = ['mamafern.myshopify.com'];
const events = ['page_view', 'product_view', 'add_to_cart', 'checkout_start', 'purchase'];

// Generate 1000 events over last 7 days
for (let i = 0; i < 1000; i++) {
  const sessionId = `sess_${Math.floor(i / 5)}_${Math.random().toString(36).slice(2)}`;
  const eventType = events[Math.floor(Math.random() * events.length)];
  const timestamp = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7 * 24 * 60 * 60);
  
  db.prepare(`
    INSERT INTO events (shop_id, session_id, event_type, timestamp, scroll_depth, time_on_page)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    shops[0],
    sessionId,
    eventType,
    timestamp,
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 120)
  );
}

console.log('✓ Seeded 1000 events');
```

Run: `npx tsx scripts/seed-data.ts`

### 2. View Dashboard
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3001/analytics`
3. See funnel chart + engagement metrics

### 3. Test Pixel
Add to a test HTML file:
```html
<script src="http://localhost:3001/analytics-pixel.js"></script>
```

Browse around, check `/api/analytics/events` receives data

## ⚠️ Known Issues

1. **Build Error (Pre-existing)**
   - CVA import issue in existing UI components (badge, button, label)
   - Not related to analytics code
   - Workaround: Use dev mode for now

2. **Hardcoded Shop ID**
   - Dashboard currently uses `mamafern.myshopify.com`
   - TODO: Get from Shopify OAuth session

## 📝 Next Steps (Phase 1 Completion)

### Immediate (to ship MVP):
1. Fix CVA dependency issue or replace affected components
2. Add Shopify OAuth to identify shop_id automatically
3. Create seed script for testing
4. Deploy to Vercel/production
5. Create merchant onboarding flow (install pixel script)

### Nice-to-haves:
6. Real-time updates (WebSocket or polling)
7. Export data (CSV/JSON)
8. Comparison mode (this week vs last week)
9. Mobile-optimized dashboard

## 🔒 Privacy & Compliance

The pixel script:
- ✅ No PII tracked (no names, emails, addresses)
- ✅ Uses sendBeacon (doesn't block page navigation)
- ✅ Session-based, not user-based
- ⚠️ TODO: Add GDPR consent check
- ⚠️ TODO: Add data retention policy (auto-delete > 90 days)

## 📦 Dependencies Added

- `better-sqlite3` - Lightweight SQL database
- `@types/better-sqlite3` - TypeScript support
- `recharts` - Charting library

## 📁 Files Created

```
src/
├── lib/db.ts                              # Database connection
├── types/analytics.ts                     # TypeScript types
├── app/
│   ├── analytics/page.tsx                 # Dashboard route
│   └── api/analytics/
│       ├── events/route.ts                # Event ingestion API
│       └── dashboard/route.ts             # Dashboard data API
└── components/analytics/
    ├── AnalyticsDashboard.tsx             # Main dashboard
    ├── FunnelChart.tsx                    # Conversion funnel viz
    └── EngagementSummary.tsx              # Metric cards

public/
└── analytics-pixel.js                     # Client tracking script
```

## 💰 Monetization Ready

Current design supports:
- **Free tier**: Last 7 days, funnel + engagement only
- **Growth ($29/mo)**: 30 days, more coming in Phase 2
- **Pro ($79/mo)**: 90 days, Phase 2+ features

Add to `shopify.app.toml`:
```toml
[pricing]
plan_names = ["Free", "Growth", "Pro"]
```

---

**Status**: Phase 1 core infrastructure complete (70%). Ready for testing & deployment prep.

---

## Plausible Analytics — Self-Hosted Setup (2026-03-03)

### Problem
Plausible dashboard was stuck on "Waiting for first page view" after the npm package was installed.

**Root cause: Mixed content blocking.**
- `mamafern.com` is served over **HTTPS**
- The self-hosted Plausible VPS runs on **HTTP** (`http://72.61.12.97:48435`)
- Browsers silently block all HTTP requests (scripts, XHR/fetch) originating from an HTTPS page
- The direct `<script src="http://72.61.12.97:48435/js/...">` in layout.tsx was dead on arrival
- The `dangerouslySetInnerHTML` init shim was also doing nothing useful

### Fix Applied
Proxied Plausible through Next.js so all traffic is same-origin (HTTPS → HTTPS).

**1. `next.config.ts` — added `rewrites()`:**
```ts
async rewrites() {
  const plausibleHost = process.env.PLAUSIBLE_HOST || "http://72.61.12.97:48435";
  return [
    { source: "/stats/js/script.js", destination: `${plausibleHost}/js/pa-Sh7STIEagH-sll0zVYBcb.js` },
    { source: "/stats/api/event",    destination: `${plausibleHost}/api/event` },
  ];
},
```
Server-side rewrites bypass mixed content rules — the VPS is called internally, the browser only ever hits `mamafern.com/stats/...`.

Also removed `http://72.61.12.97:48435` from the CSP `script-src` and `connect-src` headers (no longer needed).

**2. `src/components/view/Analytics/index.tsx` — rewrote to use npm package:**
```ts
import { init as initPlausible, track } from "@plausible-analytics/tracker";

useEffect(() => {
  initPlausible({
    domain: "mamafern.com",
    endpoint: "/stats/api/event",  // proxied route
    outboundLinks: true,
    bindToWindow: true,
  });
}, []);
```
The npm package (`@plausible-analytics/tracker`) auto-tracks SPA route changes, so every Next.js navigation fires a pageview. GA tracking is unchanged and still co-exists.

Added `trackPlausibleEvent()` export for future goal tracking (Add to Cart, Purchase, etc.).

**3. `src/app/layout.tsx` — removed broken `<head>` script tags:**
- Removed `<script async src="http://72.61.12.97:48435/...">` (HTTP, blocked)
- Removed `<script dangerouslySetInnerHTML={...}>` (broken legacy shim)

### Verify it's working
1. Open the site → DevTools → Network tab → filter for `event`
2. Should see `POST /stats/api/event` with status `202 Accepted`
3. Plausible dashboard should show live data

### Optional env var
Add to `.env.local` if the VPS IP ever changes:
```
PLAUSIBLE_HOST=http://72.61.12.97:48435
```
