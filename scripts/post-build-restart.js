/**
 * Post-build restart for Hostinger git auto-deploy.
 *
 * After `next build` overwrites .next/ with new chunks, the old server
 * process still has the old build manifest in memory. Clients get HTML
 * referencing new chunk hashes, but the old server can't serve them → 404s.
 *
 * Fix: kill the old server using its PID file. Hostinger's process manager
 * respawns it, loading the fresh build.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pidFile = path.join(__dirname, "..", ".server.pid");

// Strategy 1: Kill via PID file (most reliable)
if (fs.existsSync(pidFile)) {
  const pid = fs.readFileSync(pidFile, "utf-8").trim();
  console.log(`✅ post-build: found server PID ${pid} — killing old process`);
  try {
    execSync(`kill ${pid}`, { stdio: "inherit" });
    console.log(`✅ post-build: killed PID ${pid} — Hostinger will respawn`);
    // Clean up PID file so a stale PID doesn't cause issues
    fs.unlinkSync(pidFile);
  } catch (err) {
    console.log(`   kill failed (process may already be dead): ${err.message}`);
  }
} else {
  console.log("ℹ️ post-build: no .server.pid found — server may not be running");
}

// Strategy 2: Also touch tmp/restart.txt for Passenger (belt and suspenders)
try {
  const tmpDir = path.join(__dirname, "..", "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, "restart.txt"), Date.now().toString());
  console.log("✅ post-build: touched tmp/restart.txt");
} catch {
  // ignore
}

// Strategy 3: Broad process kill as last resort
try {
  execSync("pkill -f 'node.*server\\.js' || true", { stdio: "inherit" });
  console.log("✅ post-build: pkill cleanup done");
} catch {
  // ignore
}

console.log("✅ post-build: restart complete — new build will be served");
