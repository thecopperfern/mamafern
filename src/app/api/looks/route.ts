import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { LooksData } from "@/types/looks";

const LOOKS_PATH = path.join(process.cwd(), "data", "looks.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(LOOKS_PATH, "utf-8");
    const data: LooksData = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ looks: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminPass =
    (process.env.LOOK_ADMIN_PASS || process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS)?.trim();
  if (!adminPass) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${adminPass}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: LooksData = await request.json();
    fs.writeFileSync(LOOKS_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
