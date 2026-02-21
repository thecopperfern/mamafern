# MamaFern — Comprehensive Marketing Plan

> Startup brand marketing strategy for a headless Shopify storefront built with Next.js 15.
> No AI features in the live store. Focus: grow a loyal customer base, increase average order value, and earn repeat buyers.
>
> **Status note:** No PRD exists in the repository yet. The store currently shows "Minimal Store" placeholder copy. Brand identity section below documents the proposed direction based on name signals. Confirm brand decisions before launching any marketing channels.

---

## 1. Brand Identity

### Current State: No PRD Exists

No PRD exists in the repository. The store currently shows "Minimal Store" placeholder copy in the logo, "Create Next App" in the page metadata, and no brand palette applied in `tailwind.config.ts`. All brand decisions below represent the proposed direction based on the name signals. Confirm these before launching any marketing channels.

### Who MamaFern Is

MamaFern is a **botanical-inspired family apparel brand** — organic cotton tees, sweatshirts, onesies, and accessories for moms, dads, and kids. Small seasonal drops plus evergreen staples. Mid-premium positioning — not fast fashion, not luxury.

**Brand name decoding:**

| Signal | Meaning | Marketing Implication |
|--------|---------|----------------------|
| **Mama** | Nurturing, authentic, community, real | Warm tone, human-first messaging, community over cool |
| **Fern** | Botanical, nature, earthy, slow growth, resilience | Nature-inspired palette, earthy textures, sustainability angle |
| **Combined** | "Rooted care" — fashion that feels grounded and genuine | Reject fast fashion; lean into considered, intentional design |

**Tagline:** "Grounded family apparel for crunchy, cozy homes."

**Key adjectives:** grounded, minimal, playful, natural, warm

**Brand promise:** Skin-friendlier fabrics (organic cotton where possible), made for the whole family to wear together and for real everyday moments.

### 1.1 Visual Identity (Proposed — Requires Confirmation)

| Element | Proposed Spec |
|---------|------|
| Base / background | Cream / oat (`#F5EFE0`), warm white |
| Primary green | Fern green (`#4A7C59`) |
| Primary green light | Muted sage (`#8FAF8B`) |
| Accent warm | Soft terracotta (`#C4622D`) |
| Accent soft | Blush / warm brown (`#C49B8A`) |
| UI font | Humanist sans-serif — Inter or Satoshi |
| Display font | Gentle serif — Playfair Display or Cormorant Garamond |
| Lifestyle imagery | Wood, antiques, cast iron, sourdough, cozy "crunchy" interiors |
| Product imagery | Fabric texture close-ups, graphic + text combos, family lifestyle shots |

Apply palette as custom Tailwind tokens in `tailwind.config.ts`. Load display and body fonts via `next/font` for performance.

### 1.2 Tone of Voice

MamaFern's voice should feel like a trusted, stylish friend — warm and grounded, never preachy.

| Attribute | What it sounds like |
|-----------|-------------------|
| **Warm** | "We made this for the days when you want to feel held." |
| **Grounded** | "No trend-chasing. Just clothes that earn their keep." |
| **Lightly crunchy** | Natural, wholesome — never preachy or judgmental |
| **Direct** | Short sentences. No fluff. Call things what they are. |
| **Inclusive** | Never exclusive-cool. Aspirational but completely approachable. |

**Avoid:** Corporate speak, greenwashing, aggressive sales urgency, anything that reads as trying too hard.

### 1.3 Brand Pillars

| Pillar | What it means |
|--------|--------------|
| **Rooted** | Clothing that connects you to something real — nature, craft, slowness. |
| **Community** | MamaFern is for people who share things with their people. UGC-native. |
| **Considered** | Quality over quantity. Every piece chosen with intention. |
| **Accessible** | Not luxury, not fast fashion. The beautiful, attainable middle. |

### 1.4 Code Updates Required Before Launch

| File | Current State | Required Update |
|------|--------------|----------------|
| `src/components/view/Logo/index.tsx` | Reads "Minimal Store" | Update to "MamaFern" or "Mama Fern" |
| `src/app/layout.tsx` | Metadata reads "Create Next App" | Update with brand title, description, OG image |
| `tailwind.config.ts` | No brand palette tokens | Apply MamaFern color palette as custom tokens |

---

## 2. Target Audience

MamaFern sells to three distinct buyer types. The Crunchy Mom drives volume; the Family Coordinator drives AOV; the Gift Buyer drives holiday spikes. Marketing should address all three, but the Crunchy Mom is the primary acquisition target.

### Persona A — The Crunchy Mom (Primary)

**"Ellie, 29"**
- Millennial or Gen-Z, has one or more kids under 5
- Values organic materials, skin-safer products, and brands she can actually trust
- Follows family lifestyle content on TikTok and Instagram — bookmarks "crunchy mom" accounts
- Buys intentionally — fewer, better items; not swayed by constant sales
- Average order: $55–$90
- Discovers brands via TikTok organic, Instagram saves, mom community word-of-mouth
- Becomes loyal when a brand speaks her language (no greenwashing, real founder story)
- Likely to coordinate family outfits for photos, holidays, family trips

**What converts her:** Authentic founder story, visible organic/natural materials messaging, UGC from people who look like her, community feeling. Micro-influencers convinced 45% of their followers to try their recommended products — this persona is highly influenced by nano/micro creators she trusts.

### Persona B — The Family Coordinator (High AOV)

**"Sarah, 33"**
- Buys matching or coordinating sets for the whole family
- Plans "family photo" outfits, holiday drops, milestone moments
- Adds multiple items per order: mom tee + kids onesie + dad sweatshirt
- Average order: $110–$180
- Discovers brands through Pinterest (high purchase intent) and Instagram
- Responds strongly to "Complete the Family Look" cross-sells
- This persona is the AOV driver — design the full product family for her

**What converts her:** "Complete the family look" cross-sells showing the full outfit coordinated across ages, bundle pricing, clear size range from adult to newborn.

### Persona C — The Gift Buyer (Seasonal Volume)

