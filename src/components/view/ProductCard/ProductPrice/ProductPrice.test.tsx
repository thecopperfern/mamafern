import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPrice from "./index";

describe("ProductPrice", () => {
  it("renders single price when min equals max", () => {
    render(
      <ProductPrice
        priceRange={{
          minVariantPrice: { amount: "24.99", currencyCode: "USD" },
          maxVariantPrice: { amount: "24.99", currencyCode: "USD" },
        }}
      />
    );
    const prices = screen.getAllByText(/24\.99/);
    expect(prices).toHaveLength(1);
  });

  it("renders price range when min differs from max", () => {
    render(
      <ProductPrice
        priceRange={{
          minVariantPrice: { amount: "19.99", currencyCode: "USD" },
          maxVariantPrice: { amount: "39.99", currencyCode: "USD" },
        }}
      />
    );
    expect(screen.getByText(/19\.99/)).toBeInTheDocument();
    expect(screen.getByText(/39\.99/)).toBeInTheDocument();
  });
});
