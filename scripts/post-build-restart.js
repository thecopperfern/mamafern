/**
 * Post-build recovery for Hostinger git auto-deploy.
 *
 * Problem solved:
 * - On some Hostinger plans, deploys can leave the Node runtime stopped (503),
 *   and users may not have a panel restart button.
 *
 * Safe behavior:
 * 1) Touch tmp/restart.txt (for Passenger-style managers)
 * 2) If no live .server.pid process exists, start server.js in detached mode
 *
 * Important:
 * - Never kill processes here (no pkill, no broad kill patterns)
 * - Run auto-start only in Hostinger's git deploy workspace
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const tmpDir = path.join(projectRoot, "tmp");
const pidFile = path.join(projectRoot, ".server.pid");
const outLog = path.join(tmpDir, "server.out.log");
const errLog = path.join(tmpDir, "server.err.log");

const hostingerBuildPath = `${path.sep}.builds${path.sep}source${path.sep}repository`;
const isHostingerGitDeploy =
  process.cwd().includes(hostingerBuildPath) ||
  projectRoot.includes(hostingerBuildPath);

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function ensureTmpDir() {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
}

if (!isHostingerGitDeploy) {
  console.log("ℹ️ post-build: non-Hostinger environment detected, skipping auto-start");
  process.exit(0);
}

// Write restart marker for Passenger-style managers on Hostinger.
try {
  ensureTmpDir();
  fs.writeFileSync(path.join(tmpDir, "restart.txt"), Date.now().toString());
  console.log("✅ post-build: touched tmp/restart.txt");
} catch (error) {
  console.log(`ℹ️ post-build: could not write restart.txt: ${error.message}`);
}

let hasLiveServer = false;
if (fs.existsSync(pidFile)) {
  const pidRaw = fs.readFileSync(pidFile, "utf-8").trim();
  const pid = Number.parseInt(pidRaw, 10);
  if (isProcessRunning(pid)) {
    hasLiveServer = true;
    console.log(`✅ post-build: server already running with PID ${pid}`);
  } else {
    console.log(`ℹ️ post-build: stale PID file (${pidRaw}), removing`);
    try {
      fs.unlinkSync(pidFile);
    } catch {
      // ignore stale cleanup errors
    }
  }
} else {
  console.log("ℹ️ post-build: no .server.pid found");
}

if (hasLiveServer) {
  console.log("✅ post-build: startup recovery not needed");
  process.exit(0);
}

try {
  ensureTmpDir();
  const outFd = fs.openSync(outLog, "a");
  const errFd = fs.openSync(errLog, "a");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "production" },
    detached: true,
    stdio: ["ignore", outFd, errFd],
  });
  child.unref();
  console.log(`✅ post-build: started recovery server process PID ${child.pid}`);
} catch (error) {
  console.error(`❌ post-build: failed to start recovery server: ${error.message}`);
  process.exitCode = 1;
}
