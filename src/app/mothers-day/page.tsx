import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, SITE_CONFIG } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mother's Day Gift Guide 2026",
  description:
    "Thoughtful, natural gifts for the mama in your life. Organic cotton tees, cozy crewnecks, family sets, and eco-friendly accessories — wrapped with love.",
  path: "/mothers-day",
  keywords: [
    "mothers day gifts 2026",
    "organic cotton gifts for mom",
    "natural mom gifts",
    "crunchy mom gifts",
    "mama fern mothers day",
    "family matching outfits gift",
    "eco friendly mothers day",
  ],
});

const GIFT_BUNDLES = [
  {
    name: "The Mama Bundle",
    price: "$52",
    savings: "Save ~$2",
    description:
      "Her everyday essentials — a butter-soft organic cotton tee paired with our sturdy canvas tote. Perfect for the mom who carries everything (and everyone).",
    items: ["Mama Fern Classic Tee", "Mama Fern Canvas Tote"],
    href: "/collections/mothers-day",
    icon: "🌿",
  },
  {
    name: "The Family Set",
    price: "$98",
    savings: "Save ~$10",
    description:
      "Coordinate the whole crew. Mom, dad, and baby in matching earthy tones — the family photo set that actually feels comfortable.",
    items: [
      "Mama Fern Classic Tee",
      "Papa Fern Classic Tee",
      "Little Fern Seedling Onesie",
    ],
    href: "/collections/mothers-day",
    icon: "👨‍👩‍👧",
  },
  {
    name: "The New Mama Gift",
    price: "$54",
    savings: "Free gift wrap included",
    description:
      "For the newest mama in your life — a soft tee for her and the coziest onesie for baby, wrapped in eco-friendly kraft paper with a hand-stamped seal.",
    items: [
      "Mama Fern Classic Tee",
      "Little Fern Seedling Onesie",
      "Eco-friendly gift wrapping",
    ],
    href: "/collections/mothers-day",
    icon: "🎁",
  },
  {
    name: "The Mini Match",
    price: "$52",
    savings: "Save ~$2",
    description:
      "Mom and mini in coordinating fern prints. Because the best adventures are the ones you match for.",
    items: ["Mama Fern Classic Tee", "Little Fern Sprout Tee"],
    href: "/collections/mothers-day",
    icon: "💚",
  },
];

const GIFT_IDEAS = [
  {
    title: "For the Crunchy Mama",
    description:
      "She shops organic, makes her own baby food, and believes in the power of a good linen closet. Gift her the Wildflower Tee — wildly rooted, just like her.",
    product: "Mama Fern Wildflower Tee",
    price: "$34",
    href: "/product/mama-fern-wildflower-tee",
  },
  {
    title: "For the Cozy Mama",
    description:
      "Saturday morning pancakes, a good book, and the softest crewneck she's ever owned. The Rooted Crewneck is campfire-warm without the bulk.",
    product: "Mama Fern Rooted Crewneck",
    price: "$52",
    href: "/product/mama-fern-rooted-crewneck",
  },
  {
    title: "For the On-the-Go Mama",
    description:
      "Snacks, water bottles, a spare outfit, and somehow still room for her wallet. Our organic canvas tote handles it all — and looks good doing it.",
    product: "Mama Fern Canvas Tote",
    price: "$22",
    href: "/product/mama-fern-canvas-tote",
  },
  {
    title: "For the New Mama",
    description:
      "The New Mama Gift bundle — matching tee and onesie in the softest organic cotton, wrapped in eco-friendly kraft paper. Because she deserves to feel special.",
    product: "The New Mama Gift Bundle",
    price: "$54",
    href: "/collections/mothers-day",
  },
];

const giftGuideSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Mother's Day Gift Guide 2026 — Mama Fern",
  description:
    "Thoughtful, natural gifts for the mama in your life. Organic cotton tees, cozy crewnecks, family sets, and eco-friendly accessories.",
  url: `${SITE_CONFIG.baseUrl}/mothers-day`,
  publisher: {
    "@type": "Organization",
    name: "Mama Fern",
    url: SITE_CONFIG.baseUrl,
  },
};

