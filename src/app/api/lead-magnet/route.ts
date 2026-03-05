import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/lead-magnet
 *
 * Validates email, adds to Brevo with lead magnet tag,
 * and returns the download URL.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, leadMagnetTitle, listId, downloadUrl } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!downloadUrl) {
      return NextResponse.json({ error: "Download URL is required" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not configured");
      // Still return download URL — don't block the user
      return NextResponse.json({ success: true, downloadUrl });
    }

    const body: Record<string, unknown> = {
      email,
      attributes: {
        LEAD_MAGNET: leadMagnetTitle || "Unknown",
      },
      updateEnabled: true,
    };

    if (listId) {
      body.listIds = [parseInt(listId, 10)];
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok && res.status !== 204 && res.status !== 409) {
      const errorData = await res.json().catch(() => ({}));
      console.warn("Brevo API error:", res.status, errorData);
    }

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error) {
    console.error("Lead magnet submission error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
