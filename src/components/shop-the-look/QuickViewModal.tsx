"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { LookProduct } from "@/types/looks";

type QuickViewModalProps = {
  product: LookProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-cream">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Quick view of {product.title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative aspect-[3/4] w-full sm:w-48 flex-shrink-0 rounded-xl overflow-hidden bg-oat">
            <Image
              src={product.selectedImageUrl}
              alt={product.selectedImageAlt || product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-between py-1">
            {product.comingSoon && (
              <span className="inline-block w-fit bg-terracotta-light/20 text-terracotta border border-terracotta/20 text-xs font-medium px-3 py-1 rounded-full mb-2">
                Coming Soon
              </span>
            )}
            <div>
              <h3 className="font-display text-xl text-charcoal mb-1">
                {product.title}
              </h3>
              <p className="text-warm-brown text-base font-medium">
                {product.price}
              </p>
            </div>

            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-fern text-white text-sm font-medium px-5 py-2.5 hover:bg-fern-dark transition-colors"
            >
              {product.comingSoon ? "Preview Product \u2192" : "View Full Details \u2192"}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