export default function MothersDayPage() {
  return (
    <div>
      <JsonLd data={giftGuideSchema} />
      <PageHero
        eyebrow="Mother's Day 2026"
        title="Gifts She'll Actually Love"
        subtitle="Organic cotton, earthy tones, and something for the whole crew — wrapped with love."
      />

      {/* Intro */}
      <section
        className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up"
        aria-labelledby="intro-heading"
      >
        <h2
          id="intro-heading"
          className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-6"
        >
          Thoughtful Gifts for Every Kind of Mama
        </h2>
        <p className="text-warm-brown/80 leading-relaxed text-[15px] mb-4">
          This Mother&apos;s Day, skip the generic and give something that
          actually feels like her — soft organic cotton, earthy tones, and
          designs that celebrate the grounded, cozy life she&apos;s built for
          her family.
        </p>
        <p className="text-warm-brown/80 leading-relaxed text-[15px]">
          Every piece is made from GOTS-certified organic cotton and natural
          fabrics. No polyester, no fast fashion — just clothes that feel good
          and do good. Free eco-friendly gift wrapping available at checkout.
        </p>
      </section>

      {/* Gift Bundles */}
      <section
        className="bg-texture-linen border-y border-oat py-14"
        aria-labelledby="bundles-heading"
      >
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
            Curated Sets
          </p>
          <h2
            id="bundles-heading"
            className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-10"
          >
            Gift Bundles — More Love, Better Value
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {GIFT_BUNDLES.map((bundle) => (
              <Link
                key={bundle.name}
                href={bundle.href}
                className="group bg-white rounded-xl border border-oat p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-3xl shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {bundle.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1 group-hover:text-fern transition-colors">
                      {bundle.name}
                    </h3>
                    <p className="text-fern font-semibold text-lg mb-1">
                      {bundle.price}{" "}
                      <span className="text-terracotta text-xs font-normal">
                        {bundle.savings}
                      </span>
                    </p>
                    <p className="text-warm-brown/70 text-sm leading-relaxed mb-3">
                      {bundle.description}
                    </p>
                    <ul className="text-warm-brown/70 text-xs space-y-0.5">
                      {bundle.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Ideas by Persona */}
      <section
        className="mx-auto max-w-5xl px-4 py-14"
        aria-labelledby="ideas-heading"
      >
        <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-3">
          Gift Ideas
        </p>
        <h2
          id="ideas-heading"
          className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-10"
        >
          Not Sure What to Get? We&apos;ve Got You.
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {GIFT_IDEAS.map((idea) => (
            <Link
              key={idea.title}
              href={idea.href}
              className="group block bg-texture-linen rounded-xl border border-oat p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-charcoal mb-2 group-hover:text-fern transition-colors">
                {idea.title}
              </h3>
              <p className="text-warm-brown/70 text-sm leading-relaxed mb-3">
                {idea.description}
              </p>
              <p className="text-fern font-medium text-sm">
                {idea.product} — {idea.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Shipping & Gift Wrap Info */}
      <section
        className="bg-texture-linen border-y border-oat py-14"
        aria-labelledby="shipping-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2
            id="shipping-heading"
            className="font-display font-bold text-2xl text-charcoal mb-6"
          >
            Shipping & Gift Wrapping
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl mb-2" aria-hidden="true">
                📦
              </p>
              <h3 className="font-semibold text-charcoal text-sm mb-1">
                Free Shipping Over $70
              </h3>
              <p className="text-warm-brown/70 text-xs">
                Standard shipping 5–7 business days. Expedited available.
              </p>
            </div>
            <div>
              <p className="text-2xl mb-2" aria-hidden="true">
                🎀
              </p>
              <h3 className="font-semibold text-charcoal text-sm mb-1">
                Eco-Friendly Gift Wrap
              </h3>
              <p className="text-warm-brown/70 text-xs">
                Recycled kraft paper with a hand-stamped Mama Fern seal. Add at
                checkout.
              </p>
            </div>
            <div>
              <p className="text-2xl mb-2" aria-hidden="true">
                💌
              </p>
              <h3 className="font-semibold text-charcoal text-sm mb-1">
                Gift Note Included
              </h3>
              <p className="text-warm-brown/70 text-xs">
                Every gift-wrapped order includes a blank note card for your
                message.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Collection CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-4">
          Ready to Shop?
        </h2>
        <p className="text-warm-brown/70 text-[15px] mb-8 max-w-lg mx-auto">
          Browse the full Mother&apos;s Day collection — every piece is organic,
          cozy, and made with the kind of care she puts into everything.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collections/mothers-day"
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            Shop Mother&apos;s Day
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center bg-white border border-oat hover:border-fern text-charcoal font-medium px-8 py-2.5 rounded-md transition-colors text-sm"
          >
            Shop All
          </Link>
        </div>
      </section>
    </div>
  );
}
