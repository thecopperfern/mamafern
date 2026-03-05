"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * QuizEmailGate — Email capture screen shown before results
 *
 * Collects email, submits to /api/quiz/submit with quiz attributes,
 * then calls onComplete to reveal results.
 */
export default function QuizEmailGate({
  heading,
  subtext,
  quizName,
  resultTag,
  resultTitle,
  listId,
  onComplete,
}: {
  heading: string;
  subtext?: string;
  quizName: string;
  resultTag: string;
  resultTitle: string;
  listId?: string;
  onComplete: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          quizName,
          resultTag,
          resultTitle,
          listId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="text-center max-w-md mx-auto py-12">
      <h2 className="font-display font-bold text-2xl text-charcoal mb-2">
        {heading}
      </h2>
      {subtext && (
        <p className="text-sm text-charcoal/70 mb-6">{subtext}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-oat rounded-lg px-4 py-3 text-sm bg-white text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern"
          aria-label="Email address"
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-fern hover:bg-fern-dark text-white"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Submitting..." />
          ) : (
            "See My Results"
          )}
        </Button>
      </form>
      <button
        type="button"
        onClick={onComplete}
        className="mt-3 text-xs text-charcoal/50 hover:text-charcoal/70 underline"
      >
        Skip for now
      </button>
    </div>
  );
}
