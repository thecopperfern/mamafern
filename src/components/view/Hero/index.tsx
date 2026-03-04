"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, staggerContainer, fadeInUp } from "@/lib/motion";

type HeroProps = {
  headlineLine1?: string;
  headlineHighlight?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
};

export default function Hero({
  headlineLine1 = "For every stage of",
  headlineHighlight = "growing together",
  subtitle = "Grounded family apparel in skin-friendlier fabrics. Cute patterns and cozy sayings for moms, dads, and kids.",
  primaryButtonText = "Shop All",
  primaryButtonHref = "/shop",
  secondaryButtonText = "Shop Kids",
  secondaryButtonHref = "/collections/kids",
}: HeroProps) {
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

      <motion.div
        className="relative z-10 mx-auto max-w-6xl text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-display font-bold text-charcoal leading-tight"
          variants={fadeInUp}
        >
          {headlineLine1}
          <br />
          <span className="text-fern">{headlineHighlight}</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-charcoal/80 max-w-xl mx-auto"
          variants={fadeInUp}
        >
          {subtitle}
        </motion.p>
        <motion.div
          className="mt-8 flex gap-4 justify-center"
          variants={fadeInUp}
        >
          <Link href={primaryButtonHref}>
            <Button
              size="lg"
              className="bg-fern hover:bg-fern-dark text-white px-8"
            >
              {primaryButtonText}
            </Button>
          </Link>
          <Link href={secondaryButtonHref}>
            <Button
              size="lg"
              variant="outline"
              className="border-fern text-fern hover:bg-fern/10 px-8"
            >
              {secondaryButtonText}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
