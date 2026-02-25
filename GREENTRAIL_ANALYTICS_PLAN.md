# GreenTrail Analytics — Complete Build Plan

> **Privacy-first Shopify analytics + AI-powered conversion diagnostics.**
> Standalone Shopify app, publishable to the Shopify App Store.
> Also replaces mamafern's internal analytics prototype.

---

## Table of Contents

1. [Vision & Positioning](#vision--positioning)
2. [Current State (What Exists)](#current-state-what-exists)
3. [Architecture Overview](#architecture-overview)
4. [Tech Stack](#tech-stack)
5. [Prerequisites (Manual Setup)](#prerequisites-manual-setup-before-coding)
6. [Phase 1: Project Scaffolding & Shopify OAuth](#phase-1-project-scaffolding--shopify-oauth)
7. [Phase 2: Web Pixel Extension & Event Ingestion](#phase-2-web-pixel-extension--event-ingestion)
8. [Phase 3: Core Dashboard](#phase-3-core-dashboard-embedded-in-shopify-admin)
9. [Phase 4: Real-Time & Engagement Analytics](#phase-4-real-time--engagement-analytics)
10. [Phase 5: AI Conversion Intelligence](#phase-5-ai-conversion-intelligence)
11. [Phase 6: Billing & App Store Submission](#phase-6-billing--app-store-submission)
12. [Phase 7: Mamafern Integration](#phase-7-mamafern-integration)
13. [Verification Checklist](#verification-checklist)

---

## Vision & Positioning

**The problem:** Most Shopify analytics apps either (a) rely on third-party cookies that break under GDPR/consent walls, giving merchants inaccurate data, or (b) show dashboards full of numbers without telling merchants what to actually *do*.

**GreenTrail Analytics solves both:**

1. **Privacy-first data collection** — Uses Shopify's Web Pixels API exclusively. Web Pixels run in a strict sandboxed iframe, require no third-party cookies, and are GDPR-compliant by design. Data is accurate because it doesn't depend on cookie consent banners.

2. **AI-powered conversion diagnostics** — An AI layer (Claude API) analyzes funnel data daily, detects anomalies, identifies conversion bottlenecks, and generates actionable recommendations in plain English. Merchants learn *what to fix*, not just *what happened*.

**Target customers:** Small-to-mid Shopify merchants (1K–500K monthly sessions) who want accurate, privacy-safe analytics with zero setup complexity and AI-driven insights they can act on immediately.

**Competitive differentiators vs. existing Shopify analytics apps:**
- No cookies, no consent banners needed, no data loss from ad blockers
- AI tells you what to fix (not just charts)
- Works out of the box — one-click install, no configuration
- Free tier generous enough for most small stores

---

## Current State (What Exists)

Mama Fern's storefront repo (`D:/Dev_Land/mamafern`) has a working analytics prototype:

### Existing Files to Reference/Learn From

| File | What It Does |
|------|-------------|
| `src/lib/db.ts` | SQLite database init via better-sqlite3. Creates `events` table with shop_id, session_id, event_type, timestamp, page_url, referrer, device_type, user_agent, scroll_depth, time_on_page, product_id, cart_value, metadata columns. Indexes on shop_id+timestamp, session_id, event_type. |
| `src/types/analytics.ts` | TypeScript types: `EventType` (page_view, product_view, add_to_cart, checkout_start, purchase, engagement), `AnalyticsEvent`, `FunnelStep`, `EngagementMetrics`, `DashboardData` |
| `src/app/api/analytics/events/route.ts` | POST endpoint for event ingestion. Validates required fields (shop_id, session_id, event_type), inserts into SQLite. |
| `src/app/api/analytics/dashboard/route.ts` | GET endpoint. Queries funnel data (COUNT DISTINCT session_id by event_type), engagement metrics (AVG time_on_page, AVG scroll_depth, bounce rate), returns `DashboardData` JSON. |
| `src/components/analytics/AnalyticsDashboard.tsx` | Client component. Fetches dashboard data with 7/30/90 day selector. Renders FunnelChart + EngagementSummary. Currently hardcodes shop_id as 'mamafern.myshopify.com'. |
| `src/components/analytics/FunnelChart.tsx` | Recharts BarChart showing page_view → product_view → add_to_cart → checkout_start → purchase funnel with drop-off percentages. Uses Shadcn Card. |
| `src/components/analytics/EngagementSummary.tsx` | Four metric cards: Avg Time on Page, Avg Scroll Depth, Bounce Rate, Total Sessions. Uses Shadcn Card + lucide-react icons. |
| `public/analytics-pixel.js` | Client-side tracking script (IIFE). Generates session IDs via localStorage, tracks page_view, product_view, add_to_cart, checkout_start, purchase, engagement (scroll + time on page). Uses navigator.sendBeacon. Currently points to placeholder `https://your-app-domain.com/api/analytics/events`. |
| `src/app/analytics/page.tsx` | Renders `<AnalyticsDashboard />` |
| `src/app/analytics/layout.tsx` | Metadata with noIndex:true |
| `analytics.db` | SQLite database file (binary) |
| `shopify.app.toml` | Existing Shopify app config for mama-fern (client_id: 73ffb226cd593c5dd453de5f1dcb7e1a, scopes: write_products, read_products, write_orders, read_orders, write_customers, read_customers) |

### What We Keep From the Prototype
- **Funnel step ordering concept** (page → product → cart → checkout → purchase) — same in GreenTrail
- **Recharts for visualization** — proven, reuse pattern
- **Engagement metric calculations** (bounce rate, avg time, scroll depth) — same logic in ClickHouse
- **Event schema design** — expanded but same core fields

### What Changes
- SQLite → PostgreSQL (operational) + ClickHouse (events)
- Custom pixel script → Shopify Web Pixels API (sandboxed, privacy-compliant)
- Embedded in mamafern repo → Standalone Shopify app
- Single-tenant → Multi-tenant (any Shopify store)
- Manual dashboard → Embedded in Shopify admin via App Bridge
- No AI → Claude-powered conversion diagnostics

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  SHOPIFY STOREFRONT (any merchant's store)                   │
│                                                              │
│  ┌────────────────────────────────────┐                      │
│  │  GreenTrail Web Pixel Extension    │  Runs in STRICT      │
│  │  (Shopify Web Pixels API)          │  sandboxed iframe     │
│  │                                    │  No cookies needed    │
│  │  Subscribes to:                    │  No consent required  │
│  │  - page_viewed                     │  GDPR-safe by design  │
│  │  - product_viewed                  │                       │
│  │  - collection_viewed               │  Uses @shopify/       │
│  │  - product_added_to_cart           │  web-pixels-extension │
│  │  - product_removed_from_cart       │  register() API       │
│  │  - cart_viewed                     │                       │
│  │  - checkout_started                │                       │
│  │  - checkout_completed              │                       │
│  │  - payment_info_submitted          │                       │
│  │  - search_submitted                │                       │
│  │  - (+ 5 more standard events)      │                       │
│  └──────────────┬─────────────────────┘                      │
│                 │ fetch() with keepalive: true                │
└─────────────────┼────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────────┐
│  GREENTRAIL ANALYTICS APP (Next.js 15, Vercel)               │
│                                                              │
│  ┌─────────────────┐                                         │
│  │ /api/collect     │  High-throughput event ingestion        │
│  │ (POST)           │  - Validates shop_id against PG cache   │
│  │                  │  - Buffers in memory/Redis              │
│  │                  │  - Batch inserts to ClickHouse          │
│  │                  │  - Returns 204 immediately              │
│  └────────┬────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                         │
│  │ ClickHouse Cloud │  Analytics event store                  │
│  │                  │  - Raw events table (MergeTree)         │
│  │                  │  - Hourly rollup (AggregatingMergeTree) │
│  │                  │  - Daily rollup (materialized view)     │
│  │                  │  - Partitioned by month                 │
│  │                  │  - TTL: 2 years (configurable by plan)  │
│  └─────────────────┘                                         │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────┐                   │
│  │ Dashboard UI     │  │ PostgreSQL (Neon) │                  │
│  │ (Embedded in     │  │                  │                   │
│  │  Shopify Admin)  │  │ - shops table    │                   │
│  │                  │  │ - sessions       │                   │
│  │ - Polaris UI     │  │ - billing/plans  │                   │
│  │ - Recharts       │  │ - AI insights    │                   │
│  │ - App Bridge v4  │  │ - settings       │                   │
│  └────────┬────────┘  └──────────────────┘                   │
│           │                                                  │
│  ┌────────┴────────┐                                         │
│  │ /api/dashboard/* │  Dashboard API routes                   │
│  │ /api/ai/*        │  AI analysis endpoints                  │
│  │ /api/billing/*   │  Subscription management                │
│  │ /api/webhooks/*  │  GDPR + Shopify webhooks               │
│  │ /api/auth/*      │  OAuth flow (from scaffold)             │
│  └─────────────────┘                                         │
│                                                              │
│  ┌─────────────────┐                                         │
│  │ AI Engine        │  Scheduled daily analysis               │
│  │ (Claude Haiku)   │  - Funnel anomaly detection             │
│  │                  │  - Conversion bottleneck ID             │
│  │                  │  - Actionable recommendations           │
│  │                  │  - Weekly email digest                  │
│  └─────────────────┘                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version/Details | Why This Choice |
|-------|-----------|-----------------|-----------------|
| **Framework** | Next.js 15 | App Router, Server Components | Matches mamafern stack, scaffold default |
| **Scaffold** | ozzyonfire/shopify-next-app | github.com/ozzyonfire/shopify-next-app | Most complete Next.js App Router template for Shopify. Pre-wires OAuth, App Bridge v4, Prisma, TanStack Query, Polaris, GraphQL Codegen. pnpm workspaces with `/web` directory for the Next.js app. |
| **UI Framework** | Shopify Polaris | @shopify/polaris | Required for embedded Shopify apps. Provides Page, Layout, Card, DataTable, Badge, Banner, etc. Accessible by default. |
| **Charts** | Recharts | v3.x | Already proven in mamafern prototype. Works well with Polaris layout. |
| **ORM** | Prisma | Comes with scaffold | Type-safe PostgreSQL access, migrations, seed scripts |
| **Operational DB** | PostgreSQL | Neon (free tier for dev) | Tenant records, Shopify sessions, billing state, AI insight history, app settings. Neon offers serverless PG with branching. |
| **Analytics DB** | ClickHouse | ClickHouse Cloud (free tier: 10GB) | Purpose-built for analytics. MergeTree engine, columnar storage, sub-second aggregation on billions of rows. LowCardinality for enum-like columns. Materialized views for pre-aggregation. |
| **Auth** | Shopify OAuth + Token Exchange | @shopify/shopify-api | Scaffold handles OAuth flow. Token exchange for embedded app auth (no redirect needed after initial install). |
| **Tracking** | Shopify Web Pixels API | @shopify/web-pixels-extension | App Pixel runs in strict sandbox (iframe). Subscribes to customer_events. No cookies, no script tags injected into storefront. Privacy-compliant by design. |
| **AI** | Claude API | Haiku 4.5 (claude-haiku-4-5-20251001) | Fast, cheap, good enough for structured analytics summarization. ~$0.001/insight. |
| **Hosting** | Vercel | Pro plan recommended | Edge functions for /api/collect (low latency), serverless for dashboard. Automatic HTTPS, preview deploys. |
| **Event Buffer** | Upstash Redis (or in-memory) | For production multi-instance | Buffer events before ClickHouse batch insert. In-memory fine for single instance / dev. |
| **Email** | Resend or Brevo | For weekly digest emails | Transactional email for AI insight digests |
| **Package Manager** | pnpm | Required by scaffold | pnpm workspaces, faster than npm |
| **ClickHouse Client** | @clickhouse/client | Official Node.js client | Batch insert, query, connection pooling |

---

## Prerequisites (Manual Setup Before Coding)

These steps require human action in external dashboards — they can't be automated.

### 1. Shopify Partners Dashboard — Create App

Go to: https://partners.shopify.com → Apps → Create app → Create app manually

| Setting | Value |
|---------|-------|
| App name | GreenTrail Analytics |
| App URL | `https://localhost:3000` (change for production) |
| Allowed redirection URLs | `https://localhost:3000/api/auth/callback` |

After creation, copy:
- **Client ID** (also called API key)
- **Client Secret** (also called API secret key)

### 2. Shopify Dev Store — For Testing

Go to: Partners Dashboard → Stores → Add store → Development store

Create a store with sample products so you can test the full funnel (page view → product view → add to cart → checkout → purchase).

### 3. Neon PostgreSQL — Create Database

Go to: https://neon.tech → Sign up → New project

| Setting | Value |
|---------|-------|
| Project name | greentrail-dev |
| Region | US East (or closest) |
| Compute | Free tier (0.25 CU) |

After creation, copy the `DATABASE_URL` connection string:
```
postgresql://neondb_owner:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 4. ClickHouse Cloud — Create Service

Go to: https://clickhouse.cloud → Sign up → New service

| Setting | Value |
|---------|-------|
| Service name | greentrail-events |
| Cloud provider | AWS |
| Region | US East (match Neon/Vercel) |
| Tier | Free trial (25GB storage, 100GB queries/month) |

After creation, copy:
- **Host** (e.g., `abc123.us-east-1.aws.clickhouse.cloud`)
- **Port** (usually `8443` for HTTPS)
- **Username** (usually `default`)
- **Password** (generated)

### 5. Anthropic API Key — For AI Insights

Go to: https://console.anthropic.com → API Keys → Create key

Copy the `sk-ant-...` key.

### 6. Install Shopify CLI (if not already installed)

```bash
npm install -g @shopify/cli
```

Verify: `shopify version` → should print version number.

---

## Phase 1: Project Scaffolding & Shopify OAuth

**Goal:** A working Shopify app that installs on a dev store and shows an embedded "Welcome" page in Shopify admin.

### Step 1.1: Scaffold the App

```bash
cd D:/Dev_Land/mamafern
pnpx @shopify/create-app@latest --template https://github.com/ozzyonfire/shopify-next-app.git
```

When prompted for the app name, enter: `greentrail`

This creates `D:/Dev_Land/mamafern/greentrail/` with:

```
greentrail/
├── web/                              # Next.js app
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── src/
│   │   ├── app/                     # App Router pages & API routes
│   │   │   ├── api/auth/            # OAuth routes (pre-built)
│   │   │   └── page.tsx             # Main app page
│   │   ├── lib/
│   │   │   └── shopify.ts           # Shopify API client config
│   │   └── providers/               # App Bridge + Query providers
│   ├── .graphqlrc.yml               # GraphQL codegen config
│   ├── package.json
│   └── tsconfig.json
├── shopify.app.toml                  # App configuration
├── pnpm-workspace.yaml              # Workspace config
└── docker-compose.yml               # Optional local PG
```

### Step 1.2: Configure Environment

Create/edit `web/.env`:

```env
# PostgreSQL (Neon)
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Shopify (auto-populated by Shopify CLI, but set manually if needed)
SHOPIFY_API_KEY="your_client_id_from_partners_dashboard"
SHOPIFY_API_SECRET="your_client_secret_from_partners_dashboard"
SCOPES="read_products,read_orders,read_customers"
HOST="localhost:3000"

# ClickHouse Cloud
CLICKHOUSE_HOST="abc123.us-east-1.aws.clickhouse.cloud"
CLICKHOUSE_PORT="8443"
CLICKHOUSE_USER="default"
CLICKHOUSE_PASSWORD="your_clickhouse_password"
CLICKHOUSE_DATABASE="default"

# Claude API (Phase 5)
ANTHROPIC_API_KEY="sk-ant-..."
```

### Step 1.3: Update shopify.app.toml

```toml
# GreenTrail Analytics
client_id = "YOUR_CLIENT_ID"
name = "GreenTrail Analytics"
application_url = "https://localhost:3000"
embedded = true

[build]
automatically_update_urls_on_dev = true
dev = "cd web && pnpm run dev"

[access.admin]
direct_api_mode = "offline"
embedded_app_direct_api_access = true

[access_scopes]
scopes = "read_products,read_orders,read_customers"
use_legacy_install_flow = false

[auth]
redirect_urls = ["https://localhost:3000/api/auth/callback"]

[webhooks]
api_version = "2025-04"

  [[webhooks.subscriptions]]
  topics = ["customers/data_request", "customers/redact", "shop/redact"]
  uri = "/api/webhooks"
```

### Step 1.4: Extend Prisma Schema

Edit `web/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Shopify session storage (scaffold may already have this)
model Session {
  id          String   @id
  shop        String
  state       String
  isOnline    Boolean  @default(false)
  scope       String?
  expires     DateTime?
  accessToken String?
  userId      BigInt?
  firstName   String?
  lastName    String?
  email       String?
  accountOwner Boolean @default(false)
  locale      String?
  collaborator Boolean @default(false)
  emailVerified Boolean @default(false)
}

// GreenTrail-specific models
model Shop {
  id              String    @id @default(cuid())
  domain          String    @unique   // mystore.myshopify.com
  shopifyGid      String?   @unique   // gid://shopify/Shop/12345
  name            String?
  email           String?
  plan            String    @default("free")  // free | growth | pro
  eventsThisMonth Int       @default(0)
  eventsCap       Int       @default(10000)   // varies by plan
  retentionDays   Int       @default(7)       // varies by plan
  installedAt     DateTime  @default(now())
  uninstalledAt   DateTime?
  settings        Json      @default("{}")
  insights        Insight[]
  billingId       String?   // Shopify AppSubscription GID

  @@index([domain])
}

model Insight {
  id        String    @id @default(cuid())
  shopId    String
  shop      Shop      @relation(fields: [shopId], references: [id], onDelete: Cascade)
  type      String    // anomaly | recommendation | bottleneck | digest
  title     String    // "Cart drop-off increased 12%"
  body      String    // Full explanation + recommendation
  severity  String    // info | warning | critical
  category  String?   // funnel | traffic | product | engagement
  metadata  Json      @default("{}")  // Structured data (metrics, comparisons)
  createdAt DateTime  @default(now())
  readAt    DateTime?
  dismissed Boolean   @default(false)

  @@index([shopId, createdAt])
  @@index([shopId, type])
}
```

Run migration:
```bash
cd web
pnpm prisma migrate dev --name init
```

### Step 1.5: GDPR Webhook Handlers

Create `web/src/app/api/webhooks/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const topic = req.headers.get('x-shopify-topic');
  const shop = req.headers.get('x-shopify-shop-domain');
  // TODO: Verify HMAC signature with SHOPIFY_API_SECRET

  switch (topic) {
    case 'customers/data_request':
      // Shopify is requesting customer data for a specific customer
      // GreenTrail doesn't store PII — respond with empty data
      console.log(`[GDPR] Data request for shop: ${shop}`);
      return NextResponse.json({ ok: true });

    case 'customers/redact':
      // Shopify is requesting deletion of customer data
      // GreenTrail doesn't store PII — no action needed
      console.log(`[GDPR] Customer redact for shop: ${shop}`);
      return NextResponse.json({ ok: true });

    case 'shop/redact':
      // Shop has been uninstalled for 48+ hours — delete ALL data
      console.log(`[GDPR] Shop redact for shop: ${shop}`);
      if (shop) {
        // Delete from PostgreSQL
        await prisma.shop.deleteMany({ where: { domain: shop } });
        // TODO: Delete from ClickHouse (DELETE FROM events WHERE shop_id = ...)
      }
      return NextResponse.json({ ok: true });

    default:
      return NextResponse.json({ error: 'Unknown topic' }, { status: 400 });
  }
}
```

### Step 1.6: Generate Web Pixel Extension

```bash
cd D:/Dev_Land/mamafern/greentrail
shopify app generate extension --type web_pixel --name greentrail-pixel
```

This creates:
```
extensions/
└── greentrail-pixel/
    ├── src/
    │   └── index.ts          # Where event subscriptions go (Phase 2)
    ├── shopify.extension.toml
    └── package.json
```

### Step 1.7: Install Additional Packages

```bash
cd web
pnpm add @clickhouse/client recharts @anthropic-ai/sdk
pnpm add -D @types/node
```

### Step 1.8: Welcome Page

Replace `web/src/app/page.tsx` with a basic Polaris welcome page:

```tsx
import { Page, Layout, Card, Text, BlockStack, Banner } from '@shopify/polaris';

export default function HomePage() {
  return (
    <Page title="GreenTrail Analytics">
      <Layout>
        <Layout.Section>
          <Banner tone="success">
            <p>GreenTrail is installed and tracking events on your store.</p>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">Privacy-First Analytics</Text>
              <Text as="p">
                GreenTrail uses Shopify's Web Pixels API to collect analytics data
                without third-party cookies. Your customers' privacy is protected
                by default — no consent banners needed.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
```

### Step 1.9: Test Installation

```bash
cd D:/Dev_Land/mamafern/greentrail
shopify app dev
```

This will:
1. Start the Next.js dev server
2. Create a Cloudflare tunnel for HTTPS
3. Open your dev store's admin
4. Prompt you to install the app
5. Show the embedded "Welcome to GreenTrail" page

**Phase 1 is complete when:** The app installs on your dev store and you see the Polaris welcome page embedded in Shopify admin.

---

## Phase 2: Web Pixel Extension & Event Ingestion

**Goal:** When a customer browses any store with GreenTrail installed, every standard e-commerce event flows into ClickHouse.

### Step 2.1: Web Pixel Extension Code

Edit `extensions/greentrail-pixel/src/index.ts`:

```typescript
import { register } from '@shopify/web-pixels-extension';

register(({ analytics, browser, settings, init }) => {
  // The collect endpoint is configured as an app setting
  // In production: https://greentrail.app/api/collect
  // In dev: the tunnel URL from shopify app dev
  const COLLECT_ENDPOINT = settings.collectEndpoint || 'https://greentrail.app/api/collect';

  // Generate a session ID (persisted in browser for the tab session)
  // Web Pixels can access browser.sessionStorage
  let sessionId: string | null = null;

  async function getSessionId(): Promise<string> {
    if (sessionId) return sessionId;
    sessionId = await browser.sessionStorage.getItem('gt_sid');
    if (!sessionId) {
      sessionId = 'gt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
      await browser.sessionStorage.setItem('gt_sid', sessionId);
    }
    return sessionId;
  }

  // Extract UTM parameters from URL
  function extractUTM(search: string | undefined): Record<string, string> {
    if (!search) return {};
    const params = new URLSearchParams(search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
    };
  }

  // Get device type from user agent context
  function getDeviceType(context: any): string {
    const ua = context?.navigator?.userAgent || '';
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  // Subscribe to ALL standard events
  analytics.subscribe('all_standard_events', async (event) => {
    const sid = await getSessionId();
    const location = event.context?.document?.location;

    const payload = {
      shop_id: init.data?.shop?.id || '',
      session_id: sid,
      event_type: event.name,
      timestamp: event.timestamp,
      page_url: location?.href || '',
      referrer: event.context?.document?.referrer || '',
      device_type: getDeviceType(event.context),
      ...extractUTM(location?.search),
      data: event.data || {},
    };

    try {
      fetch(COLLECT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,  // Ensures request completes even if page navigates
      });
    } catch {
      // Silently fail — never block the store
    }
  });
});
```

### Step 2.2: Web Pixel Extension Config

Edit `extensions/greentrail-pixel/shopify.extension.toml`:

```toml
name = "GreenTrail Pixel"
type = "web_pixel"
runtime_context = "strict"

[settings]
  [[settings.fields]]
  key = "collectEndpoint"
  name = "Event collection endpoint"
  description = "The URL where analytics events are sent"
  type = "single_line_text_field"
```

### Step 2.3: ClickHouse Client

Create `web/src/lib/clickhouse.ts`:

```typescript
import { createClient } from '@clickhouse/client';

const clickhouse = createClient({
  url: `https://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE || 'default',
});

export default clickhouse;
```

### Step 2.4: ClickHouse Schema Initialization

Create `web/src/lib/clickhouse-schema.ts` (run once to initialize):

```typescript
import clickhouse from './clickhouse';

export async function initClickHouseSchema() {
  // Raw events table
  await clickhouse.command({
    query: `
      CREATE TABLE IF NOT EXISTS events (
        shop_id         String,
        session_id      String,
        event_type      LowCardinality(String),
        timestamp       DateTime64(3),
        page_url        String,
        referrer        String,
        utm_source      LowCardinality(String),
        utm_medium      LowCardinality(String),
        utm_campaign    String,
        utm_term        String,
        utm_content     String,
        device_type     LowCardinality(String),
        country         LowCardinality(String),
        product_id      String,
        variant_id      String,
        collection_id   String,
        cart_value      Float64,
        order_value     Float64,
        discount_codes  String,
        search_query    String,
        line_items      String,
        metadata        String
      ) ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (shop_id, timestamp, session_id)
      TTL timestamp + INTERVAL 2 YEAR DELETE
    `,
  });

  // Hourly rollup table
  await clickhouse.command({
    query: `
      CREATE TABLE IF NOT EXISTS events_rollup_1h (
        bucket_start    DateTime,
        shop_id         LowCardinality(String),
        event_type      LowCardinality(String),
        device_type     LowCardinality(String),
        sessions_uniq   AggregateFunction(uniqExact, String),
        events_count    AggregateFunction(count),
        value_sum       AggregateFunction(sum, Float64)
      ) ENGINE = AggregatingMergeTree
      PARTITION BY toYYYYMM(bucket_start)
      ORDER BY (shop_id, bucket_start, event_type)
    `,
  });

  // Materialized view: auto-populate hourly rollups from raw events
  await clickhouse.command({
    query: `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_events_rollup_1h
      TO events_rollup_1h AS
      SELECT
        toStartOfHour(timestamp) AS bucket_start,
        shop_id,
        event_type,
        device_type,
        uniqExactState(session_id) AS sessions_uniq,
        countState() AS events_count,
        sumState(order_value) AS value_sum
      FROM events
      GROUP BY ALL
    `,
  });

  // Daily rollup table
  await clickhouse.command({
    query: `
      CREATE TABLE IF NOT EXISTS events_rollup_1d (
        bucket_start    Date,
        shop_id         LowCardinality(String),
        event_type      LowCardinality(String),
        sessions_uniq   AggregateFunction(uniqExact, String),
        events_count    AggregateFunction(count),
        value_sum       AggregateFunction(sum, Float64)
      ) ENGINE = AggregatingMergeTree
      PARTITION BY toYYYYMM(bucket_start)
      ORDER BY (shop_id, bucket_start, event_type)
    `,
  });

  // Materialized view: auto-populate daily rollups
  await clickhouse.command({
    query: `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_events_rollup_1d
      TO events_rollup_1d AS
      SELECT
        toDate(timestamp) AS bucket_start,
        shop_id,
        event_type,
        uniqExactState(session_id) AS sessions_uniq,
        countState() AS events_count,
        sumState(order_value) AS value_sum
      FROM events
      GROUP BY ALL
    `,
  });

  console.log('ClickHouse schema initialized');
}
```

### Step 2.5: Event Ingestion Endpoint

Create `web/src/app/api/collect/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import clickhouse from '@/lib/clickhouse';

// In-memory event buffer for batch inserts
let eventBuffer: any[] = [];
let flushTimer: NodeJS.Timeout | null = null;
const FLUSH_INTERVAL_MS = 5000;   // Flush every 5 seconds
const FLUSH_SIZE_THRESHOLD = 1000; // Or every 1000 events

async function flushEvents() {
  if (eventBuffer.length === 0) return;

  const batch = [...eventBuffer];
  eventBuffer = [];

  try {
    await clickhouse.insert({
      table: 'events',
      values: batch,
      format: 'JSONEachRow',
    });
  } catch (error) {
    console.error('ClickHouse batch insert failed:', error);
    // Re-add failed events back to buffer (with retry limit in production)
    eventBuffer.unshift(...batch);
  }
}

// Start periodic flush
if (!flushTimer) {
  flushTimer = setInterval(flushEvents, FLUSH_INTERVAL_MS);
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Basic validation
    if (!event.shop_id || !event.event_type) {
      return new NextResponse(null, { status: 400 });
    }

    // Transform Web Pixel event data into our ClickHouse schema
    const row = {
      shop_id: String(event.shop_id),
      session_id: event.session_id || '',
      event_type: event.event_type,
      timestamp: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString(),
      page_url: event.page_url || '',
      referrer: event.referrer || '',
      utm_source: event.utm_source || '',
      utm_medium: event.utm_medium || '',
      utm_campaign: event.utm_campaign || '',
      utm_term: event.utm_term || '',
      utm_content: event.utm_content || '',
      device_type: event.device_type || '',
      country: '', // TODO: derive from IP via geo lookup
      product_id: event.data?.productVariant?.product?.id || '',
      variant_id: event.data?.productVariant?.id || '',
      collection_id: event.data?.collection?.id || '',
      cart_value: parseFloat(event.data?.checkout?.totalPrice?.amount || '0'),
      order_value: parseFloat(event.data?.checkout?.totalPrice?.amount || '0'),
      discount_codes: JSON.stringify(
        event.data?.checkout?.discountApplications?.map((d: any) => d.title) || []
      ),
      search_query: event.data?.searchResult?.query || '',
      line_items: JSON.stringify(
        event.data?.checkout?.lineItems?.map((item: any) => ({
          id: item.variant?.id,
          title: item.title,
          qty: item.quantity,
          price: item.variant?.price?.amount,
        })) || []
      ),
      metadata: JSON.stringify(event.data || {}),
    };

    eventBuffer.push(row);

    // Flush if buffer is large enough
    if (eventBuffer.length >= FLUSH_SIZE_THRESHOLD) {
      flushEvents(); // Fire and forget
    }

    // TODO: Increment shop.eventsThisMonth in PostgreSQL (debounced, not per-event)

    // Return 204 immediately — non-blocking
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Event ingestion error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

// CORS headers for cross-origin pixel requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Shopify Web Pixels API — Available Standard Events Reference

All 15 standard events that the Web Pixel can subscribe to:

| Event | Trigger | Key Data Available |
|-------|---------|-------------------|
| `page_viewed` | Every page load | URL, referrer, title |
| `product_viewed` | Product detail page | productVariant (id, title, price, sku, image) |
| `collection_viewed` | Collection page | collection (id, title, productVariants) |
| `product_added_to_cart` | Add to cart button | cartLine (quantity, merchandise, cost) |
| `product_removed_from_cart` | Remove from cart | cartLine |
| `cart_viewed` | Cart page | cart (lines, cost, totalQuantity) |
| `checkout_started` | Checkout initiated | checkout (lineItems, totalPrice, currencyCode) |
| `checkout_address_info_submitted` | Address entered | checkout (shippingAddress) |
| `checkout_contact_info_submitted` | Contact info entered | checkout (email, phone) |
| `checkout_shipping_info_submitted` | Shipping rate chosen | checkout (shippingLine) |
| `payment_info_submitted` | Payment details entered | checkout |
| `checkout_completed` | Purchase complete | checkout (lineItems, totalPrice, transactions, discountApplications, order) |
| `search_submitted` | Site search | searchResult (query, productVariants) |
| `alert_displayed` | Warning/validation | alert (type, message) |
| `ui_extension_errored` | Extension error | error |

**Important:** In a strict sandbox (app pixel), you can access `browser.cookie`, `browser.localStorage`, `browser.sessionStorage` — but they're scoped to the sandbox, not the main page. The `init` object provides a snapshot of shop, cart, and customer data at pixel registration time.

**Phase 2 is complete when:** You browse your dev store, click around products, add to cart, and see events appearing in your ClickHouse `events` table.

---

## Phase 3: Core Dashboard (Embedded in Shopify Admin)

**Goal:** Merchant opens GreenTrail in their Shopify admin and sees a complete analytics dashboard.

### Dashboard Pages

```
/                    → Overview (KPIs + funnel + trends)
/traffic             → Traffic sources breakdown
/products            → Product performance
/funnel              → Detailed funnel analysis
/settings            → App settings + billing
```

### Overview Page Components

1. **KPI Cards Row** (top of page):
   - Total Sessions (with % change vs previous period)
   - Conversion Rate (checkout_completed / page_viewed sessions)
   - Revenue (sum of order_value from checkout_completed)
   - Average Order Value (revenue / orders)
   - Each card shows sparkline trend (7 data points)

2. **Conversion Funnel** (main chart):
   - Horizontal bar chart or vertical funnel visualization
   - Steps: Page Views → Product Views → Add to Cart → Checkout Started → Purchase
   - Shows count + drop-off % between each step
   - Reuse recharts pattern from mamafern FunnelChart.tsx

3. **Traffic Sources Table**:
   - Columns: Source, Sessions, Conversion Rate, Revenue
   - Group by: referrer domain, UTM source, or "Direct"
   - Sortable columns

4. **Top Products**:
   - Product name, Views, Add-to-Cart Rate, Revenue
   - Link to product in Shopify admin

5. **AI Insights Banner** (Phase 5, placeholder for now):
   - Shows latest unread insight card
   - "Your cart drop-off increased 12% this week → View details"

### Time Range Selector
- Today, 7 days, 30 days, 90 days, Custom range
- "Compare to previous period" toggle
- URL-driven state (search params)

### Dashboard API Routes

Create `web/src/app/api/dashboard/` with these routes:

```
/api/dashboard/overview?shop_id=X&days=7     → KPIs + funnel + trends
/api/dashboard/traffic?shop_id=X&days=7      → Traffic source breakdown
/api/dashboard/products?shop_id=X&days=7     → Product performance
/api/dashboard/funnel?shop_id=X&days=7       → Detailed funnel with drop-off
```

Example ClickHouse queries:

```sql
-- Conversion funnel
SELECT
  event_type,
  uniqExact(session_id) AS sessions
FROM events
WHERE shop_id = {shop_id:String}
  AND timestamp >= {since:DateTime64(3)}
  AND event_type IN ('page_viewed', 'product_viewed', 'product_added_to_cart', 'checkout_started', 'checkout_completed')
GROUP BY event_type;

-- Traffic sources
SELECT
  if(utm_source != '', utm_source, if(referrer != '', domain(referrer), 'Direct')) AS source,
  uniqExact(session_id) AS sessions,
  countIf(event_type = 'checkout_completed') AS conversions,
  sumIf(order_value, event_type = 'checkout_completed') AS revenue
FROM events
WHERE shop_id = {shop_id:String} AND timestamp >= {since:DateTime64(3)}
GROUP BY source
ORDER BY sessions DESC
LIMIT 20;

-- Top products
SELECT
  product_id,
  countIf(event_type = 'product_viewed') AS views,
  countIf(event_type = 'product_added_to_cart') AS adds,
  sumIf(order_value, event_type = 'checkout_completed') AS revenue,
  if(views > 0, adds / views * 100, 0) AS atc_rate
FROM events
WHERE shop_id = {shop_id:String}
  AND timestamp >= {since:DateTime64(3)}
  AND product_id != ''
GROUP BY product_id
ORDER BY views DESC
LIMIT 20;

-- KPI trend (daily data points for sparklines)
SELECT
  toDate(timestamp) AS day,
  uniqExact(session_id) AS sessions,
  countIf(event_type = 'checkout_completed') AS orders,
  sumIf(order_value, event_type = 'checkout_completed') AS revenue
FROM events
WHERE shop_id = {shop_id:String} AND timestamp >= {since:DateTime64(3)}
GROUP BY day
ORDER BY day;
```

### UI Components (Polaris + Recharts)

Use Polaris for layout/structure, Recharts for visualizations:

```tsx
// Layout pattern for all dashboard pages
import { Page, Layout, Card, DataTable, Badge } from '@shopify/polaris';
import { BarChart, LineChart, ResponsiveContainer } from 'recharts';
```

**Phase 3 is complete when:** You see a fully functional dashboard with real event data from your dev store, including funnel, traffic sources, product performance, and trend sparklines.

---

## Phase 4: Real-Time & Engagement Analytics

**Goal:** Live visitor tracking and deeper behavioral metrics.

### Live View Page (`/live`)

- **Active visitors count** (sessions with events in last 5 minutes)
- **Pages being viewed right now** (latest page_viewed events)
- **Geographic map** (if country data available)
- **Activity feed** (real-time event stream)

Implementation: Poll `/api/dashboard/live` every 10 seconds, or use Server-Sent Events (SSE) for push updates.

```sql
-- Active visitors (last 5 minutes)
SELECT uniqExact(session_id) AS active_visitors
FROM events
WHERE shop_id = {shop_id:String}
  AND timestamp >= now() - INTERVAL 5 MINUTE;

-- Current pages
SELECT page_url, count() AS viewers
FROM events
WHERE shop_id = {shop_id:String}
  AND timestamp >= now() - INTERVAL 5 MINUTE
  AND event_type = 'page_viewed'
GROUP BY page_url
ORDER BY viewers DESC
LIMIT 10;
```

### Engagement Metrics Page (`/engagement`)

- **Avg time on page** by page URL (derive from session event gaps)
- **Bounce rate** by page (sessions with only 1 event)
- **Exit pages** (last page_viewed before session ends)
- **Session flow** (Sankey diagram: most common page-to-page navigation paths)

```sql
-- Bounce rate by entry page
SELECT
  first_page,
  count() AS total_sessions,
  countIf(event_count = 1) AS bounced,
  bounced / total_sessions * 100 AS bounce_rate
FROM (
  SELECT
    session_id,
    argMin(page_url, timestamp) AS first_page,
    count() AS event_count
  FROM events
  WHERE shop_id = {shop_id:String} AND timestamp >= {since:DateTime64(3)}
  GROUP BY session_id
)
GROUP BY first_page
ORDER BY total_sessions DESC;
```

### ClickHouse Materialized Views for Engagement

Pre-aggregate session-level metrics:

```sql
CREATE TABLE session_summary (
  shop_id         LowCardinality(String),
  session_id      String,
  date            Date,
  first_event     DateTime64(3),
  last_event      DateTime64(3),
  entry_page      String,
  exit_page       String,
  event_count     UInt32,
  page_view_count UInt32,
  device_type     LowCardinality(String),
  utm_source      LowCardinality(String),
  converted       UInt8,
  revenue         Float64
) ENGINE = ReplacingMergeTree(last_event)
PARTITION BY toYYYYMM(date)
ORDER BY (shop_id, date, session_id);
```

**Phase 4 is complete when:** Live visitor count updates in near-real-time, and engagement metrics (bounce rate, session flow) display correctly.

---

## Phase 5: AI Conversion Intelligence

**Goal:** Claude analyzes store data and generates actionable recommendations.

### How It Works

1. **Daily cron job** (or triggered via Vercel Cron):
   - For each active shop, pull last 7 days of funnel + engagement data from ClickHouse
   - Structure it as a prompt for Claude Haiku
   - Parse the response into insight cards
   - Store insights in PostgreSQL `Insight` table

2. **On-demand analysis** (merchant clicks "Analyze Now"):
   - Same flow but immediate, for the current shop only

### AI Analysis Prompt Template

```typescript
const prompt = `You are an e-commerce conversion optimization expert analyzing a Shopify store's analytics data.

## Store: ${shop.name} (${shop.domain})
## Period: Last 7 days vs previous 7 days

## Conversion Funnel
${funnelData.map(step =>
  `${step.event_type}: ${step.current_sessions} sessions (${step.change_pct > 0 ? '+' : ''}${step.change_pct}% vs prev period)`
).join('\n')}

## Drop-off Rates
${dropoffs.map(d =>
  `${d.from} → ${d.to}: ${d.dropoff_rate}% drop-off (prev: ${d.prev_dropoff_rate}%)`
).join('\n')}

## Traffic Sources (top 5 by sessions)
${trafficData.map(t =>
  `${t.source}: ${t.sessions} sessions, ${t.conversion_rate}% CVR, $${t.revenue} revenue`
).join('\n')}

## Top Products by Views
${productData.map(p =>
  `${p.product_id}: ${p.views} views, ${p.atc_rate}% ATC rate, $${p.revenue} revenue`
).join('\n')}

## Device Breakdown
${deviceData.map(d =>
  `${d.device_type}: ${d.sessions} sessions, ${d.conversion_rate}% CVR`
).join('\n')}

## Engagement
- Bounce rate: ${engagement.bounce_rate}% (prev: ${engagement.prev_bounce_rate}%)
- Avg session duration: ${engagement.avg_duration}s

Based on this data, provide exactly 3 insights in this JSON format:
[
  {
    "type": "anomaly" | "recommendation" | "bottleneck",
    "severity": "info" | "warning" | "critical",
    "category": "funnel" | "traffic" | "product" | "engagement",
    "title": "Short headline (under 60 chars)",
    "body": "2-3 sentence explanation with specific numbers and a concrete action the merchant should take."
  }
]

Rules:
- Be specific with numbers (percentages, dollar amounts)
- Every insight MUST include an actionable recommendation
- Focus on the biggest opportunities for revenue improvement
- Compare to previous period to highlight trends
- If data is insufficient, say so rather than guessing`;
```

### AI Endpoint

Create `web/src/app/api/ai/analyze/route.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import clickhouse from '@/lib/clickhouse';
import { prisma } from '@/lib/prisma';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { shopId } = await req.json();
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

  // Pull analytics data from ClickHouse
  const funnelData = await getFunnelData(shop.domain, 7);
  const trafficData = await getTrafficData(shop.domain, 7);
  const productData = await getProductData(shop.domain, 7);
  const engagement = await getEngagementData(shop.domain, 7);

  // Call Claude Haiku
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: buildAnalysisPrompt(shop, funnelData, trafficData, productData, engagement),
    }],
  });

  // Parse insights from response
  const insightsText = response.content[0].type === 'text' ? response.content[0].text : '';
  const insights = JSON.parse(insightsText);

  // Store in PostgreSQL
  for (const insight of insights) {
    await prisma.insight.create({
      data: {
        shopId: shop.id,
        type: insight.type,
        title: insight.title,
        body: insight.body,
        severity: insight.severity,
        category: insight.category,
        metadata: insight,
      },
    });
  }

  return NextResponse.json({ insights });
}
```

### Weekly Email Digest

Use Resend or Brevo to send a weekly email to the shop owner:
- Subject: "GreenTrail Weekly: Your store's top 3 insights"
- Content: The 3 most recent insights + KPI summary table
- Trigger: Vercel Cron every Monday at 9am (shop's timezone)

### Dashboard Integration

- **Insight banner** at top of Overview page: latest unread insight
- **Insights page** (`/insights`): Full list of all insights, filterable by type/severity
- Mark as read / dismiss functionality
- "Analyze Now" button for on-demand analysis

**Phase 5 is complete when:** AI generates 3 relevant, specific insights with real store data, and they appear on the dashboard.

---

## Phase 6: Billing & App Store Submission

**Goal:** Working subscription billing and App Store listing.

### Pricing Tiers

| Feature | Free | Growth ($19/mo) | Pro ($49/mo) |
|---------|------|-----------------|--------------|
| Events/month | 10,000 | 100,000 | Unlimited |
| Data retention | 7 days | 90 days | 2 years |
| Conversion funnel | Yes | Yes | Yes |
| Traffic sources | Basic | Full | Full |
| Product analytics | Top 5 | All | All |
| AI insights | None | 3/week | Daily + on-demand |
| Email digest | None | None | Weekly |
| Data export (CSV) | None | None | Yes |
| API access | None | None | Yes |
| Live view | None | Yes | Yes |
| Comparison mode | None | Yes | Yes |

### Shopify Billing API Integration

Create `web/src/lib/billing.ts`:

```typescript
import { shopifyApi } from '@/lib/shopify';

const PLANS = {
  growth: {
    name: 'GreenTrail Growth',
    amount: 19.00,
    trialDays: 7,
    eventsCap: 100000,
    retentionDays: 90,
  },
  pro: {
    name: 'GreenTrail Pro',
    amount: 49.00,
    trialDays: 7,
    eventsCap: -1, // unlimited
    retentionDays: 730, // 2 years
  },
};

export async function createSubscription(shop: string, accessToken: string, plan: 'growth' | 'pro') {
  const planConfig = PLANS[plan];

  // GraphQL mutation
  const mutation = `
    mutation appSubscriptionCreate($name: String!, $returnUrl: URL!, $lineItems: [AppSubscriptionLineItemInput!]!, $trialDays: Int) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        trialDays: $trialDays
        lineItems: $lineItems
      ) {
        appSubscription { id status }
        confirmationUrl
        userErrors { field message }
      }
    }
  `;

  const variables = {
    name: planConfig.name,
    returnUrl: `https://greentrail.app/billing/confirm?shop=${shop}`,
    trialDays: planConfig.trialDays,
    lineItems: [{
      plan: {
        appRecurringPricingDetails: {
          price: { amount: planConfig.amount, currencyCode: 'USD' },
          interval: 'EVERY_30_DAYS',
        },
      },
    }],
  };

  // Execute via Shopify Admin API
  // Returns confirmationUrl — redirect merchant there to approve
}
```

### Billing Flow

1. Merchant visits `/settings` → clicks "Upgrade to Growth"
2. App calls `appSubscriptionCreate` → gets `confirmationUrl`
3. Redirect merchant to Shopify's confirmation page
4. Merchant approves → Shopify redirects back to `returnUrl`
5. App verifies subscription status → updates `shop.plan` in PostgreSQL
6. Features unlocked based on plan

### Usage Tracking

- Track `shop.eventsThisMonth` in PostgreSQL
- Reset counter on billing cycle start (webhook: `app_subscriptions/update`)
- When free tier exceeds 10K events: show upgrade banner, stop ingesting
- When growth tier exceeds 100K: show upgrade or usage overage option

### App Store Listing Assets

Prepare before submission:
- [ ] App icon (1200x1200px)
- [ ] Screenshots (1600x900px): Overview, Funnel, Traffic, AI Insights, Live View
- [ ] Demo video (optional, 60-90 seconds)
- [ ] App description (focus on privacy-first + AI positioning)
- [ ] Privacy policy page (hosted on greentrail.app/privacy)
- [ ] Terms of service page (hosted on greentrail.app/terms)
- [ ] Support email / contact page

### App Review Checklist

Shopify requires:
- [ ] App installs cleanly on a fresh store
- [ ] App uninstalls cleanly (GDPR shop/redact webhook works)
- [ ] No blocking scripts on storefront (Web Pixel is sandboxed — we're good)
- [ ] Proper loading states (no blank screens)
- [ ] Error handling (graceful failures, not crashes)
- [ ] Accessible UI (Polaris handles this)
- [ ] GDPR compliance (data request, customer redact, shop redact)
- [ ] Billing works correctly (free tier + paid upgrades)
- [ ] Performance: < 3s initial load for dashboard

**Phase 6 is complete when:** Billing flow works end-to-end on a test store, and app passes the Shopify review checklist.

---

## Phase 7: Mamafern Integration

**Goal:** Replace mamafern's internal SQLite analytics with GreenTrail.

### Step 7.1: Install GreenTrail on Mama Fern Store

1. Deploy GreenTrail to production (Vercel)
2. Install on mama-fern.myshopify.com via Partners Dashboard
3. Web Pixel auto-deploys to the storefront
4. Verify events flow in ClickHouse

### Step 7.2: Remove Old Analytics from Mamafern Repo

Delete these files from `D:/Dev_Land/mamafern/`:

```
src/lib/db.ts                              # SQLite client
src/types/analytics.ts                     # Old types (now in GreenTrail)
src/app/api/analytics/events/route.ts      # Old ingestion endpoint
src/app/api/analytics/dashboard/route.ts   # Old dashboard API
src/app/analytics/page.tsx                 # Old dashboard page
src/app/analytics/layout.tsx               # Old dashboard layout
src/components/analytics/AnalyticsDashboard.tsx
src/components/analytics/FunnelChart.tsx
src/components/analytics/EngagementSummary.tsx
public/analytics-pixel.js                 # Old tracking script
analytics.db                              # SQLite database file
```

Remove from `package.json`:
- `better-sqlite3`
- `@types/better-sqlite3`
- `recharts` (if only used by analytics — check first)

### Step 7.3: Verify

- Browse mamafern store → events appear in GreenTrail ClickHouse
- Open GreenTrail in Shopify admin → see mamafern's real analytics
- AI generates insights based on mamafern's traffic patterns
- Old `/analytics` route returns 404 (expected)

**Phase 7 is complete when:** Mamafern's analytics are fully powered by GreenTrail, and all old analytics code is removed from the repo.

---

## Verification Checklist

| Phase | Test | Pass? |
|-------|------|-------|
| 1 | App installs on dev store via `shopify app dev` | [ ] |
| 1 | Embedded page renders in Shopify admin (Polaris UI) | [ ] |
| 1 | PostgreSQL schema migrated (shops + insights tables) | [ ] |
| 1 | GDPR webhooks respond correctly | [ ] |
| 2 | Web Pixel registers on store install | [ ] |
| 2 | Browsing dev store generates events in ClickHouse | [ ] |
| 2 | All 15 standard events captured correctly | [ ] |
| 2 | Batch insert to ClickHouse works (check row counts) | [ ] |
| 2 | Materialized views populate hourly/daily rollups | [ ] |
| 3 | Dashboard shows funnel with real data | [ ] |
| 3 | KPI cards show correct sessions, CVR, revenue, AOV | [ ] |
| 3 | Traffic sources table populates from UTM/referrer | [ ] |
| 3 | Product performance table shows real products | [ ] |
| 3 | Time range selector works (7d, 30d, 90d) | [ ] |
| 3 | Comparison mode shows % change vs previous period | [ ] |
| 4 | Live view shows active visitor count | [ ] |
| 4 | Engagement metrics (bounce rate, session duration) correct | [ ] |
| 5 | AI generates 3 insights with specific metrics | [ ] |
| 5 | Insights appear on dashboard with correct severity | [ ] |
| 5 | Weekly email digest sends correctly | [ ] |
| 6 | Free tier installs without billing prompt | [ ] |
| 6 | Growth plan subscription creates + redirects to Shopify | [ ] |
| 6 | Plan upgrade reflects in dashboard features | [ ] |
| 6 | Event cap enforced (free tier stops at 10K) | [ ] |
| 7 | GreenTrail installed on mamafern store | [ ] |
| 7 | Old analytics code removed from mamafern repo | [ ] |
| 7 | Mamafern events flowing through GreenTrail | [ ] |

---

## External Service Links

| Service | Purpose | Free Tier Limits |
|---------|---------|-----------------|
| [Shopify Partners](https://partners.shopify.com) | App registration, dev stores | Unlimited dev stores |
| [Neon](https://neon.tech) | PostgreSQL | 0.5GB storage, 1 project |
| [ClickHouse Cloud](https://clickhouse.cloud) | Event analytics | 10GB storage, trial period |
| [Vercel](https://vercel.com) | Hosting | 100GB bandwidth, serverless |
| [Anthropic Console](https://console.anthropic.com) | Claude API | Pay-as-you-go (~$0.001/insight) |
| [Upstash](https://upstash.com) | Redis (optional buffer) | 10K commands/day |
| [Resend](https://resend.com) | Email digests | 3K emails/month |

---

## Key Reference Docs

- [Shopify Web Pixels API](https://shopify.dev/docs/api/web-pixels-api) — Standard events, register() API, sandbox rules
- [Shopify App Bridge v4](https://shopify.dev/docs/api/app-bridge) — Embedded app auth, navigation
- [Shopify Billing API](https://shopify.dev/docs/apps/launch/billing) — appSubscriptionCreate, usage records
- [ClickHouse MergeTree](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree) — Partitioning, TTL, ORDER BY
- [ClickHouse Materialized Views](https://clickhouse.com/docs/en/sql-reference/statements/create/view#materialized-view) — Pre-aggregation pattern
- [ozzyonfire/shopify-next-app](https://github.com/ozzyonfire/shopify-next-app) — Scaffold source code & README
- [Shopify Polaris](https://polaris.shopify.com/) — Component library for embedded apps
