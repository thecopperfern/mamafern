# 🚀 Deployment Instructions - Complete the MIME Fix

**Status:** Code committed to GitHub ✅
**Requires:** SSH access to Hostinger (credentials provided by Comet Browser)

---

## ✅ What's Already Done

1. **server.js MIME Fix** - Committed to GitHub (lines 69-94)
2. **All Lighthouse Optimizations** - Committed and pushed
3. **SSH Access** - Enabled by Comet Browser

**SSH Credentials:**
- IP: `72.62.172.189`
- Port: `65002`
- Username: `u918197117`
- Path: `/home/u918197117/domains/mamafern.com/public_html`

---

## 🔧 Step 1: SSH into Hostinger and Restart Node.js

### Option A: Using PM2 (Recommended)

```bash
# Connect to server
ssh -p 65002 u918197117@72.62.172.189

# Navigate to project directory
cd /home/u918197117/domains/mamafern.com/public_html

# Pull latest changes from GitHub (includes MIME fix)
git pull origin main

# Restart Node.js via PM2
pm2 restart all

# OR restart specific process:
pm2 restart mamafern

# Verify it's running
pm2 status
pm2 logs mamafern --lines 20
```

### Option B: Manual Process Management

```bash
# Connect to server
ssh -p 65002 u918197117@72.62.172.189

# Navigate to project
cd /home/u918197117/domains/mamafern.com/public_html

# Pull latest changes
git pull origin main

# Find and kill existing Node.js process
ps aux | grep "node server.js"
# Note the PID from the output

# Kill the process (PM2 or supervisor will auto-restart)
kill <PID>

# OR use the PID file method:
kill $(cat .server.pid 2>/dev/null) 2>/dev/null

# If process doesn't auto-restart, start manually:
NODE_ENV=production node server.js &

# Verify it's running
ps aux | grep "node server.js"
curl -I http://localhost:3000/_next/static/chunks/main-app-*.js
```

---

## 🧪 Step 2: Verify the MIME Fix is Working

### 2.1 Check MIME Types from Server

```bash
# Test JavaScript chunks
curl -I https://mamafern.com/_next/static/chunks/main-app-*.js | grep Content-Type
# Expected: Content-Type: application/javascript

# Test CSS files
curl -I https://mamafern.com/_next/static/css/*.css | grep Content-Type
# Expected: Content-Type: text/css

# Test WebP images
curl -I https://mamafern.com/_next/static/media/linen.*.webp | grep Content-Type
# Expected: Content-Type: image/webp
```

### 2.2 Check Browser Console

1. Open https://mamafern.com in Chrome
2. Open DevTools (F12) → Console tab
3. **Expected:** No "Refused to execute script" errors ✅
4. **Expected:** No "Refused to apply style" errors ✅

### 2.3 Check Network Tab

1. DevTools → Network tab
2. Refresh page (Ctrl+R)
3. Filter by "JS" or "CSS"
4. Click any `/_next/static/chunks/*.js` file
5. Check Headers → Response Headers
6. **Expected:** `Content-Type: application/javascript` ✅

---

## 📊 Step 3: Run Lighthouse Audit

### Local Audit

```bash
# From your local machine (not server)
cd C:\Dev_Land\mamafern

# Run mobile audit
npm run lighthouse:mobile

# Check the scores
cat tmp/lighthouse-mobile.json | grep -A 5 "categories"
```

### Expected Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Performance** | 75 | 80-85 | +5-10 |
| **Best Practices** | 71 | 90-95 | +19-24 |
| **Accessibility** | 100 | 100 | ✅ |
| **SEO** | 100 | 100 | ✅ |

---

## 🔍 Troubleshooting

### Issue: Can't Connect via SSH

**Check:**
```bash
# Test connection
ping 72.62.172.189

# Test SSH port
telnet 72.62.172.189 65002

# Verbose SSH connection
ssh -p 65002 -v u918197117@72.62.172.189
```

**Solution:** Contact Hostinger if connection fails

---

### Issue: MIME Types Still Wrong After Restart

**Check server logs:**
```bash
# PM2 logs
pm2 logs mamafern --lines 50

# OR manual log file
tail -f /home/u918197117/logs/nodejs.log

# Check if server.js is the right version
head -20 server.js | grep "MIME type map"
```

**Verify git pull worked:**
```bash
git log --oneline -5
# Should show: "feat(lighthouse): Implement critical performance..."
```

**Force restart:**
```bash
pm2 delete mamafern
pm2 start server.js --name mamafern
```

---

### Issue: Process Keeps Dying

**Check for port conflicts:**
```bash
netstat -tlnp | grep 3000
# OR
lsof -i :3000
```

**Check environment variables:**
```bash
pm2 env mamafern | grep SHOPIFY
# Should show: SHOPIFY_STORE_API_URL and SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

**Verify .env.local exists:**
```bash
cat .env.local | grep SHOPIFY
```

---

### Issue: 404 Errors on Static Assets

**Check .next directory:**
```bash
ls -la .next/static/chunks/ | head -10
# Should show JS files

ls -la .next/static/css/
# Should show CSS files
```

**Rebuild if needed:**
```bash
npm run build
pm2 restart mamafern
```

---

## 📝 Verification Checklist

After completing the steps above:

- [ ] SSH connection successful
- [ ] Git pull completed (latest commit visible)
- [ ] Node.js process restarted
- [ ] Process is running (`pm2 status` or `ps aux`)
- [ ] MIME types correct (curl shows `application/javascript`)
- [ ] Browser console clean (no MIME errors)
- [ ] Lighthouse Best Practices: 90-95+
- [ ] Lighthouse Performance: 80-85+

---

## 🎯 Expected Lighthouse Improvements

### Before (Baseline)
```
Performance: 75
Best Practices: 71
Accessibility: 100
SEO: 100
```

### After (All Optimizations + MIME Fix)
```
Performance: 80-85 (+5-10)
Best Practices: 90-95 (+19-24)
Accessibility: 100 (maintained)
SEO: 100 (maintained)
```

### Key Improvements
- ✅ No console errors (11+ errors eliminated)
- ✅ JS/CSS executing correctly
- ✅ Logo loads instantly (inline SVG)
- ✅ RSS feed optimized (680x smaller)
- ✅ 19.4 MB repository cleanup

---

## 📚 Related Documentation

- `LIGHTHOUSE_IMPROVEMENTS_SUMMARY.md` - All optimizations documented
- `LOGO_OPTIMIZATION_SUMMARY.md` - Logo implementation details
- `HOSTINGER_NGINX_FIX.md` - Alternative nginx configuration approach
- `PAGESPEED_ACTION_PLAN.md` - Complete optimization roadmap

---

## 🆘 If You Need Help

**Can't SSH?**
- Contact Hostinger support for SSH assistance
- Verify SSH is enabled in hPanel

**MIME fix not working?**
- Check `pm2 logs mamafern` for errors
- Verify `server.js` has the MIME fix code (lines 69-94)
- Try manual restart: `kill $(cat .server.pid); node server.js &`

**Lighthouse still low?**
- Clear browser cache and retry
- Check console for other errors
- Verify git pull brought latest changes
- Run `npm run build` and restart

---

**Date Created:** March 6, 2026
**Status:** Ready for deployment
**Estimated Time:** 10-15 minutes
