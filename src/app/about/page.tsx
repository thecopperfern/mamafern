import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Story",
  description:
    "Learn about Mama Fern — grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs rooted in nature.",
  path: "/about",
  keywords: ["mama fern story", "about mama fern", "crunchy mom brand", "natural family clothing brand"],
});

/**
 * ⚠️ PLACEHOLDER VALUES — Replace with real brand story and imagery.
 * Search for "PLACEHOLDER" to find all items that need updating.
 */
const VALUES = [
  {
    emoji: "🌱",
    title: "Skin-Friendly Fabrics",
    desc: "⚠️ PLACEHOLDER — Describe your fabric choices and sourcing story here.",
  },
  {
    emoji: "✨",
    title: "Intentional Drops",
    desc: "⚠️ PLACEHOLDER — Explain your release strategy and production philosophy.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Coordination",
    desc: "⚠️ PLACEHOLDER — Describe how your designs work together for families.",
  },
  {
    emoji: "🎨",
    title: "Playful & Grounded",
    desc: "⚠️ PLACEHOLDER — Share what 'playful & grounded' means for Mama Fern.",
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

      {/* ⚠️ PLACEHOLDER — Brand story section */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up" aria-labelledby="brand-story-heading">
        <h2 id="brand-story-heading" className="sr-only">Brand Story</h2>

        {/* Placeholder banner */}
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl p-6 mb-8 text-center">
          <p className="text-yellow-700 font-semibold text-lg mb-1">
            ⚠️ PLACEHOLDER — Brand Story
          </p>
          <p className="text-yellow-600 text-sm">
            Replace this section with Mama Fern&apos;s authentic brand story, founder bio, and mission.
          </p>
        </div>

        <div className="space-y-5 text-warm-brown/80 leading-relaxed text-[15px]">
          <p>
            Mama Fern started with a simple idea: family apparel that feels as good as it looks.
            As a mom who cares about what touches her family&apos;s skin, I wanted clothing that
            combined cute designs with skin-friendly fabrics.
          </p>
          <blockquote className="border-l-2 border-sage pl-5 py-1">
            <p className="font-display text-xl text-charcoal italic leading-snug">
              &ldquo;Clothing that celebrates the grounded, cozy life — for the whole crew.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-texture-linen border-y border-oat py-14" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Why We Exist
          </p>
          <h2 id="mission-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
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
      <section className="mx-auto max-w-5xl px-4 py-14" aria-labelledby="values-heading">
        <h2 id="values-heading" className="font-display font-bold text-2xl text-charcoal text-center mb-10">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-texture-linen rounded-xl border border-oat p-6 flex gap-4 items-start"
            >
              <div className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{v.emoji}</div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1.5">{v.title}</h3>
                <p className="text-warm-brown/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family CTA */}
      <section className="bg-texture-linen border-t border-oat py-14" aria-labelledby="family-cta-heading">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Dress the Whole Crew
          </p>
          <h2 id="family-cta-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
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
