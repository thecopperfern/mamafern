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
import EmailCaptureModal from "@/components/view/EmailCaptureModal";
import AnnouncementBar from "@/components/view/AnnouncementBar";
import reader from "@/lib/content";

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
  let collectionLinks: { label: string; href: string }[] = [];
  try {
    const collections = await commerceClient.getCollections();
    collectionLinks = collections.map((c) => ({
      label: c.title,
      href: `/collections/${c.handle}`,
    }));
  } catch {
    // Fall back to no dynamic links
  }

  // Read announcement bar singleton
  let announcement: { enabled: boolean; message: string; linkText: string; linkHref: string; backgroundColor: "fern" | "sage" | "terracotta" | "charcoal" } | null = null;
  try {
    announcement = await reader.singletons.announcementBar.read();
  } catch {
    // Continue without announcement bar
  }

  // Read site settings for social URLs
  let socialUrls: { instagramUrl?: string; tiktokUrl?: string; pinterestUrl?: string } = {};
  try {
    const settings = await reader.singletons.siteSettings.read();
    if (settings) {
      socialUrls = {
        instagramUrl: settings.instagramUrl || undefined,
        tiktokUrl: settings.tiktokUrl || undefined,
        pinterestUrl: settings.pinterestUrl || undefined,
      };
    }
  } catch {
    // Fall back to env vars in Footer
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
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
        >
          <Analytics />
          <Toaster />
          <SkipNav />
          <EmailCaptureModal />
          {announcement?.enabled && announcement.message && (
            <AnnouncementBar
              message={announcement.message}
              linkText={announcement.linkText || undefined}
              linkHref={announcement.linkHref || undefined}
              backgroundColor={announcement.backgroundColor}
            />
          )}
          <Navbar collectionLinks={collectionLinks} />
          <main id="main-content" className="min-h-screen" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer
            instagramUrl={socialUrls.instagramUrl}
            tiktokUrl={socialUrls.tiktokUrl}
            pinterestUrl={socialUrls.pinterestUrl}
          />
        </body>
      </Providers>
    </html>
  );
}
