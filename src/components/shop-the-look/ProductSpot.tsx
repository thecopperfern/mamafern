"use client";

import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

interface Product {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  productUrl: string;
  selectedImageUrl: string;
  selectedImageAlt: string;
  comingSoon: boolean;
}

interface ProductSpotProps {
  product: Product;
}

export default function ProductSpot({ product }: ProductSpotProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="group text-left w-full focus-visible:outline-2 focus-visible:outline-fern focus-visible:outline-offset-2 rounded-xl"
        data-testid={`product-spot-${product.shopifyHandle}`}
      >
        {/* Image Card */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-100 shadow-sm bg-oat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.selectedImageUrl}
            alt={product.selectedImageAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`product-spot-image-${product.shopifyHandle}`}
          />

          {/* Coming Soon Badge */}
          {product.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="bg-white/80 backdrop-blur-sm text-stone-700 text-xs font-medium px-3 py-1 rounded-full"
                data-testid={`coming-soon-badge-${product.shopifyHandle}`}
              >
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-2 px-0.5">
          <p
            className="text-sm font-medium text-charcoal group-hover:text-fern transition-colors"
            data-testid={`product-title-${product.shopifyHandle}`}
          >
            {product.title}
          </p>
          <p
            className="text-sm text-warm-brown"
            data-testid={`product-price-${product.shopifyHandle}`}
          >
            {product.price}
          </p>
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
