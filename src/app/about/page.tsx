import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Mama Fern",
  description: "Learn about Mama Fern — grounded family apparel for crunchy, cozy homes.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-charcoal mb-6">
        About Mama Fern
      </h1>

      <div className="space-y-6 text-warm-brown/80 leading-relaxed">
        <p>
          Mama Fern started with a simple idea: family apparel that feels as
          good as it looks. As a mom who cares about what touches her
          family&apos;s skin, I wanted clothing that combined cute designs with
          skin-friendlier fabrics.
        </p>

        <h2 className="text-2xl font-display font-bold text-charcoal pt-4">
          Our Mission
        </h2>
        <p>
          We believe family moments deserve to be comfortable. That&apos;s why we
          use organic cotton and other gentle materials wherever we can, paired
          with playful patterns and sayings that celebrate the grounded, cozy
          life.
        </p>

        <h2 className="text-2xl font-display font-bold text-charcoal pt-4">
          What We Stand For
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Skin-friendlier fabrics — organic cotton where possible</li>
          <li>Small, intentional drops — quality over quantity</li>
          <li>Coordinating family looks — matching without being matchy</li>
          <li>Designs that are playful, grounded, and happy</li>
        </ul>

        <h2 className="text-2xl font-display font-bold text-charcoal pt-4">
          Made for Your Family
        </h2>
        <p>
          From tees and sweatshirts for mom and dad to onesies and kid-sized
          versions of our best designs, Mama Fern is here to dress your whole
          crew in comfort and style.
        </p>
      </div>
    </div>
  );
}
