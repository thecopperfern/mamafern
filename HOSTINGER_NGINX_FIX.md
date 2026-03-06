# Hostinger Nginx MIME Type Fix (CRITICAL)

**Status:** Phase 0 - CRITICAL
**Impact:** Best Practices 71→90+, fixes broken JS/CSS execution
**Est. Time:** 1-2 hours
**Requires:** Hostinger SSH access or hPanel configuration

---

## Problem

Hostinger's nginx reverse proxy serves Next.js static assets (`/_next/static/`) with MIME type `text/plain` instead of `application/javascript` and `text/css`, causing browsers to refuse to execute them:

```
Refused to execute script from '.../_next/static/chunks/1430-c38ebef53d263cd3.js'
  because its MIME type ('text/plain') is not executable

Refused to apply style from '.../_next/static/css/2360369649d85331.css'
  because its MIME type ('text/plain') is not a supported stylesheet MIME type
```

**Affected resources:** 11 JS chunks + 1 CSS file

This is the **#1 reason Best Practices = 71** and contributes to TBT/TTI degradation.

---

## Root Cause

The nginx reverse proxy intercepts `/_next/static/` requests BEFORE they reach Node.js and serves them directly from disk with incorrect MIME types.

The `server.js` MIME type fix only works when Node.js serves the request, but nginx bypasses Node.js for static assets.

---

## Solution Options

### Option A: nginx Configuration (RECOMMENDED)

**If you have SSH access to Hostinger VPS:**

1. SSH into the server:
   ```bash
   ssh your-username@your-hostinger-ip
   ```

2. Locate the nginx config file:
   ```bash
   # Common locations:
   /etc/nginx/sites-available/mamafern.com
   /etc/nginx/conf.d/mamafern.conf
   /usr/local/nginx/conf/nginx.conf

   # Find your site config:
   nginx -T | grep "server_name mamafern.com"
   ```

3. Add this location block to the server block:
   ```nginx
   server {
       server_name mamafern.com;

       # ... existing config ...

       # Fix MIME types for Next.js static assets
       location /_next/static/ {
           types {
               application/javascript  js;
               text/css                css;
               image/webp              webp;
               image/avif              avif;
               image/jpeg              jpg jpeg;
               image/png               png;
               image/svg+xml           svg;
               font/woff               woff;
               font/woff2              woff2;
           }

           # Cache static assets for 1 year (immutable build hashes)
           add_header Cache-Control "public, max-age=31536000, immutable";

           # Security headers
           add_header X-Content-Type-Options "nosniff";

           # Serve from disk (nginx default behavior)
           root /path/to/mamafern/.next;
           try_files $uri =404;
       }

       # ... rest of config ...
   }
   ```

4. Test the configuration:
   ```bash
   nginx -t
   ```

5. If test passes, reload nginx:
   ```bash
   sudo systemctl reload nginx
   # OR
   sudo nginx -s reload
   ```

6. Verify the fix:
   ```bash
   curl -I https://mamafern.com/_next/static/chunks/framework-*.js | grep Content-Type
   # Should show: Content-Type: application/javascript

   curl -I https://mamafern.com/_next/static/css/*.css | grep Content-Type
   # Should show: Content-Type: text/css
   ```

---

### Option B: hPanel Configuration (if no SSH)

**If you only have Hostinger hPanel access:**

1. Log into Hostinger hPanel
2. Navigate to **Advanced** → **Nginx Configuration**
3. Find your site's server block
4. Add the same `location /_next/static/` block from Option A
5. Save and apply configuration

**Note:** hPanel UI varies by hosting plan. If you don't see "Nginx Configuration":
- Contact Hostinger support and provide them with the nginx config snippet
- OR upgrade to a VPS plan with SSH access

---

### Option C: Serve Static Files Through Node.js (FALLBACK)

**If nginx configuration is not possible:**

Modify `server.js` to handle `/_next/static/` requests before nginx intercepts them.

