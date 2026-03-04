/**
 * GitHub REST API utility for committing files directly to the repo.
 *
 * Used by the lookbook admin to persist data/looks.json and uploaded images
 * to GitHub so they survive Hostinger git deploys. This mirrors how Keystatic
 * persists blog content.
 *
 * Flow (Git Data API for atomic multi-file commits):
 * 1. GET  /git/ref/heads/main         → current commit SHA
 * 2. GET  /git/commits/:sha           → current tree SHA
 * 3. POST /git/blobs                  → create blob for each file
 * 4. POST /git/trees                  → create tree with new/deleted blobs
 * 5. POST /git/commits                → create commit pointing to new tree
 * 6. PATCH /git/refs/heads/main       → fast-forward branch ref
 *
 * Required env var: GITHUB_PAT (fine-grained PAT with Contents: Read+Write)
 * If not set, all operations silently no-op (local dev).
 */

const OWNER = "thecopperfern";
const REPO = "mamafern";
const BRANCH = "main";

interface GitHubFile {
  path: string;
  /** String content (UTF-8) or Buffer (binary, e.g. images) */
  content: string | Buffer;
}

interface GitHubDeleteFile {
  path: string;
  deleted: true;
}

type FileOperation = GitHubFile | GitHubDeleteFile;

function isDelete(op: FileOperation): op is GitHubDeleteFile {
  return "deleted" in op && op.deleted === true;
}

function getToken(): string | null {
  return process.env.GITHUB_PAT?.trim() || null;
}

async function ghFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }

  return res;
}

/**
 * Commits one or more file changes (creates/updates/deletes) to GitHub
 * in a single atomic commit.
 *
 * @param files - Array of file operations. Each is either:
 *   - { path, content } to create/update a file
 *   - { path, deleted: true } to delete a file
 * @param message - Commit message
 * @returns true if committed successfully, false if skipped (no PAT)
 */
export async function commitToGitHub(
  files: FileOperation[],
  message: string
): Promise<boolean> {
  const token = getToken();
  if (!token) {
    console.log("[github-commit] No GITHUB_PAT set, skipping commit");
    return false;
  }

  if (files.length === 0) return false;

  // 1. Get current commit SHA for the branch
  const refRes = await ghFetch(`/git/ref/heads/${BRANCH}`, token);
  const refData = await refRes.json();
  const currentCommitSha: string = refData.object.sha;

  // 2. Get the tree SHA from the current commit
  const commitRes = await ghFetch(`/git/commits/${currentCommitSha}`, token);
  const commitData = await commitRes.json();
  const baseTreeSha: string = commitData.tree.sha;

  // 3. Create blobs for each file (skip deleted files)
  const treeItems: Array<{
    path: string;
    mode: string;
    type: string;
    sha: string | null;
  }> = [];

  for (const file of files) {
    if (isDelete(file)) {
      // To delete a file, set sha to null in the tree
      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: null,
      });
    } else {
      // Create a blob — binary files use base64 encoding
      const isBinary = Buffer.isBuffer(file.content);
      const blobRes = await ghFetch("/git/blobs", token, {
        method: "POST",
        body: JSON.stringify({
          content: isBinary
            ? (file.content as Buffer).toString("base64")
            : file.content,
          encoding: isBinary ? "base64" : "utf-8",
        }),
      });
      const blobData = await blobRes.json();

      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobData.sha,
      });
    }
  }

  // 4. Create a new tree with the changes
  const treeRes = await ghFetch("/git/trees", token, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });
  const treeData = await treeRes.json();

  // 5. Create a new commit
  const newCommitRes = await ghFetch("/git/commits", token, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [currentCommitSha],
    }),
  });
  const newCommitData = await newCommitRes.json();

  // 6. Update the branch reference
  await ghFetch(`/git/refs/heads/${BRANCH}`, token, {
    method: "PATCH",
    body: JSON.stringify({
      sha: newCommitData.sha,
    }),
  });

  console.log(`[github-commit] Committed ${files.length} file(s): ${message}`);
  return true;
}
