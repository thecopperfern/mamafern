"use client";

import { useState } from "react";
import Image from "next/image";
import QuickViewModal from "./QuickViewModal";
import type { LookProduct } from "@/types/looks";

const BADGE_COLORS: Record<string, string> = {
  default: "bg-white/80 text-stone-700",
  success: "bg-emerald-100/90 text-emerald-800",
  warning: "bg-amber-100/90 text-amber-800",
  danger: "bg-red-100/90 text-red-800",
  info: "bg-blue-100/90 text-blue-800",
};

interface ProductSpotProps {
  product: LookProduct;
}

export default function ProductSpot({ product }: ProductSpotProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const badgeClass = product.badge
    ? BADGE_COLORS[product.badge.variant] || BADGE_COLORS.default
    : "";

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="group text-left w-full focus-visible:outline-2 focus-visible:outline-fern focus-visible:outline-offset-2 rounded-xl"
        aria-label={`View ${product.title}`}
        data-testid={`product-spot-${product.id}`}
      >
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-stone-100 shadow-sm bg-oat">
          {product.selectedImageUrl && (
            <Image
              src={product.selectedImageUrl}
              alt={product.selectedImageAlt || product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
              unoptimized
            />
          )}
          {product.badge && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full ${badgeClass}`}
              >
                {product.badge.text}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2.5 px-0.5">
          <p className="text-sm text-charcoal font-medium truncate group-hover:text-fern transition-colors">
            {product.title}
          </p>
          <p className="text-sm text-warm-brown">{product.price}</p>
        </div>
      </button>

      <QuickViewModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
