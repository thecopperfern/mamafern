import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const envLocalPath = join(process.cwd(), ".env.local");
  const envLocalExists = existsSync(envLocalPath);
  let envLocalKeys: string[] = [];
  if (envLocalExists) {
    const content = readFileSync(envLocalPath, "utf-8");
    envLocalKeys = content
      .split("\n")
      .filter((l) => l.match(/^[A-Z_]+=.+$/))
      .map((l) => l.split("=")[0]);
  }

  return NextResponse.json({
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    envLocalExists,
    envLocalKeys,
    shopifyUrl: process.env.SHOPIFY_STORE_API_URL ? "SET" : "EMPTY",
    shopifyToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? "SET" : "EMPTY",
  });
}
