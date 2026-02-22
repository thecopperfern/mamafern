import Link from "next/link";

const CATEGORIES = [
  {
    label: "Moms",
    href: "/collections/moms",
    color: "from-blush/40 to-cream",
  },
  {
    label: "Dads",
    href: "/collections/dads",
    color: "from-sage/40 to-cream",
  },
  {
    label: "Kids",
    href: "/collections/kids",
    color: "from-terracotta-light/30 to-cream",
  },
  {
    label: "Accessories",
    href: "/collections/accessories",
    color: "from-oat to-cream",
  },
];

export default function CategoryCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-8 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden rounded-xl h-48 flex items-end p-4 bg-gradient-to-t border border-oat hover:shadow-md transition-shadow"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-t ${cat.color} group-hover:opacity-80 transition-opacity`}
            />
            <span className="relative z-10 font-display font-bold text-lg text-charcoal">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
