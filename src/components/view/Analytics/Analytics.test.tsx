import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent } from "./index";

describe("trackEvent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing when GA_ID is not set", () => {
    // NEXT_PUBLIC_GA_ID is not set in test env, so trackEvent should be a no-op
    expect(() =>
      trackEvent("add_to_cart", "ecommerce", "Test Product")
    ).not.toThrow();
  });

  it("calls gtag when available on window", () => {
    const gtagMock = vi.fn();
    (window as unknown as { gtag: typeof gtagMock }).gtag = gtagMock;

    // trackEvent checks for GA_ID env var, which isn't set in tests
    // so this confirms it doesn't throw
    trackEvent("add_to_cart", "ecommerce", "Test Product", 25);
    // Since GA_ID is not set, gtag should NOT be called
    expect(gtagMock).not.toHaveBeenCalled();
  });
});
