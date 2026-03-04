"use client";

import { useEffect } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Analytics component — loaded in the root layout, client-side only.
 *
 * Handles two analytics providers:
 *
 * 1. Plausible (primary) — self-hosted at http://72.61.12.97:48435
 *    Events are sent to /stats/api/event which Next.js proxies to the VPS.
 *    Using a proxy is REQUIRED because mamafern.com is HTTPS and the VPS is
 *    HTTP — browsers block HTTP requests from HTTPS pages (mixed content).
 *    The proxy route is defined in next.config.ts under rewrites().
 *
 * 2. Google Analytics (optional) — only active when NEXT_PUBLIC_GA_ID is set.
 *
 * The @plausible-analytics/tracker npm package automatically tracks SPA
 * route changes, so every Next.js page navigation is counted as a pageview.
 *
 * IMPORTANT: @plausible-analytics/tracker accesses `location` at module level,
 * so it MUST be dynamically imported to avoid crashing during SSR/prerendering.
 */
export default function Analytics() {
  useEffect(() => {
    // Dynamically import to avoid `location is not defined` during SSR.
    import("@plausible-analytics/tracker").then(({ init }) => {
      // Initialize Plausible tracker once on mount.
      // - domain: must match exactly what's registered in the Plausible dashboard
      // - endpoint: our Next.js proxy route → forwarded server-side to the VPS
      // - outboundLinks: track clicks on external links (e.g. social, affiliate)
      // - bindToWindow: exposes window.plausible so Plausible's installation
      //   verification tool can detect the integration automatically
      init({
        domain: "mamafern.com",
        endpoint: "/stats/api/event",
        outboundLinks: true,
        bindToWindow: true,
      });
    });
  }, []);

  // Render GA script tags only when GA is configured
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}

// ─── GA custom event helper ──────────────────────────────────────────────────

/** Track a Google Analytics custom event. No-op if GA is not configured. */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === "undefined" || !GA_ID) return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ─── Plausible custom event helper ───────────────────────────────────────────

/**
 * Track a Plausible custom event (goal).
 *
 * The event name must match a goal defined in the Plausible dashboard.
 * Common events: 'Add to Cart', 'Begin Checkout', 'Purchase', 'Newsletter Signup'
 *
 * @example
 * trackPlausibleEvent('Add to Cart', { props: { product: 'Forest Romper' } })
 */
export async function trackPlausibleEvent(
  eventName: string,
  options?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const { track } = await import("@plausible-analytics/tracker");
  track(eventName, options ?? {});
}
