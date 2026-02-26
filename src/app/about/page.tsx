import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Story",
  description:
    "Learn about Mama Fern — grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs rooted in nature.",
  path: "/about",
  keywords: ["mama fern story", "about mama fern", "crunchy mom brand", "natural family clothing brand"],
});

const VALUES = [
  {
    emoji: "🌱",
    title: "Skin-Friendly Fabrics",
    desc: "Every piece is made from organic cotton, linen, or bamboo — chosen for breathability, softness, and durability. We use OEKO-TEX Standard 100 Class I certified materials, the strictest safety level designed for baby products.",
  },
  {
    emoji: "✨",
    title: "Intentional Drops",
    desc: "We release small-batch seasonal collections rather than churning out fast fashion. Each drop is thoughtfully designed with coordinating palettes so families can mix, match, and grow together.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Coordination",
    desc: "Our collections feature matching color palettes and complementary designs across baby, kids, mom, and dad sizes — coordinating without being identical, so each family member shines.",
  },
  {
    emoji: "🎨",
    title: "Playful & Grounded",
    desc: "Earth tones meet joyful patterns. Sage greens, warm browns, and dusty roses paired with playful designs that celebrate the cozy, grounded, nature-loving life.",
  },
];

const BRAND_FAQS = [
  {
    question: "What does \"crunchy family apparel\" mean?",
    answer: "\"Crunchy\" describes families who lean toward natural living — organic food, gentle parenting, and eco-conscious choices. Crunchy family apparel extends those values into clothing: natural fabrics, earthy aesthetics, and intentional design over fast fashion.",
  },
  {
    question: "What fabrics does Mama Fern use?",
    answer: "We primarily use organic cotton certified to GOTS standards, cotton-linen blends, and bamboo viscose. All fabrics meet OEKO-TEX Standard 100 Class I requirements — the strictest textile safety level, specifically designed for baby products.",
  },
  {
    question: "Does Mama Fern make matching family outfits?",
    answer: "Yes — matching family sets are at the heart of what we do. We design coordinating (not identical) pieces across baby, kids, mom, and dad sizes in complementary earth-tone palettes.",
  },
  {
    question: "Where is Mama Fern based?",
    answer: "Mama Fern is designed in the United States. Our products are crafted with ethical manufacturing partners who are personally vetted for fair labor practices and environmental responsibility.",
  },
  {
    question: "Is Mama Fern sustainable?",
    answer: "Sustainability is core to our mission. We use organic and natural fabrics, produce in small batches to minimize waste, use recycled packaging materials, and partner only with manufacturers who meet our environmental and labor standards.",
  },
];

const aboutOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mama Fern",
  url: SITE_CONFIG.baseUrl,
  logo: `${SITE_CONFIG.baseUrl}/logo.png`,
  description: "Mama Fern is a family apparel brand based in the United States, specializing in natural-fabric clothing for families who value comfort, sustainability, and earthy aesthetics.",
  foundingDate: "2024",
  founder: { "@type": "Organization", name: "Mama Fern" },
};

const aboutArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "About Mama Fern — Grounded Family Apparel",
  description: "Learn about Mama Fern's mission, values, and the story behind grounded family apparel for crunchy, cozy homes.",
  author: { "@type": "Organization", name: "Mama Fern", url: SITE_CONFIG.baseUrl },
  publisher: {
    "@type": "Organization",
    name: "Mama Fern",
    logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/logo.png` },
  },
  mainEntityOfPage: `${SITE_CONFIG.baseUrl}/about`,
};

export default function AboutPage() {
  return (
    <div>
      <JsonLd data={aboutOrganizationSchema} />
      <JsonLd data={aboutArticleSchema} />
      <PageHero
        eyebrow="Our Story"
        title="About Mama Fern"
        subtitle="Grounded family apparel for crunchy, cozy homes."
      />

      {/* Brand Story */}
      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up" aria-labelledby="brand-story-heading">
        <h2 id="brand-story-heading" className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6">
          What Is Mama Fern?
        </h2>
        <div className="space-y-5 text-warm-brown/80 leading-relaxed text-[15px]">
          <p>
            <strong>Mama Fern is a family apparel brand</strong> based in the United States,
            specializing in natural-fabric clothing for families who value comfort, sustainability,
            and earthy aesthetics. We design matching family sets, kids&apos; clothing, and parent
            apparel for outdoor-loving, crunchy, cottagecore-inspired families.
          </p>
          <p>
            The name &ldquo;Mama Fern&rdquo; represents everything we believe in — ferns are among
            the oldest plants on Earth, resilient and quietly beautiful. They thrive in shade and
            sun alike, grounded in the soil but always reaching toward the light. That&apos;s the
            spirit we bring to every piece of clothing we create: grounded, natural, and designed
            to grow with your family.
          </p>
          <blockquote className="border-l-2 border-sage pl-5 py-1">
            <p className="font-display text-xl text-charcoal italic leading-snug">
              &ldquo;Clothing that celebrates the grounded, cozy life — for the whole crew.&rdquo;
            </p>
          </blockquote>
          <p>
            Every piece in our collection is made from natural materials — organic cotton certified
            to GOTS standards, linen, and bamboo viscose — chosen for breathability, softness, and
            durability. We use fabrics that meet OEKO-TEX Standard 100 Class I requirements, the
            strictest textile safety level, specifically designed for baby products.
          </p>
          <p>
            Our customers are parents who care deeply about what touches their family&apos;s skin.
            Crunchy moms who choose cloth diapers and organic snacks. Cottagecore dads who love a
            good henley and a Saturday morning hike. Families who believe that what they wear can
            reflect the same values they bring to everything else — natural living, outdoor
            adventure, and togetherness.
          </p>
          <p>
            What makes Mama Fern different? We design coordinating family outfits — not identical
            matching sets, but complementary pieces in the same earthy palettes. Sage greens, warm
            browns, dusty roses, and soft creams that work together beautifully while letting each
            family member express their own style. We produce in small batches with ethical
            manufacturing partners, use recycled packaging, and price our pieces so quality
            natural-fabric clothing is accessible to real families.
          </p>
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
            cotton and other natural materials in every piece, paired with earthy patterns and
            thoughtful designs that celebrate the grounded, cozy life. Our goal is to make
            natural-fabric family clothing that&apos;s beautiful, accessible, and built to last
            through all the adventures — from playground mornings to campfire evenings.
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
                <p className="text-warm-brown/70 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand FAQ — AI-optimized Q&A */}
      <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="brand-faq-heading">
        <h2 id="brand-faq-heading" className="font-display font-bold text-2xl text-charcoal mb-8">
          Frequently Asked About Mama Fern
        </h2>
        <div className="space-y-6">
          {BRAND_FAQS.map((faq, i) => (
            <div key={i}>
              <h3 className="font-semibold text-charcoal mb-2">{faq.question}</h3>
              <p className="text-warm-brown/70 text-[15px] leading-relaxed">{faq.answer}</p>
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
