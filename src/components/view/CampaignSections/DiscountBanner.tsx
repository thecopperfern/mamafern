"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Tag } from "lucide-react";
import { toast } from "sonner";

/**
 * DiscountBanner — Displays a discount code with copy-to-clipboard
 * and optional countdown timer for campaign end dates.
 *
 * Used on campaign pages when a discount code is configured.
 * Styled with fern/terracotta brand colors.
 */
export default function DiscountBanner({
  code,
  description,
  endDate,
}: {
  code: string;
  description?: string;
  endDate?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) return;

    const updateCountdown = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Discount code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try selecting the code manually");
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="bg-gradient-to-r from-fern/10 to-terracotta/10 border border-fern/20 rounded-xl p-6 text-center">
        <Tag className="h-6 w-6 text-fern mx-auto mb-3" aria-hidden="true" />
        {description && (
          <p className="text-sm text-charcoal/80 mb-2">{description}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <span
            className="font-display font-bold text-2xl text-charcoal tracking-wider bg-white/70 px-5 py-2 rounded-lg border border-dashed border-fern/40 select-all"
            aria-label={`Discount code: ${code}`}
          >
            {code}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-fern text-white hover:bg-fern-dark transition-colors"
            aria-label={copied ? "Copied!" : "Copy discount code"}
          >
            {copied ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Copy className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {timeLeft && (
          <p className="text-xs text-terracotta font-medium mt-3">
            {timeLeft}
          </p>
        )}
      </div>
    </section>
  );
}
