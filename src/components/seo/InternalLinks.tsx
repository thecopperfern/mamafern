import Link from "next/link";

type InternalLinksContext = "product" | "collection" | "blog";

interface InternalLinksProps {
  context: InternalLinksContext;
}

const LINKS: Record<InternalLinksContext, { label: string; href: string; desc: string }[]> = {
  product: [
    { label: "Shop All Collections", href: "/shop", desc: "Browse our full catalog" },
    { label: "Our Story", href: "/about", desc: "Learn about Mama Fern" },
    { label: "Style Guides", href: "/blog", desc: "Inspiration and tips from our journal" },
    { label: "FAQ", href: "/faq", desc: "Common questions, answered" },
  ],
  collection: [
    { label: "Shop All", href: "/shop", desc: "See every collection" },
    { label: "Natural Fabric Guide", href: "/blog/best-natural-fabric-kids-clothes", desc: "Why natural fabrics matter" },
    { label: "Our Story", href: "/about", desc: "The Mama Fern mission" },
    { label: "Community", href: "/community", desc: "Join grounded families" },
  ],
  blog: [
    { label: "Shop the Collection", href: "/shop", desc: "Find your family's look" },
    { label: "Our Story", href: "/about", desc: "Meet the Mama Fern team" },
    { label: "More Articles", href: "/blog", desc: "Browse the full journal" },
    { label: "Community", href: "/community", desc: "Connect with families like yours" },
  ],
};

/**
 * Internal linking component for SEO.
 * Renders contextual "Explore More" links at the bottom of pages.
 */
export default function InternalLinks({ context }: InternalLinksProps) {
  const links = LINKS[context];

  return (
    <nav className="mt-12 pt-8 border-t border-oat" aria-label="Explore more from Mama Fern">
      <h2 className="font-display font-bold text-lg text-charcoal mb-4">
        Explore More
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block bg-texture-linen rounded-lg border border-oat p-4 hover:border-fern/30 transition-colors group"
          >
            <span className="text-sm font-medium text-charcoal group-hover:text-fern transition-colors">
              {link.label}
            </span>
            <span className="block text-xs text-charcoal/75 mt-0.5">
              {link.desc}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
