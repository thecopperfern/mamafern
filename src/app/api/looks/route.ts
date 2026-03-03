import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { LooksData } from "@/types/looks";
import { migrateLooksData, isLookPublished } from "@/lib/looks-migration";

const LOOKS_PATH = path.join(process.cwd(), "data", "looks.json");

export async function GET(request: NextRequest) {
  try {
    const raw = fs.readFileSync(LOOKS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    const data = migrateLooksData(parsed);

    // If ?published=true, filter to only visible looks
    const publishedOnly =
      request.nextUrl.searchParams.get("published") === "true";

    if (publishedOnly) {
      return NextResponse.json({
        ...data,
        looks: data.looks
          .filter(isLookPublished)
          .sort((a, b) => a.order - b.order),
      });
    }

    // Admin: return all, sorted by order
    return NextResponse.json({
      ...data,
      looks: data.looks.sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json(
      { version: 2, looks: [] } satisfies LooksData,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const adminPass = (
    process.env.LOOK_ADMIN_PASS || process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS
  )?.trim();
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
    // Ensure order is set and sorted
    const sorted: LooksData = {
      ...body,
      version: 2,
      looks: body.looks
        .map((look, i) => ({ ...look, order: look.order ?? i }))
        .sort((a, b) => a.order - b.order),
    };
    fs.writeFileSync(LOOKS_PATH, JSON.stringify(sorted, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
