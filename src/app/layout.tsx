import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/view/Navbar";
import Footer from "@/components/view/Footer";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { commerceClient } from "@/lib/commerce";
import Analytics from "@/components/view/Analytics";
import SkipNav from "@/components/view/SkipNav";
import dynamic from "next/dynamic";
import AnnouncementBar from "@/components/view/AnnouncementBar";
import {
  getNavigation,
  getFooterData,
  getAnnouncementWithSchedule,
  getPopupSettings,
} from "@/lib/content-helpers";
import reader from "@/lib/content";
import { unstable_cache } from "next/cache";

// Lazy-load EmailCaptureModal — it's non-critical and imports framer-motion.
// Deferring it removes ~30-50KB of JS from the initial critical bundle,
// reducing TBT and improving LCP by not blocking the main thread.
const EmailCaptureModal = dynamic(
  () => import("@/components/view/EmailCaptureModal"),
  { loading: () => null }
);

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mamafern.com"),
  title: {
    default: "Mama Fern | Grounded Family Apparel",
    template: "%s | Mama Fern",
  },
  description:
    "Grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs for moms, dads, and kids who love the outdoors.",
  keywords: [
    "mama fern",
    "family apparel",
    "crunchy mom clothing",
    "natural fabric kids clothes",
    "earthy family fashion",
    "grounded family clothing",
    "boho family apparel",
    "cottagecore kids clothing",
    "matching family outfits",
    "organic family clothing",
  ],
  authors: [{ name: "Mama Fern", url: "https://mamafern.com" }],
  creator: "Mama Fern",
  publisher: "Mama Fern",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    siteName: "Mama Fern",
    type: "website",
    url: "https://mamafern.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mama Fern – Grounded Family Apparel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mamafern",
    creator: "@mamafern",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://mamafern.com",
    types: {
      "application/rss+xml": "https://mamafern.com/blog/feed.xml",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
  category: "fashion",
  other: {
    "ai-description":
      "Mama Fern makes grounded family apparel in natural fabrics for crunchy, cottagecore, and outdoor-loving families.",
    "ai-content-type": "e-commerce, family fashion",
    "ai-topics":
      "family apparel, natural clothing, crunchy mom, cottagecore, matching family outfits",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cache CMS reads that rarely change — reduces TTFB by ~200ms on cache hits.
  // Shopify collection links are NOT cached (they're dynamic product data).
  const getCachedNavigation = unstable_cache(getNavigation, ["navigation"], { revalidate: 300 });
  const getCachedFooterData = unstable_cache(getFooterData, ["footer"], { revalidate: 300 });
  const getCachedAnnouncement = unstable_cache(getAnnouncementWithSchedule, ["announcement"], { revalidate: 300 });
  const getCachedPopupSettings = unstable_cache(getPopupSettings, ["popup"], { revalidate: 300 });
  const getCachedSocialUrls = unstable_cache(
    async () => {
      try {
        const settings = await reader.singletons.siteSettings.read();
        return settings
          ? {
              instagramUrl: settings.instagramUrl || undefined,
              tiktokUrl: settings.tiktokUrl || undefined,
              pinterestUrl: settings.pinterestUrl || undefined,
            }
          : {};
      } catch {
        return {} as { instagramUrl?: string; tiktokUrl?: string; pinterestUrl?: string };
      }
    },
    ["social-urls"],
    { revalidate: 300 }
  );

  // Read all layout data in parallel — CMS reads are cached for 5 minutes
  const [collectionLinks, navigation, footerData, announcement, popupSettings, socialUrls] =
    await Promise.all([
      commerceClient
        .getCollections()
        .then((collections) =>
          collections.map((c) => ({
            label: c.title,
            href: `/collections/${c.handle}`,
          }))
        )
        .catch(() => [] as { label: string; href: string }[]),
      getCachedNavigation(),
      getCachedFooterData(),
      getCachedAnnouncement(),
      getCachedPopupSettings(),
      getCachedSocialUrls(),
    ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/linen.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://cdn11.bigcommerce.com" />
        <link rel="dns-prefetch" href="https://cdn11.bigcommerce.com" />
        {/*
          Plausible analytics is initialized in the <Analytics /> client component
          using the @plausible-analytics/tracker npm package. Events are sent to
          /stats/api/event which is proxied to the self-hosted VPS in next.config.ts.
          No script tag needed here — the npm package handles everything client-side.
        */}
      </head>
      <Providers>
        <body
          className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          <Analytics />
          <Toaster />
          <SkipNav />
          <EmailCaptureModal popupSettings={popupSettings} />
          {announcement && (
            <AnnouncementBar
              message={announcement.message}
              linkText={announcement.linkText || undefined}
              linkHref={announcement.linkHref || undefined}
              backgroundColor={announcement.backgroundColor}
            />
          )}
          <Navbar
            collectionLinks={collectionLinks}
            mainLinks={navigation.mainLinks}
            infoLinks={navigation.infoLinks}
          />
          <main id="main-content" className="min-h-screen" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer
            instagramUrl={socialUrls.instagramUrl}
            tiktokUrl={socialUrls.tiktokUrl}
            pinterestUrl={socialUrls.pinterestUrl}
            footerData={footerData}
          />
        </body>
      </Providers>
    </html>
  );
}
