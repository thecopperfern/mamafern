"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Keystatic CMS Login Page
 *
 * A simple branded password gate for the marketing team.
 * On success, the API sets a 30-day HttpOnly cookie and redirects
 * the user to wherever they were trying to go (default: /keystatic).
 */
export default function KeystaticLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/keystatic";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/keystatic-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
      } else {
        setError("Incorrect password. Try again.");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-charcoal tracking-wide">
            Mama Fern
          </p>
          <p className="text-sm text-warm-brown mt-1 font-body">
            Content Studio
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-oat p-8">
          <h1 className="font-display text-xl text-charcoal mb-6">
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter the CMS password"
                className="w-full px-4 py-2.5 rounded-lg border border-oat bg-cream text-charcoal placeholder:text-warm-brown/50 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-fern hover:bg-fern/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-warm-brown/60 mt-6">
          Need access? Contact the site admin.
        </p>
      </div>
    </main>
  );
}
