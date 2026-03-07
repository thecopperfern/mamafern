# Performance Optimization - Next Steps
**Current Status:** Mobile 90/100, LCP 3.6s
**Goal:** Push to 95+/100, LCP <2.5s
**Priority:** Medium (not urgent - already production-ready)

---

## 🎯 QUICK WINS (1-2 hours each)

### 1. Fix React Hydration Error #418 ⚠️ HIGH IMPACT
**Issue:** Console shows "Minified React error #418" - server/client HTML mismatch
**Location:** Unknown (need to debug)
**Expected Gain:** +200-400ms LCP, cleaner console, +2-3 Lighthouse points

**Steps:**
```bash
# 1. Run dev mode to see full error
npm run dev

# 2. Open http://localhost:3000
# 3. Check console for full error message with component name
# 4. Likely causes:
#    - Date/time rendering (server time ≠ client time)
#    - window/document usage during render
#    - Conditional rendering based on browser APIs
#    - Random IDs/values generated differently

# 5. Common fixes:
#    - Wrap client-only code in useEffect
#    - Use suppressHydrationWarning for acceptable mismatches
#    - Ensure server and client render identical HTML
```

**Files to Check:**
- `src/components/view/Hero/index.tsx` (likely culprit)
- `src/components/view/EmailCaptureModal` (client component)
- Any component using `window`, `document`, or date/time

---

### 2. Fix 404/403 Network Errors 🔴 MEDIUM IMPACT
**Issue:** 4× 404 errors, 1× 403 error loading resources
**Expected Gain:** Cleaner Network tab, +1-2 Best Practices points

**Steps:**
```bash
# 1. Identify missing resources
# Open DevTools → Network → Filter: "status-code:404"
# Document what's missing

# 2. Common causes:
#    - Stale service worker cache
#    - Old build artifacts referenced
#    - Missing fonts/images
#    - Broken sitemap links

# 3. Check these files:
#    - public/ directory (missing assets?)
#    - sitemap.xml (broken links?)
#    - Font references in CSS
```

---

### 3. Compress Hero Background Image 🖼️ MEDIUM IMPACT
**Current:** linen.webp = 55KB
**Target:** <30KB
**Expected Gain:** +200-400ms LCP

**Steps:**
```bash
# 1. Try lower quality WebP
npx @squoosh/cli --webp '{"quality":70}' public/linen.webp -d public/

# 2. Or use cwebp directly
cwebp -q 70 public/linen.webp -o public/linen-optimized.webp

# 3. Test visually - texture should still look good
# 4. If acceptable, replace linen.webp

# Alternative: Inline small images as base64
# For images <10KB, consider base64 in CSS
```

---

## 🔬 DEEP DIVES (2-4 hours each)

### 4. Bundle Analysis & Code Splitting 📦 HIGH IMPACT
**Issue:** 60KB unused JavaScript (41% of Google Analytics)
**Expected Gain:** +300ms, +3-5 Lighthouse points

**Steps:**
```bash
# 1. Install bundle analyzer
npm install -D @next/bundle-analyzer

# 2. Add to next.config.ts:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# 3. Run analysis
ANALYZE=true npm run build

# 4. Opens interactive bundle map in browser
# Look for:
#    - Large chunks that can be split
#    - Unused dependencies
#    - Duplicated code across bundles

# 5. Common optimizations:
#    - Dynamic imports for large components
#    - Remove unused dependencies
#    - Split vendor bundles
```

**Likely Culprits:**
- Keystatic admin code leaking into production
- Unused Shopify GraphQL types
- Large UI libraries imported but not fully used
- Polyfills for modern browsers (unnecessary)

---

### 5. Inline Critical CSS ⚡ MEDIUM IMPACT
**Issue:** CSS files block initial render
**Expected Gain:** +100-200ms LCP

**Steps:**
```bash
# 1. Identify critical CSS (Hero section styles)
# 2. Extract to inline <style> in layout.tsx <head>
# 3. Load full CSS async

# Manual approach:
# - Copy Hero/Button/Layout styles
# - Inline in <head>
# - Add media="print" onload="this.media='all'" to main CSS

# Automated approach:
npm install -D critters
# Configure in next.config.ts
```

**Critical Styles:**
- Hero section (background, h1, buttons)
- Layout (body, font-family)
- Above-the-fold components only

---

### 6. Font Subsetting 🔤 LOW IMPACT
**Current:** Full Latin subset (~37KB + 38KB)
**Target:** US English only (~25KB + 25KB)
**Expected Gain:** +50-100ms LCP

**Steps:**
```bash
# Next.js Google Fonts doesn't support custom subsetting
# But we can optimize with font-display and unicode-range

# In layout.tsx, fonts already have:
display: "swap" ✅
preload: true ✅

# Next step: Self-host and subset manually
# 1. Download fonts from Google Fonts
# 2. Use fonttools to subset:
pip install fonttools brotli
pyftsubset font.woff2 --unicodes="U+0020-007F"

# 3. Self-host in public/fonts/
# 4. Use @font-face in globals.css
```

**Worth it?** Probably not - diminishing returns for ~50ms gain

---

## 📊 ADVANCED OPTIMIZATIONS (4+ hours)

### 7. Image Optimization Audit 🖼️
**Audit all images on homepage:**
- Hero background: Already optimized (linen.webp)
- Logo: 63KB PNG → could be WebP
- Product images: Shopify CDN → add format=webp param
- Category cards: Check sizes and formats

**Steps:**
1. List all images with sizes
2. Compress with Squoosh/cwebp
3. Add responsive srcset
4. Use Next.js Image component everywhere

---

### 8. Server Response Time Optimization ⚡
**Current:** TTFB 153ms (acceptable)
**Target:** <100ms
**Expected Gain:** +50ms LCP

