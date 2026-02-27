import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import InternalLinks from "@/components/seo/InternalLinks";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Crunchy Mom Style Guide — What to Wear as a Natural-Living Mom",
  description:
    "The ultimate crunchy mom style guide: outfit ideas, wardrobe staples, and natural-fabric picks for moms who choose organic, eco-conscious living. Practical fashion for real life.",
  path: "/style-guide/crunchy-mom",
  keywords: [
    "crunchy mom style",
    "crunchy mom outfits",
    "natural mom fashion",
    "eco mom wardrobe",
    "organic cotton mom clothes",
    "earthy mom style",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Crunchy Mom Style Guide — What to Wear as a Natural-Living Mom",
  description:
    "Practical wardrobe guide for crunchy moms: natural fabrics, earthy color palettes, and outfit formulas that look great without compromising your values.",
  author: { "@type": "Organization", name: "Mama Fern", url: SITE_CONFIG.baseUrl },
  publisher: {
    "@type": "Organization",
    name: "Mama Fern",
    logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/logo.png` },
  },
  mainEntityOfPage: `${SITE_CONFIG.baseUrl}/style-guide/crunchy-mom`,
};

export default function CrunchyMomStyleGuidePage() {
  return (
    <div>
      <JsonLd data={articleSchema} />
      <PageHero
        eyebrow="Style Guide"
        title="Crunchy Mom Style Guide"
        subtitle="Practical, beautiful fashion for natural-living moms."
      />
      <Breadcrumbs
        crumbs={[
          { label: "Style Guides", href: "/style-guide" },
          { label: "Crunchy Mom Style" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-14 prose-mamafern">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6">
          What Is Crunchy Mom Style?
        </h2>
        <div className="space-y-5 text-warm-brown leading-relaxed text-[15px]">
          <p>
            &ldquo;Crunchy mom&rdquo; is a term for mothers who lean into natural, eco-conscious
            living — cloth diapers, organic food, babywearing, gentle parenting, and a deep
            respect for the planet. Crunchy mom <em>style</em> is the fashion extension of that
            philosophy: clothing made from natural fabrics, in earthy color palettes, designed for
            real life with kids.
          </p>
          <p>
            Think of it as the intersection of comfort and intention. Crunchy mom fashion isn&apos;t
            about looking &ldquo;granola&rdquo; — it&apos;s about choosing pieces that align with
            your values without sacrificing aesthetics. The modern crunchy mom wardrobe is
            polished, versatile, and built to handle everything from school drop-off to a weekend
            farmers market outing.
          </p>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Crunchy Mom Wardrobe Staples
          </h3>
          <p>
            Building a crunchy mom wardrobe starts with versatile basics in natural fabrics.
            Here are the essentials:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>
              <strong>Organic cotton tees and tanks</strong> — the foundation of every outfit.
              Look for GOTS-certified organic cotton for the softest, most responsibly made options.
            </li>
            <li>
              <strong>Linen-blend pants or wide-leg trousers</strong> — breathable, relaxed, and
              effortlessly stylish. Perfect for warm weather and layering.
            </li>
            <li>
              <strong>Oversized cardigans or kimonos</strong> — ideal layering pieces for
              babywearing or chilly mornings. Hemp and cotton blends drape beautifully.
            </li>
            <li>
              <strong>High-waisted joggers</strong> — for the days when comfort is non-negotiable.
              Choose organic French terry or bamboo viscose.
            </li>
            <li>
              <strong>A versatile earth-tone dress</strong> — a linen or cotton midi dress in
              sage, terracotta, or dusty rose that works for playdates and date nights.
            </li>
          </ul>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            The Crunchy Mom Color Palette
          </h3>
          <p>
            Earth tones are the backbone of the crunchy mom aesthetic. These colors are easy to
            mix, match, and coordinate with your kids&apos; outfits:
          </p>
          <div className="flex flex-wrap gap-3 my-4">
            {[
              { color: "bg-[#8B9D77]", name: "Sage Green" },
              { color: "bg-[#7C5C42]", name: "Warm Brown" },
              { color: "bg-[#C9A88E]", name: "Dusty Rose" },
              { color: "bg-[#F0E6D4]", name: "Oat Cream" },
              { color: "bg-[#5C7A5C]", name: "Forest" },
              { color: "bg-[#C97B4B]", name: "Terracotta" },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${c.color} border border-oat`} />
                <span className="text-xs text-warm-brown">{c.name}</span>
              </div>
            ))}
          </div>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Fabric Guide for Crunchy Moms
          </h3>
          <p>
            The fabrics you choose matter as much as the style. Here&apos;s what to look for:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>
              <strong>Organic cotton (GOTS certified)</strong> — soft, breathable, and grown
              without pesticides. The gold standard for everyday wear.
            </li>
            <li>
              <strong>Linen</strong> — naturally antimicrobial, highly breathable, and gets
              softer with every wash. Perfect for warm climates.
            </li>
            <li>
              <strong>Bamboo viscose</strong> — silky-soft with natural moisture-wicking
              properties. Great for activewear and loungewear.
            </li>
            <li>
              <strong>Hemp</strong> — incredibly durable and eco-friendly. Blends beautifully
              with cotton for a softer hand feel.
            </li>
          </ul>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Outfit Formulas That Work
          </h3>
          <p>
            When in doubt, these three formulas cover 90% of crunchy mom life:
          </p>
          <ol className="list-decimal ml-5 space-y-3">
            <li>
              <strong>The Playground Run:</strong> Organic cotton graphic tee + high-waisted
              joggers + slip-on sneakers. Simple, comfy, and looks intentional.
            </li>
            <li>
              <strong>The Market Morning:</strong> Linen midi dress + woven sandals + canvas
              tote. Throw a cardigan over it for cool mornings.
            </li>
            <li>
              <strong>The Outdoor Adventure:</strong> Henley top + linen-blend pants + hiking
              boots. Layer with a hemp-cotton jacket when the trail gets shady.
            </li>
          </ol>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Coordinate with Your Kids
          </h3>
          <p>
            The best part of crunchy mom style? It coordinates beautifully with kids&apos; outfits.
            At Mama Fern, we design matching family palettes — not identical outfits, but
            complementary pieces in the same earth-tone range. Mom in a sage sweatshirt, toddler
            in a matching sage romper, baby in a sage onesie — coordinated without being costumey.
          </p>
        </div>

        <div className="mt-12 bg-texture-linen rounded-xl border border-oat p-6 text-center">
          <p className="font-display font-bold text-lg text-charcoal mb-2">
            Ready to build your crunchy mom wardrobe?
          </p>
          <p className="text-warm-brown text-sm mb-4">
            Shop natural-fabric pieces designed for real crunchy mom life.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            Shop Mama Fern
          </Link>
        </div>
      </article>

      <InternalLinks context="blog" />
    </div>
  );
}
