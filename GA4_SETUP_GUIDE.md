# Google Analytics 4 (GA4) Setup Guide — Mama Fern

**Status:** Infrastructure ready ✅ — just needs GA4 Measurement ID
**Current Analytics:** Plausible (self-hosted) is already active
**GA4 Role:** Secondary analytics provider for Google ecosystem integration

---

## Quick Start (5 minutes)

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left gear icon)
3. In the **Account** column, select your account (or create one)
4. In the **Property** column, click **Create Property**
5. Fill in:
   - **Property name:** Mama Fern
   - **Time zone:** Your timezone
   - **Currency:** USD
6. Click **Next** → Select your business category and size
7. Click **Next** → Select your business objectives (E-commerce recommended)
8. Click **Create** → Accept Terms of Service

### Step 2: Set Up Data Stream

1. After creating property, you'll see "Choose a platform"
2. Click **Web**
3. Fill in:
   - **Website URL:** `https://mamafern.com`
   - **Stream name:** Mama Fern Production
   - Check **Enhanced measurement** (recommended — auto-tracks scroll, clicks, video, file downloads)
4. Click **Create stream**
5. **Copy your Measurement ID** — looks like `G-XXXXXXXXXX`

### Step 3: Add to Environment Variables

**Local development:**
```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Hostinger deployment:**
1. Log into Hostinger hPanel
2. Go to your Node.js app settings
3. Add environment variable:
   - **Name:** `NEXT_PUBLIC_GA_ID`
   - **Value:** `G-XXXXXXXXXX`
4. Restart the app with PM2: `pm2 restart mamafern`

### Step 4: Verify It's Working

1. **Real-time Test:**
   - Go to GA4 → Reports → Realtime
   - Open `https://mamafern.com` in another tab
   - You should see 1 active user within 30 seconds

2. **DevTools Verification:**
   - Open DevTools → Network tab
   - Filter for `google-analytics` or `gtag`
   - Refresh page → should see requests to `www.google-analytics.com/g/collect`

