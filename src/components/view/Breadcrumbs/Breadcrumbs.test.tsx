import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumbs from "./index";

describe("Breadcrumbs", () => {
  it("renders Home link", () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("renders intermediate links", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: "Kids Collection" },
        ]}
      />
    );
    const shopLink = screen.getByText("Shop");
    expect(shopLink.closest("a")).toHaveAttribute("href", "/shop");
  });

  it("renders last item as text (not link)", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: "Organic Onesie" },
        ]}
      />
    );
    const lastItem = screen.getByText("Organic Onesie");
    expect(lastItem.closest("a")).toBeNull();
    expect(lastItem.tagName).toBe("SPAN");
  });

  it("renders multiple breadcrumb items", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: "Kids", href: "/collections/kids" },
          { label: "Onesie" },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Kids")).toBeInTheDocument();
    expect(screen.getByText("Onesie")).toBeInTheDocument();
  });
});
