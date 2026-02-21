# MamaFern — Marketing Plan

> Startup brand marketing strategy for a headless Shopify storefront. Built with AI as a development tool. No AI features in the live store. Focus: grow a loyal customer base, increase average order value, and earn repeat buyers.

---

## A Note on the PRD

No product requirements document or brand guidelines file was found in this repository. The site currently shows "Minimal Store" as the brand name and generic Next.js metadata. **Before executing any marketing, the brand identity section below must be completed first.** Everything else in this plan depends on it.

---

## 1. Brand Identity (Define Before Marketing)

### What "MamaFern" Signals

The name carries two distinct layers:

- **Mama** — nurturing, authentic, real, community-first, not corporate. Could lean into "cool girl" energy, the modern mother aesthetic, or simply a warm/human brand personality.
- **Fern** — botanical, nature-inspired, earthy, organic, grounded. Suggests a palette of greens, neutrals, and natural textures.

Combined: a fashion brand with a grounded, nature-adjacent identity and a warm, human voice. Think: the intersection of conscious living and personal style.

### Brand Direction Options (Choose One)

| Direction | Vibe | Palette | Customer |
|-----------|------|---------|----------|
| **Botanical Minimal** | Clean, earthy, quiet luxury | Sage, cream, terracotta, forest green | Style-conscious 25-40, values quality + sustainability |
| **Cool Girl Nature** | Effortless, slightly editorial, raw | Olive, sand, deep brown, off-white | Fashion-forward 20-35, Instagram/TikTok native |
| **Warm Community** | Approachable, inclusive, real | Warm neutrals, rust, camel, ivory | Community-oriented, values brand story over trend |

### Brand Identity Checklist (Must Define)

- [ ] **Logo** — wordmark or icon? Typography style?
- [ ] **Primary color palette** — 3-4 colors max
- [ ] **Typography** — heading font (personality) + body font (readability)
- [ ] **Photography style** — studio vs. lifestyle, light vs. moody, model-led vs. product-only
- [ ] **Tone of voice** — 3 adjectives (e.g., warm, honest, effortless)
- [ ] **Brand tagline or positioning statement**
- [ ] **What MamaFern is NOT** — just as important as what it is

Once defined, update:
- `src/components/view/Logo/index.tsx` (currently reads "Minimal Store")
- `src/app/layout.tsx` metadata (currently reads "Create Next App")
- Tailwind color tokens in `tailwind.config.ts`

---

## 2. Target Audience

MamaFern has Men and Women collections. Two primary personas:

### Persona A — The Woman (Primary)

**"Jordan, 28"**
- Lives in a mid-size or major city
- Follows fashion content on TikTok and Instagram but is skeptical of fast fashion
- Values quality and the story behind a brand
- Shops online 2-4x per month
- Average order: $60-$120
- Discovers brands through organic social, friends' recommendations, and editorial content
- Will become a loyal customer if she connects with the brand story

### Persona B — The Man (Secondary)

**"Marcus, 30"**
- Buys for himself or as gifts
- Values understated, quality clothing
- Less influenced by editorial, more by reviews and "does this last"
- Average order: $70-$130
- Discovers brands through Reddit, YouTube reviews, word of mouth

### Persona C — The Gift Buyer (Opportunity)

Not a wearer of the product but buys MamaFern as a gift. This customer has high AOV (buys multiple items) and is most active around holidays and gifting moments. Design the gift experience (packaging, gift notes, gift wrapping upsell) for this persona specifically.

---

## 3. Channel Strategy

### The Hierarchy

For a startup with limited time and budget, execute channels in this order:

```
1. Email list (owned, highest ROI — $36-45 per $1 spent)
2. Organic social (TikTok + Instagram — free reach while algorithm rewards new accounts)
3. SEO (slow burn, 6-9 months to traction, but free traffic forever)
4. Referral program (zero CAC acquisitions)
5. Paid retargeting (after organic is established — not before)
6. Cold paid ads (last, when CAC math is proven)
```

### Channel-by-Channel Breakdown

#### Email (Start Immediately)
- Set up before driving any traffic — you cannot recover a visitor you did not capture
- Welcome popup: 10% off first order or early access in exchange for email
- Tool: **Shopify Email** (free) to start → **Omnisend** when you want pre-built flows → **Klaviyo** at 500+ orders/month
- See Section 6 for full email flows

