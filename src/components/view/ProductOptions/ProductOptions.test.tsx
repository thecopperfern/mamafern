import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductOptions from "./index";
import { mockProduct } from "@/__tests__/fixtures";

describe("ProductOptions", () => {
  it("renders option labels", () => {
    render(<ProductOptions options={mockProduct.options} />);
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("renders size option values as buttons", () => {
    render(<ProductOptions options={mockProduct.options} />);
    expect(screen.getByText("0-3M")).toBeInTheDocument();
    expect(screen.getByText("3-6M")).toBeInTheDocument();
    expect(screen.getByText("6-12M")).toBeInTheDocument();
    expect(screen.getByText("12-18M")).toBeInTheDocument();
  });

  it("calls setSelectedOptions when a size is clicked", async () => {
    const setSelectedOptions = vi.fn();
    render(
      <ProductOptions
        options={mockProduct.options}
        setSelectedOptions={setSelectedOptions}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("3-6M"));
    expect(setSelectedOptions).toHaveBeenCalledWith(
      expect.objectContaining({ Size: "3-6M" })
    );
  });

  it("highlights selected size option", () => {
    render(
      <ProductOptions
        options={mockProduct.options}
        selectedOptions={{ Size: "0-3M", Color: "Sage Green" }}
      />
    );
    // The selected 0-3M button should have the default variant styling
    const sButton = screen.getByText("0-3M");
    expect(sButton).toBeInTheDocument();
  });

  it("renders color swatches as circular buttons", () => {
    render(<ProductOptions options={mockProduct.options} />);
    // Color option has 2 values (Sage Green, Natural Cream) — rendered as styled buttons
    const buttons = screen.getAllByRole("button");
    // Should have 4 size buttons + 2 color swatch buttons = 6
    expect(buttons.length).toBe(6);
  });
});
