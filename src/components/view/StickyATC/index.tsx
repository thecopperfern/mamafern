"use client";

import { useEffect, useState, RefObject } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  variantTitle?: string;
  price: string;
  currencyCode: string;
  disabled: boolean;
  onAddToCart: () => void;
  observeRef: RefObject<HTMLButtonElement | null>;
};

export default function StickyATC({
  title,
  variantTitle,
  price,
  currencyCode,
  disabled,
  onAddToCart,
  observeRef,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = observeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeRef]);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(parseFloat(price || "0"));

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream border-t border-oat shadow-lg transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-charcoal truncate">{title}</p>
          {variantTitle && variantTitle !== "Default Title" && (
            <p className="text-xs text-warm-brown/70 truncate">{variantTitle}</p>
          )}
        </div>
        <span className="text-sm font-semibold text-charcoal shrink-0">
          {formattedPrice}
        </span>
        <Button
          size="sm"
          disabled={disabled}
          onClick={onAddToCart}
          className="bg-fern hover:bg-fern-dark text-white shrink-0"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
