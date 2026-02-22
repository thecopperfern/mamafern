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
    expect(screen.getByText("Organic Cotton Onesie")).toBeInTheDocument();
  });

  it("renders product description", () => {
    render(<ProductDetail product={mockProduct} />);
    expect(
      screen.getByText("Soft organic cotton onesie for your little one.")
    ).toBeInTheDocument();
  });

  it("renders Add to Cart button (disabled by default)", () => {
    render(<ProductDetail product={mockProduct} />);
    const btn = screen.getByText("Add to Cart");
    expect(btn).toBeDisabled();
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
