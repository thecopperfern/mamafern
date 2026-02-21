import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WishlistButton from "./index";

vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}));

vi.mock("@/lib/atoms/wishlist", () => ({
  useWishlist: () => ({
    initialize: vi.fn(),
    toggleItem: vi.fn().mockReturnValue(true),
    isWishlisted: vi.fn().mockReturnValue(false),
  }),
}));

describe("WishlistButton", () => {
  it("renders heart button with aria-label", () => {
    render(<WishlistButton handle="test" title="Test" />);
    expect(screen.getByLabelText("Add to wishlist")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<WishlistButton handle="test" title="Test" />);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });
});
