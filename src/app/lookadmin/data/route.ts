import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    const expectedToken = process.env.LOOK_ADMIN_PASS;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const dir = path.dirname(LOOKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(LOOKS_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Looks API] Error writing looks.json:", error);
    return NextResponse.json(
      { error: "Failed to save looks data" },
      { status: 500 }
    );
  }
}
