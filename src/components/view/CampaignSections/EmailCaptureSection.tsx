"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * EmailCaptureSection — Standalone email capture for campaign pages
 *
 * Submits to the newsletter API to add the contact to Brevo.
 */
export default function EmailCaptureSection({
  heading,
  subtext,
  buttonText,
}: {
  heading: string;
  subtext?: string;
  buttonText?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      toast.success("You're in! Check your inbox.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h2 className="font-display font-bold text-2xl text-charcoal mb-2">
        {heading}
      </h2>
      {subtext && (
        <p className="text-charcoal/70 text-sm mb-6 max-w-md mx-auto">
          {subtext}
        </p>
      )}

      {success ? (
        <div className="flex items-center justify-center gap-2 text-fern font-medium">
          <Check className="h-5 w-5" aria-hidden="true" />
          <span>Welcome to the family!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-oat rounded-lg px-4 py-3 text-sm bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern"
            aria-label="Email address"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-fern hover:bg-fern-dark text-white shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-label="Submitting..." />
            ) : (
              buttonText || "Join"
            )}
          </Button>
        </form>
      )}
    </section>
  );
}
