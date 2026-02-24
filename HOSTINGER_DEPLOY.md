# Hostinger Deployment Guide — Mama Fern

**Status**: ✅ Production build verified and working. Ready for Hostinger deployment.

## Prerequisites

- Hostinger plan with **Node.js hosting** support (Business or higher)
- SSH access enabled
- Domain pointed to Hostinger nameservers

---

## 1. Build Locally

```bash
npm run build
```

This produces the `.next/` build output. The custom `server.js` serves the app with HTTP/2-safe Content-Length headers for static assets.

## 2. Upload to Hostinger

Upload the **entire project** to your Hostinger site root:

```
/home/u-your-username/domains/mamafern.com/public_html/
```

Use SFTP, FileZilla, or Hostinger's File Manager.

## 4. Set Environment Variables

In Hostinger's hPanel → **Advanced** → **Node.js** (or via `.env` file in site root):

```env
NODE_ENV=production
PORT=3000
SHOPIFY_STORE_API_URL=https://mama-fern.myshopify.com/api/2026-04/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mama-fern.myshopify.com
BREVO_API_KEY=your_brevo_key
BREVO_LIST_ID=your_list_id
BREVO_SENDER_EMAIL=hello@mamafern.com
CONTACT_TO_EMAIL=hello@mamafern.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **Important**: `SHOPIFY_STOREFRONT_ACCESS_TOKEN` and `SHOPIFY_STORE_API_URL` are server-only.
> They are NOT prefixed with `NEXT_PUBLIC_` and are never sent to the browser.

## 4. Start the App

### Option A: Hostinger Node.js Panel
1. Go to hPanel → **Advanced** → **Node.js**
2. Set **Application root**: `/public_html`
3. Set **Application startup file**: `server.js`
4. Set **Node.js version**: 20.x or latest LTS
5. Click **Create** / **Restart**

### Option B: SSH + PM2
```bash
ssh u-your-username@your-server-ip
cd ~/domains/mamafern.com/public_html
npm install -g pm2   # if not installed
pm2 start ecosystem.config.js
pm2 save
pm2 startup          # auto-start on reboot
```

## 5. Verify

- Visit `https://mamafern.com` — should load the homepage
- Check `https://mamafern.com/sitemap.xml` — should list all products/collections
- Check `https://mamafern.com/robots.txt`
- Open browser DevTools → Network tab: confirm NO requests contain the Shopify token
- Test add to cart → checkout flow

## 6. SSL

Hostinger provides free SSL via Let's Encrypt. Enable it in hPanel → **Security** → **SSL**.

## 7. Updating the Site

```bash
# Local: rebuild
npm run build

# Upload project to Hostinger, then restart:
pm2 restart mamafern
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | Check PM2 logs: `pm2 logs mamafern` |
| Port conflict | Ensure PORT matches what Hostinger expects (usually 3000) |
| Missing env vars | Check `.env` file or hPanel env var settings |
| Static files 404 | Ensure `public/` and `.next/static/` were copied into standalone |
| SQLite errors | `analytics.db` requires a persistent filesystem — works on Hostinger VPS, may not on shared |
| `ChunkLoadError` / `ERR_HTTP2_PROTOCOL_ERROR` | Hostinger's nginx drops large JS chunks mid-HTTP/2 stream. Fixed by: (1) `compress: false` in next.config.ts (prevents double-gzip), (2) webpack `maxSize: 150_000` to keep chunks small, (3) server.js serves `_next/static/` directly with explicit `Content-Length`. Rebuild and redeploy. |
