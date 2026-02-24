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
  title: {
    default: "Mama Fern | Grounded Family Apparel",
    template: "%s | Mama Fern",
  },
  description:
    "Grounded family apparel for crunchy, cozy homes. Cute patterns and sayings in skin-friendly fabrics, designed for moms, dads, and kids.",
  openGraph: {
    siteName: "Mama Fern",
    type: "website",
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

  return (
    <html lang="en">
      <Providers>
        <body
          className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
        >
          <SkipNav />
          <Analytics />
          <Toaster />
          <EmailCaptureModal />
          <Navbar collectionLinks={collectionLinks} />
          <main id="main-content" className="min-h-screen" role="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
