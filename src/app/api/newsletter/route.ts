import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
const BREVO_BACK_IN_STOCK_LIST_ID = process.env.BREVO_BACK_IN_STOCK_LIST_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      backInStock,
      productTitle,
      variantTitle,
    } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      console.log("[Newsletter Signup]", { email, backInStock, productTitle });
      return NextResponse.json({ success: true });
    }

    // Build list IDs — always add to main list, optionally to back-in-stock list
    const listIds: number[] = [];
    if (BREVO_LIST_ID) listIds.push(parseInt(BREVO_LIST_ID));
    if (backInStock && BREVO_BACK_IN_STOCK_LIST_ID) {
      listIds.push(parseInt(BREVO_BACK_IN_STOCK_LIST_ID));
    }

    // Build contact attributes
    const attributes: Record<string, string | boolean> = {};
    if (firstName) attributes.FIRSTNAME = firstName;
    if (lastName) attributes.LASTNAME = lastName;
    if (backInStock) attributes.BACK_IN_STOCK_REQUESTED = true;
    if (productTitle) attributes.BACK_IN_STOCK_PRODUCT = productTitle;
    if (variantTitle) attributes.BACK_IN_STOCK_VARIANT = variantTitle;

    const payload: Record<string, unknown> = {
      email: email.trim(),
      updateEnabled: true,
    };
    if (listIds.length > 0) payload.listIds = listIds;
    if (Object.keys(attributes).length > 0) payload.attributes = attributes;

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    // 201 = created, 204 = updated (both are success)
    if (res.status !== 201 && res.status !== 204) {
      const errorBody = await res.text();
      console.error("[Brevo Contacts Error]", res.status, errorBody);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter Error]", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
