import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Style Guides",
  description:
    "Explore Mama Fern style guides — crunchy mom fashion, cottagecore family outfits, and natural fabric guides. Dress your family in grounded, nature-inspired style.",
  path: "/style-guide",
  keywords: [
    "crunchy mom style guide",
    "cottagecore family fashion",
    "natural fabric guide",
    "earthy family outfits",
  ],
});

const GUIDES = [
  {
    href: "/style-guide/crunchy-mom",
    title: "Crunchy Mom Style Guide",
    description:
      "Practical, beautiful outfit ideas for natural-living moms who want to look put-together without sacrificing comfort or values.",
    emoji: "🌿",
  },
  {
    href: "/style-guide/cottagecore-family",
    title: "Cottagecore Family Fashion Guide",
    description:
      "Coordinating family outfits inspired by the cottagecore aesthetic — soft linens, muted florals, and whimsical earth tones for the whole crew.",
    emoji: "🏡",
  },
  {
    href: "/style-guide/natural-fabric-guide",
    title: "Natural Fabric Guide for Kids & Families",
    description:
      "Everything you need to know about organic cotton, linen, bamboo, and other natural fabrics — why they matter and how to care for them.",
    emoji: "🧵",
  },
];

export default function StyleGuidesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Style Guides"
        title="Mama Fern Style Guides"
        subtitle="Practical guides for dressing your family in comfort, nature, and intention."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group bg-texture-linen rounded-xl border border-oat p-6 hover:border-sage transition-colors"
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                {g.emoji}
              </div>
              <h2 className="font-display font-bold text-lg text-charcoal mb-2 group-hover:text-fern transition-colors">
                {g.title}
              </h2>
              <p className="text-warm-brown text-sm leading-relaxed">
                {g.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