**Options:**
- Add Redis caching for Shopify API responses
- Optimize database queries (if using DB)
- Use CDN for static assets
- Enable HTTP/2 server push

**Complexity:** High - requires infrastructure changes

---

### 9. Third-Party Script Audit 📜
**Current scripts:**
- Google Analytics (152KB) - already optimized with lazyOnload ✅
- Plausible Analytics - self-hosted, lightweight ✅
- Judge.me (reviews) - loaded afterInteractive

**Optimize:**
- Defer Judge.me to lazyOnload if not critical
- Check for unused analytics events
- Consider removing GA entirely if Plausible is sufficient

---

## 🎯 PRIORITY MATRIX

| Task | Impact | Effort | Priority | Expected Gain |
|------|--------|--------|----------|---------------|
| Fix React #418 | High | Low | **🔴 1** | +200-400ms LCP, +2-3 points |
| Bundle Analysis | High | Medium | **🔴 2** | +300ms, +3-5 points |
| Compress Hero BG | Medium | Low | **🟡 3** | +200-400ms LCP |
| Fix 404/403 | Medium | Low | **🟡 4** | +1-2 BP points |
| Inline Critical CSS | Medium | Medium | **🟡 5** | +100-200ms LCP |
| Font Subsetting | Low | High | **🟢 6** | +50-100ms LCP |
| Image Audit | Medium | High | **🟢 7** | Variable |
| Server TTFB | Low | Very High | **🟢 8** | +50ms LCP |

---

## 📈 PROJECTED RESULTS

### If Tasks 1-4 Completed:
```
Mobile Performance: 90 → 95-97
Mobile LCP: 3.6s → 2.2-2.5s ✅ (under target!)
Mobile TBT: 30ms → 20-25ms
```

### If All Tasks 1-6 Completed:
```
Mobile Performance: 90 → 97-99
Mobile LCP: 3.6s → 1.8-2.0s ✅✅ (excellent!)
Mobile TBT: 30ms → 15-20ms
```

---

## 🛠️ DEVELOPMENT WORKFLOW

### Before Starting:
```bash
# 1. Create feature branch
git checkout -b perf/optimization-phase-2

# 2. Run baseline Lighthouse
npx lighthouse https://mamafern.com \
  --output=json \
  --output-path=./tmp/baseline-before-phase2.json \
  --screenEmulation.mobile=true \
  --formFactor=mobile
```

### After Each Task:
```bash
# 1. Test locally
npm run build && npm run start

# 2. Run Lighthouse
npx lighthouse http://localhost:3000 --preset=perf

# 3. Commit if improvement verified
git add .
git commit -m "perf: [description] - [metric improvement]"
```

### Before Deployment:
```bash
# 1. Test production build locally
npm run build
npm run start

# 2. Full Lighthouse audit (mobile + desktop)
# 3. Visual regression test
# 4. Check for console errors
# 5. Deploy to production
```

---

## 📋 CHECKLIST TEMPLATE

When working on optimizations, use this checklist:

**Pre-Work:**
- [ ] Baseline Lighthouse audit saved
- [ ] Feature branch created
- [ ] Documentation reviewed

**During Work:**
- [ ] Changes tested locally
- [ ] Lighthouse improvement verified
- [ ] No console errors introduced
- [ ] Visual regression check passed
- [ ] Code committed with descriptive message

**Post-Work:**
- [ ] Production deployment tested
- [ ] Before/after comparison documented
- [ ] Agent instruction files updated (if new patterns)
- [ ] Team notified of changes

---

## 🧪 TESTING COMMANDS

```bash
# Quick performance test (local)
npm run build && npm run start
npx lighthouse http://localhost:3000 --preset=perf

# Full audit (mobile + desktop)
npm run build && npm run start
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./tmp/audit-mobile.html \
  --screenEmulation.mobile=true

npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./tmp/audit-desktop.html \
  --preset=desktop

# Production test
npx lighthouse https://mamafern.com \
  --output=html \
  --screenEmulation.mobile=true

# Bundle size analysis
ANALYZE=true npm run build

# Check for console errors
npm run build && npm run start
# Open http://localhost:3000 and check console
```

---

## 📚 REFERENCE DOCS

**Performance Documentation:**
- `LCP_FIX_IMPLEMENTATION.md` - Font preloading guide
- `LCP_FIX_TEST_RESULTS.md` - Current test results
- `LIGHTHOUSE_POST_DEPLOYMENT_ANALYSIS.md` - Original analysis

**Agent Instructions (Updated):**
- `CLAUDE.md` - Performance optimization rules
- `.github/copilot-instructions.md` - Performance guidelines
- `.gemini/instructions.md` - Performance checklist

**External Resources:**
- [Web.dev LCP Guide](https://web.dev/lcp/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Error #418](https://react.dev/errors/418)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## 🎯 SUCCESS CRITERIA

**Target Metrics (Mobile):**
- Performance: ≥95 (currently 90)
- LCP: <2.5s (currently 3.6s)
- TBT: <100ms (currently 30ms) ✅
- CLS: <0.1 (currently 0) ✅

**Stretch Goals:**
- Performance: 97-99
- LCP: <2.0s
- TBT: <50ms

**Non-Negotiables:**
- Desktop Performance: Maintain ≥99 ✅
- Accessibility: Maintain 100 ✅
- SEO: Maintain 100 ✅
- Best Practices: Maintain ≥96 ✅

---

**Last Updated:** March 6, 2026
**Current Status:** Mobile 90/100, LCP 3.6s (production-ready, room for improvement)
**Estimated Time to 95+:** 4-8 hours of focused optimization work
**Recommended Start:** Task #1 (React Hydration Error) - biggest impact for least effort
