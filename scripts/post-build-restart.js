/**
 * Post-build restart for Hostinger git auto-deploy.
 *
 * After `next build` overwrites .next/ with new chunks, the old server
 * process still has the old build manifest in memory. Clients get HTML
 * referencing new chunk hashes, but the old server can't serve them → 404s.
 *
 * Fix: kill the old server using its PID file. Hostinger's process manager
 * respawns it, loading the fresh build.
 *
 * ⚠️  We intentionally avoid `pkill` / broad process kills — on Hostinger's
 *     deploy pipeline those can kill the deploy runner or process manager
 *     itself, leaving the site down with a 503.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pidFile = path.join(__dirname, "..", ".server.pid");

// Strategy 1: Kill via PID file (targeted — only kills OUR server)
if (fs.existsSync(pidFile)) {
  const pid = fs.readFileSync(pidFile, "utf-8").trim();
  console.log(`✅ post-build: found server PID ${pid} — killing old process`);
  try {
    execSync(`kill ${pid}`, { stdio: "inherit" });
    console.log(`✅ post-build: killed PID ${pid} — Hostinger will respawn`);
    fs.unlinkSync(pidFile);
  } catch (err) {
    console.log(`   kill failed (process may already be dead): ${err.message}`);
  }
} else {
  console.log("ℹ️ post-build: no .server.pid found — server may not be running");
}

// Strategy 2: Touch tmp/restart.txt for Passenger-style process managers
try {
  const tmpDir = path.join(__dirname, "..", "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, "restart.txt"), Date.now().toString());
  console.log("✅ post-build: touched tmp/restart.txt");
} catch {
  // ignore
}

console.log("✅ post-build: restart complete — new build will be served");
