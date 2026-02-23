import { NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "hello@thecopperfern.com";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mamafern.com";

function buildWelcomeEmail(firstName: string): string {
  const greeting = firstName ? `Welcome, ${firstName}!` : "Welcome!";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Mama Fern</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#4A6741;padding:36px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:4px;color:#FAF7F2;font-weight:normal;">🌿 MAMA FERN 🌿</h1>
              <p style="margin:8px 0 0;font-size:11px;color:#A3B18A;letter-spacing:2px;text-transform:uppercase;">Natural family apparel</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 40px;text-align:center;">
              <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2C2C2C;font-weight:normal;">${greeting} 🌿</h2>
              <p style="margin:0 0 12px;font-size:15px;color:#555;line-height:1.7;">Your Mama Fern account is all set up and ready to go.</p>
              <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.7;">Browse our collections of soft, natural apparel made for the whole family — or head to your account to manage orders and preferences any time.</p>
              <a href="${SITE_URL}" style="display:inline-block;background-color:#4A6741;color:#FAF7F2;text-decoration:none;padding:14px 36px;border-radius:4px;font-size:14px;font-weight:600;letter-spacing:0.5px;">Shop the Collection</a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #F0EBE3;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#999;line-height:1.6;">
                © ${new Date().getFullYear()} Mama Fern · Made for families who keep it natural
              </p>
              <p style="margin:0;font-size:12px;color:#bbb;">
                <a href="${SITE_URL}" style="color:#4A6741;text-decoration:none;">mamafern.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
      console.log("[Welcome Email] No API key — skipping send for", email);
      return NextResponse.json({ success: true });
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Mama Fern", email: BREVO_SENDER_EMAIL },
        to: [{ email: email.trim(), name: firstName || undefined }],
        subject: "Welcome to Mama Fern 🌿",
        htmlContent: buildWelcomeEmail(firstName || ""),
      }),
    });

    if (!res.ok) {
      console.error("[Welcome Email Error]", res.status, await res.text());
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Welcome Email Error]", error);
    // Never fail the caller — welcome email is non-critical
    return NextResponse.json({ success: true });
  }
}
