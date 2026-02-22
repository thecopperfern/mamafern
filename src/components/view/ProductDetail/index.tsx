"use client";

import { useState } from "react";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
      <ProductCarousel images={product.images} />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold font-display text-charcoal">
            {product.title}
          </h1>
          <WishlistButton handle={product.handle} title={product.title} />
        </div>
        <p className="text-sm text-warm-brown/70">{product.description}</p>
        <ProductOptions
          selectedOptions={selectedOptions}
          setSelectedOptions={handleSelectOptions}
          options={product.options}
        />
        <ProductPrice priceRange={product.priceRange} />
        {selectedVariant && !selectedVariant.availableForSale && (
          <p className="text-sm text-terracotta">Out of stock</p>
        )}
        <Button
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={handleAddToCart}
          className="bg-fern hover:bg-fern-dark text-white"
        >
          Add to Cart
        </Button>
        <ShareButtons title={product.title} handle={product.handle} />
      </div>
      <div className="md:col-span-3">
        <ProductReviews productHandle={product.handle} />
      </div>
    </div>
  );
}
