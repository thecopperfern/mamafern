import Link from "next/link";
import NewsletterSignup from "../NewsletterSignup";

const SHOP_LINKS = [
  { label: "All Collections", href: "/shop" },
  { label: "Moms", href: "/collections/moms" },
  { label: "Dads", href: "/collections/dads" },
  { label: "Kids", href: "/collections/kids" },
  { label: "Accessories", href: "/collections/accessories" },
];

const INFO_LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-texture-linen-dark text-white/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Mama Fern
            </h3>
            <p className="text-sm text-white/60 max-w-xs">
              Grounded family apparel for crunchy, cozy homes. Cute patterns and
              sayings in skin-friendlier fabrics.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Info
            </h4>
            <ul className="space-y-2">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <NewsletterSignup />
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mama Fern. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
