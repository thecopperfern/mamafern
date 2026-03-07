# Quick Reference - Performance Optimization

## 📊 Current Status (March 6, 2026)

```
Mobile Performance:  90/100 ✅ (Target Met)
Desktop Performance: 99/100 ✅
Mobile LCP:         3.6s ⚠️  (Target: <2.5s)
Mobile TBT:         30ms ✅
```

---

## 🚀 Next Steps (Priority Order)

### 1️⃣ Fix React Hydration Error #418
**Time:** 1-2 hours | **Gain:** +2-3 Lighthouse points
```bash
npm run dev
# Check console for full error, fix HTML mismatch
```

### 2️⃣ Bundle Analysis
**Time:** 2-3 hours | **Gain:** +3-5 Lighthouse points
```bash
npm install -D @next/bundle-analyzer
ANALYZE=true npm run build
```

### 3️⃣ Compress Hero Background
**Time:** 1 hour | **Gain:** +200-400ms LCP
```bash
npx @squoosh/cli --webp '{"quality":70}' public/linen.webp
```

### 4️⃣ Fix 404/403 Errors
**Time:** 30 min | **Gain:** Cleaner console
```
DevTools → Network → Filter "status-code:404"
```

---

## ⚡ Quick Commands

```bash
# Test performance
npm run build && npm run start
npx lighthouse http://localhost:3000 --preset=perf

# Production audit
npx lighthouse https://mamafern.com \
  --screenEmulation.mobile=true \
  --output=html

# Bundle analysis
ANALYZE=true npm run build

# Debug React errors
npm run dev
# Open http://localhost:3000 and check console
```

---

## 🎯 Performance Rules (DO NOT BREAK)

### ✅ Font Preloading (CRITICAL)
```typescript
// src/app/layout.tsx
const playfair = Playfair_Display({
  preload: true, // ← NEVER REMOVE
});
```

### ✅ Script Deferral (CRITICAL)
```typescript
// src/components/view/Analytics/index.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="lazyOnload" // ← NEVER CHANGE to afterInteractive
/>
```

### ✅ Shopify Dynamic Rendering (CRITICAL)
```typescript
// Any page using commerceClient
export const dynamic = "force-dynamic" // ← NEVER USE revalidate
```

---

## 📁 Key Files

**Performance Config:**
- `src/app/layout.tsx` - Fonts (lines 31-44)
- `src/components/view/Analytics/index.tsx` - GA loading
- `src/components/view/Hero/index.tsx` - LCP element

**Documentation:**
- `PERFORMANCE_NEXT_STEPS.md` - Detailed action plan
- `LCP_FIX_IMPLEMENTATION.md` - Technical guide
- `LCP_FIX_TEST_RESULTS.md` - Test results

**Agent Instructions:**
- `CLAUDE.md` - Claude performance rules
- `.github/copilot-instructions.md` - Copilot rules
- `.gemini/instructions.md` - Gemini rules

---

## 🎯 Targets

| Metric | Current | Next Target | Stretch Goal |
|--------|---------|-------------|--------------|
| Mobile Perf | 90 | 95 | 97+ |
| LCP | 3.6s | 2.5s | 2.0s |
| TBT | 30ms | 25ms | 20ms |

**If Next 4 Tasks Done:** Performance → 95+, LCP → 2.2s ✅

---

**Last Updated:** March 6, 2026
