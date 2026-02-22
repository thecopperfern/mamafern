import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionContent from "./index";
import { mockProduct, mockProduct2 } from "@/__tests__/fixtures";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

vi.mock("@/components/view/WishlistButton", () => ({
  default: () => <button>wishlist</button>,
}));

const defaultPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  endCursor: null,
};

describe("CollectionContent", () => {
  it("renders product cards", () => {
    render(
      <CollectionContent
        products={[mockProduct, mockProduct2]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    expect(screen.getByText("Organic Cotton Onesie")).toBeInTheDocument();
    expect(screen.getByText("Fern Print Tee")).toBeInTheDocument();
  });

  it("renders sort dropdown", () => {
    render(
      <CollectionContent
        products={[]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    expect(screen.getByText("Sort by:")).toBeInTheDocument();
  });

  it("renders Filters button", () => {
    render(
      <CollectionContent
        products={[mockProduct]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("shows filter panel when Filters clicked", async () => {
    render(
      <CollectionContent
        products={[mockProduct]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Filters"));
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("shows price filter options", async () => {
    render(
      <CollectionContent
        products={[mockProduct]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Filters"));
    expect(screen.getByText("Under $25")).toBeInTheDocument();
    expect(screen.getByText("$25 - $50")).toBeInTheDocument();
  });

  it("filters products by price", async () => {
    render(
      <CollectionContent
        products={[mockProduct]} // price is 24.99
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Filters"));
    // Click "$25 - $50" — product is 24.99 so it should be filtered out
    await user.click(screen.getByText("$25 - $50"));
    expect(
      screen.getByText("No products match your filters.")
    ).toBeInTheDocument();
  });

  it("shows size filter options when products have sizes", async () => {
    render(
      <CollectionContent
        products={[mockProduct]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Filters"));
    expect(screen.getByText("Size")).toBeInTheDocument();
  });

  it("shows empty state when no products", () => {
    render(
      <CollectionContent
        products={[]}
        pageInfo={defaultPageInfo}
        handle="kids"
        currentSort="default"
      />
    );
    expect(
      screen.getByText("No products found in this collection.")
    ).toBeInTheDocument();
  });

  it("renders Next Page button when hasNextPage", () => {
    render(
      <CollectionContent
        products={[mockProduct]}
        pageInfo={{ hasNextPage: true, hasPreviousPage: false, endCursor: "abc" }}
        handle="kids"
        currentSort="default"
      />
    );
    expect(screen.getByText("Next Page")).toBeInTheDocument();
  });
});
