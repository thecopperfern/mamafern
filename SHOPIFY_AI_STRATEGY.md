# MamaFern — Headless Shopify AI Strategy

> **STATUS: DEFERRED — Post-launch.** Decision made Feb 25, 2026 to launch without AI chat agent. Focus is on core shopping experience, Mother's Day campaign (Mar 16 – May 10), and product catalog buildout. Revisit after store launch and initial sales data.

> Full review, research, and implementation roadmap for building out the headless Shopify storefront with AI-powered features.

---

## 1. Video Context & What It Covers

The referenced video (and the ecosystem it belongs to) covers building an **AI-powered Shopify storefront agent** — specifically using Anthropic's Claude AI integrated with Shopify's Storefront API via the **Model Context Protocol (MCP)**. This is part of Shopify's Winter '26 Edition push toward "agentic commerce."

The core pattern shown:

1. A chat bubble embedded in a headless storefront
2. Claude receives tool definitions for Shopify operations (search products, add to cart, fetch policies, checkout)
3. Server-Sent Events (SSE) stream responses back to the UI in real-time
4. Claude uses tool_use to call Shopify GraphQL mutations when the user asks to add items or check out
5. Conversation history is persisted per session

This maps directly onto your existing stack. You already have the GraphQL queries/mutations — the AI layer sits on top of them as a "natural language interface" to what you've already built.

---

## 2. Current Codebase State

### What You Have (Strong Foundation)

| Area | Status | Notes |
|------|--------|-------|
| Next.js 15 + App Router | Complete | React 19, TypeScript strict |
| Shopify Storefront GraphQL | Complete | graphql-request + codegen |
| Cart CRUD | Complete | Jotai atoms + localStorage |
| Customer Auth | Complete | Login/Signup + nookies cookies |
| Collections + Pagination | Complete | Cursor-based pagination |
| Product Detail + Variants | Complete | Embla carousel, option selection |
| UI System | Complete | shadcn/ui + Tailwind |
| TanStack Query | Complete | 60s stale time, typed hooks |

### What Is Missing

| Area | Priority | Effort |
|------|----------|--------|
| Checkout page | Critical | Low (checkoutUrl already exists) |
| Server-side API proxy | Critical (security) | Low |
| Customer profile page | High | Medium |
| Order history page | High | Medium |
| Search (product/collection) | High | Medium |
| AI chat agent | High | Medium |
| Wishlist / saved items | Medium | Medium |
| Product reviews | Medium | Medium |
| Shopify Catalog / MCP discovery | Medium | Low |
| SEO meta tags (dynamic) | High | Low |
| Error boundaries + loading states | Medium | Low |
| Rate limiting on API proxy | Medium | Low |

---

## 3. Critical Security Issue: Fix First

### Problem

Your Shopify Storefront token is exposed to the browser:

```
NEXT_PUBLIC_SHOPIFY_STORE_API_URL
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

`NEXT_PUBLIC_` variables are bundled into client-side JavaScript. Anyone can open DevTools → Network → see the token in request headers. While the Storefront API token has limited scope (read-only for most operations), exposing it enables:

- Competitors scraping your full product catalog and pricing automatically
- Abuse of your API quota (rate limits hit on your account, not theirs)
- Token rotation forcing you to redeploy every time

### Fix: Next.js Route Handler Proxy

Create `/src/app/api/shopify/route.ts` as a server-side proxy. Move the credentials to server-only environment variables (no `NEXT_PUBLIC_` prefix). All GraphQL calls go through this route, which adds the auth header server-side before forwarding to Shopify.

```
.env.local (server-only):
  SHOPIFY_STORE_API_URL=https://your-store.myshopify.com/api/2024-10/graphql.json
  SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here

.env.local (client-safe, just the domain for display):
  NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
