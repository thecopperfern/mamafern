"use client";

import { useState } from "react";
import Image from "next/image";
import QuickViewModal from "./QuickViewModal";
import type { LookProduct } from "@/types/looks";

type ProductSpotProps = {
  product: LookProduct;
};

export default function ProductSpot({ product }: ProductSpotProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="group text-left w-full"
        aria-label={`View ${product.title}`}
      >
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-stone-100 shadow-sm bg-oat">
          <Image
            src={product.selectedImageUrl}
            alt={product.selectedImageAlt || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
            unoptimized
          />
          {product.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/80 backdrop-blur-sm text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        <div className="mt-2.5 px-0.5">
          <p className="text-sm text-charcoal font-medium truncate">
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
