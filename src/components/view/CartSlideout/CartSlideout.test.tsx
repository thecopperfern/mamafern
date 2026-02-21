import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartSlideout from "./index";
import { mockCart, mockEmptyCart } from "@/__tests__/fixtures";

vi.mock("next/image", () => ({
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

const mockUpdateItem = vi.fn();
const mockRemoveItem = vi.fn();
const mockApplyDiscount = vi.fn();
const mockRemoveDiscount = vi.fn();

let currentCart = mockEmptyCart;

vi.mock("@/lib/atoms/cart", () => ({
  useCartActions: () => ({
    cart: currentCart,
    updateItem: mockUpdateItem,
    removeItem: mockRemoveItem,
    applyDiscount: mockApplyDiscount,
    removeDiscount: mockRemoveDiscount,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("CartSlideout", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <CartSlideout open={false} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows empty cart message when no items", () => {
    currentCart = mockEmptyCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("shows Continue Shopping button when empty", () => {
    currentCart = mockEmptyCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
  });

  it("shows cart items when cart has lines", () => {
    currentCart = mockCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Organic Cotton Onesie")).toBeInTheDocument();
  });

  it("shows Checkout button when cart has items", () => {
    currentCart = mockCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("checkout links to checkoutUrl", () => {
    currentCart = mockCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    const checkoutLink = screen.getByText("Checkout").closest("a");
    expect(checkoutLink).toHaveAttribute("href", mockCart.checkoutUrl);
  });

  it("shows promo code toggle", () => {
    currentCart = mockCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Have a promo code?")).toBeInTheDocument();
  });

  it("shows quantity controls", () => {
    currentCart = mockCart;
    render(<CartSlideout open={true} onClose={vi.fn()} />);
    expect(screen.getByText("2")).toBeInTheDocument(); // quantity
  });
});
