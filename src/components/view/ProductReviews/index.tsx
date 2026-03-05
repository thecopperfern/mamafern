/**
 * ProductReviews — Judge.me Review Widget Container
 *
 * Judge.me hydrates this div automatically via its global preloader script
 * (loaded in layout.tsx). The widget handles:
 * - Displaying existing reviews with star ratings
 * - Review submission form
 * - Photo/video review uploads
 * - AggregateRating JSON-LD injection (automatic)
 *
 * No client-side JS needed from us — Judge.me's script does all the work.
 * We just render the container div with the correct data attributes.
 */
export default function ProductReviews({
  productHandle,
}: {
  productHandle: string;
}) {
  const shopDomain = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;

  // If Judge.me isn't configured, show a minimal fallback
  if (!shopDomain) {
    return (
      <section className="border-t border-oat pt-8 mt-8">
        <h2 className="text-xl font-display font-bold text-charcoal mb-4">
          Customer Reviews
        </h2>
        <p className="text-charcoal/60 text-sm">
          Reviews coming soon.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t border-oat pt-8 mt-8">
      <h2 className="text-xl font-display font-bold text-charcoal mb-6">
        Customer Reviews
      </h2>
      {/* Judge.me auto-hydrates this div with the full review widget */}
      <div
        className="jdgm-widget jdgm-review-widget"
        data-product-title={productHandle}
        data-id={productHandle}
      />
    </section>
  );
}
