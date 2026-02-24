"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Read the customerAccessToken from cookies (client-side).
 * Works with both httpOnly cookies (via server route) and JS-set cookies.
 */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)customerAccessToken=([^;]*)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Clear the auth cookie and local storage, then redirect.
 */
function clearAuth() {
  document.cookie =
    "customerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem("cartId");
}

interface UseAuthRedirectOptions {
  /** If true, redirects unauthenticated users to /auth (default: true) */
  requireAuth?: boolean;
  /** Custom redirect path for unauthenticated users (default: "/auth") */
  redirectTo?: string;
}

interface UseAuthRedirectReturn {
  /** The customer access token, or null if not authenticated */
  token: string | null;
  /** Whether the auth state is still being determined */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Call this to log the user out */
  logout: () => void;
  /** Call this when you receive a 401/auth error from Shopify */
  handleAuthError: () => void;
}

/**
 * Centralized authentication hook.
 *
 * Usage:
 *   const { token, isLoading, isAuthenticated, logout } = useAuthRedirect();
 *   const { token } = useAuthRedirect({ requireAuth: false }); // Don't redirect
 */
export function useAuthRedirect(
  options: UseAuthRedirectOptions = {}
): UseAuthRedirectReturn {
  const { requireAuth = true, redirectTo = "/auth" } = options;
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = getTokenFromCookie();
    setToken(t);
    setIsLoading(false);

    if (requireAuth && !t) {
      router.replace(redirectTo);
    }
  }, [requireAuth, redirectTo, router]);

  const logout = useCallback(() => {
    clearAuth();
    router.push("/");
    // Force a full page reload to clear all client state
    window.location.href = "/";
  }, [router]);

  const handleAuthError = useCallback(() => {
    clearAuth();
    router.replace("/auth");
  }, [router]);

  return {
    token,
    isLoading,
    isAuthenticated: !!token,
    logout,
    handleAuthError,
  };
}