**"Linda, 52" or "Jamie, 31"**
- Buying for a new mom, a baby shower, a birthday, or Mother's Day
- May not know the brand — discovers via search ("organic cotton mom gift")
- Single-purchase but potentially high AOV (bundles, gift sets)
- Active November–December and April–May (Mother's Day window)
- Needs gift-specific landing pages, clear packaging messaging, and gift note options at checkout
- SEO and Pinterest are primary discovery channels for this persona

**What converts her:** Gift wrapping option at checkout, gift message capability, "perfect gift" framing, clear delivery timeframes.

### Why Mother's Day Is Uniquely Ownable

The "Mama" in MamaFern makes Mother's Day the single most brand-aligned commerce moment of the year. Build a dedicated gift guide, special packaging tier, and a full campaign push every April–May. This should be a top-3 revenue month annually.

**Earth Day (April 22) is also ownable.** For a brand built on organic cotton and nature imagery, Earth Day is a natural storytelling moment. No other brand name contains both "earth" signals — lean into materials sourcing and sustainability narrative.

---

## 3. Channel Strategy

**Core philosophy:** Organic first. Email as the owned asset. Paid as a multiplier once unit economics are proven.

Organic marketing takes 4–12 months to show compounding results — SEO takes 6–9 months before meaningful rankings, and social media content requires 3–6 months of consistent posting to build momentum. Paid marketing is instant but stops the moment the budget does. Build organic and email first; use paid to accelerate what is already proven to work.

### 3.1 Channel Priority Order

```
Priority 1: Email list (owned audience — $36–45 ROI per $1 spent; highest ROI of any channel)
Priority 2: Organic TikTok + Instagram (free reach; algorithms reward new accounts)
Priority 3: Organic Pinterest (long-tail fashion discovery; pins drive traffic for 6 months to 3 years)
Priority 4: SEO + Blog (6–9 month investment; free traffic permanently)
Priority 5: Referral program (zero-CAC acquisitions from happy customers)
Priority 6: Paid retargeting only (after organic is established; CPAs 3–5x lower than cold)
Priority 7: Cold paid ads (last — only when CAC math is proven and retargeting is ROAS-positive)
```

### 3.2 Channel-by-Channel Breakdown

#### Email (Start Immediately — Before Any Traffic)

- Set up before driving any traffic. You cannot recover a visitor you did not capture.
- Welcome popup: 10% off first order or early access in exchange for email signup
- Platform: **Klaviyo** free tier (up to 250 contacts) is the recommended starting point — the strongest DTC email platform with the best Shopify integration and flows library
- Pre-launch: build a dedicated waitlist with "Be the first to shop MamaFern"
- See [Section 6](#6-email-marketing-flows) for full automated email flows

#### TikTok (Primary Organic Discovery)

- Algorithm rewards original content regardless of follower count — a brand-new account can go viral
- Volume matters: post 5–7 times per week minimum
- Best content for family/crunchy-mom brands:
  - Founder story ("why I started MamaFern")
  - "Day in our life" with kids wearing MamaFern pieces
  - Fabric close-up / "why I care about organic cotton"
  - Family outfit coordination content
  - "Crunchy mom starter pack" style content
  - Authentic unboxing from early customers
- **Critical:** Do NOT produce polished ads. Raw, authentic content massively outperforms on TikTok. iPhone video of packing orders outperforms a $5,000 brand video.
- The "crunchy mom" TikTok community is an existing, passionate audience — speak directly to them
- Use keywords in captions (TikTok search is growing — treat it as a secondary SEO channel)

#### Instagram (Brand Home + Community)

- Use **Reels** for reach (repurpose TikTok content; remove watermark before posting)
- Use **Stories** for daily community engagement: polls, Q&A, DM prompts, new arrivals
- Use the **static feed** for brand aesthetic — this is your mood board for new visitors
- Use **Highlights** to archive: Reviews, Our Story, New Arrivals, Behind the Scenes, Real Customers (UGC)
- Post 4–5x per week: 3 feed posts (images + carousels) + 2 Reels minimum
- Use 3–5 niche hashtags: `#crunchymom`, `#organicbabyclothes`, `#slowfashion`, `#capsulewardrobe`, `#consciousparent`
- Collab posts (Instagram Collabs feature) with micro-influencers to cross-share audiences

**Content mix target:**
- 40% product / styling content
- 30% lifestyle / mood / brand world
- 20% community / UGC reposts
- 10% founder story / behind the scenes

#### Pinterest (Sleeper Channel for Family Fashion)

- Fashion is one of Pinterest's strongest categories; family and parenting content is a top vertical
- Pins have a 6-month to 3-year discovery window — content drives traffic long after posting
- Create boards: "Family Outfit Ideas," "Matching Family Outfits," "Crunchy Mom Style," "Organic Cotton Kids"
- Create shoppable pins linked directly to MamaFern product pages
- Enable Rich Pins via Shopify Pinterest integration (pulls live product data automatically)
- Repurpose existing product photography — no new content required
- Set up early and let it compound; expect no immediate results but significant long-term returns

#### SEO + Blog (6–9 Month Investment)

- See [Section 8](#8-seo-strategy-headless-specific) for the full technical and content SEO plan
- One blog post per week targeting long-tail keywords in the family fashion niche
- Collection page descriptions with 150–300 words of editorial copy
- Builds compounding free traffic with purchase intent over time — continues working forever

#### Referral Program (Zero-CAC Acquisitions)

- Every happy customer is a potential free acquisition channel
- Install **Smile.io** (free tier) and give customers a unique referral code
- Structure: "Give 10% off to a friend, get $10 store credit when they buy"
- Promote it in post-purchase email, packaging inserts, and the loyalty program dashboard

#### Paid Advertising (Month 3–4 at Earliest)

Do not run cold traffic paid ads until:
- Email flows are live and performing (abandoned cart recovery + welcome series active)
- Organic content is validated (you know which creative angle resonates)
- You have 10+ reviews for social proof to include on paid creatives
- A retargeting campaign is running and ROAS-positive

**Paid channel launch sequence:**
1. Meta retargeting (site visitors, email list, Instagram/TikTok followers) — lowest CPA
2. Meta lookalike audiences based on first 100+ customers
3. Google Shopping for brand terms + product-specific searches
4. TikTok Spark Ads (boost best organic TikTok content — cheapest awareness spend)
5. Meta cold prospecting (only after retargeting ROAS is proven)

**Channel comparison by budget efficiency for startups:**

| Channel | When to Start | Monthly Budget | Expected ROAS | Notes |
|---------|--------------|----------------|---------------|-------|
| Organic social | Day 1 | $0 | N/A | Founder-led content is the unfair advantage |
| Email | Day 1 | $0–$20 | 36–45x | Highest ROI channel in ecommerce |
| Pinterest | Day 1 | $0 | N/A | Compounds over 6–12 months |
| Meta retargeting | Month 3 | $300–$600 | 3–5x | Warm audience; low CPA |
| Google Shopping | Month 3 | $200–$500 | 2–4x | High-intent; brand + product searches |
| TikTok Spark Ads | Month 3 | $200–$400 | 1.5–3x | Amplifies proven organic content |
| Meta cold prospecting | Month 5+ | $500–$2,000 | 1.5–2.5x | Scale only after retargeting is profitable |

---

## 4. Launch Strategy (Zero Audience)

The goal of a launch strategy is to generate momentum — not to be perfect before starting. The playbook: build an email waitlist before the store goes live, seed content with micro-influencers 4–8 weeks before launch, create launch-week urgency, and spread influencer content over 5–7 days rather than all on day one.

### Phase 1: 8 Weeks Before Launch

- [ ] Start organic content on TikTok and Instagram immediately — even with no product ready
- [ ] Share the brand-building journey ("building in public"): design process, fabric sourcing, name origin, founder why
- [ ] Set up a "Coming Soon" email waitlist landing page at the live URL
- [ ] Target: **500 email subscribers before launch day**
- [ ] Identify 15–20 nano/micro-influencers in the crunchy-mom/slow-fashion niche (5k–100k followers)
- [ ] Begin creating first 5–10 SEO blog posts (see Section 8)

**Platforms to find influencers:** JoinBrands, Aspire.io, or manual TikTok/Instagram search using `#crunchymom`, `#organicbabyclothes`, `#slowfashion`, `#crunchy`, `#naturalparenting`

### Phase 2: 4 Weeks Before Launch

- [ ] Send gifted product to influencer list — no payment required, no obligation to post
  - Outreach: "No strings attached — wanted you to have this. If you love it and want to share, we'd be thrilled. If not, no worries at all."
- [ ] Tease new arrivals in Stories and TikTok — show product without price or date, just build intrigue
- [ ] Build your Judge.me review profile — personally ask first customers for written or video reviews
- [ ] Finalize brand photography and product images

### Phase 3: Launch Week

- [ ] Email waitlist with exclusive early access **24 hours before public launch** (10–15% off, 48 hours only)
- [ ] Post launch content across TikTok and Instagram on launch day
- [ ] Coordinate influencer content drops spread across 5–7 days — **not all on Day 1** — for sustained momentum
- [ ] Enable Sales Pop or Fomo app to show real-time purchase activity

### Phase 4: First 30 Days Post-Launch

- [ ] Follow up with every customer personally — ask for reviews, ask for feedback
- [ ] Repost every single piece of UGC immediately to your own channels
- [ ] Monitor content performance — double down on what works, drop what doesn't
- [ ] Confirm post-purchase email sequence is running (see Section 6)

### Founder Story Content (Your Biggest Differentiator)

No other brand has your story. This is the most powerful competitive advantage at launch, costs nothing to produce, and is the content type that builds the strongest early community.

**Content to create before launch:**
- A 60–90 second brand origin video for TikTok/Reels: why did you start MamaFern? What does the name mean?
- A written brand story on the About page (500–800 words — also serves as SEO content)
- A "Day in the life of building MamaFern" TikTok series (3–5 episodes)
- Behind-the-scenes content: packaging design, first sample arrival, first photoshoot day

**Format note:** Lo-fi founder-led content consistently outperforms polished agency video for DTC brands at launch. An iPhone video of unpacking your first samples with honest narration will outperform a $5,000 brand video.

### Micro-Influencer Seeding Detail

| Tier | Followers | Compensation | Expected Outcome |
|------|-----------|--------------|-----------------|
| Nano | 1,000–10,000 | Gifted product only | High authenticity, small reach, great for early social proof |
| Micro | 10,000–100,000 | Gifted + optional $50–$200 fee | Best ROI for startup budgets; 3–6% engagement rates |
| Mid-tier | 100,000–500,000 | $300–$1,500 per post | Use only for exceptional brand-fit creators |

**Selection criteria for MamaFern:**
- Engagement rate > 3% (micro-influencers average 3–6%)
- Aesthetic aligns with botanical / organic / crunchy-mom / slow fashion world
- Audience primarily women aged 25–40, with children or family lifestyle content
- Content feels authentic — not like an ad catalogue

### Launch Discount Structure

| Audience | Discount | Window | Notes |
|----------|---------|--------|-------|
| Waitlist VIP | 15% off first order | 24 hours early access | Your most engaged audience |
| Public launch | 10% off sitewide | 7-day window only | Announce end date upfront |
| Referral (ongoing) | 10% off for referee, $10 credit for referrer | Permanent | Via Smile.io |
| Influencer codes | 10–15% off with creator's code | Duration of partnership | Track per influencer |

**Important:** Do not train customers to wait for discounts. Run launch discounts for a fixed, clearly announced window and end them on the stated date. Build full-price buying as the default behavior from the start.

### UGC Strategy From Day One

- Include a card in every order: "Share your MamaFern moment. Tag us @mamafern — we feature real customers every week."
- Create a branded hashtag: `#mamafernfamily` or `#wornbymamafern`
- Incentivize first 100 customers: "Post a photo in your piece and get 15% off your next order"
- Repost all UGC immediately — signals community to new visitors
- Save all UGC to Instagram Highlights under "Real Customers"

**UGC vs. influencer content distinction:**
- **UGC** = content created by real customers, often unprompted or lightly incentivized. Feeds your organic social and ad creative pool. High authenticity, low cost.
- **Influencer content** = contracted or gifted content from creators with an existing audience. Expands reach and adds authority.
- Use both. The strongest DTC brands in 2025–2026 run a hybrid model: organic UGC from real customers + targeted influencer partnerships for reach.

---

## 5. Average Order Value (AOV) Strategy

Current average AOV benchmark for fashion: **$85-$120**. The goal is to get above your category average within 90 days of launch.

### Tactic 1 — Free Shipping Threshold

Set free shipping at **15-20% above your current AOV**.

- Example: if AOV is $80, set free shipping at $95
- Display a dynamic cart progress bar: "You're $15 away from free shipping"
- This single tactic causes 58% of shoppers to add items to qualify
- Implement as a cart notification in `src/lib/atoms/cart.tsx`

### Tactic 2 — "Complete the Family Look" Cross-Sells

On each product page, curate 2-3 products that complete the family outfit.

- This is the PRD's explicit feature: "Complete the Family Look" section on every product detail page
- Cross-sell logic: mom tee → matching kids onesie + dad crewneck in same colorway
- Implement via Shopify product metafields (no app needed initially)
- Or use **Selleasy** (free plan) for automatic cross-sell widgets
- This is your single strongest AOV lever — the Family Coordinator persona buys the whole set

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

Email marketing generates $36–$45 for every $1 spent — the highest ROI of any marketing channel in ecommerce. Set up all five flows before driving any traffic to the store. They run automatically and generate 30–50% of total email revenue.

### Flow 1 — Welcome Series (Trigger: Email signup or first purchase)

Welcome emails generate 4x average open rates and 5x average revenue per email compared to standard campaigns.

| Email | Timing | Content |
|-------|--------|---------|
| Email 1 | Immediately | Brand story, what MamaFern stands for, welcome discount, link to best sellers |
| Email 2 | Day 2–3 | Best sellers, social proof (reviews + UGC), discount reminder |
| Email 3 | Day 5–7 | Final discount reminder, founder story, Instagram community invite |

**Key:** The welcome series is the highest-performing flow. Spend the most design time here.

### Flow 2 — Abandoned Cart (Trigger: Cart created, no purchase in 1 hour)

Abandoned cart emails recover 5–15% of abandoned carts. Average revenue: $3.65 per email recipient.

| Email | Timing | Approach | Tactic |
|-------|--------|----------|--------|
| Email 1 | 1 hour after abandonment | Clean reminder, product image, link back | No discount yet |
| Email 2 | 24 hours after | Overcome objections (returns policy, sizing guide, reviews) | Add product reviews |
| Email 3 | 48–72 hours after | Final attempt with small sweetener | Free shipping or 10% off |

### Flow 3 — Post-Purchase Series (Trigger: Order confirmed)

| Email | Timing | Purpose |
|-------|--------|---------|
| Email 1 | Immediately | Branded order confirmation (not Shopify default) |
| Email 2 | Day 3–5 (shipped) | Tracking link + "how to style it" content + cross-sell suggestion |
| Email 3 | Day 10–14 (delivered) | Review request + UGC prompt ("Share on Instagram, tag us") |
| Email 4 | Day 30 | Personalized second-purchase recommendation + loyalty program intro |
| Email 5 | Day 60 | New arrivals / seasonal content re-engagement |

### Flow 4 — Browse Abandonment (Trigger: Product page viewed, no cart add)

- 1–2 emails featuring the viewed product
- Include specific reviews for that product
- Lower intent than cart abandonment but still profitable
- Only activate once email tech stack is performing well on the first three flows

### Flow 5 — Win-Back (Trigger: 90 days since last purchase)

| Email | Timing | Message |
|-------|--------|---------|
| Email 1 | Day 90 | "We miss you — here's what's new" |
| Email 2 | Day 97 | "Still thinking about it? Here's 15% off" |
| Email 3 | Day 104 | Final attempt before suppressing from list |

After 3 emails with no engagement: suppress the contact. Unengaged contacts destroy email deliverability — a clean, engaged list of 1,000 outperforms a dirty list of 10,000.

### Email Platform Recommendation

| Stage | Platform | Why | Cost |
|-------|----------|-----|------|
| Launch | **Klaviyo** | Best DTC email platform. Best Shopify integration. Strongest flows library. Industry standard. | Free (up to 250 contacts) |
| Growing | **Klaviyo paid** | Same platform, upgrade as list grows | $20–$45/mo at 500–1,000 contacts |
| Alternative | **Omnisend** | Better pricing than Klaviyo at similar feature set. Pre-built flows, Shopify-native. | Free (up to 250 contacts) |
| SMS complement | **Postscript** | SMS-native, Shopify-specific, pay-per-message | ~$0.01/text |

**Verdict:** Start with Klaviyo free tier. The flows library is battle-tested for DTC Shopify brands. Omnisend is a solid alternative if pricing becomes a constraint later. Add Postscript for SMS at month 3+ (98% SMS open rate vs. 20–25% for email).

---

## 7. Repeat Buyer / Retention Strategy

Loyal customers generate 44% of total revenue and 46% of orders despite being only 21% of the customer base. Repeat buyers spend 67% more per order than first-time customers. A 5% increase in retention can boost profits by 25–95%. Retention is not a nice-to-have — it is the core business model for a sustainable DTC brand.

### Retention Benchmarks

| Metric | Healthy | Best-in-Class |
|--------|---------|---------------|
| Repeat purchase rate | 20–30% | 40%+ |
| Time between second and third order | Under 90 days | Under 60 days |
| Customer LTV (12-month) | 2x AOV | 3–4x AOV |

### Tactic 1 — Loyalty Program

**Recommended app:** **Smile.io** (free up to 200 orders/month) or **BON: Loyalty & Rewards** (better startup pricing)

**Program structure** — use botanical naming on-brand for MamaFern:

| Tier | Name | Threshold | Perks |
|------|------|-----------|-------|
| Base | Seedling | All customers | Earn 5 points per $1 spent |
| Mid | Bloom | 500 points ($100 spent) | 10% birthday discount, early access to sales |
| Top | Root | 2,000 points ($400 spent) | Free shipping always, 15% discount, free gift with purchase |

**Ways to earn points:**
- Purchase: 5 points per $1
- Write a review: 100 points
- Refer a friend: 250 points (referrer) + 10% off for friend
- Follow on Instagram: 50 points
- Birthday bonus: 200 points

**Redemption:** 100 points = $1 off

### Tactic 2 — SMS Re-Engagement

SMS has 98% open rate vs. 20–25% for email. Reserve it for high-value moments — do not spam.

Use SMS for:
- Flash sales and limited new drops
- Abandoned cart backup (sent after email flow has run)
- Shipping and delivery notifications
- Win-back for lapsed customers (60–90 days no purchase)

**Tools:** **Postscript** (Shopify-native, pay-per-message ~$0.01/text) or **Klaviyo SMS** (if already on Klaviyo — one consolidated platform)

Example message: "Hey [name], new MamaFern drops just landed. Use COMEBACK15 for 15% off. Shop now → [link]"

Collect SMS opt-ins at checkout: "Text me my tracking info + exclusive offers."

### Tactic 3 — VIP Early Access

Give the top 10% of customers (by spend) early access to new drops, sales, and limited items.

- Name this group **"MamaFern Roots"** (aligns with loyalty tier naming)
- Communicate via a distinct email template — make them feel recognized, not just marketed to
- First access to new collections 24–48 hours before the general public
- Share brand decisions with them: "Help us name this colorway" — creates investment in the brand
- Private Instagram Close Friends story list for VIPs: BTS content before it goes public

### Tactic 4 — Seasonal "New Season" Repurchase Trigger

Leverage seasonal drops to re-engage lapsed buyers from the prior season.

- Fashion example: "New fall drop is live — remember the sage tee you got in spring? It has a new sibling."
- Triggered by: time since last purchase + product category purchased
- This is particularly effective for a brand with seasonal drops and a loyal core customer base

### Tactic 5 — Community Layer (Year 2+)

Brands that build community see dramatically higher LTV and word-of-mouth than those that rely only on discounts.

- **Instagram Community:** Repost UGC religiously. Create a community name.
- **Referral program:** "Give 10%, Get 10%" via Smile.io
- **Monthly styling challenge:** "Style your MamaFern piece" with `#mamafernfamily` — winner gets store credit
- **Year 2+:** Private Discord or Circle community for loyal customers — early product input, styling conversations, behind-the-scenes before public launch

### Tactic 6 — Handwritten Thank-You Notes

For the first 200 customers, include a handwritten note or signed card in the package.

This is not scalable forever — but it creates the kind of experience that generates organic word-of-mouth and UGC at a critical early stage when every customer interaction matters. Cost: ~$0.50/order. ROI: incalculable.

---

## 8. SEO Strategy (Headless-Specific)

MamaFern's headless Next.js 15 architecture means SEO is fully under developer control — a significant advantage over standard Shopify themes. Nothing is automatic. Everything must be implemented intentionally. The payoff: faster pages, more control, and better technical SEO than any standard Shopify store.

### 8.1 Technical SEO (Build Before Launch)

#### Metadata

Use Next.js 15's `generateMetadata()` function on every page. Every product and collection page must have a unique `<title>` and `<meta description>`.

```typescript
// app/products/[handle]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle)
  return {
    title: `${product.title} | MamaFern`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.title} | MamaFern`,
      images: [{ url: product.featuredImage.url }],
    },
  }
}
```

**Title formats:**
- Product pages: `[Product Name] | MamaFern`
- Collection pages: `[Collection Name] — MamaFern | Organic Family Fashion`
- Homepage: `MamaFern — Organic Cotton Family Apparel`
- Blog posts: `[Post Title] | MamaFern`

The homepage currently reads "Create Next App" in `src/app/layout.tsx` — update immediately.

#### Structured Data (JSON-LD)

Add these schema types before launch. Google uses them to generate rich snippets (star ratings, price, availability visible in search results), which directly improve click-through rate.

| Schema Type | Where | Why |
|-------------|-------|-----|
| `Product` | All product pages | Star ratings + price in Google results |
| `BreadcrumbList` | Collection + product pages | Better CTR from search results |
| `Organization` | Root layout | Brand presence in Knowledge Panel |
| `WebSite` with `SearchAction` | Root layout | Google Sitelinks search box |

#### Canonical URLs

- Self-referencing canonical tag on every product, collection, and blog page
- Prevent duplicate content from color/size variant parameter URLs
- `<link rel="canonical" href="https://mamafern.com/products/[handle]" />`

#### XML Sitemap

```typescript
// app/sitemap.ts (Next.js App Router native)
export default async function sitemap() {
  const products = await getAllProducts()
  const collections = await getAllCollections()
  return [
    { url: 'https://mamafern.com', lastModified: new Date() },
    ...products.map(p => ({ url: `https://mamafern.com/products/${p.handle}` })),
    ...collections.map(c => ({ url: `https://mamafern.com/collections/${c.handle}` })),
  ]
}
```

Submit to Google Search Console on launch day.

#### robots.txt

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/'] },
    sitemap: 'https://mamafern.com/sitemap.xml',
  }
}
```

