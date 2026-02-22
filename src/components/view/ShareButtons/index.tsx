"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check } from "lucide-react";

export default function ShareButtons({
  title,
  handle,
}: {
  title: string;
  handle: string;
}) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${handle}`
      : `/product/${handle}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or not supported — fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-warm-brown/60">Share:</span>
      <Button
        size="sm"
        variant="outline"
        onClick={handleShare}
        className="h-8 px-2 text-xs"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={shareToTwitter}
        className="h-8 px-2 text-xs"
      >
        𝕏
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={shareToFacebook}
        className="h-8 px-2 text-xs"
      >
        FB
      </Button>
    </div>
  );
}
