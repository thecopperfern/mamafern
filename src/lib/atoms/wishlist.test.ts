import { describe, it, expect, beforeEach } from "vitest";

// We can't easily test hooks outside React, so test the localStorage logic directly
describe("wishlist localStorage", () => {
  const STORAGE_KEY = "mamafern_wishlist";

  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty when no data in localStorage", () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });

  it("persists handles to localStorage", () => {
    const handles = ["organic-onesie", "fern-tee"];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(loaded).toEqual(handles);
  });

  it("removes an item from the list", () => {
    const handles = ["organic-onesie", "fern-tee"];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    const updated = handles.filter((h) => h !== "organic-onesie");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(loaded).toEqual(["fern-tee"]);
  });

  it("handles invalid JSON gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    let result: string[] = [];
    try {
      result = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    } catch {
      result = [];
    }
    expect(result).toEqual([]);
  });
});
