# Animation Testing Guide

## Why You're Not Seeing Animations

The animations are there, but you need to:
1. **Restart the dev server** (to pick up the new "use client" components)
2. **Visit the right pages** (animations are on specific pages)
3. **Interact with elements** (some animations only trigger on hover/click)

## Where to See Each Animation

### 1. ✅ Button Micro-Interactions (Everywhere)

**Where:** Any button on the site
**How to see it:**
- Hover over buttons → they scale up slightly (1.02x)
- Click/tap buttons → they scale down (0.98x)

**Test locations:**
- "Add to Cart" buttons
- "View Options" buttons
- Navigation buttons

### 2. ✅ Product Card Hover (Shop & Collections)

**Where:** `/shop` or `/collections/*`
**How to see it:**
- Hover over any product card
- Card lifts up 4px with smooth transition

**Test it:**
```
http://localhost:3000/shop
```

### 3. ✅ Page Transitions (Navigation)

**Where:** Product pages, Collections, Shop
**How to see it:**
- Navigate to: `/product/[any-product]`
- Page content fades in from below (20px slide up)
- When leaving, fades out upward

**Test sequence:**
1. Go to: `http://localhost:3000/shop`
2. Click any product
3. Watch for fade-in animation
4. Click back
5. Watch for fade-out animation

### 4. ✅ Product Gallery Thumbnails

**Where:** Product detail pages
**How to see it:**
- Hover over thumbnail images in the gallery
- Thumbnails scale up to 1.05x with spring physics

**Test it:**
```
http://localhost:3000/product/[any-product-with-multiple-images]
```

### 5. ✅ Toast Notifications (Cart Actions)

**Where:** Anywhere you add to cart
**How to see it:**
- Add item to cart
- Toast slides in from bottom-center with spring physics
- Branded colors (cream background, fern border for success)

**Test it:**
1. Go to any product page
2. Click "Add to Cart"
3. Watch for toast animation

### 6. ✅ Improved Text Contrast (Everywhere)

**Where:** Entire site
**What changed:**
- Secondary text is now darker (text-warm-brown/70 instead of /30-60)
- Placeholder text in forms is more readable
- All text meets WCAG AA 4.5:1 contrast

**Test locations:**
- Contact form placeholders
- Product descriptions
- Cart item details
- "No image" fallback text

## Quick Animation Test Checklist

```bash
# 1. Start fresh dev server
npm run dev

# 2. Visit shop page
# Open: http://localhost:3000/shop

# 3. Hover over product cards
# → Should see: Card lifts up

# 4. Click a product
# → Should see: Page fades in from below

# 5. Hover over product thumbnails
# → Should see: Thumbnail scales up

# 6. Hover over buttons
# → Should see: Button scales up slightly

# 7. Click "Add to Cart"
# → Should see: Toast slides in from bottom
```

## Subtle Animations by Design

These animations follow **Emil Kowalski's principles**:
- Movement is **subtle** (4-16px for micro-interactions)
- Duration is **fast** (150-300ms)
- Transitions use **spring physics** (natural feel)
- **Purpose:** Enhance UX without being distracting

If animations feel too subtle, we can increase:
- Scale values (1.02 → 1.05)
- Movement distances (4px → 8px)
- Spring stiffness (for more bounce)

## Troubleshooting

### "I still don't see animations"

1. **Clear browser cache:** Hard refresh (Ctrl+Shift+R)
2. **Check browser console:** Look for errors
3. **Verify dev server restarted:** Should see "Ready in XXXms"
4. **Test in different browser:** Firefox, Chrome, Edge

### "Animations are disabled"

Check if your OS has "Reduce Motion" enabled:
- **Windows:** Settings > Accessibility > Visual effects > Animation effects
- **Mac:** System Preferences > Accessibility > Display > Reduce motion
- **Our code respects this setting** and disables animations automatically

### "Page transitions aren't working"

This is a known limitation with Next.js App Router - page transitions between different routes can be challenging. The animations work best:
- Within the same page (hover, click interactions)
- On initial page load
- For client-side state changes

## Performance Check

Open browser DevTools > Performance tab:
- Record a page navigation
- Should maintain **60fps** during animations
- No layout thrashing
- Transforms are GPU-accelerated

---

**Next Steps:**
1. Get Shopify credentials set up (see SHOPIFY_SETUP_GUIDE.md)
2. Restart dev server with `npm run dev`
3. Test animations following the checklist above
4. Report back if you want to adjust animation intensity