#### Core Web Vitals

The headless architecture provides a major speed advantage over standard Shopify. Target:

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 2.5s | `next/image` with `priority` prop on above-fold images |
| CLS | < 0.1 | Explicit `width` and `height` on all images |
| INP | < 200ms | Minimize client-side JS; lazy-load non-critical components |

Use ISR (Incremental Static Regeneration) with `revalidate = 60` on product and collection pages for SEO-friendly static HTML with near-real-time inventory data.

#### Headless Analytics Note

Standard Shopify analytics pixels and tracking break in headless Next.js builds. Install **Elevar** (~$50/mo) at growth phase for server-side event tracking. This is critical for accurate attribution when paid channels go live — without it, your ad platforms will underreport conversions and your ROAS will look worse than it is.

---

### 8.2 Content SEO (Months 1–6)

#### Collection Page Descriptions

Each collection page needs 150–300 words of unique editorial copy. This is consistently absent from headless stores and represents an easy early SEO win.

**Women's collection description example:**
> "MamaFern Women's Collection — organic cotton fashion for the woman who dresses with intention. Earthy tees, cozy sweatshirts, and layering pieces designed to be worn season after season. Slow fashion, rooted in nature, made for the whole family to love."

**Target keywords by collection:**
- Women's: `organic women's fashion`, `slow fashion women`, `botanical women's clothing`, `earthy women's style`
- Men's: `organic cotton men's shirts`, `earthy men's basics`, `sustainable men's clothing`
- Family / kids: `matching family outfits`, `organic cotton kids clothes`, `coordinated family fashion`

