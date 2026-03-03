"use client";

import { useState } from "react";
import Image from "next/image";
import type { LookHotspot as HotspotType, LookProduct } from "@/types/looks";

interface LookHotspotProps {
  hotspot: HotspotType;
  product: LookProduct;
}

/**
 * Animated pulsing dot on the hero image.
 * Hover shows a tooltip with product thumbnail, name, and price.
 * Click scrolls to the product card or opens the product URL.
 */
export default function LookHotspot({ hotspot, product }: LookHotspotProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // Try to scroll to the product card
    const el = document.querySelector(`[data-testid="product-spot-${product.id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Fallback: open product URL
    if (product.productUrl) {
      window.location.href = product.productUrl;
    }
  };

  return (
    <button
      className="absolute z-20 group"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      onClick={handleClick}
      aria-label={`View ${product.title} — ${product.price}`}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fern/60" />
        <span className="relative inline-flex rounded-full h-5 w-5 bg-fern border-2 border-white shadow-md" />
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden pointer-events-none z-30">
          {product.selectedImageUrl && (
            <div className="relative w-full h-24">
              <Image
                src={product.selectedImageUrl}
                alt={product.selectedImageAlt || product.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="p-2.5">
            <p className="text-xs font-medium text-charcoal truncate">
              {product.title}
            </p>
            <p className="text-xs text-warm-brown">{product.price}</p>
          </div>
        </div>
      )}
    </button>
  );
}
