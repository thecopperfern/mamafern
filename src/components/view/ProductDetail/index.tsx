"use client";

import { useState, useRef } from "react";
import type { CommerceProduct, CommerceVariant } from "@/lib/commerce";
import ProductCarousel from "@/components/view/ProductCarousel";
import ProductPrice from "@/components/view/ProductCard/ProductPrice";
import ProductOptions from "@/components/view/ProductOptions";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/atoms/cart";
import { toast } from "sonner";
import ShareButtons from "@/components/view/ShareButtons";
import WishlistButton from "@/components/view/WishlistButton";
import { trackEvent } from "@/components/view/Analytics";
import ProductReviews from "@/components/view/ProductReviews";
import StickyATC from "@/components/view/StickyATC";
import NotifyMe from "@/components/view/NotifyMe";
import FabricSpecs from "@/components/view/FabricSpecs";

export default function ProductDetail({
  product,
}: {
  product: CommerceProduct;
}) {
  const { addItem } = useCartActions();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] = useState<CommerceVariant>();
  const atcButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectOptions = (options: Record<string, string>) => {
    const variant = product.variants.find((v) => {
      return Object.keys(options).every((key) => {
        return v.selectedOptions.some(
          (opt) => opt.name === key && opt.value === options[key]
        );
      });
    });
    setSelectedVariant(variant);
    setSelectedOptions(options);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(selectedVariant.id, 1);
      toast.success(`${product.title} added to cart`);
      trackEvent("add_to_cart", "ecommerce", product.title);
    }
  };

  const isOOS = !!selectedVariant && !selectedVariant.availableForSale;
  const atcDisabled = !selectedVariant || isOOS;

  // Price shown in sticky bar — use selected variant price or product min
  const stickyPrice = selectedVariant
    ? selectedVariant.price.amount
    : product.priceRange.minVariantPrice.amount;
  const stickyCurrency = selectedVariant
    ? selectedVariant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
        <ProductCarousel images={product.images} />
        <div className="flex flex-col gap-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold font-display text-charcoal">
              {product.title}
            </h1>
            <WishlistButton handle={product.handle} title={product.title} />
          </div>
          <p className="text-sm text-charcoal/85">{product.description}</p>
          <ProductOptions
            selectedOptions={selectedOptions}
            setSelectedOptions={handleSelectOptions}
            options={product.options}
          />
          <ProductPrice priceRange={product.priceRange} />

          <FabricSpecs />

          {isOOS ? (
            <NotifyMe
              productTitle={product.title}
              variantTitle={selectedVariant?.title}
            />
          ) : (
            <Button
              ref={atcButtonRef}
              disabled={atcDisabled}
              onClick={handleAddToCart}
              className="bg-fern hover:bg-fern-dark text-white"
            >
              {selectedVariant ? "Add to Cart" : "Select Options"}
            </Button>
          )}

          <ShareButtons title={product.title} handle={product.handle} />
        </div>
        <div className="md:col-span-3">
          <ProductReviews productHandle={product.handle} />
        </div>
      </div>

      {/* Sticky ATC — mobile only, appears when main button scrolls out of view */}
      <StickyATC
        title={product.title}
        variantTitle={selectedVariant?.title}
        price={stickyPrice}
        currencyCode={stickyCurrency}
        disabled={atcDisabled}
        onAddToCart={handleAddToCart}
        observeRef={atcButtonRef}
      />
    </>
  );
}
