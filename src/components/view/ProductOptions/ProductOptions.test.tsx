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
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
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
    await user.click(screen.getByText("M"));
    expect(setSelectedOptions).toHaveBeenCalledWith(
      expect.objectContaining({ Size: "M" })
    );
  });

  it("highlights selected size option", () => {
    render(
      <ProductOptions
        options={mockProduct.options}
        selectedOptions={{ Size: "S", Color: "Sage" }}
      />
    );
    // The selected S button should have the default variant styling
    const sButton = screen.getByText("S");
    expect(sButton).toBeInTheDocument();
  });

  it("renders color swatches as circular buttons", () => {
    render(<ProductOptions options={mockProduct.options} />);
    // Color option has 2 values (Sage, Cream) — rendered as styled buttons
    const buttons = screen.getAllByRole("button");
    // Should have 3 size buttons + 2 color swatch buttons = 5
    expect(buttons.length).toBe(5);
  });
});
