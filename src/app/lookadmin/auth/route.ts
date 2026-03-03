import { NextResponse } from "next/server";
import { getAdminPass } from "../get-admin-pass";

/**
 * POST /lookadmin/auth
 *
 * Verifies the admin passphrase server-side using the LOOK_ADMIN_PASS env var.
 * This keeps the password out of the client bundle entirely — it lives only on
 * the server and takes effect immediately when changed (no rebuild required).
 *
 * Returns 200 on success, 401 on wrong password, 500 if env var is not set.
 */
export async function POST(req: Request) {
  try {
    const { passphrase } = await req.json();

    const expected = getAdminPass();

    if (!expected) {
      console.error("[LookAdmin Auth] Neither LOOK_ADMIN_PASS nor NEXT_PUBLIC_LOOK_ADMIN_PASS env var is set.");
      return NextResponse.json(
        { error: "Server misconfiguration — password env var not set" },
        { status: 500 }
      );
    }

    if (passphrase.trim() !== expected) {
      return NextResponse.json({ error: "Incorrect passphrase" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[LookAdmin Auth] Error processing request:", error);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