```

**Client side:** Posts GraphQL query body to `/api/shopify`
**Route handler:** Adds auth header + forwards to Shopify
**Rate limiting note:** With a serverless proxy, all requests appear to come from one IP. Add a simple in-memory or Redis rate limiter per user session to stay within Shopify's limits.

---

## 4. Immediate Implementation Priorities

### 4.1 Checkout Flow

You already have `cart.checkoutUrl` from Shopify. The simplest implementation:

```
src/app/checkout/page.tsx
```

On this page:
1. Display cart summary (line items, totals)
2. Show a "Complete Purchase" button that redirects to `cart.checkoutUrl`
3. Shopify handles the actual checkout (payment, address, confirmation)

This is a 1–2 hour implementation that unblocks purchases.

**Optional advanced path:** Use Shopify's Checkout Extensibility to embed your own UI. Much more work but keeps the branded experience.

### 4.2 Customer Profile + Orders

GraphQL queries already exist in `src/graphql/profile.ts`:
- `GET_CUSTOMER` — profile data
- `GET_CUSTOMER_ORDERS` — paginated order history
- `CUSTOMER_UPDATE` — profile editing

Need to build:
- `src/app/account/page.tsx` — profile overview
- `src/app/account/orders/page.tsx` — order list + details
- Route guard: redirect to `/auth` if no `customerAccessToken` cookie

### 4.3 Search

You have `useDebounce` already. Need:

GraphQL query using Shopify's `search` field on the Storefront API:
```graphql
query SearchProducts($query: String!, $first: Int!) {
  search(query: $query, first: $first, types: PRODUCT) {
    edges {
      node { ... on Product { id title handle images(first:1) { ... } priceRange { ... } } }
    }
  }
}
```

UI: Search bar in Navbar with debounced results dropdown, or a full `/search?q=` page.

---

## 5. AI Chat Agent Implementation

### Architecture

```
Browser
  └── ChatBubble component (React)
        └── POST /api/chat (SSE stream)
              └── Claude API (anthropic SDK)
                    └── tool_use → Shopify GraphQL (server-side, secure)
```

### Why This Architecture

- Claude never directly calls Shopify — your server does
- Shopify tokens stay server-side (fixes the security issue simultaneously)
- SSE gives streaming "typing" UX without websockets
- Claude's tool_use is deterministic: you define exactly which Shopify operations it can invoke

### Tool Definitions for Claude

Map your existing GraphQL operations to Claude tools:

| Tool Name | Underlying GraphQL | What It Does |
|-----------|-------------------|--------------|
| `search_products` | `GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY` + search query | Natural language product search |
| `get_product_details` | `GET_PRODUCT_BY_HANDLE_QUERY` | Fetch full product info for a handle |
| `add_to_cart` | `ADD_TO_CART` mutation | Add a variant to cart |
| `view_cart` | `GET_CART` query | Show current cart contents |
| `remove_from_cart` | `REMOVE_FROM_CART` mutation | Remove a line item |
| `get_collections` | `GET_COLLECTIONS_QUERY` | List available collections |
| `get_store_policy` | Static content or metafields | Shipping, returns, etc. |

### System Prompt Strategy

```
You are MamaFern's shopping assistant. You help customers find products,
manage their cart, and answer questions about the store.