#### Blog / Editorial Content

Create `src/app/blog/[slug]/page.tsx` with a headless CMS. **Sanity** is recommended: free tier, excellent Next.js support, clean content modeling, no lock-in.

**High-value blog topics for MamaFern:**

| Post Title | Target Keyword | Intent |
|-----------|---------------|--------|
| "How to build a family capsule wardrobe from scratch" | family capsule wardrobe | Informational → commercial |
| "What is organic cotton? Why it matters for kids and babies" | organic cotton kids clothing | Informational → commercial |
| "10 matching family outfit ideas for 2026" | matching family outfits | Informational + commercial |
| "The crunchy mom fashion guide: what to wear and why" | crunchy mom fashion | Brand-specific |
| "What to wear for family photos: a complete guide" | family photo outfit ideas | High purchase intent |
| "Slow fashion vs. fast fashion: a real, honest comparison" | slow fashion | Informational + values |
| "Earth Day 2026: why we made MamaFern organic" | Earth Day sustainable fashion | Brand + seasonal |
| "Mother's Day gift guide: organic cotton gifts for moms" | Mother's Day mom gift | Seasonal + high purchase intent |

Each post: 1,000–1,500 words, one primary keyword, 2–3 internal links to product or collection pages.

#### Internal Linking

- Every blog post links to 2–3 relevant product or collection pages
- Collection pages cross-link to each other where relevant
- Homepage links to top-performing collection pages with keyword-rich anchor text

