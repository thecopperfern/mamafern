/**
 * Keystatic CMS Layout
 *
 * Hides the root layout's Navbar/Footer via CSS and resets brand styles so
 * Keystatic's built-in UI (buttons, dropdowns, editor toolbar) renders
 * correctly without interference.
 *
 * Previous approach used a fixed overlay with overflow:auto, but that clipped
 * portaled dropdown menus (heading picker, link popover, etc.) because
 * overflow:auto creates a clipping context. This approach lets the page
 * scroll naturally so all portals and dropdowns work without z-index hacks.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide Mama Fern chrome — Keystatic needs the full viewport */}
      <style>{`
        header, footer, nav { display: none !important; }
        body { background-color: #fff !important; background-image: none !important; }
      `}</style>
      <div className="keystatic-container">
        {children}
      </div>
    </>
  );
}
