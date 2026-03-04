import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminPass } from "../get-admin-pass";
import { commitToGitHub } from "@/lib/github-commit";

const LOOKS_FILE = path.join(process.cwd(), "data", "looks.json");

export async function GET() {
  try {
    const data = fs.readFileSync(LOOKS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("[Looks API] Error reading looks.json:", error);
    return NextResponse.json({ looks: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const expectedToken = getAdminPass();

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const dir = path.dirname(LOOKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const jsonContent = JSON.stringify(body, null, 2);
    fs.writeFileSync(LOOKS_FILE, jsonContent, "utf-8");

    // Commit to GitHub for persistence across deploys (fire-and-forget)
    commitToGitHub(
      [{ path: "data/looks.json", content: jsonContent }],
      "Update lookbook data"
    ).catch((err) => console.warn("[lookadmin] GitHub commit failed (non-critical):", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Looks API] Error writing looks.json:", error);
    return NextResponse.json(
      { error: "Failed to save looks data" },
      { status: 500 }
    );
  }
}