#### TikTok (Primary Organic)
- Algorithm rewards original content regardless of follower count — a new account can go viral
- Best content for fashion brands: founder story, product close-ups with good music, "what I ordered vs. what I got" (positive), styling videos, brand behind-the-scenes
- Frequency: 3-5 posts/week
- Do NOT produce polished ads — raw, authentic content outperforms on this platform

#### Instagram (Brand Home)
- Use Reels for reach (same TikTok content, repurposed)
- Use Stories for community engagement: polls, Q&A, DM prompts, new arrivals
- Use the static feed for brand aesthetic — this is your mood board for new visitors
- Save key content to Highlights: Reviews, Our Story, New Arrivals, Behind the Scenes

#### Pinterest (Sleeper Channel for Fashion)
- Fashion is one of Pinterest's strongest categories
- Pins have a 6-month to 3-year discovery window — content drives traffic long after posting
- Create shoppable pins linked directly to MamaFern product pages
- Repurpose existing product photography — no new content required
- Set up and maintain, then leave it running

#### SEO + Blog (6-9 Month Investment)
- See Section 8 for full technical SEO plan
- One blog post per week targeting long-tail fashion/style keywords
- Collection page descriptions with 150-300 words of editorial content (not just product grids)
- Ranks over time, drives free traffic with purchase intent permanently

#### Referral (No-Cost Acquisition)
- Every happy customer is a potential free acquisition
- Install **Smile.io** (free tier) or **ReferralCandy** and give customers a unique code
- Structure: "Give 10% off to a friend, get $10 store credit when they buy"
- Promote it in post-purchase email and on the account page

#### Paid (Phase 2+)
- Do not run cold traffic ads until: email flows are live, organic content is validated, you have 10+ reviews
- Start with retargeting only: site visitors, email list, Instagram/TikTok followers
- Retargeting CPAs are 3-5x lower than cold audiences — start here
- Promote your highest-performing organic posts with $20-$50 boosts to test what scales

---

## 4. Launch Strategy (Zero Audience)

The goal of a launch strategy is to generate momentum — not to be ready when things are perfect.

### 8 Weeks Before Launch

- [ ] Start organic content immediately — even with no product ready, share the brand-building journey ("building in public")
- [ ] Set up email capture with a waitlist landing page ("Be the first to know when we launch")
- [ ] Target: **500 email subscribers before launch day**
- [ ] Identify 15-20 nano/micro-influencers in the fashion niche to seed product to
- [ ] Begin creating your first 10 SEO blog posts

### 4 Weeks Before Launch

- [ ] Send product samples to influencer list — no payment required, ask for honest content if they love it
- [ ] Tease new arrivals in Stories and TikTok (no price, no date yet — just product)
- [ ] Build your Judge.me review profile — ask the first 10 customers for written or video reviews personally
- [ ] Finalize brand photography and product images for launch

### Launch Week

- [ ] Email waitlist with early access (24 hours before public launch)
- [ ] Early access discount for waitlist subscribers (10-15% off, 48 hours only)
- [ ] Post launch content across TikTok and Instagram on launch day
- [ ] Coordinate influencer content drops across the same week (not all on day 1 — spread over 5-7 days for sustained momentum)
- [ ] Enable Fomo or Sales Pop app to show real-time purchase activity

### First 30 Days Post-Launch

- [ ] Follow up with every customer personally — ask for reviews, ask for feedback
- [ ] Repost every single piece of UGC to your own channels
- [ ] Monitor what content performs — double down on what works, drop what doesn't
- [ ] Send a post-purchase email sequence (see Section 6)

---

## 5. Average Order Value (AOV) Strategy

Current average AOV benchmark for fashion: **$85-$120**. The goal is to get above your category average within 90 days of launch.

### Tactic 1 — Free Shipping Threshold

Set free shipping at **15-20% above your current AOV**.

- Example: if AOV is $80, set free shipping at $95
- Display a dynamic cart progress bar: "You're $15 away from free shipping"
- This single tactic causes 58% of shoppers to add items to qualify
- Implement as a cart notification in `src/lib/atoms/cart.tsx`

### Tactic 2 — "Complete the Look" Cross-Sells

On each product page, manually curate 2-3 products that pair with the current item.

- Implement using Shopify product metafields (no app needed initially)
- Or use **Selleasy** (free plan) for automatic cross-sell widgets
- Fashion cross-sells: shirt → pants, jacket → tee, shoes → accessories
- Show at the bottom of the product detail page before Add to Cart

### Tactic 3 — Post-Purchase One-Click Upsell

After checkout, before the order confirmation page, offer one additional item.

