import { describe, it, expect } from "vitest";
import { submitContactForm } from "./action";

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitContactForm", () => {
  it("returns success when all fields provided", async () => {
    const result = await submitContactForm(
      {},
      makeFormData({ name: "Jane", email: "jane@test.com", message: "Hello!" })
    );
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns error when name is missing", async () => {
    const result = await submitContactForm(
      {},
      makeFormData({ name: "", email: "jane@test.com", message: "Hello!" })
    );
    expect(result.error).toBe("All fields are required.");
    expect(result.success).toBeUndefined();
  });

  it("returns error when email is missing", async () => {
    const result = await submitContactForm(
      {},
      makeFormData({ name: "Jane", email: "", message: "Hello!" })
    );
    expect(result.error).toBe("All fields are required.");
  });

  it("returns error when message is missing", async () => {
    const result = await submitContactForm(
      {},
      makeFormData({ name: "Jane", email: "jane@test.com", message: "" })
    );
    expect(result.error).toBe("All fields are required.");
  });
});