Rules:
- Only use the provided tools to interact with the store
- Never invent product details; use the search_products or get_product_details tools
- When adding to cart, always confirm the variant and quantity with the user first
- Keep responses concise and friendly
- If asked about checkout, explain they can use the cart icon at the top right
```

### Key Implementation Files

```
src/app/api/chat/route.ts          — SSE streaming endpoint
src/app/api/shopify/route.ts       — Shopify GraphQL proxy
src/lib/claude.ts                  — Claude client + streamConversation helper
src/lib/shopify-tools.ts           — Tool execution logic (maps tool calls to GraphQL)
src/components/view/ChatBubble/    — Chat UI component
src/lib/atoms/chat.tsx             — Chat state (Jotai)
```

### SSE Streaming Pattern

```typescript
// src/app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages, cartId } = await req.json()

  const stream = new ReadableStream({
    async start(controller) {
      const response = await anthropic.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
        tools: SHOPIFY_TOOLS,
      })

      for await (const event of response) {
        if (event.type === 'content_block_delta') {
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`)
        }
        if (event.type === 'message_stop') {
          controller.enqueue('data: [DONE]\n\n')
          controller.close()
        }
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
```

### Dependencies to Add

```bash
npm install @anthropic-ai/sdk
```

Only one new dependency needed — everything else is already in your stack.

---

## 6. Shopify Winter '26 / AI Discovery Features

These are forward-looking features that are now available (as of early 2026):

### 6.1 Storefront MCP

Shopify now ships a Storefront MCP server for Oxygen-hosted Hydrogen stores. If you migrate to Oxygen, you get:
- Claude can query your live storefront data directly via MCP
- No need to manually define tool schemas — MCP handles the contract
- Built-in auth for customer-scoped operations

For your current Next.js setup: you can implement the same pattern manually (which is what the AI agent section above describes) without needing Hydrogen/Oxygen.

### 6.2 Shopify Catalog for AI Discovery

Your headless store can register with Shopify Catalog, making your products discoverable through AI shopping assistants (ChatGPT, Perplexity, Google AI). This is an entirely new traffic channel.

Setup involves:
1. Installing the Headless sales channel on your Shopify admin
2. Configuring your storefront domain
3. Shopify generates a catalog feed that AI tools index

### 6.3 Dev MCP for Development Workflow

Add the Shopify Dev MCP server to your Claude Code configuration:

```json
{
  "mcpServers": {
    "shopify-dev": {
      "command": "npx",
      "args": ["@shopify/dev-mcp", "start"]
    }
  }
}
```

This gives Claude Code live access to Storefront API docs, Hydrogen cookbook, and GraphQL schema — meaning future development sessions here will have accurate, up-to-date Shopify API knowledge.

---

## 7. Full Implementation Roadmap

### Phase 1: Security + Checkout (Unblock Purchases)

1. **Move tokens server-side** — Create `/api/shopify` proxy route handler, update `src/shopify/client.ts` to call the proxy instead of Shopify directly, rename env vars to remove `NEXT_PUBLIC_`
2. **Checkout page** — Build `/app/checkout/page.tsx` using `cart.checkoutUrl` redirect
3. **Dynamic SEO** — Add `generateMetadata` to product and collection pages using existing GraphQL data

### Phase 2: Account + Search

4. **Account pages** — `/app/account/page.tsx` and `/app/account/orders/page.tsx` using existing profile GraphQL
5. **Search** — Add `search` GraphQL query, search UI in Navbar with debounce
6. **Route guards** — Protect account pages, handle token expiry gracefully

### Phase 3: AI Chat Agent

7. **Claude API integration** — Add `@anthropic-ai/sdk`, create `src/lib/claude.ts`
8. **Shopify tools** — Create `src/lib/shopify-tools.ts` mapping tools to existing GraphQL operations
9. **Chat API route** — Build `/api/chat/route.ts` with SSE streaming
10. **ChatBubble component** — Build floating chat UI with streaming message display
11. **Cart sync** — Chat agent reads/writes the same Jotai cart atom so cart UI stays in sync

### Phase 4: Discovery + Growth

12. **Shopify Catalog registration** — Enable AI discovery channel
13. **Wishlist** — New GraphQL query + Jotai atom, persist to localStorage or customer metafields
14. **Product reviews** — Shopify product reviews app or Judge.me integration
15. **Dev MCP** — Add to Claude Code config for faster future development

---

## 8. Security Checklist

| Item | Current State | Action |
|------|--------------|--------|
| Storefront token exposed | `NEXT_PUBLIC_` (client-visible) | Move to server-only proxy |
| Customer access token storage | `nookies` cookie (good) | Consider `httpOnly: true` flag |
| Cart ID in localStorage | OK for Storefront API | No change needed |
| Claude API key | Not yet used | Must be server-only env var, never `NEXT_PUBLIC_` |
| Input sanitization | Forms use Zod validation | Good for existing forms |
| HMAC verification | N/A currently | Needed if using Shopify webhooks later |
| Rate limiting | None | Add to `/api/shopify` and `/api/chat` routes |
| CORS | Not configured | Add to route handlers in Phase 1 |

---

## 9. Environment Variables (Target State)

```bash
# .env.local — ALL server-only (no NEXT_PUBLIC_ for secrets)

# Shopify
SHOPIFY_STORE_API_URL=https://your-store.myshopify.com/api/2024-10/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-public-storefront-token

# AI
ANTHROPIC_API_KEY=your-claude-api-key

# Public (safe to expose — just domain for UI display purposes)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SITE_URL=https://mamafern.com
```

---

## 10. Key External Resources

- [Shopify: Build a Storefront AI Agent](https://shopify.dev/docs/apps/build/storefront-mcp/build-storefront-ai-agent) — Official tutorial covering the exact pattern referenced in the video
- [Hydrogen Winter '26 AI Update](https://hydrogen.shopify.dev/update/december-2025) — Storefront MCP, Shopify Catalog, Dev MCP features
- [Shopify Winter '26 Dev Edition](https://www.shopify.com/news/winter-26-edition-dev) — Full overview of AI-native commerce tools
- [Vercel: Next.js + Shopify Guide](https://vercel.com/guides/building-ecommerce-sites-with-next-js-and-shopify) — Architecture patterns and deployment
- [Shopify Storefront API Docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started) — API reference

---

## Summary

Your codebase is a clean, well-structured headless Shopify implementation. The GraphQL layer is solid and the existing mutations/queries cover everything needed for Phase 1–3 without adding new API operations. The main gaps are:

1. **Security** — Token exposure is the most urgent fix
2. **Checkout** — The revenue path needs to be completed
3. **AI agent** — This is the differentiating feature the video demonstrates; your existing GraphQL layer maps cleanly onto Claude tool definitions

The AI agent doesn't require rebuilding anything — it layers on top of your existing Shopify GraphQL operations via Claude's `tool_use` feature, with a single new API route handling the streaming.
