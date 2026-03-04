export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/view/PageHero";
import { buildMetadata } from "@/lib/seo";
import reader from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const data = await reader.singletons.communityPage.read();
  return buildMetadata({
    title: data?.seoTitle || "Community",
    description:
      data?.seoDescription ||
      "Stories, updates, and inspiration from the Mama Fern community. Join families who value natural living, comfort, and grounded family fashion.",
    path: "/community",
    keywords: (data?.seoKeywords || ["mama fern community", "crunchy mom community", "natural family lifestyle"]) as string[],
  });
}

export default async function CommunityPage() {
  const data = await reader.singletons.communityPage.read();

  const heroEyebrow = data?.heroEyebrow || "Mama Fern Community";
  const heroTitle = data?.heroTitle || "Welcome to Our Family";
  const heroSubtitle = data?.heroSubtitle || "Stories, updates, and a little inspiration from the families who wear Mama Fern.";
  const featuredEyebrow = data?.featuredEyebrow || "Welcome";
  const featuredHeading = data?.featuredHeading || "Hello from Mama Fern";
  const featuredBody =
    data?.featuredBody ||
    "We\u2019re so glad you\u2019re here. Mama Fern is more than a clothing brand \u2014 it\u2019s a community of families who value comfort, quality, and a little bit of fun in their everyday wear. Stay tuned for seasonal drop announcements, behind-the-scenes looks at our design process, and stories from the families who wear Mama Fern.";
  const featuredMeta = data?.featuredMeta || "Posted by the Mama Fern team \u2014 Feb 2026";
  const valuesHeading = data?.valuesHeading || "What Brings Us Together";
  const values = data?.values?.length
    ? data.values
    : [
        { emoji: "\u{1F33F}", title: "Natural Living", description: "Choosing gentler fabrics, cleaner choices, and a mindful pace for your family." },
        { emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}", title: "Family First", description: "Every design starts with real families in mind \u2014 cozy, coordinating, and full of joy." },
        { emoji: "\u{1F49A}", title: "Growing Together", description: "Your stories and feedback shape everything we make. This brand belongs to all of us." },
      ];
  const ctaEyebrow = data?.ctaEyebrow || "Stay Connected";
  const ctaHeading = data?.ctaHeading || "More stories coming soon";
  const ctaBody =
    data?.ctaBody ||
    "We\u2019re building something special here. Follow along for new posts, seasonal drops, and behind-the-scenes moments.";
  const primaryButtonText = data?.primaryButtonText || "Shop the Collection";
  const primaryButtonHref = data?.primaryButtonHref || "/shop";
  const secondaryButtonText = data?.secondaryButtonText || "Share Your Story";
  const secondaryButtonHref = data?.secondaryButtonHref || "/contact";

  return (
    <div>
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      {/* Featured welcome post */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        <article className="relative bg-texture-linen rounded-2xl border border-oat overflow-hidden p-8 md:p-10">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sage/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-blush/20 rounded-full pointer-events-none" />

          <p className="relative text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            {featuredEyebrow}
          </p>
          <h2 className="relative font-display font-bold text-2xl md:text-3xl text-charcoal mb-5 leading-snug">
            {featuredHeading}
          </h2>
          <p className="relative text-warm-brown leading-relaxed text-[15px] mb-5">
            {featuredBody}
          </p>
          <div className="relative h-px bg-oat mb-4" />
          <p className="relative text-xs text-warm-brown italic">
            {featuredMeta}
          </p>
        </article>
      </section>

      {/* Community values */}
      <section className="bg-texture-linen border-y border-oat py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal text-center mb-10">
            {valuesHeading}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-cream/70 rounded-xl border border-oat p-6 text-center"
              >
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="font-display font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-warm-brown text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay connected CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="bg-texture-linen rounded-2xl border border-oat p-8 md:p-10 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            {ctaEyebrow}
          </p>
          <h3 className="font-display font-bold text-charcoal text-2xl md:text-3xl mb-4 leading-snug">
            {ctaHeading}
          </h3>
          <p className="text-warm-brown text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            {ctaBody}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={primaryButtonHref}
              className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
            >
              {primaryButtonText}
            </Link>
            <Link
              href={secondaryButtonHref}
              className="inline-flex items-center border border-fern text-fern hover:bg-fern/10 font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
