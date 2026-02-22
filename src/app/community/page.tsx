import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/view/PageHero";

export const metadata: Metadata = {
  title: "Community | Mama Fern",
  description: "Updates, stories, and inspiration from the Mama Fern community.",
};

const VALUES = [
  {
    emoji: "🌿",
    title: "Natural Living",
    desc: "Choosing gentler fabrics, cleaner choices, and a mindful pace for your family.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Family First",
    desc: "Every design starts with real families in mind — cozy, coordinating, and full of joy.",
  },
  {
    emoji: "💚",
    title: "Growing Together",
    desc: "Your stories and feedback shape everything we make. This brand belongs to all of us.",
  },
];

export default function CommunityPage() {
  return (
    <div>
      <PageHero
        eyebrow="Mama Fern Community"
        title="Welcome to Our Family"
        subtitle="Stories, updates, and a little inspiration from the families who wear Mama Fern."
      />

      {/* Featured welcome post */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        <article className="relative bg-texture-linen rounded-2xl border border-oat overflow-hidden p-8 md:p-10">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sage/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-blush/20 rounded-full pointer-events-none" />

          <p className="relative text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Welcome
          </p>
          <h2 className="relative font-display font-bold text-2xl md:text-3xl text-charcoal mb-5 leading-snug">
            Hello from Mama Fern
          </h2>
          <p className="relative text-warm-brown/70 leading-relaxed text-[15px] mb-5">
            We&apos;re so glad you&apos;re here. Mama Fern is more than a clothing brand — it&apos;s
            a community of families who value comfort, quality, and a little bit of fun in their
            everyday wear. Stay tuned for seasonal drop announcements, behind-the-scenes looks at
            our design process, and stories from the families who wear Mama Fern.
          </p>
          <div className="relative h-px bg-oat mb-4" />
          <p className="relative text-xs text-warm-brown/40 italic">
            Posted by the Mama Fern team &mdash; Feb 2026
          </p>
        </article>
      </section>

      {/* Community values */}
      <section className="bg-texture-linen border-y border-oat py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal text-center mb-10">
            What Brings Us Together
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-cream/70 rounded-xl border border-oat p-6 text-center"
              >
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="font-display font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-warm-brown/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay connected CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="bg-texture-linen rounded-2xl border border-oat p-8 md:p-10 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Stay Connected
          </p>
          <h3 className="font-display font-bold text-charcoal text-2xl md:text-3xl mb-4 leading-snug">
            More stories coming soon
          </h3>
          <p className="text-warm-brown/60 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            We&apos;re building something special here. Follow along for new posts, seasonal
            drops, and behind-the-scenes moments.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
            >
              Shop the Collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-fern text-fern hover:bg-fern/10 font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
            >
              Share Your Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
