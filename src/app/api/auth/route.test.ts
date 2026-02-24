import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, DELETE } from "@/app/api/auth/route";

describe("Auth API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST - Set auth cookie", () => {
    it("sets httpOnly cookie with access token", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: "test-customer-token-123",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(response.status).toBe(200);

      // Check that the cookie was set
      const setCookieHeader = response.headers.get("set-cookie");
      expect(setCookieHeader).toContain("customerAccessToken=test-customer-token-123");
      expect(setCookieHeader).toContain("HttpOnly");
      expect(setCookieHeader).toContain("Path=/");
    });

    it("sets cookie with custom expiry from expiresAt", async () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 1 day
      const req = new NextRequest("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: "token-with-expiry",
          expiresAt: futureDate,
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.success).toBe(true);
      const setCookieHeader = response.headers.get("set-cookie");
      expect(setCookieHeader).toContain("customerAccessToken=token-with-expiry");
    });

    it("returns 400 when accessToken is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid JSON body", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE - Clear auth cookie", () => {
    it("clears the auth cookie", async () => {
      const response = await DELETE();
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(response.status).toBe(200);

      const setCookieHeader = response.headers.get("set-cookie");
      expect(setCookieHeader).toContain("customerAccessToken=");
      expect(setCookieHeader).toContain("Max-Age=0");
    });
  });
});
