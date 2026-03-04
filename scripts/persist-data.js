const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");

// Detect Hostinger git deploy environment
// Hostinger clones to: /home/u.../domains/mamafern.com/.builds/source/repository/
const hostingerBuildPath = `${path.sep}.builds${path.sep}source${path.sep}repository`;
const isHostingerGitDeploy =
  process.cwd().includes(hostingerBuildPath) ||
  projectRoot.includes(hostingerBuildPath);

if (!isHostingerGitDeploy) {
  console.log("ℹ️ persist-data: non-Hostinger environment, skipping");
  process.exit(0);
}

// Derive live site path from build path
// Build: /home/u.../domains/mamafern.com/.builds/source/repository/
// Live:  /home/u.../domains/mamafern.com/public_html/
const buildsIndex = projectRoot.indexOf(".builds");
const domainRoot = projectRoot.substring(0, buildsIndex);
const liveSite = path.join(domainRoot, "public_html");

// Files/dirs to persist from live site → build directory
const PERSIST_ITEMS = [
  {
    src: path.join(liveSite, "data", "looks.json"),
    dest: path.join(projectRoot, "data", "looks.json"),
    type: "file",
    label: "looks.json",
  },
  {
    src: path.join(liveSite, "public", "uploads", "looks"),
    dest: path.join(projectRoot, "public", "uploads", "looks"),
    type: "directory",
    label: "uploaded look images",
  },
];

for (const item of PERSIST_ITEMS) {
  if (item.type === "file") {
    if (fs.existsSync(item.src)) {
      fs.mkdirSync(path.dirname(item.dest), { recursive: true });
      fs.copyFileSync(item.src, item.dest);
      console.log(`✅ persist-data: restored ${item.label}`);
    } else {
      console.log(
        `ℹ️ persist-data: ${item.label} not found on live site (first deploy?)`
      );
    }
  } else if (item.type === "directory") {
    if (fs.existsSync(item.src)) {
      fs.mkdirSync(item.dest, { recursive: true });
      copyDirRecursive(item.src, item.dest);
      console.log(`✅ persist-data: restored ${item.label}`);
    } else {
      console.log(
        `ℹ️ persist-data: ${item.label} directory not found on live site`
      );
    }
  }
}

function copyDirRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
