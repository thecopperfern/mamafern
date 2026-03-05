import { Leaf, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const badges = [
  {
    icon: Leaf,
    label: "Organic & Natural Fabrics",
    description: "Skin-friendly materials",
  },
  {
    icon: Truck,
    label: "Free Shipping $50+",
    description: "On all US orders",
  },
  {
    icon: ShieldCheck,
    label: "Secure Checkout",
    description: "SSL encrypted payment",
  },
  {
    icon: RefreshCw,
    label: "30-Day Returns",
    description: "Hassle-free exchanges",
  },
];

/**
 * TrustBadges — Row of trust/credibility badges
 *
 * Displayed below Add to Cart on product pages and on the homepage.
 * Uses Lucide icons with brand colors. Fully accessible with aria-labels.
 */
export default function TrustBadges({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
      role="list"
      aria-label="Trust and guarantee badges"
    >
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-oat/50"
          role="listitem"
        >
          <badge.icon
            className="h-5 w-5 text-fern"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-charcoal leading-tight">
            {badge.label}
          </span>
          <span className="text-[10px] text-charcoal/60 leading-tight">
            {badge.description}
          </span>
        </div>
      ))}
    </div>
  );
}