---

### 8.3 Link Building for a New Brand

Links are the hardest part of SEO for new brands. Target quality over quantity.

| Tactic | Effort | Expected Links |
|--------|--------|---------------|
| Submit to ethical/sustainable fashion directories | Low | 3–10 relevant links |
| Get featured in "organic cotton brand" or "crunchy mom brand" roundup posts | Medium | 2–5 DR40+ links |
| Guest post on family lifestyle or slow fashion blogs | High | 1–3 DR50+ links |
| PR: pitch family/lifestyle editors at regional publications | High | 1–3 high-authority links |
| Influencer posts linking to site in bio | Low | 5–20 links (brand awareness + modest SEO value) |
| Community participation (Reddit: r/BabyBumps, r/CrunchyBerries, Facebook groups) | Medium | Brand awareness + occasional links |

Focus on 3–5 high-quality, relevant links from family/fashion sites in the first 6 months. One DR60 link from a respected parenting publication is worth more than 50 low-quality links.

---

## 9. Social Proof Strategy (Zero Reviews at Launch)

95% of consumers read online reviews before buying. For a new brand, social proof is the bridge between a visitor and a first-time customer. Here is how to build it before reviews exist.

### Pre-Launch (No Reviews Yet)

1. **Micro-influencer seeding:** Send gifted product to 15–20 nano/micro-influencers in the crunchy-mom/family fashion niche. No payment required, no obligation to post. Authentic posts from trusted micro-creators convert better than paid placements. Micro-influencers convince 45% of followers to try their recommended products.

