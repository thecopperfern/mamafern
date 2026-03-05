import { NextRequest, NextResponse } from "next/server";
import { createBasicDiscountCode } from "@/lib/commerce/shopify/admin";

/**
 * POST /api/admin/discount
 *
 * Protected endpoint for creating Shopify discount codes.
 * Requires the KEYSTATIC_PASSWORD header for authentication
 * (same password used for CMS access).
 */
export async function POST(request: NextRequest) {
  // Simple auth check — requires the CMS password
  const authHeader = request.headers.get("x-admin-password");
  const expectedPassword = process.env.KEYSTATIC_PASSWORD;

  if (!expectedPassword || authHeader !== expectedPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, type, value, startsAt, endsAt, title } = body;

    if (!code || !type || !value || !startsAt) {
      return NextResponse.json(
        { error: "Missing required fields: code, type, value, startsAt" },
        { status: 400 }
      );
    }

    if (type !== "percentage" && type !== "fixed") {
      return NextResponse.json(
        { error: "type must be 'percentage' or 'fixed'" },
        { status: 400 }
      );
    }

    const result = await createBasicDiscountCode({
      code,
      type,
      value: parseFloat(value),
      startsAt,
      endsAt,
      title,
    });

    return NextResponse.json({ success: true, discount: result });
  } catch (error) {
    console.error("Failed to create discount code:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
