import { describe, it, expect } from "vitest";
import { formatPrice, formatPriceWithLocale } from "./currency";

describe("formatPrice", () => {
  it("formats USD amounts", () => {
    const result = formatPrice("24.99", "USD");
    expect(result).toContain("24.99");
  });

  it("formats zero amounts", () => {
    const result = formatPrice("0.00", "USD");
    expect(result).toContain("0.00");
  });

  it("handles large amounts", () => {
    const result = formatPrice("1299.99", "USD");
    expect(result).toContain("1,299.99");
  });
});

describe("formatPriceWithLocale", () => {
  it("formats with explicit US locale", () => {
    const result = formatPriceWithLocale("24.99", "USD", "en-US");
    expect(result).toBe("$24.99");
  });

  it("formats EUR with German locale", () => {
    const result = formatPriceWithLocale("24.99", "EUR", "de-DE");
    // German locale uses comma as decimal separator
    expect(result).toContain("24,99");
  });

  it("formats GBP with UK locale", () => {
    const result = formatPriceWithLocale("50.00", "GBP", "en-GB");
    expect(result).toContain("50.00");
    expect(result).toContain("£");
  });
});
