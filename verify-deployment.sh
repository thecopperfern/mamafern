#!/bin/bash
# Verification script for Mama Fern Lighthouse optimizations
# Run this after deploying to Hostinger to verify MIME fix is working

set -e

echo "🔍 Mama Fern Deployment Verification"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SITE_URL="https://mamafern.com"
PASS=0
FAIL=0

echo "Testing site: $SITE_URL"
echo ""

# Test 1: Check if site is up
echo "Test 1: Site availability..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓${NC} Site is up"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Site is down or unreachable"
    ((FAIL++))
fi

# Test 2: Check JavaScript MIME type
echo ""
echo "Test 2: JavaScript MIME types..."
JS_MIME=$(curl -sI "$SITE_URL/_next/static/chunks/main-app-*.js" 2>/dev/null | grep -i "content-type" | head -1)
if echo "$JS_MIME" | grep -q "application/javascript"; then
    echo -e "${GREEN}✓${NC} JavaScript MIME type correct"
    echo "  $JS_MIME"
    ((PASS++))
else
    echo -e "${RED}✗${NC} JavaScript MIME type incorrect"
    echo "  Expected: application/javascript"
    echo "  Got: $JS_MIME"
    ((FAIL++))
fi

# Test 3: Check CSS MIME type
echo ""
echo "Test 3: CSS MIME types..."
CSS_MIME=$(curl -sI "$SITE_URL/_next/static/css/*.css" 2>/dev/null | grep -i "content-type" | head -1)
if echo "$CSS_MIME" | grep -q "text/css"; then
    echo -e "${GREEN}✓${NC} CSS MIME type correct"
    echo "  $CSS_MIME"
    ((PASS++))
else
    echo -e "${RED}✗${NC} CSS MIME type incorrect"
    echo "  Expected: text/css"
    echo "  Got: $CSS_MIME"
    ((FAIL++))
fi

# Test 4: Check cache headers
echo ""
echo "Test 4: Cache headers on static assets..."
CACHE_HEADER=$(curl -sI "$SITE_URL/_next/static/chunks/main-app-*.js" 2>/dev/null | grep -i "cache-control" | head -1)
if echo "$CACHE_HEADER" | grep -q "max-age=31536000"; then
    echo -e "${GREEN}✓${NC} Cache headers correct (1 year)"
    echo "  $CACHE_HEADER"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} Cache headers suboptimal"
    echo "  Expected: max-age=31536000"
    echo "  Got: $CACHE_HEADER"
fi

# Test 5: Check logo file
echo ""
echo "Test 5: Logo optimization..."
LOGO_SIZE=$(curl -sI "$SITE_URL/logo.png" 2>/dev/null | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
if [ -n "$LOGO_SIZE" ] && [ "$LOGO_SIZE" -lt 50000 ]; then
    echo -e "${GREEN}✓${NC} Logo optimized ($(echo $LOGO_SIZE | awk '{printf "%.1f KB", $1/1024}'))"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} Logo file size: ${LOGO_SIZE:-unknown} bytes"
fi

# Test 6: Check RSS feed
echo ""
echo "Test 6: RSS feed logo reference..."
RSS_LOGO=$(curl -s "$SITE_URL/blog/feed.xml" 2>/dev/null | grep -o '<url>.*logo.*</url>' | head -1)
if echo "$RSS_LOGO" | grep -q "logo.png"; then
    echo -e "${GREEN}✓${NC} RSS feed using optimized logo"
    echo "  $RSS_LOGO"
    ((PASS++))
else
    echo -e "${RED}✗${NC} RSS feed logo not optimized"
    echo "  $RSS_LOGO"
    ((FAIL++))
fi

# Test 7: Check for console errors (requires browser, manual check)
echo ""
echo "Test 7: Browser console check..."
echo -e "${YELLOW}⚠${NC} Manual verification required:"
echo "  1. Open $SITE_URL in Chrome"
echo "  2. Open DevTools (F12) → Console"
echo "  3. Verify NO 'Refused to execute script' errors"
echo "  4. Verify NO 'Refused to apply style' errors"

# Summary
echo ""
echo "======================================"
echo "Verification Summary"
echo "======================================"
echo -e "${GREEN}Passed: $PASS${NC}"
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Failed: $FAIL${NC}"
fi
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All automated tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Check browser console manually (Test 7)"
    echo "2. Run Lighthouse audit: npm run lighthouse:mobile"
    echo "3. Expected scores: Performance 80-85, Best Practices 90-95"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Check output above.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Verify Node.js process restarted on server"
    echo "2. Check pm2 logs: pm2 logs mamafern"
    echo "3. Verify git pull completed: git log --oneline -1"
    echo "4. See DEPLOYMENT_INSTRUCTIONS.md for detailed help"
    exit 1
fi
