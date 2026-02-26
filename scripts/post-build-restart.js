/**
 * Post-build restart script for Hostinger git auto-deploy.
 *
 * Problem: Hostinger's auto-deploy runs `npm run build` after a push,
 * but does NOT restart the running Node.js process. The old server
 * keeps running with stale code and stale env vars.
 *
 * Solution: Try multiple restart strategies in order of preference.
 * At least one should work on Hostinger's Node.js hosting.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let restarted = false;

// Strategy 1: Phusion Passenger restart (Hostinger uses this)
// Touching tmp/restart.txt signals Passenger to gracefully restart
try {
  const tmpDir = path.join(__dirname, "..", "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const restartFile = path.join(tmpDir, "restart.txt");
  fs.writeFileSync(restartFile, Date.now().toString());
  console.log("✅ post-build: touched tmp/restart.txt (Passenger restart)");
  restarted = true;
} catch (err) {
  console.log("   Passenger restart skipped:", err.message);
}

// Strategy 2: Kill running server.js process so it gets respawned
try {
  const output = execSync(
    "pgrep -f 'node server\\.js' || true",
    { encoding: "utf-8" }
  ).trim();

  if (output) {
    const pids = output.split("\n").filter(Boolean);
    console.log(`✅ post-build: found server process(es): ${pids.join(", ")}`);
    execSync(`kill ${pids.join(" ")} || true`, { stdio: "inherit" });
    console.log("✅ post-build: killed old server — will be respawned");
    restarted = true;
  }
} catch (err) {
  console.log("   Process kill skipped:", err.message);
}

if (!restarted) {
  console.log("⚠️ post-build: no restart method succeeded");
  console.log("   Site should still work if Hostinger auto-restarts the app.");
}
