import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockReplace = vi.fn();
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

import { useAuthRedirect } from "./useAuthRedirect";

describe("useAuthRedirect", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    // Clear cookies
    document.cookie =
      "customerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  afterEach(() => {
    document.cookie =
      "customerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("redirects to /auth when no token and requireAuth is true", () => {
    renderHook(() => useAuthRedirect());
    expect(mockReplace).toHaveBeenCalledWith("/auth");
  });

  it("does not redirect when requireAuth is false", () => {
    renderHook(() => useAuthRedirect({ requireAuth: false }));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("returns token when cookie exists", () => {
    document.cookie = "customerAccessToken=test-token-123; path=/";
    const { result } = renderHook(() => useAuthRedirect());
    expect(result.current.token).toBe("test-token-123");
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("returns null token when no cookie", () => {
    const { result } = renderHook(() =>
      useAuthRedirect({ requireAuth: false })
    );
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("redirects to custom path when specified", () => {
    renderHook(() => useAuthRedirect({ redirectTo: "/login" }));
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("clears cookie on handleAuthError", () => {
    document.cookie = "customerAccessToken=test-token; path=/";
    const { result } = renderHook(() =>
      useAuthRedirect({ requireAuth: false })
    );

    act(() => {
      result.current.handleAuthError();
    });

    expect(mockReplace).toHaveBeenCalledWith("/auth");
    expect(document.cookie).not.toContain("customerAccessToken=test-token");
  });

  it("isLoading is false after mount", () => {
    const { result } = renderHook(() =>
      useAuthRedirect({ requireAuth: false })
    );
    expect(result.current.isLoading).toBe(false);
  });
});
