import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Look Admin | Mama Fern",
  robots: { index: false, follow: false },
};

/**
 * Lookadmin layout — hides the root layout's Navbar, Footer, SkipNav, and
 * EmailCaptureModal so admin pages render full-screen without the storefront
 * shell. Uses the same inline-style pattern as the Keystatic CMS layout.
 */
export default function LookAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        [role="banner"],
        [role="contentinfo"] { display: none !important; }
        #main-content { min-height: 0 !important; padding: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