- This is the single highest-converting upsell placement — payment is already captured
- Offer a complementary product at a discount ("Add this for 20% off — no re-entering payment info")
- App: **Aftersell** (free plan) or **ReConvert**
- Target: $10-$30 add-on offers, not major items

### Tactic 4 — Bundles

Create curated bundles in Shopify admin (shirt + pants + belt = "The Full Look" bundle).

- Price at 10-15% discount vs. buying separately
- Bundle perceived value is almost always higher than individual items
- Feature bundles prominently on collection pages and homepage
- App: **EcomRise** (free plan includes bundling)

### Tactic 5 — Gift Wrapping Upsell

At checkout, offer a premium gift wrapping option for $5-$8.

- Captures the gift buyer persona (Section 2, Persona C)
- Zero inventory risk — just better packaging
- Mention it in November-December email campaigns as a seasonal push
- Add as a Shopify cart attribute or checkout extension

### Tactic 6 — Spend Threshold Bonus

Flash "Spend $X more and get [free item / free gift / free shipping]" at the cart stage.

- Rotate the incentive: sometimes free shipping, sometimes a free item (clearance, samples), sometimes bonus discount
- Time-limited versions ("Until midnight tonight") outperform always-on versions

### AOV Target Milestones

| Timeline | Target AOV | Primary Lever |
|----------|------------|---------------|
| Launch (Month 1) | $75-$90 | Free shipping threshold |
| Month 3 | $90-$110 | Cross-sells live + bundles |
| Month 6 | $110-$130 | Post-purchase upsell + gift program |

---

## 6. Email Marketing Flows

Set these up before launching. They run automatically and generate 30-50% of total email revenue.

### Flow 1 — Welcome Series (Trigger: email signup)

| # | Send Time | Subject Line Direction | Content |
|---|-----------|----------------------|---------|
| Email 1 | Immediately | "Welcome to MamaFern" | Brand story, what makes us different, welcome discount, link to best sellers |
| Email 2 | Day 2 | "Our most loved pieces" | Best sellers, social proof (reviews), reminder of welcome discount |
| Email 3 | Day 5 | "Last chance: your welcome offer" | Final discount reminder, founder story, Instagram community invite |

Welcome emails generate 4x average open rates and 5x average revenue per email.

### Flow 2 — Abandoned Cart (Trigger: cart created, no purchase in 1 hour)

| # | Send Time | Approach | Extra |
|---|-----------|----------|-------|
| Email 1 | 1 hour | Clean reminder, product image, link back | No discount yet |
| Email 2 | 24 hours | Light urgency, "these are popular" | Add product reviews |
| Email 3 | 72 hours | Final attempt with small sweetener | Free shipping or 10% off |

Recovers 5-15% of abandoned carts. Average revenue: $3.65 per recipient.

### Flow 3 — Post-Purchase Series (Trigger: order placed)

| # | Send Time | Purpose |
|---|-----------|---------|
| Email 1 | Immediate | Order confirmation + what to expect |
| Email 2 | Shipped | Tracking link + cross-sell suggestion |
| Email 3 | 3-5 days after delivery | Review request + UGC prompt ("Tag us") |
| Email 4 | 10-14 days after delivery | Personalized second-purchase recommendation + repeat buyer discount |

### Flow 4 — Browse Abandonment (Trigger: product page viewed, no cart add)

- 1-2 emails featuring the viewed product
- Include reviews for that specific product
- Lower intent than cart abandonment but still profitable

### Flow 5 — Win-Back (Trigger: 90 days since last purchase)

| # | Send Time | Message |
|---|-----------|---------|
| Email 1 | 90 days | "We miss you — here's what's new" |
| Email 2 | +7 days | "Still thinking about it? Here's 15% off" |
| Email 3 | +7 days | Final attempt before suppressing |

After 3 emails with no engagement: suppress the contact (protects deliverability).

### Email Platform Recommendation

| Stage | Platform | Why |
|-------|----------|-----|
| Launch | **Shopify Email** | Free, built-in, gets flows live in hours |
| Growing (100+ orders/month) | **Omnisend** | Pre-built flows, free tier, Shopify-native |
| Scaling (500+ orders/month) | **Klaviyo** | Best segmentation and revenue attribution |

---

## 7. Repeat Buyer / Retention Strategy

Loyal customers generate 44% of total revenue and 46% of orders despite being only 21% of the customer base. A 5% increase in retention can boost profits by 25-95%.

### Target Benchmarks

