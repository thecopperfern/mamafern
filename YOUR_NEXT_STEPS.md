# Your Next Steps - Mama Fern Store Launch

**Status**: ✅ All dev work complete | ⏳ Waiting for product content + Shopify setup
**Today's Date**: February 25, 2026
**Campaign Start**: March 16, 2026 (19 days remaining)
**Store Launch**: April 6, 2026 (40 days remaining)

---

## 📦 Product Catalog Ready!

The full 10-product launch catalog is now defined in **PRODUCT_CATALOG.md** with:
- 10 specific products with names, handles, prices, SKUs, variants, and metafields
- 4 gift bundles for Mother's Day campaign
- 6 launch collections with product assignments
- Design briefs and blank sourcing recommendations
- Tagging strategy for cross-sell and filtering

### The Launch 10

| # | Product | Price | Collection(s) |
|---|---------|-------|---------------|
| 1 | Mama Fern Classic Tee | $32 | moms, mothers-day |
| 2 | Mama Fern Rooted Crewneck | $52 | moms, mothers-day |
| 3 | Papa Fern Classic Tee | $32 | dads |
| 4 | Papa Fern Rooted Crewneck | $52 | dads |
| 5 | Little Fern Sprout Tee | $22 | kids, family-sets |
| 6 | Little Fern Seedling Onesie | $24 | kids, mothers-day |
| 7 | Mama Fern Canvas Tote | $22 | accessories, mothers-day |
| 8 | Mama Fern Cozy Beanie | $20 | accessories |
| 9 | Mama Fern Wildflower Tee | $34 | moms, mothers-day |
| 10 | Little Fern Nature Explorer Tee | $22 | kids |

See **PRODUCT_CATALOG.md** for full details including variant tables, metafields, and design briefs.

---

## 🎉 What's Already Done

### Dev Work (100% Complete)
- ✅ Cart drawer with free shipping progress bar
- ✅ Product variant selector (color swatches, size buttons)
- ✅ Mobile sticky "Add to Cart" bar
- ✅ Collection filters (price, size) and sorting
- ✅ Email capture popup (8-second delay, 10% off offer)
- ✅ "Complete the Family Look" product carousel
- ✅ Fabric & Feel specs accordion
- ✅ Brand styling (DM Sans + Playfair Display, full color palette)
- ✅ Shopify API connection configured
- ✅ Mother's Day gift guide page (`/mothers-day`)
- ✅ Pinterest icon added to footer (set `NEXT_PUBLIC_PINTEREST_URL` in env)
- ✅ FAQ updated with Mother's Day and family matching questions
- ✅ Brevo newsletter API route ready (just needs API key)
- ✅ 92/92 tests passing

### Decisions Made (Feb 25, 2026)
- **Fonts:** DM Sans + Playfair Display (keeping current, not reverting to PRD)
- **Colors:** Current implementation palette (keeping, not reverting to PRD)
- **Email:** Brevo (not Klaviyo) — API route already built
- **Hosting:** Hostinger at mamafern.com (already deployed)
- **AI chat agent:** Deferred to post-launch (SHOPIFY_AI_STRATEGY.md marked accordingly)
- **Dads:** Papa Fern products included at launch
- **Pricing:** Using PRD ranges; finalize when screen printing costs are confirmed
- **Fulfillment:** Bulk blanks + local screen printing

---

## 🚀 What You Need to Do NOW (Feb 25-28)

### Priority 1: Finalize Product Artwork (most critical)

You chose to define designs with help — the design briefs are in PRODUCT_CATALOG.md. Next steps:

1. **Option A: Hire an illustrator** — Post on Fiverr/Upwork for botanical hand-drawn illustrations. Budget ~$200-400 for all 10 designs. Share the design briefs from PRODUCT_CATALOG.md.
2. **Option B: DIY with Canva/Procreate** — Use botanical illustration templates and hand-lettering fonts. The designs are intentionally simple (single/two-color screen prints).
3. **Option C: AI-assisted** — Generate initial concepts with an image tool, then refine for print-ready files.

**Deliverable:** Print-ready files (vector SVG or high-res PNG at 300dpi) for each product.

### Priority 2: Create Collections in Shopify (15 mins)

1. Log into https://mama-fern.myshopify.com/admin
2. Go to **Products → Collections**
3. Create these 6 + 1:

| Collection Title | Handle | Type |
|-----------------|--------|------|
| For Moms | `moms` | Automated (tag: `mama-fern`) |
| For Dads | `dads` | Automated (tag: `papa-fern`) |
| For Kids | `kids` | Automated (tag: `little-fern`) |
| Accessories | `accessories` | Automated (tag: `accessory`) |
| New Arrivals | `new-arrivals` | Automated (all products) |
| Mother's Day Gifts | `mothers-day` | Automated (tag: `mothers-day-2026`) |
| Family Sets | `family-sets` | Automated (tag contains: `family-set`) |

### Priority 3: Add Products in Shopify (45-90 mins)

Follow the detailed specs in PRODUCT_CATALOG.md for each product. For each:
1. Set title, handle, description, price
2. Add variants (size + color)
3. Upload product images (placeholder photos OK for now)
4. Add tags per the tagging strategy
5. Populate custom metafields (fabric_composition, fabric_weight, etc.)
6. Set status to Active

