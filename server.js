/**
 * Custom Node.js server for Hostinger deployment.
 *
 * Usage (after `npm run build`):
 *   node server.js
 *
 * The standalone output from Next.js bundles everything needed.
 * Copy this file into .next/standalone/ alongside the built output,
 * then copy the `public/` and `.next/static/` folders:
 *
 *   cp -r public .next/standalone/public
 *   cp -r .next/static .next/standalone/.next/static
 *   cd .next/standalone && node server.js
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, () => {
    console.log(
      `> Mama Fern ready on http://${hostname}:${port} (${dev ? "dev" : "production"})`
    );
  });
});
