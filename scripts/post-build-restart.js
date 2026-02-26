/**
 * Post-build restart script for Hostinger git auto-deploy.
 *
 * Problem: Hostinger's auto-deploy runs `npm run build` after a push,
 * but does NOT restart the running Node.js process. The old server
 * keeps running with stale code (or crashes), making the site inaccessible.
 *
 * Solution: After `next build` completes, this script restarts the app
 * using PM2 (if available) or kills the old process so Hostinger's
 * process manager can respawn it.
 *
 * This runs at the END of every build, so every push = fresh server.
 */

const { execSync } = require("child_process");

function tryRestart() {
  // Strategy 1: PM2 restart (preferred)
  try {
    execSync("pm2 restart mamafern --update-env", { stdio: "inherit" });
    console.log("✅ post-build: PM2 restarted mamafern");
    return true;
  } catch {
    // PM2 not available or app not registered
  }

  // Strategy 2: PM2 start if not yet registered
  try {
    execSync("pm2 start ecosystem.config.js --update-env", { stdio: "inherit" });
    console.log("✅ post-build: PM2 started mamafern via ecosystem.config.js");
    return true;
  } catch {
    // PM2 not installed
  }

  // Strategy 3: Kill any existing node server.js process so the
  // hosting panel's process manager respawns it
  try {
    // Find and kill the old server.js process (Linux only)
    execSync("pkill -f 'node server.js' || true", { stdio: "inherit" });
    console.log("✅ post-build: killed old server.js process (will be respawned)");
    return true;
  } catch {
    // Not on Linux or no matching process
  }

  console.log("⚠️ post-build: could not restart server automatically");
  console.log("   You may need to manually restart the Node.js app in Hostinger hPanel.");
  return false;
}

tryRestart();
