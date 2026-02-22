import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButtons from "./index";

describe("ShareButtons", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders share label and buttons", () => {
    render(<ShareButtons title="Test Product" handle="test-product" />);
    expect(screen.getByText("Share:")).toBeInTheDocument();
    expect(screen.getByText("𝕏")).toBeInTheDocument();
    expect(screen.getByText("FB")).toBeInTheDocument();
  });

  it("renders a copy/share button", () => {
    render(<ShareButtons title="Test Product" handle="test-product" />);
    // The first button is the copy/share link button
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3); // copy, X, FB
  });

  it("opens Twitter share in new window", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<ShareButtons title="Test Product" handle="test-product" />);

    const user = userEvent.setup();
    await user.click(screen.getByText("𝕏"));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("x.com/intent/tweet"),
      "_blank",
      "noopener"
    );
  });

  it("opens Facebook share in new window", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<ShareButtons title="Test Product" handle="test-product" />);

    const user = userEvent.setup();
    await user.click(screen.getByText("FB"));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("facebook.com/sharer"),
      "_blank",
      "noopener"
    );
  });
});
