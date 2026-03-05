import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/quiz/submit
 *
 * Saves quiz result email to Brevo with quiz-specific attributes.
 * Creates or updates contact with QUIZ_RESULT and QUIZ_NAME attributes.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, quizName, resultTag, resultTitle, listId } = await request.json();

    if (!email || !quizName) {
      return NextResponse.json(
        { error: "Email and quizName are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body: Record<string, unknown> = {
      email,
      attributes: {
        QUIZ_NAME: quizName,
        QUIZ_RESULT: resultTag || "",
        QUIZ_RESULT_TITLE: resultTitle || "",
      },
      updateEnabled: true,
    };

    // Add to specific list if provided
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

    if (!res.ok && res.status !== 204) {
      const errorData = await res.json().catch(() => ({}));
      // 409 = contact already exists, which is fine (updateEnabled handles it)
      if (res.status !== 409) {
        console.warn("Brevo API error:", res.status, errorData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to save quiz result" },
      { status: 500 }
    );
  }
}
