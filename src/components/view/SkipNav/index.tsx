/**
 * Skip Navigation Link — ADA Accessibility
 *
 * Provides keyboard users a way to skip directly to the main content area,
 * bypassing the navigation. Required for WCAG 2.1 Level A compliance
 * (Success Criterion 2.4.1 — Bypass Blocks).
 *
 * Visually hidden until focused via Tab key.
 */
export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-fern focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
