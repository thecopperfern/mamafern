import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { commitToGitHub } from "@/lib/github-commit";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "looks");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function getAdminPass(): string | undefined {
  return (
    process.env.LOOK_ADMIN_PASS || process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS
  )?.trim();
}

function isAuthorized(request: NextRequest): boolean {
  const adminPass = getAdminPass();
  if (!adminPass) return false;
  return request.headers.get("Authorization") === `Bearer ${adminPass}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    ensureUploadDir();

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uuidv4()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    // Commit image to GitHub for persistence across deploys (fire-and-forget)
    commitToGitHub(
      [{ path: `public/uploads/looks/${filename}`, content: buffer }],
      `Upload lookbook image: ${filename}`
    ).catch((err) => console.warn("[upload] GitHub commit failed (non-critical):", err));

    return NextResponse.json({
      url: `/uploads/looks/${filename}`,
      filename,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await request.json();
    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "Filename required" },
        { status: 400 }
      );
    }

    // Prevent directory traversal
    const safeName = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, safeName);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete image from GitHub too (fire-and-forget)
    commitToGitHub(
      [{ path: `public/uploads/looks/${safeName}`, deleted: true }],
      `Delete lookbook image: ${safeName}`
    ).catch((err) => console.warn("[upload] GitHub delete commit failed (non-critical):", err));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