2. **Founder transparency:** An About page with real photos, your actual story, and why you built MamaFern. This is your strongest social proof before any reviews exist. It converts skeptical cold traffic by humanizing the brand.

3. **UGC-first packaging:** Include an insert card in every order with your Instagram handle, your branded hashtag (`#mamafernfamily`), and a QR code to leave a review on Judge.me.

4. **Real-time purchase notifications:** Install **Sales Pop** or **Fomo** to show live purchase activity ("Sarah from Austin just ordered the Fern Tee — 2 hours ago"). Even small order volume creates perceived momentum for new visitors.

### Post-Launch

5. **Judge.me reviews:** Install on day one. Automated review request emails fire 5–7 days after delivery. Even 5–10 reviews change conversion rates significantly. For headless implementation, use Judge.me's API to display reviews in the Next.js product page component.

6. **"Featured In" press:** Proactively pitch family lifestyle blogs, niche parenting publications, and local press. One media feature adds significant credibility for cold traffic and also generates a quality backlink for SEO.

7. **Repost every single piece of UGC:** Every customer photo on social media gets reposted immediately. Ask permission, always credit the creator. This is your richest free content. Save to Instagram Highlights "Real Customers" so it's permanently visible to new profile visitors.

8. **Review-gated discount:** "Leave a photo review and earn 100 loyalty points" — incentivizes the photo reviews that convert better than text-only reviews.

---

## 10. Shopify App Stack

Install apps progressively — not all at once. Every app adds page weight, ongoing cost, and maintenance burden. Start with free apps, validate they work, then upgrade.

**Note for headless builds:** Apps that inject scripts into Shopify's Liquid theme require custom integration in the Next.js frontend via their API. Apps that operate through Shopify's admin (email, loyalty, reviews, analytics) work normally.

### Phase 1: Launch (Free Apps Only)

| Category | App | Cost | Notes |
|----------|-----|------|-------|
| **Email marketing** | Klaviyo | Free (250 contacts) | Best DTC email platform. Start here. |
| **Reviews** | Judge.me | Free (unlimited) | Rich snippets, photo reviews. Requires headless API integration. |
| **Loyalty** | Smile.io | Free (200 orders/mo) | Points, referrals, VIP tiers out of the box. |
| **Post-purchase upsell** | ReConvert | Free (<50 orders/mo) | Best post-checkout upsell. One-click add-ons. |
| **Free shipping bar** | Hextom: Free Shipping Bar | Free | AOV lift. Shows cart progress toward threshold. |
| **Social proof / FOMO** | Sales Pop | Free | Real-time purchase notifications. |
| **Cross-sell** | Selleasy | Free plan | "Complete the look" widgets. |
| **Bundles** | Bundler - Product Bundles | Free plan | Create and manage product bundles. |
| **Back in stock** | Back in Stock: Restock Alerts | Free plan | Captures lost demand from out-of-stock products. |
| **Gift wrapping** | Gift Wrap & Gift Message | Free | Checkout upsell for gift buyers. |

### Phase 2: Growth (Months 3–6)

| Category | App | Cost | Notes |
|----------|-----|------|-------|
| **Email (upgrade)** | Klaviyo paid | $20–$45/mo | When list exceeds 250 contacts |
| **Headless analytics** | Elevar | ~$50/mo | **Critical.** Server-side event tracking for headless Next.js. Standard Shopify pixels break in headless builds — without this, ad attribution is broken. |
| **Referrals** | ReferralCandy | ~$49/mo | Clean referral program. Activate at month 3. |
| **SMS** | Postscript | ~$0.01/text | Shopify-native SMS. Add alongside email for win-back flows. |
| **Unified analytics** | Triple Whale | ~$129/mo | Consolidated ROAS across all paid channels. Use at $10K+/mo revenue. |

### Phase 3: Scale (Month 6+)

| Category | App | Cost | Notes |
|----------|-----|------|-------|
| **Personalization** | Rebuy Personalization Engine | ~$99/mo | AI-powered recommendations across the full funnel. Best-in-class at scale. |
| **Reviews (upgrade)** | Loox | $9.99/mo | Photo-first reviews UX. Strong for fashion brands. |
| **Loyalty (upgrade)** | LoyaltyLion | ~$159/mo | More advanced analytics and segmentation than Smile.io. |
| **Subscriptions** | Recharge | ~$99/mo | Only if a subscription model (seasonal box, basics replenishment) is added to the product line. |

### Email Platform Deep Comparison

| Platform | Best For | Key Advantage | Limitation | Cost |
|----------|---------|---------------|------------|------|
| **Klaviyo** | DTC brands at any stage | Best segmentation, revenue attribution, flows library, Shopify integration | More expensive per contact than Omnisend | Free → $20+/mo |
| **Omnisend** | Budget-conscious early-stage brands | Better pricing than Klaviyo, similar features, pre-built flows | Slightly less powerful segmentation | Free → $16+/mo |
| **Shopify Email** | Absolute launch minimum | Zero cost, zero setup, built-in | Very limited automation and segmentation | Free (10K emails/mo) |

