import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-sage/30 via-cream to-blush/20 py-20 md:py-32 px-4">
      <div className="mx-auto max-w-6xl text-center">
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
