export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";
import reader from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const data = await reader.singletons.aboutPage.read();
  return buildMetadata({
    title: data?.seoTitle || "Our Story",
    description:
      data?.seoDescription ||
      "Learn about Mama Fern — grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs rooted in nature.",
    path: "/about",
    keywords: (data?.seoKeywords || ["mama fern story", "about mama fern", "crunchy mom brand", "natural family clothing brand"]) as string[],
  });
}

export default async function AboutPage() {
  const data = await reader.singletons.aboutPage.read();

  // Fallback values if CMS data doesn't exist yet
  const heroEyebrow = data?.heroEyebrow || "Our Story";
  const heroTitle = data?.heroTitle || "About Mama Fern";
  const heroSubtitle = data?.heroSubtitle || "Grounded family apparel for crunchy, cozy homes.";
  const brandStoryHeading = data?.brandStoryHeading || "What Is Mama Fern?";
  const brandStoryParagraphs = data?.brandStoryParagraphs?.length
    ? data.brandStoryParagraphs
    : [
        "Mama Fern is a family apparel brand based in the United States, specializing in natural-fabric clothing for families who value comfort, sustainability, and earthy aesthetics. We design matching family sets, kids\u2019 clothing, and parent apparel for outdoor-loving, crunchy, cottagecore-inspired families.",
        "The name \u201cMama Fern\u201d represents everything we believe in \u2014 ferns are among the oldest plants on Earth, resilient and quietly beautiful. They thrive in shade and sun alike, grounded in the soil but always reaching toward the light. That\u2019s the spirit we bring to every piece of clothing we create: grounded, natural, and designed to grow with your family.",
        "Every piece in our collection is made from natural materials \u2014 organic cotton certified to GOTS standards, linen, and bamboo viscose \u2014 chosen for breathability, softness, and durability. We use fabrics that meet OEKO-TEX Standard 100 Class I requirements, the strictest textile safety level, specifically designed for baby products.",
        "Our customers are parents who care deeply about what touches their family\u2019s skin. Crunchy moms who choose cloth diapers and organic snacks. Cottagecore dads who love a good henley and a Saturday morning hike. Families who believe that what they wear can reflect the same values they bring to everything else \u2014 natural living, outdoor adventure, and togetherness.",
        "What makes Mama Fern different? We design coordinating family outfits \u2014 not identical matching sets, but complementary pieces in the same earthy palettes. Sage greens, warm browns, dusty roses, and soft creams that work together beautifully while letting each family member express their own style. We produce in small batches with ethical manufacturing partners, use recycled packaging, and price our pieces so quality natural-fabric clothing is accessible to real families.",
      ];
  const brandStoryBlockquote = data?.brandStoryBlockquote || "Clothing that celebrates the grounded, cozy life \u2014 for the whole crew.";
  const missionEyebrow = data?.missionEyebrow || "Why We Exist";
  const missionHeading = data?.missionHeading || "Our Mission";
  const missionBody =
    data?.missionBody ||
    "We believe family moments deserve to be comfortable. That\u2019s why we use organic cotton and other natural materials in every piece, paired with earthy patterns and thoughtful designs that celebrate the grounded, cozy life. Our goal is to make natural-fabric family clothing that\u2019s beautiful, accessible, and built to last through all the adventures \u2014 from playground mornings to campfire evenings.";
  const valuesHeading = data?.valuesHeading || "What We Stand For";
  const values = data?.values?.length
    ? data.values
    : [
        { emoji: "\u{1F331}", title: "Skin-Friendly Fabrics", description: "Every piece is made from organic cotton, linen, or bamboo \u2014 chosen for breathability, softness, and durability. We use OEKO-TEX Standard 100 Class I certified materials, the strictest safety level designed for baby products." },
        { emoji: "\u2728", title: "Intentional Drops", description: "We release small-batch seasonal collections rather than churning out fast fashion. Each drop is thoughtfully designed with coordinating palettes so families can mix, match, and grow together." },
        { emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", title: "Family Coordination", description: "Our collections feature matching color palettes and complementary designs across baby, kids, mom, and dad sizes \u2014 coordinating without being identical, so each family member shines." },
        { emoji: "\u{1F3A8}", title: "Playful & Grounded", description: "Earth tones meet joyful patterns. Sage greens, warm browns, and dusty roses paired with playful designs that celebrate the cozy, grounded, nature-loving life." },
      ];
  const brandFaqHeading = data?.brandFaqHeading || "Frequently Asked About Mama Fern";
  const brandFaqs = data?.brandFaqs?.length
    ? data.brandFaqs
    : [
        { question: 'What does "crunchy family apparel" mean?', answer: '"Crunchy" describes families who lean toward natural living \u2014 organic food, gentle parenting, and eco-conscious choices. Crunchy family apparel extends those values into clothing: natural fabrics, earthy aesthetics, and intentional design over fast fashion.' },
        { question: "What fabrics does Mama Fern use?", answer: "We primarily use organic cotton certified to GOTS standards, cotton-linen blends, and bamboo viscose. All fabrics meet OEKO-TEX Standard 100 Class I requirements \u2014 the strictest textile safety level, specifically designed for baby products." },
        { question: "Does Mama Fern make matching family outfits?", answer: "Yes \u2014 matching family sets are at the heart of what we do. We design coordinating (not identical) pieces across baby, kids, mom, and dad sizes in complementary earth-tone palettes." },
        { question: "Where is Mama Fern based?", answer: "Mama Fern is designed in the United States. Our products are crafted with ethical manufacturing partners who are personally vetted for fair labor practices and environmental responsibility." },
        { question: "Is Mama Fern sustainable?", answer: "Sustainability is core to our mission. We use organic and natural fabrics, produce in small batches to minimize waste, use recycled packaging materials, and partner only with manufacturers who meet our environmental and labor standards." },
      ];
  const ctaEyebrow = data?.ctaEyebrow || "Dress the Whole Crew";
  const ctaHeading = data?.ctaHeading || "Made for Your Family";
  const ctaBody =
    data?.ctaBody ||
    "From tees and sweatshirts for mom and dad to onesies and kid-sized versions of our best designs, Mama Fern is here to dress your whole crew in comfort and style.";
  const ctaButtonText = data?.ctaButtonText || "Shop All";
  const ctaButtonHref = data?.ctaButtonHref || "/shop";
  const jsonLdDescription =
    data?.jsonLdDescription ||
    "Mama Fern is a family apparel brand based in the United States, specializing in natural-fabric clothing for families who value comfort, sustainability, and earthy aesthetics.";
  const jsonLdFoundingDate = data?.jsonLdFoundingDate || "2024";

  const aboutOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mama Fern",
    url: SITE_CONFIG.baseUrl,
    logo: `${SITE_CONFIG.baseUrl}/logo.png`,
    description: jsonLdDescription,
    foundingDate: jsonLdFoundingDate,
    founder: { "@type": "Organization", name: "Mama Fern" },
  };

  const aboutArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${heroTitle} \u2014 Grounded Family Apparel`,
    description: "Learn about Mama Fern\u2019s mission, values, and the story behind grounded family apparel for crunchy, cozy homes.",
    author: { "@type": "Organization", name: "Mama Fern", url: SITE_CONFIG.baseUrl },
    publisher: {
      "@type": "Organization",
      name: "Mama Fern",
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/logo.png` },
    },
    mainEntityOfPage: `${SITE_CONFIG.baseUrl}/about`,
  };

  return (
    <div>
      <JsonLd data={aboutOrganizationSchema} />
      <JsonLd data={aboutArticleSchema} />
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      {/* Brand Story */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up" aria-labelledby="brand-story-heading">
        <h2 id="brand-story-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6">
          {brandStoryHeading}
        </h2>
        <div className="space-y-5 text-warm-brown leading-relaxed text-[15px]">
          {brandStoryParagraphs[0] && (
            <p>
              <strong>{brandStoryParagraphs[0].split(", specializing")[0]}</strong>
              {brandStoryParagraphs[0].includes(", specializing") ? `, specializing${brandStoryParagraphs[0].split(", specializing")[1]}` : ""}
            </p>
          )}
          {brandStoryParagraphs[1] && <p>{brandStoryParagraphs[1]}</p>}
          <blockquote className="border-l-2 border-sage pl-5 py-1">
            <p className="font-display text-xl text-charcoal italic leading-snug">
              &ldquo;{brandStoryBlockquote}&rdquo;
            </p>
          </blockquote>
          {brandStoryParagraphs.slice(2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-texture-linen border-y border-oat py-14" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            {missionEyebrow}
          </p>
          <h2 id="mission-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
            {missionHeading}
          </h2>
          <p className="text-warm-brown leading-relaxed text-[15px]">
            {missionBody}
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="mx-auto max-w-5xl px-4 py-14" aria-labelledby="values-heading">
        <h2 id="values-heading" className="font-display font-bold text-2xl text-charcoal text-center mb-10">
          {valuesHeading}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-texture-linen rounded-xl border border-oat p-6 flex gap-4 items-start"
            >
              <div className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{v.emoji}</div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1.5">{v.title}</h3>
                <p className="text-warm-brown text-sm leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand FAQ — AI-optimized Q&A */}
      <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="brand-faq-heading">
        <h2 id="brand-faq-heading" className="font-display font-bold text-2xl text-charcoal mb-8">
          {brandFaqHeading}
        </h2>
        <div className="space-y-6">
          {brandFaqs.map((faq, i) => (
            <div key={i}>
              <h3 className="font-semibold text-charcoal mb-2">{faq.question}</h3>
              <p className="text-warm-brown text-[15px] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Family CTA */}
      <section className="bg-texture-linen border-t border-oat py-14" aria-labelledby="family-cta-heading">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            {ctaEyebrow}
          </p>
          <h2 id="family-cta-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-5">
            {ctaHeading}
          </h2>
          <p className="text-warm-brown leading-relaxed text-[15px] mb-8 max-w-xl">
            {ctaBody}
          </p>
          <Link
            href={ctaButtonHref}
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>
    </div>
  );
}
