import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GuaranteeBanner — "100% satisfaction or your money back" banner
 *
 * Prominent guarantee statement for homepage placement.
 * Builds trust before first purchase.
 */
export default function GuaranteeBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-fern/5 border border-fern/15 rounded-xl px-6 py-5 flex items-center gap-4",
        className
      )}
    >
      <ShieldCheck className="h-8 w-8 text-fern shrink-0" aria-hidden="true" />
      <div>
        <p className="font-display font-bold text-charcoal text-sm">
          100% Satisfaction Guarantee
        </p>
        <p className="text-xs text-charcoal/70 mt-0.5">
          Love it or return it within 30 days, no questions asked. We stand behind every stitch.
        </p>
      </div>
    </div>
  );
}
