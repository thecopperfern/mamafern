import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import InternalLinks from "@/components/seo/InternalLinks";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Natural Fabric Guide — Organic Cotton, Linen, Bamboo & More",
  description:
    "Complete guide to natural fabrics for kids and families: organic cotton, linen, bamboo viscose, and hemp. Learn what each fabric offers, how to care for it, and why it matters for your family.",
  path: "/style-guide/natural-fabric-guide",
  keywords: [
    "natural fabric guide",
    "organic cotton vs bamboo",
    "best fabric for baby clothes",
    "linen for kids",
    "GOTS certified cotton",
    "OEKO-TEX Standard 100",
    "natural fabric care",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Natural Fabric Guide — Organic Cotton, Linen, Bamboo & More",
  description:
    "Everything families need to know about natural fabrics: types, certifications, benefits, and care instructions for organic cotton, linen, bamboo, and hemp.",
  author: { "@type": "Organization", name: "Mama Fern", url: SITE_CONFIG.baseUrl },
  publisher: {
    "@type": "Organization",
    name: "Mama Fern",
    logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/logo.png` },
  },
  mainEntityOfPage: `${SITE_CONFIG.baseUrl}/style-guide/natural-fabric-guide`,
};

const FABRICS = [
  {
    name: "Organic Cotton (GOTS Certified)",
    icon: "🌱",
    pros: [
      "Softest hand feel, ideal for sensitive baby skin",
      "Grown without synthetic pesticides or fertilizers",
      "GOTS certification covers environmental and social criteria",
      "Hypoallergenic and breathable year-round",
    ],
    cons: [
      "Tends to wrinkle more than synthetics",
      "May shrink slightly on first wash (pre-washed options available)",
    ],
    bestFor: "Everyday tees, onesies, pajamas, swaddles — anything that touches skin for extended periods.",
    care: "Machine wash cold, tumble dry low. Organic cotton softens with each wash.",
  },
  {
    name: "Linen",
    icon: "🌾",
    pros: [
      "Exceptionally breathable — stays cool in summer heat",
      "Naturally antimicrobial and odor-resistant",
      "Gets softer and more beautiful with every wash",
      "One of the most eco-friendly natural fibers (flax requires minimal water)",
    ],
    cons: [
      "Wrinkles easily (though many consider this part of its charm)",
      "Can feel stiff when new — softens significantly after 3-5 washes",
    ],
    bestFor: "Summer dresses, overalls, button-downs, wide-leg pants, family photo outfits.",
    care: "Machine wash cold on gentle cycle. Hang dry or tumble dry low. Iron while damp for a crisp look, or embrace the wrinkles.",
  },
  {
    name: "Bamboo Viscose",
    icon: "🎋",
    pros: [
      "Silky-soft feel, excellent for sensitive skin",
      "Natural moisture-wicking and temperature-regulating",
      "Naturally antibacterial",
      "Drapes beautifully — flattering on all body types",
    ],
    cons: [
      "Processing from bamboo to viscose uses chemicals (look for OEKO-TEX certification)",
      "Less durable than cotton or linen — better for low-friction garments",
    ],
    bestFor: "Sleep sacks, loungewear, base layers, joggers, leggings.",
    care: "Machine wash cold on gentle cycle. Avoid high heat — hang dry or tumble dry on low.",
  },
  {
    name: "Hemp",
    icon: "🌿",
    pros: [
      "Exceptionally durable — one of the strongest natural fibers",
      "Requires minimal water and no pesticides to grow",
      "UV-resistant and naturally antimicrobial",
      "Gets softer with every wash without losing strength",
    ],
    cons: [
      "Can feel rough when pure — blends with cotton solve this",
      "More limited color options due to fiber structure",
    ],
    bestFor: "Outerwear, jackets, durable pants, tote bags, accessories.",
    care: "Machine wash warm. Tumble dry medium. Hemp is extremely low-maintenance and ages beautifully.",
  },
];

export default function NaturalFabricGuidePage() {
  return (
    <div>
      <JsonLd data={articleSchema} />
      <PageHero
        eyebrow="Style Guide"
        title="Natural Fabric Guide"
        subtitle="Everything your family needs to know about organic cotton, linen, bamboo, and hemp."
      />
      <Breadcrumbs
        crumbs={[
          { label: "Style Guides", href: "/style-guide" },
          { label: "Natural Fabric Guide" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-14 prose-mamafern">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6">
          Why Natural Fabrics Matter for Families
        </h2>
        <div className="space-y-5 text-warm-brown leading-relaxed text-[15px]">
          <p>
            Children&apos;s skin is up to 5 times thinner than adult skin, making it far more
            susceptible to irritation from synthetic dyes, chemical finishes, and petroleum-based
            fibers. Natural fabrics — organic cotton, linen, bamboo, and hemp — are gentler, more
            breathable, and free from many of the chemicals found in conventional textiles.
          </p>
          <p>
            Beyond skin safety, choosing natural fabrics is an environmental decision. The fashion
            industry accounts for roughly 10% of global carbon emissions. Natural fibers biodegrade,
            require fewer toxic chemicals in production, and often use less water than their
            synthetic counterparts (especially linen and hemp).
          </p>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Understanding Fabric Certifications
          </h3>
          <p>
            Not all &ldquo;natural&rdquo; labels are meaningful. Here are the certifications that
            actually matter:
          </p>
          <ul className="list-disc ml-5 space-y-3">
            <li>
              <strong>GOTS (Global Organic Textile Standard)</strong> — the gold standard for
              organic textiles. Covers the entire supply chain from farm to finished product,
              including environmental and social criteria. Look for GOTS certification on organic
              cotton products.
            </li>
            <li>
              <strong>OEKO-TEX Standard 100</strong> — tests for harmful substances in finished
              textiles. <strong>Class I</strong> is the strictest level, specifically designed for
              baby products (items that may be put in the mouth). All Mama Fern fabrics meet this
              standard.
            </li>
            <li>
              <strong>Fair Trade Certified</strong> — ensures fair wages and safe working
              conditions for textile workers. Important for the social side of sustainability.
            </li>
            <li>
              <strong>USDA Organic</strong> — certifies that cotton was grown without synthetic
              pesticides or GMOs. This covers the raw material, not the manufacturing process
              (which is where GOTS adds value).
            </li>
          </ul>
        </div>

        {/* Fabric deep dives */}
        <h2 className="font-display font-bold text-2xl text-charcoal mt-14 mb-8">
          Fabric-by-Fabric Breakdown
        </h2>
        <div className="space-y-10">
          {FABRICS.map((fabric) => (
            <div
              key={fabric.name}
              className="bg-texture-linen rounded-xl border border-oat p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" aria-hidden="true">{fabric.icon}</span>
                <h3 className="font-display font-bold text-lg text-charcoal">{fabric.name}</h3>
              </div>
              <div className="space-y-4 text-warm-brown text-[15px] leading-relaxed">
                <div>
                  <h4 className="font-semibold text-charcoal text-sm mb-1">Pros</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    {fabric.pros.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal text-sm mb-1">Cons</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    {fabric.cons.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
                <p>
                  <strong>Best for:</strong> {fabric.bestFor}
                </p>
                <p>
                  <strong>Care:</strong> {fabric.care}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference table */}
        <h3 className="font-display font-bold text-xl text-charcoal mt-14 mb-4">
          Quick Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-warm-brown border border-oat rounded-lg">
            <thead>
              <tr className="bg-texture-linen text-charcoal">
                <th className="text-left p-3 font-semibold">Fabric</th>
                <th className="text-left p-3 font-semibold">Softness</th>
                <th className="text-left p-3 font-semibold">Durability</th>
                <th className="text-left p-3 font-semibold">Breathability</th>
                <th className="text-left p-3 font-semibold">Eco Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Organic Cotton", s: "★★★★★", d: "★★★★☆", b: "★★★★☆", e: "★★★★★" },
                { name: "Linen", s: "★★★★☆", d: "★★★★★", b: "★★★★★", e: "★★★★★" },
                { name: "Bamboo Viscose", s: "★★★★★", d: "★★★☆☆", b: "★★★★★", e: "★★★☆☆" },
                { name: "Hemp", s: "★★★☆☆", d: "★★★★★", b: "★★★★☆", e: "★★★★★" },
              ].map((r) => (
                <tr key={r.name} className="border-t border-oat">
                  <td className="p-3 font-medium text-charcoal">{r.name}</td>
                  <td className="p-3">{r.s}</td>
                  <td className="p-3">{r.d}</td>
                  <td className="p-3">{r.b}</td>
                  <td className="p-3">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 bg-texture-linen rounded-xl border border-oat p-6 text-center">
          <p className="font-display font-bold text-lg text-charcoal mb-2">
            Shop natural-fabric family clothing
          </p>
          <p className="text-warm-brown text-sm mb-4">
            Every Mama Fern piece is made from OEKO-TEX certified natural fabrics.
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
