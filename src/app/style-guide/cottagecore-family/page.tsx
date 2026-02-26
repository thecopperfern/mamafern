import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import InternalLinks from "@/components/seo/InternalLinks";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cottagecore Family Fashion Guide — Earthy Outfits for the Whole Crew",
  description:
    "Your guide to cottagecore family fashion: coordinating earthy outfits, linen layers, and whimsical details for moms, dads, kids, and babies. Dress your whole family in cozy, nature-inspired style.",
  path: "/style-guide/cottagecore-family",
  keywords: [
    "cottagecore family outfits",
    "cottagecore family fashion",
    "matching family earth tones",
    "linen family clothes",
    "whimsical family style",
    "nature-inspired family outfits",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cottagecore Family Fashion Guide — Earthy Outfits for the Whole Crew",
  description:
    "How to dress your whole family in coordinating cottagecore style: earthy palettes, natural fabrics, and whimsical details for every age.",
  author: { "@type": "Organization", name: "Mama Fern", url: SITE_CONFIG.baseUrl },
  publisher: {
    "@type": "Organization",
    name: "Mama Fern",
    logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/logo.png` },
  },
  mainEntityOfPage: `${SITE_CONFIG.baseUrl}/style-guide/cottagecore-family`,
};

export default function CottagecoreFamilyGuidePage() {
  return (
    <div>
      <JsonLd data={articleSchema} />
      <PageHero
        eyebrow="Style Guide"
        title="Cottagecore Family Fashion"
        subtitle="Coordinating earthy outfits for your whole crew."
      />
      <Breadcrumbs
        crumbs={[
          { label: "Style Guides", href: "/style-guide" },
          { label: "Cottagecore Family Fashion" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-14 prose-mamafern">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6">
          What Is Cottagecore Family Fashion?
        </h2>
        <div className="space-y-5 text-warm-brown/80 leading-relaxed text-[15px]">
          <p>
            Cottagecore is a lifestyle and aesthetic movement that celebrates rural simplicity —
            wildflower gardens, homemade bread, slow mornings, and a deep connection with nature.
            Cottagecore <em>family fashion</em> translates that warmth into clothing: soft natural
            fabrics, muted earthy tones, gentle patterns, and a handcrafted feel that makes every
            family photo look like a storybook page.
          </p>
          <p>
            Unlike minimalist aesthetics, cottagecore embraces texture and warmth. Think linen
            overalls on a toddler, a floral-embroidered henley on dad, a prairie-style dress on
            mom, and a tiny onesie with mushroom prints on baby. The key is coordination through
            palette and mood rather than identical pieces.
          </p>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            The Cottagecore Color Palette for Families
          </h3>
          <p>
            Cottagecore fashion draws from the natural world — think of the colors you see on a
            morning walk through a meadow:
          </p>
          <div className="flex flex-wrap gap-3 my-4">
            {[
              { color: "bg-[#D4C5A4]", name: "Wheat" },
              { color: "bg-[#8B9D77]", name: "Sage" },
              { color: "bg-[#C9A88E]", name: "Blush" },
              { color: "bg-[#E8DCC8]", name: "Cream" },
              { color: "bg-[#A0785C]", name: "Cinnamon" },
              { color: "bg-[#6B7F5E]", name: "Moss" },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${c.color} border border-oat`} />
                <span className="text-xs text-warm-brown/70">{c.name}</span>
              </div>
            ))}
          </div>
          <p>
            These tones photograph beautifully together, making them ideal for family sessions,
            holiday cards, and social media posts. Build each family member&apos;s outfit from
            the same 3-4 colors and everything coordinates automatically.
          </p>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Cottagecore Outfit Ideas by Family Member
          </h3>

          <h4 className="font-semibold text-charcoal !mt-6 !mb-2">For Mom</h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>Linen midi dress in sage or dusty rose with a woven belt</li>
            <li>Oversized cotton cardigan over a graphic tee for casual days</li>
            <li>Wide-leg linen pants paired with a fitted tee and straw hat</li>
          </ul>

          <h4 className="font-semibold text-charcoal !mt-6 !mb-2">For Dad</h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>Henley shirt in olive or wheat with rolled-up organic cotton chinos</li>
            <li>Linen button-down (untucked) in a muted earth tone</li>
            <li>Simple cotton tee in a coordinating color with canvas sneakers</li>
          </ul>

          <h4 className="font-semibold text-charcoal !mt-6 !mb-2">For Kids (2-8 years)</h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>Linen overalls or rompers — the quintessential cottagecore kid piece</li>
            <li>Cotton tee with nature-themed graphic (mushrooms, ferns, animals)</li>
            <li>Organic cotton dress with smocking or ruffle details for girls</li>
          </ul>

          <h4 className="font-semibold text-charcoal !mt-6 !mb-2">For Baby</h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>Organic cotton onesie in a matching palette color</li>
            <li>Muslin swaddle with botanical print as an accessory</li>
            <li>Bamboo sleep sack in cream or sage for cozy outdoor photos</li>
          </ul>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Styling Tips for Cottagecore Family Photos
          </h3>
          <ol className="list-decimal ml-5 space-y-3">
            <li>
              <strong>Stick to 3-4 colors maximum.</strong> Pick from the cottagecore palette
              above and make sure every family member wears at least one of those colors.
            </li>
            <li>
              <strong>Mix textures, not patterns.</strong> Combine linen, cotton, and knit
              textures rather than competing prints. If one person wears a pattern, keep others
              solid.
            </li>
            <li>
              <strong>Layer intentionally.</strong> Cardigans, vests, and scarves add visual
              interest and work perfectly for outdoor shoots where light changes.
            </li>
            <li>
              <strong>Choose natural settings.</strong> Cottagecore outfits look best in meadows,
              gardens, orchards, and woodland trails — let the clothing echo the environment.
            </li>
            <li>
              <strong>Coordinate, don&apos;t match identically.</strong> The charm of cottagecore
              is in the curated, collected feeling — not the uniformed look.
            </li>
          </ol>

          <h3 className="font-display font-bold text-xl text-charcoal !mt-10 !mb-4">
            Where to Find Cottagecore Family Clothes
          </h3>
          <p>
            At Mama Fern, cottagecore is part of our DNA. Every collection features coordinating
            pieces across baby, kid, mom, and dad sizes in soft earth tones and natural fabrics.
            We design pieces that layer together beautifully — so you can build a full family
            cottagecore wardrobe from a single drop.
          </p>
        </div>

        <div className="mt-12 bg-texture-linen rounded-xl border border-oat p-6 text-center">
          <p className="font-display font-bold text-lg text-charcoal mb-2">
            Dress your crew in cottagecore
          </p>
          <p className="text-warm-brown/70 text-sm mb-4">
            Shop coordinating family pieces in natural fabrics and earthy tones.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            Shop Family Sets
          </Link>
        </div>
      </article>

      <InternalLinks context="blog" />
    </div>
  );
}