| Metric | Healthy | Best-in-Class |
|--------|---------|---------------|
| Repeat purchase rate | 20-30% | 40%+ |
| Time between orders | Under 90 days | Under 60 days |
| Customer LTV (Year 1) | 2x AOV | 3-4x AOV |

### Tactic 1 — Loyalty Program

Install **Smile.io** (free tier) or **Growave** (free plan).

Structure:
- **Points on purchases** (e.g., $1 spent = 10 points, 100 points = $1 off)
- **Points for reviews** — incentivizes the social proof you need
- **Points for referrals** — turns customers into acquisition channels
- **VIP tiers** — Bronze (0-200 points), Silver (200-500), Gold (500+), each with escalating perks

Name the tiers something on-brand for MamaFern (botanical language works: Seedling, Bloom, Root).

### Tactic 2 — SMS Re-Engagement

For customers who have purchased but gone quiet (60-90 days), send a 1-2 message SMS re-engagement.

- SMS open rates are 98% vs. 20-25% for email
- Tools: **Postscript** or **Klaviyo SMS** (if already using Klaviyo)
- Keep messages short, personal, and offer value: "Hey [name], new drops just landed. Use COMEBACK15 for 15% off."

### Tactic 3 — VIP Early Access

Give your top 10% of customers (by spend) early access to new drops, sales, and limited items.

- Name this group something on-brand (e.g., "MamaFern Roots")
- Communicate via email with a distinct design/tone — make them feel seen
- First access to new collections before the public
- This mechanic creates status incentives that motivate higher spend

### Tactic 4 — "You Might Need This Again" Replenishment

If any MamaFern products are consumable or season-based, set timed "it might be time to reorder" emails at the average repurchase cycle.

- Fashion example: seasonal drops → "New season is here, your [item they bought last spring] has a new version"
- Triggered by time since last purchase + product category

### Tactic 5 — Community Layer

Create a private space for loyal customers — Discord, Circle, or a private Instagram close friends list.

- Give early product input opportunities: "Help us name this colorway", "Vote on our next drop"
- Share behind-the-scenes content before it goes public
- Brands that build community see dramatically higher LTV and word-of-mouth

### Tactic 6 — Handwritten or Personal Thank-You

For your first 200 customers, include a handwritten note or a signed card in the package. This is not scalable forever but creates the kind of experience that generates organic word of mouth and UGC at a critical early stage. Cost: ~$0.50/order.

---

## 8. SEO Strategy (Headless-Specific)

Your Next.js headless store does not auto-generate SEO metadata the way a Shopify theme does. Everything below must be built manually — but that means you can also do it better.

### Technical SEO (Phase 1 — Build First)

**In `src/app/layout.tsx`:**
- Replace `"Create Next App"` title and description with MamaFern brand metadata
- Add `openGraph` and `twitter` metadata blocks to the `Metadata` object

**In `src/app/product/[handle]/page.tsx` and `src/app/collections/[handle]/page.tsx`:**
- Add `generateMetadata` function using product/collection title, description, and first image as OG image
- Example:
  ```ts
  export async function generateMetadata({ params }) {
    const product = await fetchProduct(params.handle)
    return {
      title: `${product.title} | MamaFern`,
      description: product.description,
      openGraph: { images: [product.images.edges[0].node.url] }
    }
  }
  ```

**JSON-LD Structured Data:**
- Add `Product` schema to product pages (price, availability, aggregate rating)
- Add `BreadcrumbList` schema to collection and product pages
- Add `Organization` schema to root layout
- Google uses these for rich snippets in search results

**Sitemap and Robots:**
- Add `src/app/sitemap.ts` — Next.js App Router supports dynamic sitemaps natively
- Add `src/app/robots.ts` — disallow `/api/`, allow everything else
- Submit sitemap to Google Search Console on launch day

**Core Web Vitals:**
- Use `next/image` on every product and collection image (already in codebase — audit for any missing instances)
- Add `sizes` prop to all `next/image` components for responsive loading
- Load third-party scripts (analytics, loyalty widgets) via `next/script` with `strategy="lazyOnload"`

**ISR for Product and Collection Pages:**
- Add `revalidate = 60` to product and collection pages (static at build, refreshes every 60 seconds)
- This gives you SEO-friendly static HTML with near-real-time product data

### Content SEO (Months 1-6)

**Collection page descriptions:**
- Add 150-300 words of editorial content above or below each product grid
- Example for Women's collection: describe the aesthetic, the fabrics, the intention behind the collection
- This content is indexed by Google and improves collection page rankings