### Priority 4: Set Up Brevo (15 mins)

1. Log into Brevo (https://app.brevo.com)
2. Get your API key from Settings → SMTP & API → API Keys
3. Create a contact list for newsletter subscribers — note the List ID
4. Create a "Back in Stock" list — note that List ID too
5. Create a welcome email template (Template ID 1)
6. Add these to your `.env.local`:
   ```
   BREVO_API_KEY=your_key_here
   BREVO_LIST_ID=your_list_id
   BREVO_BACK_IN_STOCK_LIST_ID=your_bis_list_id
   ```

---

## 📅 Updated Week-by-Week Roadmap

### Week 1: Feb 25-28 — Product Content Sprint
- [ ] Finalize/commission artwork for 10 products
- [ ] Create 7 collections in Shopify
- [ ] Add all 10 products with placeholder images
- [ ] Populate metafields for fabric specs
- [ ] Set up Brevo API key + contact lists
- [ ] Test site locally (`npm run dev`)

### Week 2: Mar 1-7 — Photography + Social
- [ ] Product photography (flat lays minimum, lifestyle ideal)
- [ ] Replace placeholder images in Shopify
- [ ] Create Instagram account (@mamafern)
- [ ] Create TikTok account (@mamafern)
- [ ] Create Pinterest account (Mama Fern)
- [ ] Add social URLs to `.env.local`:
  ```
  NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/mamafern
  NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@mamafern
  NEXT_PUBLIC_PINTEREST_URL=https://pinterest.com/mamafern
  ```

### Week 3: Mar 8-15 — Pre-Campaign Prep
- [ ] Email welcome flow configured in Brevo
- [ ] Abandoned cart email template created
- [ ] Schedule teaser content for social (3-5 posts ready)
- [ ] Brief 2-3 micro-influencers for product seeding
- [ ] Final QA pass on all 10 product pages
- [ ] Test checkout flow end-to-end
- [ ] Test gift wrapping option at checkout

### Week 4: Mar 16-22 — 🌱 CAMPAIGN PHASE 1: Seed & Tease
- [ ] Waitlist/email capture live on site
- [ ] First organic social posts (behind-the-scenes, fabric close-ups)
- [ ] Influencer seeding packages shipped
- [ ] Email teaser to existing subscribers
- [ ] See MOTHERS_DAY_CAMPAIGN.md for full Phase 1 checklist

### Week 5: Mar 23-29 — Campaign Phase 2: Warm Up
- [ ] Product reveal posts
- [ ] "Meet the Collection" email
- [ ] Pinterest boards populated
- [ ] See MOTHERS_DAY_CAMPAIGN.md for Phase 2

### Week 6: Mar 30 - Apr 5 — Final Pre-Launch
- [ ] End-to-end testing (all devices)
- [ ] Payment gateway verified
- [ ] Gift bundle discounts configured in Shopify
- [ ] Performance check and deploy

### Week 7: Apr 6-12 — 🚀 STORE LAUNCH
- [ ] Store goes live at mamafern.com
- [ ] Launch email blast to waitlist
- [ ] Social media launch announcements
- [ ] Influencer posts go live
- [ ] Monitor orders and customer service

### Week 8-9: Apr 13 - May 4 — Revenue Sprint
- [ ] Mother's Day countdown content
- [ ] Gift guide promotion push
- [ ] Retargeting ads (if budget allows)
- [ ] Last-chance shipping deadline content
- [ ] See MOTHERS_DAY_CAMPAIGN.md for Phases 3-4

### Week 10: May 5-10 — Mother's Day Week
- [ ] Final "order by" deadline (May 3 for standard shipping)
- [ ] Express shipping push (May 5-7)
- [ ] Digital gift card option for last-minute buyers
- [ ] Mother's Day post: customer UGC, thank you content

---

## 🔑 Important Links

- **Shopify Admin**: https://mama-fern.myshopify.com/admin
- **Live Site**: https://mamafern.com
- **Brevo Dashboard**: https://app.brevo.com
- **Product Catalog**: See PRODUCT_CATALOG.md in this repo
- **Mother's Day Campaign**: See MOTHERS_DAY_CAMPAIGN.md
- **Dev Server**: http://localhost:3000 (after `npm run dev`)

---

## 📊 Current Status

| Area | Status | Notes |
|------|--------|-------|
| Dev Work | ✅ Done | 92/92 tests, all features built |
| Product Catalog | ✅ Defined | 10 products in PRODUCT_CATALOG.md |
| Mother's Day Page | ✅ Built | /mothers-day gift guide live |
| Shopify Collections | ⏳ Create now | 7 collections to add |
| Shopify Products | ⏳ Create now | 10 products to add |
| Product Artwork | ⏳ Commission/create | Design briefs ready |
| Product Photography | ⏳ Week 2 | Flat lays + lifestyle |
| Brevo Email Setup | ⏳ This week | API route ready, needs key |
| Social Media Accounts | ⏳ Week 2 | Instagram, TikTok, Pinterest |
| Hosting | ✅ Live | Hostinger at mamafern.com |
| AI Chat Agent | ⏸️ Deferred | Post-launch, see SHOPIFY_AI_STRATEGY.md |
