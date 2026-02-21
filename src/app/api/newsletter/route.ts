import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.contacts.create({
        email,
        audienceId: RESEND_AUDIENCE_ID,
      });
      return NextResponse.json({ success: true });
    }

    // If no Resend config, log and return success
    // The newsletter component also creates a Shopify customer as a fallback
    console.log("[Newsletter Signup]", email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter Error]", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