**Verdict:** Start with Klaviyo free tier. The DTC flows library and Shopify data integration is unmatched. If budget is a hard constraint, Omnisend is the best alternative — comparable features at lower price. Avoid starting on Shopify Email if you can; migrating flows later adds unnecessary work.

---

## 11. Budget Allocation Guide

### Starter Budget ($0–$500/month)

| Activity | Budget | Notes |
|----------|--------|-------|
| Organic content (TikTok, Instagram, Pinterest) | $0 | Time investment only — founder-led content |
| Email (Klaviyo free tier) | $0 | Up to 250 contacts |
| App stack (Phase 1 — all free) | $0 | Reviews, loyalty, upsell, FOMO |
| Product seeding (influencer gifting) | $100–$200 | Product cost only for 10–15 influencers |
| Content creation tools | $15–$30 | Canva Pro ($13/mo), CapCut (free) |
| Photography | $100–$250 | One lifestyle shoot / month or DIY |

### Growth Budget ($500–$2,000/month)

| Activity | % of Budget | Notes |
|----------|------------|-------|
| Email (Klaviyo paid) | 5% | As list grows past free tier |
| Core apps (Elevar, ReConvert, etc.) | 8% | Elevar critical at this stage |
| Content / photography | 15–20% | Consistent monthly shoot cadence |
| Micro-influencer partnerships | 15–20% | Some paid micro content ($50–$200/creator) |
| Meta retargeting ads | 25–30% | Retargeting warm audiences only |
| Google Shopping ads | 15–20% | High-intent branded + product searches |
| SEO content (blog) | 5–10% | 2 posts/month or freelance writer |

### Scaling Budget ($2,000–$10,000/month)

| Activity | % of Budget | Notes |
|----------|------------|-------|
| Email + SMS (Klaviyo + Postscript) | 4% | Growing list and message volume |
| App stack | 5% | Rebuy, Loox, LoyaltyLion |
| Content / creative production | 10% | Professional shoots, UGC campaigns |
| Influencer program | 10% | Ongoing creator relationships |
| Meta Ads (retargeting + prospecting) | 35–40% | Lookalike + broad prospecting |
| Google Shopping | 15% | Brand + product term campaigns |
| TikTok Spark Ads | 10% | Amplify best organic TikTok content |
| Analytics / attribution (Triple Whale) | 1–2% | Data infrastructure |

### The Rule of Sequence

> Spend the minimum needed to learn, not the maximum available to grow.

At each phase, validate a channel's unit economics before increasing spend. A Meta ad returning 1.5x ROAS at $500/month will return 1.5x ROAS at $10,000/month — never scale a losing channel.

**The correct sequence:**
1. Prove organic content resonates (Months 1–2)
2. Prove email converts visitors into buyers (Months 1–3)
3. Prove retargeting ads are profitable before scaling (Months 3–4)
4. Prove cold prospecting ads are profitable before scaling (Months 4–6)
5. Scale what works; cut what doesn't; repeat quarterly

---

## 12. KPIs by Growth Stage

Track different signals at each stage. Early vanity metrics (follower counts, page views) are less useful than conversion signals.

### Stage 1 — Launch (Months 1–2)

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Email list size (pre-launch) | 500+ before opening | Owned audience at day one |
| Email signup conversion rate | 2–4% of site visitors | Pop-up effectiveness |
| Website sessions | 500–2,000/month | Baseline traffic health |
| First purchases (total orders) | 25–50 | Revenue validation |
| Conversion rate | 1–2% | Industry average for new fashion brands |
| AOV | $75+ | Minimum viable unit economics |
| Reviews collected | 10+ | Social proof threshold |
| Welcome email open rate | 35%+ | List health signal |

### Stage 2 — Growth (Months 3–6)

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Monthly orders | 100–300 | Revenue trajectory |
| Monthly revenue | $8,000–$25,000 | Business sustainability |
| AOV | $90–$110 | Upsell / bundle effectiveness |
| CAC (customer acquisition cost) | < $30 organic, < $50 paid | Unit economics sustainability |
| Conversion rate | 2–3.5% | Store optimization signal |
| Email open rate | > 30% | List health |
| Email click-through rate | > 2.5% | Content relevance |
| Abandoned cart recovery rate | > 5% | Flow performance |
| Repeat purchase rate | > 15% | Early retention signal |
| Email list size | 2,000+ | Owned channel growth |
| Organic social followers | 1,000+ combined | Community signal |

### Stage 3 — Scale (Month 6+)

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Monthly orders | 500+ | Scale threshold |
| AOV | $110–$130 | Mature upsell / cross-sell system |
| Repeat purchase rate | > 25% | Brand loyalty established |
| Customer LTV (12-month) | 2.5–3x AOV | Retention program impact |
| ROAS (return on ad spend) | > 3x | Paid channel efficiency |
| Email revenue share | 30–40% of total | Owned channel maturity |
| Organic traffic share | > 30% of sessions | SEO compounding |
| NPS (Net Promoter Score) | > 50 | Brand love signal |
| Loyalty program participation | > 20% of customers | Retention program adoption |

### Metrics Dashboard Stack

| Tool | Use | Cost |
|------|-----|------|
| Google Analytics 4 | Traffic, conversion, attribution | Free |
| Shopify Analytics | Revenue, orders, AOV, repeat rate | Included |
| Google Search Console | SEO rankings, impressions, CTR | Free |
| Klaviyo Dashboard | Email metrics, flow revenue per recipient | Included |
| Triple Whale (Month 6+) | Unified ROAS and multi-channel attribution | $129/mo |

---

## 13. Content Calendar Framework

### Weekly Posting Cadence

| Platform | Posts Per Week | Primary Format | Primary Goal |
|----------|---------------|----------------|-------------|
| TikTok | 5–7 | Short video (15–60 sec) | Discovery, viral reach |
| Instagram Feed | 4–5 | Images + carousels | Brand building, product showcase |
| Instagram Reels | 3–4 | Short video (repurposed TikTok) | Reach, algorithm distribution |
| Instagram Stories | 7 (daily) | Polls, BTS, UGC, product tags | Community engagement |
| Pinterest | 5–10 pins | Product + lifestyle images | Long-tail purchase-intent traffic |
| Email | 1–2/week | Newsletter + automated flows | Conversion and retention |

### Weekly Content Theme Rhythm

