import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductReviews from "./index";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ProductReviews", () => {
  it("renders Customer Reviews heading", () => {
    render(<ProductReviews productHandle="test-product" />);
    expect(screen.getByText("Customer Reviews")).toBeInTheDocument();
  });

  it("renders Write a Review button", () => {
    render(<ProductReviews productHandle="test-product" />);
    expect(screen.getByText("Write a Review")).toBeInTheDocument();
  });

  it("shows empty state when no reviews", () => {
    render(<ProductReviews productHandle="test-product" />);
    expect(
      screen.getByText("No reviews yet. Be the first to review this product!")
    ).toBeInTheDocument();
  });

  it("shows review form when Write a Review clicked", async () => {
    render(<ProductReviews productHandle="test-product" />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Write a Review"));
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Share your thoughts...")
    ).toBeInTheDocument();
  });

  it("renders 5 stars in the form", async () => {
    render(<ProductReviews productHandle="test-product" />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Write a Review"));
    // Each star is an SVG, and there are 5 in the rating selector
    const stars = document.querySelectorAll("svg.lucide-star");
    expect(stars.length).toBe(5);
  });

  it("has a Submit Review button", async () => {
    render(<ProductReviews productHandle="test-product" />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Write a Review"));
    expect(screen.getByText("Submit Review")).toBeInTheDocument();
  });
});
