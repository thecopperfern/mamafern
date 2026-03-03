"use client";

import { useState } from "react";
import Image from "next/image";

type AdminLoginProps = {
  onAuthenticated: () => void;
};

export default function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // POST to server-side API route so the password is never in the client bundle.
      // LOOK_ADMIN_PASS is a server-only env var — changes take effect without a rebuild.
      const res = await fetch("/lookadmin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });

      if (res.ok) {
        // Store both an auth flag and the passphrase so AdminContent can use
        // it as a Bearer token for subsequent API calls — without ever
        // putting NEXT_PUBLIC_LOOK_ADMIN_PASS in the client bundle.
        sessionStorage.setItem("lookadmin_auth", "true");
        sessionStorage.setItem("lookadmin_pass", passphrase);
        onAuthenticated();
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect passphrase");
      }
    } catch (err) {
      console.error("[AdminLogin] Auth request failed:", err);
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/mamafern_logo_transparent.png"
            alt="Mama Fern"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <h1 className="font-display text-xl text-charcoal text-center mb-6">
          Look Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-pass"
              className="block text-sm font-medium text-warm-brown mb-1.5"
            >
              Admin passphrase
            </label>
            <input
              id="admin-pass"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-brown/40 focus:border-fern focus:ring-1 focus:ring-fern outline-none"
              placeholder="Enter passphrase"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-fern text-white text-sm font-medium py-2.5 hover:bg-fern-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
