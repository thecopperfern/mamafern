"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useCartActions } from "@/lib/atoms/cart";
import { toast } from "sonner";
import type { LookProduct } from "@/types/looks";

const BADGE_COLORS: Record<string, string> = {
  default: "bg-stone-100 border-stone-200 text-stone-700",
  success: "bg-emerald-100 border-emerald-200 text-emerald-800",
  warning: "bg-amber-100 border-amber-200 text-amber-800",
  danger: "bg-red-100 border-red-200 text-red-800",
  info: "bg-blue-100 border-blue-200 text-blue-800",
};

interface QuickViewModalProps {
  product: LookProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  const { addItem } = useCartActions();

  if (!product) return null;

  const isExternal =
    product.productUrl?.startsWith("http://") ||
    product.productUrl?.startsWith("https://");

  const canAddToCart = !!product.variantId;

  const handleAddToCart = async () => {
    if (!product.variantId) return;
    try {
      await addItem(product.variantId, 1);
      toast.success(`${product.title} added to cart`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const badgeClass = product.badge
    ? BADGE_COLORS[product.badge.variant] || BADGE_COLORS.default
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl bg-cream border-stone-200 p-0 overflow-hidden"
        data-testid="quick-view-modal"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/2 aspect-[3/4] relative bg-oat">
            {product.selectedImageUrl && (
              <Image
                src={product.selectedImageUrl}
                alt={product.selectedImageAlt || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            )}
          </div>

          <div className="sm:w-1/2 p-6 flex flex-col justify-center gap-4">
            <DialogHeader className="text-left">
              {product.badge && (
                <span
                  className={`inline-flex self-start items-center rounded-full border text-xs font-medium px-3 py-1 mb-2 ${badgeClass}`}
                >
                  {product.badge.text}
                </span>
              )}
              <DialogTitle className="text-xl font-display text-charcoal">
                {product.title}
              </DialogTitle>
              <DialogDescription className="text-lg font-medium text-warm-brown">
                {product.price}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              {canAddToCart && (
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-fern hover:bg-fern-dark text-white gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  Add to Cart
                </Button>
              )}

              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Button
                    variant={canAddToCart ? "outline" : "default"}
                    className={`w-full gap-2 ${
                      !canAddToCart
                        ? "bg-fern hover:bg-fern-dark text-white"
                        : ""
                    }`}
                    size="lg"
                  >
                    {product.badge?.text === "Coming Soon"
                      ? "Preview Product"
                      : "View Full Details"}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
