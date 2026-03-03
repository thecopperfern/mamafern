"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

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

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl bg-cream border-stone-200 p-0 overflow-hidden"
        data-testid="quick-view-modal"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="sm:w-1/2 aspect-[3/4] relative bg-oat">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.selectedImageUrl}
              alt={product.selectedImageAlt}
              className="w-full h-full object-cover"
              data-testid="quick-view-product-image"
            />
          </div>

          {/* Product Info */}
          <div className="sm:w-1/2 p-6 flex flex-col justify-center gap-4">
            <DialogHeader className="text-left">
              {product.comingSoon && (
                <span
                  className="inline-flex self-start items-center rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-medium px-3 py-1 mb-2"
                  data-testid="quick-view-coming-soon-badge"
                >
                  Coming Soon
                </span>
              )}
              <DialogTitle
                className="text-xl font-display text-charcoal"
                data-testid="quick-view-product-title"
              >
                {product.title}
              </DialogTitle>
              <DialogDescription
                className="text-lg font-medium text-warm-brown"
                data-testid="quick-view-product-price"
              >
                {product.price}
              </DialogDescription>
            </DialogHeader>

            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="quick-view-detail-link"
            >
              <Button
                className="w-full bg-fern hover:bg-fern-dark text-white gap-2"
                size="lg"
                data-testid="quick-view-detail-button"
              >
                {product.comingSoon ? "Preview Product" : "View Full Details"}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
