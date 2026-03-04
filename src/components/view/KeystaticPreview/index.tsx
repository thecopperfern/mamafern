"use client";

import { useState, useEffect } from "react";

/**
 * KeystaticPreview — floating mobile preview panel for the Keystatic admin.
 *
 * Shows a 375px-wide iframe of the actual Next.js page being edited.
 * The URL is auto-detected from the current Keystatic route.
 * Preview reflects the last-saved version (not live typing).
 */

const ROUTE_MAP: Record<string, string> = {
  faqPage: "/faq",
  announcementBar: "/",
  aboutPage: "/about",
  homepageHero: "/",
  communityPage: "/community",
  siteSettings: "/",
  contactPage: "/contact",
  shopPage: "/shop",
  homepageSections: "/",
  popupSettings: "/",
  navigation: "/",
  footer: "/",
  mediaGuidelines: "/admin/media",
};

function getPreviewUrl(pathname: string): string {
  // Singleton: /keystatic/singletons/{name}
  const singletonMatch = pathname.match(/\/keystatic\/singletons\/([^/]+)/);
  if (singletonMatch) {
    return ROUTE_MAP[singletonMatch[1]] || "/";
  }

  // Collection: posts
  const postMatch = pathname.match(/\/keystatic\/collection\/posts\/([^/]+)/);
  if (postMatch) {
    return `/blog/${postMatch[1]}`;
  }

  // Collection: campaigns
  const campaignMatch = pathname.match(/\/keystatic\/collection\/campaigns\/([^/]+)/);
  if (campaignMatch) {
    return `/campaigns/${campaignMatch[1]}`;
  }

  // Collection: style guides
  const guideMatch = pathname.match(/\/keystatic\/collection\/styleGuides\/([^/]+)/);
  if (guideMatch) {
    return `/style-guide/${guideMatch[1]}`;
  }

  return "/";
}

export default function KeystaticPreview() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setPreviewUrl(getPreviewUrl(window.location.pathname));
  }, []);

  // Update preview URL when navigating within Keystatic
  useEffect(() => {
    const interval = setInterval(() => {
      const newUrl = getPreviewUrl(window.location.pathname);
      if (newUrl !== previewUrl) {
        setPreviewUrl(newUrl);
        setIframeKey((k) => k + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [previewUrl]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-fern text-white shadow-lg hover:bg-fern/90 transition-colors"
        aria-label={open ? "Close preview" : "Open mobile preview"}
        title="Mobile preview"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Preview panel */}
      {open && (
        <div className="fixed top-0 right-0 z-[9998] flex h-full w-[420px] flex-col border-l border-gray-200 bg-gray-100 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
            <span className="text-sm font-medium text-gray-700">
              Preview (375px)
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Refresh preview"
                title="Refresh"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close preview"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* URL bar */}
          <div className="border-b border-gray-200 bg-white px-3 py-1.5">
            <span className="text-xs text-gray-400">{previewUrl}</span>
          </div>

          {/* Iframe container — centered 375px phone width */}
          <div className="flex flex-1 items-start justify-center overflow-hidden bg-gray-100 p-3">
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="h-full w-[375px] rounded-lg border border-gray-300 bg-white shadow-sm"
              title="Mobile preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
