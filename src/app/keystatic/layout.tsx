/**
 * Keystatic CMS Layout
 *
 * Renders as a fixed full-viewport overlay so the root layout's Navbar/Footer
 * are completely hidden behind it. This prevents the top/bottom cutoff issue
 * (especially on mobile) and isolates Keystatic from Mama Fern's brand CSS.
 *
 * The companion `.keystatic-container` rules in globals.css reset inherited
 * brand styles (colors, fonts, textures) so Keystatic's built-in button and
 * form styles render correctly.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="keystatic-container">
      {children}
    </div>
  );
}
