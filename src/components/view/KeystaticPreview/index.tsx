"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * KeystaticPreview — floating preview panel for the Keystatic admin.
 *
 * Features:
 * - Device size selector: Mobile (375px), Tablet (768px), Desktop (1024px)
 * - Auto-detects preview URL from Keystatic route
 * - Loading spinner + error state for iframe
 * - Refresh button + fullscreen toggle
 * - Polls every 1s for route changes, auto-refreshes iframe
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

type DeviceSize = "mobile" | "tablet" | "desktop";

const DEVICE_SIZES: Record<DeviceSize, { width: number; label: string; panelWidth: number }> = {
  mobile: { width: 375, label: "Mobile", panelWidth: 420 },
  tablet: { width: 768, label: "Tablet", panelWidth: 820 },
  desktop: { width: 1024, label: "Desktop", panelWidth: 1080 },
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
  const [device, setDevice] = useState<DeviceSize>("mobile");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        setLoading(true);
        setError(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [previewUrl]);

  const handleRefresh = useCallback(() => {
    setIframeKey((k) => k + 1);
    setLoading(true);
    setError(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const currentDevice = DEVICE_SIZES[device];
  const panelWidth = fullscreen ? "100%" : `${currentDevice.panelWidth}px`;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-fern text-white shadow-lg hover:bg-fern/90 transition-colors"
        aria-label={open ? "Close preview" : "Open preview"}
        title="Preview"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Preview panel */}
      {open && (
        <div
          className="fixed top-0 right-0 z-[9998] flex h-full flex-col border-l border-gray-200 bg-gray-100 shadow-2xl transition-all duration-200"
          style={{ width: panelWidth }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
            {/* Device size selector */}
            <div className="flex gap-1">
              {(Object.keys(DEVICE_SIZES) as DeviceSize[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDevice(d);
                    if (fullscreen) setFullscreen(false);
                  }}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    device === d
                      ? "bg-fern text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                  aria-label={`${DEVICE_SIZES[d].label} preview (${DEVICE_SIZES[d].width}px)`}
                  aria-pressed={device === d}
                >
                  {DEVICE_SIZES[d].label}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Refresh preview"
                title="Refresh"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Fullscreen toggle */}
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen preview"}
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  {fullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  )}
                </svg>
              </button>
              {/* Close */}
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
          <div className="border-b border-gray-200 bg-white px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-400 truncate flex-1">{previewUrl}</span>
            <span className="text-xs text-gray-300">{currentDevice.width}px</span>
          </div>

          {/* Iframe container */}
          <div className="relative flex flex-1 items-start justify-center overflow-hidden bg-gray-100 p-3">
            {/* Loading spinner */}
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-fern/30 border-t-fern" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
                <p className="text-sm text-gray-500">Failed to load preview</p>
                <button
                  onClick={handleRefresh}
                  className="rounded bg-fern px-3 py-1.5 text-sm text-white hover:bg-fern/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={previewUrl}
              className="h-full rounded-lg border border-gray-300 bg-white shadow-sm"
              style={{ width: `${currentDevice.width}px` }}
              title={`${currentDevice.label} preview`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          </div>
        </div>
      )}
    </>
  );
}