**Blog / Editorial:**
- Create `src/app/blog/[slug]/page.tsx` with a headless CMS (Sanity is recommended — free tier, excellent Next.js support)
- Target long-tail keywords specific to your fashion niche
- Example keyword targets:
  - "botanical-inspired clothing brands"
  - "sustainable women's fashion online"
  - "minimalist men's fashion under $100"
  - "gender-neutral earth tone outfits"
- One post per week at 800-1,200 words targeting one primary keyword each
- Fashion content that converts: styling guides, "what to wear with", seasonal edit roundups

**Internal Linking:**
- Every blog post should link to 2-3 product or collection pages
- Collection pages should link to each other where relevant
- This passes link equity to your highest-value pages

---

## 9. Social Proof Strategy (Zero Reviews at Launch)

### Pre-Launch

1. **Micro-influencer seeding:** Send 10-20 free products to nano/micro-influencers (1K-50K followers) in the fashion niche. No payment. Ask only for authentic content if they love it.
2. **Founder transparency:** An About page with real photos, your actual story, and why you built MamaFern. This is social proof before you have any reviews.
3. **UGC-first packaging:** Include an insert card in every order with your Instagram handle, a branded hashtag, and a QR code to leave a review.

### Post-Launch

4. **Judge.me:** Install from day one. Every order gets an automated review request 5-7 days after delivery. Even 5-10 reviews change conversion rates significantly.
5. **FOMO apps:** Install **Fomo** or **Trust Pulse** to show real-time purchase activity ("Sarah from Austin just ordered the Fern Tee"). Even small order volume creates perceived momentum.
6. **"Featured In":** Proactively pitch fashion blogs, niche publications, and local press. A single feature adds significant credibility for cold traffic.
7. **Repost every UGC:** Every customer photo on social media gets reposted. Always. Ask permission, always credit. This is your richest free content.

---

## 10. Shopify App Stack

Install apps progressively — not all at once. Every app adds page weight and cost.

### Phase 1: Launch (Free Apps Only)

| Category | App | Cost |
|----------|-----|------|
| Email | Shopify Email | Free |
| Reviews | Judge.me | Free |
| Loyalty | Smile.io | Free tier |
| Post-purchase upsell | Aftersell | Free plan |
| Social proof / FOMO | Fomo or Trust Pulse | Free tier |
| Cross-sell | Selleasy | Free plan |

### Phase 2: Growth (Months 3-6)

| Category | App | Cost |
|----------|-----|------|
| Email (upgrade) | Omnisend | ~$16/month |
| Analytics | Triple Whale | ~$129/month |
| Bundles | EcomRise | Free/paid |
| Referral | ReferralCandy | ~$49/month |
| Headless tracking | Elevar | ~$50/month |

**Elevar is important:** Standard Shopify pixels and analytics tags break in headless Next.js builds. Elevar provides server-side event tracking that works correctly across headless architecture — essential for accurate attribution of paid channels.

### Phase 3: Scale (Month 6+)

| Category | App | Cost |
|----------|-----|------|
| Email (upgrade) | Klaviyo | Based on list size |
| SMS | Postscript or Attentive | Usage-based |
| Loyalty (upgrade) | LoyaltyLion | ~$199/month |
| Reviews (upgrade) | Okendo or Stamped | ~$19-$29/month |
| Personalization | Rebuy | ~$99/month |

---

## 11. Budget Allocation Guide

### Starter Budget ($0-$500/month)

| Activity | Allocation |
|----------|-----------|
| Organic content (TikTok, Instagram, Pinterest) | $0 — time investment only |
| Email marketing (Shopify Email) | $0 |
| Product seeding (10-15 influencers) | $0-$200 (product cost only) |
| SEO tools (Google Search Console) | $0 |
| App stack (Phase 1 — all free) | $0 |

### Growth Budget ($500-$2,000/month)

| Activity | % of Budget |
|----------|------------|
| Paid retargeting (Meta or TikTok) | 40% |
| Influencer/UGC content creation | 30% |
| App upgrades (Omnisend, Elevar) | 20% |
| Content creation tools (Canva Pro, etc.) | 10% |

### Scaling Budget ($2,000-$10,000/month)

| Activity | % of Budget |
|----------|------------|
| Paid ads (retargeting + cold) | 50% |
| Email/SMS platforms | 10% |
| Influencer partnerships | 20% |
| App stack | 10% |
| Analytics + attribution | 10% |

**Rule:** Never spend on cold paid ads until you have: email flows live, 20+ reviews, proven organic content, and a ROAS-positive retargeting campaign. The sequence matters.

