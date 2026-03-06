import KeystaticPreview from "@/components/view/KeystaticPreview";

/**
 * Keystatic CMS Layout
 *
 * Hides the root layout's Navbar/Footer via CSS and resets brand styles so
 * Keystatic's built-in UI (buttons, dropdowns, editor toolbar) renders
 * correctly without interference.
 *
 * Includes a floating mobile preview panel (KeystaticPreview) that shows
 * a 375px-wide iframe of the page being edited.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide Mama Fern chrome — target only our Navbar/Footer, not Keystatic's own nav */}
      <style>{`
        [role="banner"],
        [role="contentinfo"],
        #email-capture-modal { display: none !important; }
        #main-content { min-height: 0 !important; }
        body { background-color: #fff !important; background-image: none !important; }

        /* Keystatic CMS container styles - moved from globals.css for route-specific loading */
        .keystatic-container {
          min-height: 100vh;
          background-color: #fff;
          background-image: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
          --background: #fff;
          --foreground: #1a1a1a;
          color: #1a1a1a;
        }
      `}</style>
      <div className="keystatic-container">
        {children}
      </div>
      <KeystaticPreview />
    </>
  );
}
