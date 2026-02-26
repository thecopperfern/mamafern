"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";

type Props = {
  productTitle: string;
  variantTitle?: string;
};

export default function NotifyMe({ productTitle, variantTitle }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          backInStock: true,
          productTitle,
          variantTitle,
        }),
      });
      setSubmitted(true);
      toast.success("We'll let you know when it's back!");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-fern">
        <Bell className="h-4 w-4 shrink-0" />
        <span>We&apos;ll notify you when this is back in stock.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-terracotta">Out of stock</p>
      <p className="text-xs text-warm-brown/70">
        Enter your email and we&apos;ll notify you when it&apos;s available.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-9 text-sm"
        />
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          variant="outline"
          className="h-9 border-fern text-fern hover:bg-fern/10 shrink-0"
        >
          <Bell className="h-3.5 w-3.5 mr-1.5" />
          {loading ? "..." : "Notify Me"}
        </Button>
      </form>
    </div>
  );
}
