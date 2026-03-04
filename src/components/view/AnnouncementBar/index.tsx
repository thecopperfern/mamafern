"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * AnnouncementBar — dismissible top bar driven by the CMS announcementBar singleton.
 *
 * Rendered in layout.tsx above the Navbar. The server component reads the
 * singleton and only renders this component when `enabled` is true.
 * Dismiss state is stored in sessionStorage so it stays hidden for the
 * current browser session but reappears on next visit.
 */

type AnnouncementBarProps = {
  message: string;
  linkText?: string;
  linkHref?: string;
  backgroundColor?: "fern" | "sage" | "terracotta" | "charcoal";
};

const BG_MAP: Record<string, string> = {
  fern: "bg-fern text-white",
  sage: "bg-sage text-charcoal",
  terracotta: "bg-terracotta text-white",
  charcoal: "bg-charcoal text-white",
};

export default function AnnouncementBar({
  message,
  linkText,
  linkHref,
  backgroundColor = "fern",
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    // Key includes a hash of the message so changing the message resets dismiss state
    const storageKey = `announcement-dismissed-${btoa(message).slice(0, 8)}`;
    const wasDismissed = sessionStorage.getItem(storageKey) === "true";
    setDismissed(wasDismissed);
  }, [message]);

  if (dismissed || !message) return null;

  const handleDismiss = () => {
    const storageKey = `announcement-dismissed-${btoa(message).slice(0, 8)}`;
    sessionStorage.setItem(storageKey, "true");
    setDismissed(true);
  };

  const bgClass = BG_MAP[backgroundColor] || BG_MAP.fern;

  return (
    <div className={`${bgClass} relative`} role="banner" aria-label="Announcement">
      <div className="mx-auto max-w-6xl px-10 py-2.5 text-center text-sm font-medium">
        <span>{message}</span>
        {linkText && linkHref && (
          <>
            {" "}
            <Link href={linkHref} className="underline underline-offset-2 hover:opacity-80">
              {linkText}
            </Link>
          </>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
