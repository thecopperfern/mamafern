"use client";

import { useState } from "react";
import { toast } from "sonner";

/**
 * Blog-specific newsletter call-to-action.
 * Styled for in-article placement with warm, brand-consistent design.
 * Reuses the /api/newsletter endpoint.
 */
export default function BlogNewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setStatus("idle");
    }
  }

  return (
    <div className="my-12 rounded-2xl bg-oat/60 border border-oat p-6 md:p-8 text-center">
      {status === "success" ? (
        <div>
          <h3 className="font-display font-bold text-xl text-charcoal mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-warm-brown text-sm">
            Thanks for subscribing. We&apos;ll send you the good stuff.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-display font-bold text-xl text-charcoal mb-2">
            Enjoyed this article?
          </h3>
          <p className="text-warm-brown text-sm mb-5 max-w-md mx-auto">
            Get more style guides and family tips delivered to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <label htmlFor="blog-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="blog-newsletter-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-oat bg-cream text-charcoal placeholder:text-warm-brown/50 text-sm focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-2.5 rounded-lg bg-fern text-white text-sm font-medium hover:bg-fern-dark transition-colors disabled:opacity-50 shrink-0"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
