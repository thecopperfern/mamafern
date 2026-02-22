"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

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
      setMessage("Thanks for subscribing!");
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessage(msg);
      toast.error(msg);
    }
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
        Stay in the Loop
      </h4>
      <p className="text-sm text-white/60 mb-3">
        Get deals, new arrivals, and family inspo straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
          className="h-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-9 bg-fern hover:bg-fern-dark text-white text-sm px-4 shrink-0"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </form>
      {message && (
        <p
          className={`text-xs mt-2 ${
            status === "error" ? "text-terracotta" : "text-fern-light"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
