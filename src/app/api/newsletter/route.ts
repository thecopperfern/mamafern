import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
const BREVO_BACK_IN_STOCK_LIST_ID = process.env.BREVO_BACK_IN_STOCK_LIST_ID;
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "hello@thecopperfern.com";
// Template ID 1 = "Newsletter Welcome — Mama Fern" created in Brevo
const WELCOME_TEMPLATE_ID = 1;

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

    // Send marketing welcome email to brand-new newsletter subscribers only.
    // 201 = new contact, 204 = existing contact updated → skip to avoid duplicates.
    // Back-in-stock signups get a different flow so skip those too.
    if (res.status === 201 && !backInStock) {
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: { name: "Mama Fern", email: BREVO_SENDER_EMAIL },
          to: [
            {
              email: email.trim(),
              name: firstName ? `${firstName}${lastName ? " " + lastName : ""}` : undefined,
            },
          ],
          templateId: WELCOME_TEMPLATE_ID,
        }),
      }).catch((err) =>
        console.error("[Newsletter Welcome Email Error]", err)
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
