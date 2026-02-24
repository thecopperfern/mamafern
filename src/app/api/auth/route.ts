import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side auth token management.
 *
 * POST: Set the customerAccessToken as an httpOnly cookie
 * DELETE: Clear the customerAccessToken cookie
 *
 * This prevents XSS attacks from being able to steal the token
 * since JavaScript cannot read httpOnly cookies.
 */

export async function POST(req: NextRequest) {
  try {
    const { accessToken, expiresAt } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "accessToken is required" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Calculate maxAge from expiresAt, or default to 30 days
    let maxAge = 60 * 60 * 24 * 30; // 30 days
    if (expiresAt) {
      const expiresMs = new Date(expiresAt).getTime() - Date.now();
      if (expiresMs > 0) {
        maxAge = Math.floor(expiresMs / 1000);
      }
    }

    response.cookies.set("customerAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("customerAccessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
