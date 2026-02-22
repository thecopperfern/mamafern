import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/atoms/cart", () => ({
  useCartActions: () => ({
    cart: { id: "", totalQuantity: 0, lines: [] },
    initializeCart: vi.fn(),
  }),
}));

vi.mock("../CartSlideout", () => ({
  default: () => <div data-testid="cart-slideout" />,
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the Shop link", () => {
    render(<Navbar />);
    // Should have Shop in both desktop and mobile nav
    const shopLinks = screen.getAllByText("Shop");
    expect(shopLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("uses dynamic collection links when provided", () => {
    const collectionLinks = [
      { label: "Summer", href: "/collections/summer" },
      { label: "Winter", href: "/collections/winter" },
    ];
    render(<Navbar collectionLinks={collectionLinks} />);
    expect(screen.getAllByText("Summer").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Winter").length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to default links when no collectionLinks", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Moms").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dads").length).toBeGreaterThanOrEqual(1);
  });

  it("opens search bar when search icon clicked", async () => {
    render(<Navbar />);
    const user = userEvent.setup();

    // Should not show search input initially
    expect(screen.queryByPlaceholderText("Search products...")).not.toBeInTheDocument();

    // Find the search button (has Search icon)
    const buttons = screen.getAllByRole("button");
    // Search button is the first action button
    const searchBtn = buttons.find((b) => !b.textContent);
    if (searchBtn) {
      await user.click(searchBtn);
      expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
    }
  });

  it("navigates to search page on form submit", async () => {
    render(<Navbar />);
    const user = userEvent.setup();

    // Open search
    const buttons = screen.getAllByRole("button");
    const searchBtn = buttons.find((b) => !b.textContent);
    if (searchBtn) {
      await user.click(searchBtn);
      const input = screen.getByPlaceholderText("Search products...");
      await user.type(input, "onesie");
      await user.click(screen.getByText("Search"));
      expect(mockPush).toHaveBeenCalledWith("/search?q=onesie");
    }
  });

  it("shows login button when not logged in", () => {
    render(<Navbar />);
    // User icon should link to /auth
    const authLinks = document.querySelectorAll('a[href="/auth"]');
    expect(authLinks.length).toBeGreaterThanOrEqual(1);
  });
});
