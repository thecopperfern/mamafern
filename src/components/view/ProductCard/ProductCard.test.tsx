import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "./index";
import { mockProduct } from "@/__tests__/fixtures";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock("../WishlistButton", () => ({
  default: () => <button data-testid="wishlist-btn">wishlist</button>,
}));

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Organic Cotton Onesie")).toBeInTheDocument();
  });

  it("renders product image", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("Front view");
    expect(img).toBeInTheDocument();
  });

  it("renders 'No image' placeholder when no images", () => {
    const noImageProduct = { ...mockProduct, images: [], featuredImage: null };
    render(<ProductCard product={noImageProduct} />);
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("navigates to product page on click", async () => {
    render(<ProductCard product={mockProduct} />);
    const user = userEvent.setup();
    // The card container has role="button", the inner button is "Add to Cart"
    // Click the card container (first element with role button)
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith("/product/organic-onesie");
  });

  it("renders action button", () => {
    render(<ProductCard product={mockProduct} />);
    // Button text may be "Add to Cart" or "View Options" depending on variants
    const btns = screen.getAllByRole("button");
    const actionBtn = btns.find(
      (b) => b.textContent === "Add to Cart" || b.textContent === "View Options"
    );
    expect(actionBtn).toBeTruthy();
  });
});
