import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="relative py-24 md:py-36 px-4"
      style={{
        backgroundImage: "url('/linen.jpeg')",
        backgroundRepeat: "repeat",
        backgroundSize: "800px auto",
      }}
    >
      {/* Colour wash over the texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-cream/60 to-blush/30" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-charcoal leading-tight">
          For every stage of
          <br />
          <span className="text-fern">growing together</span>
        </h1>
        <p className="mt-4 text-lg text-warm-brown/70 max-w-xl mx-auto">
          Grounded family apparel in skin-friendlier fabrics. Cute patterns and
          cozy sayings for moms, dads, and kids.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-fern hover:bg-fern-dark text-white px-8"
            >
              Shop All
            </Button>
          </Link>
          <Link href="/collections/kids">
            <Button
              size="lg"
              variant="outline"
              className="border-fern text-fern hover:bg-fern/10 px-8"
            >
              Shop Kids
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