---

## 12. KPIs by Growth Stage

### Stage 1 — Launch (Months 1-2)

| Metric | Target |
|--------|--------|
| Email list size | 500+ before launch |
| Website traffic (weekly) | 500+ sessions |
| Email open rate | 35%+ (welcome series) |
| Conversion rate | 1-2% (healthy for new brand) |
| First 30-day orders | 25-50 |
| Reviews collected | 10+ |

### Stage 2 — Growth (Months 3-6)

| Metric | Target |
|--------|--------|
| Monthly orders | 100-300 |
| AOV | $90-$110 |
| Email list | 2,000+ |
| Repeat purchase rate | 15-20% |
| Organic social followers | 1,000+ combined |
| CAC (customer acquisition cost) | Under $30 |

### Stage 3 — Scale (Month 6+)

| Metric | Target |
|--------|--------|
| Monthly orders | 500+ |
| AOV | $110-$130 |
| Repeat purchase rate | 25-30% |
| LTV (12-month) | 2.5-3x AOV |
| ROAS on paid | 3x+ |
| Email revenue % | 30-40% of total revenue |

---

## 13. Content Calendar Framework

### Weekly Rhythm (Fashion Brand)

| Day | Platform | Content Type |
|-----|----------|-------------|
| Monday | TikTok | New week / new drop / styling content |
| Tuesday | Instagram Stories | Poll or Q&A — audience engagement |
| Wednesday | TikTok | Behind the scenes / brand story |
| Thursday | Instagram Reels | Product close-up or "outfit of the week" |
| Friday | Email | New arrivals, weekend promo if running |
| Saturday | TikTok | Customer UGC repost or founder-led content |
| Sunday | Pinterest | Pin 5-10 product images, refresh boards |

### Monthly Rhythm

| Week | Focus |
|------|-------|
| Week 1 | New drop or collection launch content |
| Week 2 | Educational or lifestyle content (styling tips, brand story) |
| Week 3 | Social proof / community (UGC reposts, review highlights) |
| Week 4 | Promotional or re-engagement (loyalty reminder, flash offer) |

### Seasonal Calendar (Key Commerce Moments)

| Month | Opportunity |
|-------|------------|
| January | New Year reset, "new wardrobe" messaging |
| February | Valentine's Day — gift buyer persona, couples content |
| March-April | Spring drop, refresh campaign |
| May | Mother's Day — especially relevant to the "Mama" brand name |
| June-July | Summer styles, vacation dressing |
| September | Fall drop, "back to routine" campaign |
| November | Black Friday / Cyber Monday — plan 6 weeks in advance |
| December | Holiday gifting — gift guides, gift wrapping upsell, last order dates |

**Note on Mother's Day:** The "Mama" in MamaFern makes this moment uniquely ownable. Build a dedicated gift guide, special packaging, and a marketing push specifically around this holiday — this should be one of the top 3 revenue months of the year.

---

## 14. Technical Prerequisite Checklist

Marketing is wasted on a store that cannot convert. Before running any paid traffic, confirm:

- [ ] Checkout works end-to-end (`cart.checkoutUrl` redirect — Phase 1 of the dev plan)
- [ ] Product pages show reviews (Judge.me installed)
- [ ] Free shipping threshold is visible in cart
- [ ] Email popup is live and capturing leads
- [ ] Welcome email flow is active
- [ ] Abandoned cart flow is active
- [ ] Logo shows "MamaFern" (not "Minimal Store")
- [ ] Page titles and descriptions are set (not "Create Next App")
- [ ] OG image tags are set (for social sharing previews)
- [ ] Google Analytics or Vercel Analytics is installed
- [ ] Google Search Console is set up, sitemap submitted

---

## Summary

MamaFern has strong bones — a fast, well-built headless storefront with the technical foundation to support a full e-commerce experience. The marketing layer follows a clear sequence:

1. **Define the brand** (name, palette, voice) — everything else depends on this
2. **Build the email engine** before driving any traffic
3. **Go organic-first** on TikTok and Instagram — the algorithm rewards new accounts
4. **Seed product** to micro-influencers before launch for first-wave social proof
5. **Activate AOV tactics** (free shipping threshold, cross-sells, post-purchase upsells) from day one
6. **Build loyalty** into the experience from the first order — loyalty program, personal touches, community
7. **Add paid spend** only after organic is validated and email is converting
8. **Own Mother's Day** — it is your most brand-aligned commerce moment of the year
