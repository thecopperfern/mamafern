"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareLookProps {
  lookId: string;
  lookTitle: string;
}

/**
 * Share buttons for a look: Copy link, Pinterest, native Web Share API.
 * Generates a shareable URL with ?look= query param.
 */
export default function ShareLook({ lookId, lookTitle }: ShareLookProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/lookbook?look=${lookId}`
      : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }
    try {
      await navigator.share({
        title: `${lookTitle} — Mama Fern`,
        text: `Check out the "${lookTitle}" look from Mama Fern!`,
        url: shareUrl,
      });
    } catch {
      // User cancelled share — not an error
    }
  };

  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(`${lookTitle} — Mama Fern`)}`;

  return (
    <div
      className="flex items-center justify-center gap-3 pt-2"
      data-testid="share-look"
    >
      <span className="text-xs text-warm-brown/60">Share this look:</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className="gap-1.5 text-warm-brown hover:text-fern"
        aria-label="Copy link to this look"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
        {copied ? "Copied" : "Copy Link"}
      </Button>

      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-warm-brown hover:text-fern transition-colors"
        aria-label="Share on Pinterest"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      </a>

      {"share" in navigator && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="gap-1.5 text-warm-brown hover:text-fern"
          aria-label="Share this look"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      )}
    </div>
  );
}