**File:** `server.js`

```javascript
const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MIME type mappings
const MIME_TYPES = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

app.prepare().then(() => {
  const server = express();

  // Intercept /_next/static/ requests and serve with correct MIME types
  server.get('/_next/static/*', (req, res) => {
    const filePath = path.join(__dirname, '.next', 'static', req.path.replace('/_next/static/', ''));

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Not Found');
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

**Drawbacks:**
- Adds latency (Node.js serves files instead of nginx)
- Bypasses nginx's static file caching
- Increases Node.js memory usage

**Only use this if Option A and B are not possible.**

---

## Verification Steps

After implementing any option:

1. **Check MIME types:**
   ```bash
   curl -I https://mamafern.com/_next/static/chunks/main-app-*.js | grep Content-Type
   # Expected: Content-Type: application/javascript

   curl -I https://mamafern.com/_next/static/css/*.css | grep Content-Type
   # Expected: Content-Type: text/css
   ```

2. **Run Lighthouse audit:**
   ```bash
   npm run lighthouse:mobile
   ```
   - Best Practices should jump from 71 to 85-90+
   - No "Refused to execute script" errors in console

3. **Check browser console:**
   - Open https://mamafern.com in Chrome DevTools
   - Check Console tab - should have no MIME type errors
   - Check Network tab - all `/_next/static/` resources should show correct Content-Type

4. **Verify caching:**
   ```bash
   curl -I https://mamafern.com/_next/static/chunks/framework-*.js | grep Cache-Control
   # Expected: Cache-Control: public, max-age=31536000, immutable
   ```

---

## Expected Impact

**Before:**
- Best Practices: 71 (mobile)
- Console: 11+ "Refused to execute script" errors
- JS/CSS: Not executed by browser

**After:**
- Best Practices: 85-90+ (mobile)
- Console: Clean (no MIME errors)
- JS/CSS: Properly executed

**Estimated Lighthouse score improvements:**
- Best Practices: +15-20 points
- Performance: +3-5 points (faster JS execution)
- TBT: -50-100ms (unblocked JS reduces main thread work)

---

## Troubleshooting

### Issue: nginx config change doesn't take effect

**Solution:**
```bash
# Check if config is valid
nginx -t

# Hard reload nginx
sudo systemctl restart nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: 404 errors after config change

**Solution:**
- Verify the `root` path in the `location /_next/static/` block
- It should point to `/path/to/mamafern/.next` (parent of `static` folder)
- Check file permissions: `ls -la .next/static/`

### Issue: Can't find nginx config file

**Solution:**
```bash
# List all nginx config files
nginx -T

# Find mamafern.com config
grep -r "mamafern.com" /etc/nginx/

# Common locations:
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/
ls -la /usr/local/nginx/conf/
```

### Issue: Don't have SSH or hPanel access

**Solution:**
- Contact Hostinger support directly
- Provide them with the nginx config snippet from Option A
- Reference this document for context

---

## Related Documentation

- `PAGESPEED_ACTION_PLAN.md` - Full Lighthouse optimization roadmap
- `HOSTINGER_DEPLOYMENT_FIX.MD` - Critical Shopify connection fix
- `server.js` - Current custom server implementation
- `next.config.ts` - Next.js build configuration

---

## Implementation Checklist

- [ ] SSH into Hostinger VPS
- [ ] Locate nginx config file
- [ ] Add `location /_next/static/` block
- [ ] Test nginx config (`nginx -t`)
- [ ] Reload nginx (`sudo systemctl reload nginx`)
- [ ] Verify MIME types with curl
- [ ] Run Lighthouse audit
- [ ] Check browser console for errors
- [ ] Verify caching headers
- [ ] Document results in PAGESPEED_ACTION_PLAN.md

---

**Date Created:** March 6, 2026
**Priority:** CRITICAL - Phase 0
**Owner:** DevOps / Server Admin