3. **GA4 DebugView (optional):**
   - Install [Google Analytics Debugger extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Enable it → GA4 → Admin → DebugView
   - Browse your site → see events in real-time

---

## What's Already Tracked (Out of the Box)

### Automatic Tracking via Enhanced Measurement
✅ Page views (all pages, including SPA navigation)
✅ Scroll depth (10%, 25%, 50%, 75%, 90%)
✅ Outbound link clicks
✅ Site search (if you add search functionality)
✅ Video engagement (YouTube embeds)
✅ File downloads (PDFs, etc.)

### Custom E-commerce Events (Already Implemented)
✅ **Add to Cart** — tracked in `ProductDetail` component when user clicks "Add to Cart"

---

## Recommended E-commerce Events to Add

To get the full GA4 e-commerce funnel, add these events:

### 1. View Item (Product Page View)
**When:** User lands on `/product/[handle]`
**Where:** `src/app/product/[handle]/page.tsx` or `src/components/view/ProductDetail/index.tsx`

```typescript
import { trackEvent } from "@/components/view/Analytics";

// In ProductDetail component
useEffect(() => {
  trackEvent("view_item", "ecommerce", product.title, product.price);
}, [product]);
```

### 2. Begin Checkout
**When:** User clicks checkout button in cart
**Where:** `src/components/view/CartSlideout/index.tsx`

```typescript
import { trackEvent } from "@/components/view/Analytics";

const handleCheckout = () => {
  trackEvent("begin_checkout", "ecommerce", "", totalPrice);
  window.location.href = cart.checkoutUrl;
};
```

### 3. View Cart
**When:** User opens cart slideout
**Where:** `src/components/view/CartSlideout/index.tsx`

```typescript
useEffect(() => {
  if (open && cart.lines.length > 0) {
    trackEvent("view_cart", "ecommerce", "", cart.estimatedCost.totalAmount.amount);
  }
}, [open]);
```

### 4. Remove from Cart
**When:** User removes item from cart
**Where:** `src/components/view/CartSlideout/index.tsx`

```typescript
const handleRemoveItem = (lineId: string, productTitle: string) => {
  removeItem(lineId);
  trackEvent("remove_from_cart", "ecommerce", productTitle);
};
```

### 5. Newsletter Signup
**When:** User submits email in EmailCaptureModal
**Where:** `src/components/view/EmailCaptureModal/index.tsx`

```typescript
import { trackEvent } from "@/components/view/Analytics";

const handleSubmit = async () => {
  // ... existing submit logic
  trackEvent("newsletter_signup", "engagement", "popup");
};
```

### 6. Search (if you add search)
**When:** User performs a search
**Where:** Search component

```typescript
trackEvent("search", "engagement", searchQuery);
```

---

## Advanced GA4 Configuration (Optional)

### Enhanced E-commerce Tracking (Recommended for Shopify)

For full GA4 e-commerce integration with detailed product data:

1. **Update `trackEvent` to support GA4 e-commerce format:**

```typescript
// src/components/view/Analytics/index.tsx

/** Track GA4 e-commerce event with product details */
export function trackEcommerceEvent(
  eventName: string,
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity?: number;
  }>,
  value?: number
) {
  if (typeof window === "undefined" || !GA_ID) return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", eventName, {
    currency: "USD",
    value,
    items,
  });
}
```

2. **Use in ProductDetail:**

```typescript
import { trackEcommerceEvent } from "@/components/view/Analytics";

const handleAddToCart = () => {
  trackEcommerceEvent("add_to_cart", [
    {
      item_id: selectedVariant.id,
      item_name: product.title,
      price: parseFloat(selectedVariant.price),
      quantity: 1,
    },
  ], parseFloat(selectedVariant.price));
};
```

### GA4 Custom Dimensions (Advanced)

Track additional context:

1. **Go to GA4 → Admin → Custom definitions**
2. Create custom dimensions:
   - `product_collection` — which collection the product is from
   - `user_type` — new vs returning
   - `device_type` — mobile, tablet, desktop

3. Send with events:

```typescript
trackEvent("add_to_cart", "ecommerce", product.title, product.price, {
  product_collection: collectionHandle,
  device_type: window.innerWidth < 768 ? "mobile" : "desktop",
});
```

---

## GA4 Goals & Conversions

After setup, configure these as **Conversions** in GA4:

1. **Go to GA4 → Admin → Events**
2. Mark these events as conversions:
   - `purchase` (auto-tracked if using GA4 e-commerce)
   - `begin_checkout`
   - `add_to_cart`
   - `newsletter_signup`

This lets you track conversion rates in reports.

---

## GA4 Reports You'll See

### Standard Reports (no config needed)
- **Realtime** — Active users right now
- **User acquisition** — Where traffic comes from (Google, Instagram, TikTok, Pinterest)
- **Engagement** — Pages per session, avg session duration
- **Events** — All tracked events with counts

### E-commerce Reports (after first purchase)
- **Purchase journey** — View item → Add to cart → Begin checkout → Purchase
- **Item views** — Top products by pageviews
- **Add to carts** — Products most added to cart
- **Revenue** — Total revenue, transactions, avg order value

### Custom Reports (Explorations)
Create custom funnels:
1. GA4 → Explore → Funnel exploration
2. Build funnel:
   - Step 1: `page_view` (any product page)
   - Step 2: `add_to_cart`
   - Step 3: `begin_checkout`
   - Step 4: `purchase` (Shopify hosted checkout handles this)

---

## Troubleshooting

### "No data is being received"
✅ Check `NEXT_PUBLIC_GA_ID` is set correctly
✅ Rebuild and restart after adding env var: `npm run build && pm2 restart mamafern`
✅ GA4 can take 24-48 hours to show historical data (Realtime is instant)
✅ Check browser DevTools Network tab for `google-analytics.com` requests

### "Events not showing up"
✅ Make sure you're calling `trackEvent()` (GA) not `trackPlausibleEvent()` (Plausible)
✅ Check if ad blockers are enabled (they block GA but not Plausible)
✅ Verify `GA_ID` check in Analytics component: `if (!GA_ID) return null;` means GA is disabled

### "Page views look low"
✅ GA4 auto-tracks SPA navigation via Next.js router
✅ If using ad blockers, ~20-40% of users won't be tracked (privacy-focused users)
✅ Plausible typically shows 20-30% more traffic than GA (fewer blockers)

### "Duplicate tracking (GA + Plausible)"
✅ **This is intentional and recommended.**
✅ Plausible = privacy-focused, accurate traffic data
✅ GA4 = Google ecosystem (Ads, Search Console), e-commerce funnels
✅ Both run in parallel with no conflicts

---

## Privacy & Compliance

### Current Implementation
✅ GA4 only loads when `NEXT_PUBLIC_GA_ID` is set (user opt-in)
✅ Using `strategy="afterInteractive"` (doesn't block page load)
⚠️ **TODO:** Add cookie consent banner (required in EU/UK for GA)

### GDPR/CCPA Compliance
If you have EU/UK traffic, you MUST add a cookie consent banner before GA tracks:

**Recommended:** Use [CookieYes](https://www.cookieyes.com/) (free tier) or [Osano](https://www.osano.com/)

1. Sign up → Create consent banner
2. Add script tag to `layout.tsx` before Analytics component
3. Configure to block GA until user accepts

**Alternative (code-based):**
```typescript
// Only init GA after user consents
if (typeof window !== "undefined" && window.localStorage.getItem("cookieConsent") === "true") {
  // ... load GA scripts
}
```

---

## Testing Checklist

- [ ] GA4 property created
- [ ] Measurement ID copied
- [ ] `NEXT_PUBLIC_GA_ID` added to `.env.local`
- [ ] Site rebuilt and restarted
- [ ] Realtime report shows active user when you visit the site
- [ ] DevTools Network shows GA requests
- [ ] Page view events appear in GA4 → Reports → Events
- [ ] Add to cart tracked (test by adding product to cart)
- [ ] (If deployed) Hostinger env var set and app restarted

---

## Summary

**Time to set up:** ~5 minutes
**Cost:** Free (up to 10M events/month)
**Data retention:** 14 months (GA4 default)
**Real-time data:** Yes (30-second delay)
**Historical reports:** 24-48 hours after first event

**Next steps after basic setup:**
1. Add the recommended e-commerce events (view_item, begin_checkout, etc.)
2. Configure conversions in GA4
3. Set up custom funnels in Explorations
4. Add cookie consent banner if targeting EU/UK

---

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Plausible vs GA4](https://plausible.io/vs-google-analytics)
