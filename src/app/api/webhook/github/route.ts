import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * GitHub Webhook: Syncs blog content from the "Blog" branch without a full rebuild.
 *
 * When Keystatic commits to the "Blog" branch via GitHub App, this webhook
 * pulls only the blog content files (content/blog/ and public/images/blog/)
 * into the running server's working directory. Since blog pages use
 * force-dynamic, the updated content appears immediately.
 *
 * Setup (GitHub repo Settings → Webhooks → Add webhook):
 *   URL: https://mamafern.com/api/webhook/github
 *   Content type: application/json
 *   Secret: same as GITHUB_WEBHOOK_SECRET env var
 *   Events: Push only
 *
 * Security: HMAC-SHA256 signature verification via X-Hub-Signature-256 header.
 */

async function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const digest =
    "sha256=" +
    Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return signature === digest;
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Webhook] GITHUB_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  // Read raw body for signature verification
  const payload = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  const valid = await verifySignature(payload, signature, secret);
  if (!valid) {
    console.warn("[Webhook] Invalid signature — rejecting request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse the push event
  let body: { ref?: string };
  try {
    body = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only process pushes to the Blog branch
  const branch = body.ref?.replace("refs/heads/", "");
  if (branch !== "Blog") {
    return NextResponse.json({
      message: `Ignored push to ${branch}`,
      synced: false,
    });
  }

  // Pull only blog content files from the Blog branch
  try {
    console.log("[Webhook] Syncing blog content from Blog branch...");
    await execAsync("git fetch origin Blog");
    await execAsync(
      "git checkout origin/Blog -- content/blog/ public/images/blog/"
    );
    console.log("[Webhook] Blog content synced successfully");

    return NextResponse.json({
      message: "Blog content synced from Blog branch",
      synced: true,
    });
  } catch (err) {
    console.error("[Webhook] Git sync failed:", err);
    return NextResponse.json(
      { error: "Git sync failed" },
      { status: 500 }
    );
  }
}
