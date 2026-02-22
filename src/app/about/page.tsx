import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/view/PageHero";

export const metadata: Metadata = {
  title: "About | Mama Fern",
  description: "Learn about Mama Fern — grounded family apparel for crunchy, cozy homes.",
};

const VALUES = [
  {
    emoji: "🌱",
    title: "Skin-Friendlier Fabrics",
    desc: "Organic cotton where possible — always gentle on little ones.",
  },
  {
    emoji: "✨",
    title: "Intentional Drops",
    desc: "Small, quality releases over mass production. Every piece is considered.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Coordination",
    desc: "Matching without being matchy. Designs that work together naturally.",
  },
  {
    emoji: "🎨",
    title: "Playful & Grounded",
    desc: "Designs that bring joy while staying true to the natural, cozy life.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Our Story"
        title="About Mama Fern"
        subtitle="Grounded family apparel for crunchy, cozy homes."
      />

      {/* Brand story */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        <div className="space-y-5 text-warm-brown/80 leading-relaxed text-[15px]">
          <p>
            Mama Fern started with a simple idea: family apparel that feels as good as it looks.
            As a mom who cares about what touches her family&apos;s skin, I wanted clothing that
            combined cute designs with skin-friendlier fabrics.
          </p>
          <blockquote className="border-l-2 border-sage pl-5 py-1">
            <p className="font-display text-xl text-charcoal italic leading-snug">
              &ldquo;Clothing that celebrates the grounded, cozy life — for the whole crew.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-texture-linen border-y border-oat py-14">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Why We Exist
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
            Our Mission
          </h2>
          <p className="text-warm-brown/70 leading-relaxed text-[15px]">
            We believe family moments deserve to be comfortable. That&apos;s why we use organic
            cotton and other gentle materials wherever we can, paired with playful patterns and
            sayings that celebrate the grounded, cozy life.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="font-display font-bold text-2xl text-charcoal text-center mb-10">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-texture-linen rounded-xl border border-oat p-6 flex gap-4 items-start"
            >
              <div className="text-2xl shrink-0 mt-0.5">{v.emoji}</div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1.5">{v.title}</h3>
                <p className="text-warm-brown/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family CTA */}
      <section className="bg-texture-linen border-t border-oat py-14">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Dress the Whole Crew
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
            Made for Your Family
          </h2>
          <p className="text-warm-brown/70 leading-relaxed text-[15px] mb-8 max-w-xl">
            From tees and sweatshirts for mom and dad to onesies and kid-sized versions of our
            best designs, Mama Fern is here to dress your whole crew in comfort and style.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            Shop All
          </Link>
        </div>
      </section>
    </div>
  );
}