| Day | Platform | Theme |
|-----|---------|-------|
| Monday | TikTok | New week / new drop / "what we're wearing this week" |
| Tuesday | Instagram Stories | Poll or Q&A — "which colorway should we drop next?" |
| Wednesday | TikTok | Behind the scenes — fabric sourcing, design process, packing orders |
| Thursday | Instagram Reels | Family outfit coordination / product detail close-up |
| Friday | Email | New arrivals, weekend drop if applicable |
| Saturday | TikTok | Customer UGC repost or founder-led "day in the life" with kids |
| Sunday | Pinterest | Pin 5–10 product images; refresh "family outfit" and "crunchy mom style" boards |

### Monthly Content Framework

| Week | Focus |
|------|-------|
| Week 1 | New drop or collection launch content |
| Week 2 | Educational / lifestyle ("why we use organic cotton", brand story, materials deep dive) |
| Week 3 | Community spotlight (UGC reposts, family photo tags, review highlights) |
| Week 4 | Promotional or re-engagement (loyalty reminder, flash offer, family bundle spotlight) |

### TikTok Content Pillars (Proven for Family Fashion DTC)

| Content Type | Example | Why It Works |
|-------------|---------|-------------|
| Founder story | "Why I started MamaFern — the real story" | Builds trust, drives follows |
| Get ready with me | Family getting dressed in coordinating MamaFern pieces | High engagement, aspirational |
| Fabric deep dive | Slow close-up of organic cotton weave, care instructions | Builds perceived quality |
| Crunchy mom content | "What a crunchy mom puts in their cart" featuring MamaFern | Audience identification |
| Unboxing | First customer receives their order | Social proof, community feel |
| Capsule wardrobe | "How I dress my whole family with 10 pieces" | Educational, high saves |
| Behind the scenes | Packing orders, design process, sample arrival | Humanises brand |

### Seasonal Commerce Calendar

MamaFern's calendar is built around **family milestones** — not generic fashion seasons.

| Month | Opportunity | MamaFern Angle |
|-------|------------|----------------|
| January | "Fresh start" for families | New year drop, "back to basics" organic essentials |
| February | Valentine's Day | Family matching Valentine's outfits — "love in every stitch" |
| March–April | Spring / Earth Day (April 22) | **Earth Day is a flagship moment** — organic cotton story, sustainability, spring drop |
| **May** | **Mother's Day** | **Top revenue month. Gift guide, special packaging, "for every kind of mama" campaign. Start 3 weeks early.** |
| June | Father's Day | Dad collection spotlight, family coordination content |
| July–August | Summer outdoor / family travel | Casual summer drop, "adventure-ready" onesies and tees |
| September | Back to school / Fall | Fall colorway drop (terracotta, warm browns), cozy family content |
| October | Halloween | Limited Halloween drop (pumpkin/fern graphics on onesies + family sets — seasonal scarcity opportunity) |
| November | **Black Friday / Cyber Monday** | Plan 6 weeks in advance. Family bundle deals, gift with purchase. |
| December | Holiday gifting | Gift guides, gift wrapping upsell, last-order dates prominently displayed |

**Mother's Day is the Super Bowl.** The "Mama" in MamaFern makes this uniquely ownable. Build a dedicated gift guide landing page, a special packaging tier, and a 3-week campaign build-up. This should be a top-3 revenue month every year.

**Earth Day is underused by most brands.** For an organic cotton family brand, April 22 is a natural owned moment. Lean into it with materials sourcing stories, sustainability narrative, and the brand origin story. It's free, differentiating, and perfectly aligned.

---

## 14. Technical Prerequisite Checklist

Marketing spend is wasted on a store that cannot convert. Before running any paid traffic or major organic campaigns, confirm all of the following:

### Storefront Identity
- [ ] Logo updated from "Minimal Store" to "MamaFern" (`src/components/view/Logo/index.tsx`)
- [ ] Homepage metadata updated from "Create Next App" (`src/app/layout.tsx`)
- [ ] MamaFern color palette tokens applied in `tailwind.config.ts`
- [ ] OG image tags set (for social sharing previews)

### Commerce Functionality
- [ ] Checkout works end-to-end (`cart.checkoutUrl` redirect is functional)
- [ ] Free shipping threshold set in Shopify admin
- [ ] Free shipping progress bar visible in cart
- [ ] Gift wrapping option available at checkout

### Email & Marketing
- [ ] Email popup live and capturing leads (10% off first order)
- [ ] Klaviyo Welcome Series flow active
- [ ] Klaviyo Abandoned Cart flow active
- [ ] Post-purchase email sequence running
- [ ] Smile.io loyalty program installed and configured

### Social Proof
- [ ] Judge.me installed and configured (review requests fire 5–7 days post-delivery)
- [ ] Sales Pop or Fomo installed for real-time purchase notifications
- [ ] "Real Customers" Instagram Highlight populated before launch

### Analytics & SEO
- [ ] Google Analytics 4 installed and verified
- [ ] Google Search Console verified and sitemap submitted
- [ ] XML sitemap generated and accessible at `/sitemap.xml`
- [ ] `robots.txt` configured at `/robots.ts`
- [ ] `generateMetadata()` implemented on product and collection pages
- [ ] JSON-LD Product schema added to product pages
- [ ] `next/image` used on all product and collection images with explicit dimensions
- [ ] Collection page descriptions written (150–300 words each)

---

## Summary

MamaFern has strong technical bones — a fast, well-built headless storefront with the architecture to support a full commerce experience. The brand name gives it a clear lane: botanical, earthy, genuine, family-oriented. The marketing strategy follows a proven startup DTC sequence:

1. **Define the brand first** (palette, voice, photography style) — everything else depends on this one decision
2. **Build the email engine before driving any traffic** — the owned channel that compounds forever
3. **Go organic-first on TikTok and Instagram** — the algorithm rewards new accounts; founder-led content is the competitive advantage
4. **Seed product to 15–20 micro-influencers before launch** — social proof before the first public customer
5. **Activate AOV tactics from day one** — free shipping threshold, "Complete the Family Look" cross-sells, post-purchase upsells
6. **Build loyalty into the first order** — loyalty program (Seedling → Bloom → Root), handwritten notes, community
7. **Add paid spend only after organic is validated** and retargeting ROAS is proven
8. **Own Mother's Day and Earth Day** — they are the most brand-aligned commerce moments of the year, and no competitor has a name that owns them like MamaFern does

---

*This document was compiled using research from Shopify, Klaviyo, Referral Candy, Influencer Marketing Hub, JoinBrands, and multiple 2025–2026 DTC brand strategy sources. Treat it as a living document — update quarterly as MamaFern grows and data accumulates.*
