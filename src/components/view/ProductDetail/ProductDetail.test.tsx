import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductDetail from "./index";
import { mockProduct } from "@/__tests__/fixtures";

vi.mock("@/lib/atoms/cart", () => ({
  useCartActions: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/view/ProductCarousel", () => ({
  default: ({ images }: { images: unknown[] }) => (
    <div data-testid="product-carousel">{images.length} images</div>
  ),
}));

vi.mock("@/components/view/WishlistButton", () => ({
  default: () => <button data-testid="wishlist-btn">wishlist</button>,
}));

vi.mock("@/components/view/Analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/components/view/ProductReviews", () => ({
  default: () => <div data-testid="product-reviews">Reviews</div>,
}));

describe("ProductDetail", () => {
  it("renders product title", () => {
    render(<ProductDetail product={mockProduct} />);
    // Title may appear multiple times (main heading + sticky ATC bar)
    const titles = screen.getAllByText("Organic Cotton Onesie");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders product description", () => {
    render(<ProductDetail product={mockProduct} />);
    expect(
      screen.getByText("Soft organic cotton onesie for your little one.")
    ).toBeInTheDocument();
  });

  it("renders Add to Cart button (disabled by default)", () => {
    render(<ProductDetail product={mockProduct} />);
    const btns = screen.getAllByText("Add to Cart");
    // At least one Add to Cart button should be disabled
    expect(btns.some((btn) => btn.hasAttribute("disabled") || (btn as HTMLButtonElement).disabled)).toBe(true);
  });

  it("renders share buttons", () => {
    render(<ProductDetail product={mockProduct} />);
    expect(screen.getByText("Share:")).toBeInTheDocument();
  });

  it("renders product options", () => {
    render(<ProductDetail product={mockProduct} />);
    // Should show option names
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });
});
