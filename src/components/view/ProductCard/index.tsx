"use client";

import { Button } from "@/components/ui/button";
import type { CommerceProduct } from "@/lib/commerce";
import Image from "next/image";
import ProductPrice from "./ProductPrice";
import { useRouter } from "next/navigation";
import WishlistButton from "../WishlistButton";
import { useCartActions } from "@/lib/atoms/cart";
import { toast } from "sonner";
import { motion, cardHover } from "@/lib/motion";

const ProductCard = ({ product }: { product: CommerceProduct }) => {
  const router = useRouter();
  const { addItem } = useCartActions();

  // Single variant = only one option and it's the default (no real choices)
  const isSingleVariant =
    product.variants.length === 1 &&
    product.variants[0].selectedOptions.every(
      (opt) => opt.value === "Default Title"
    );

  const handleCardClick = () => {
    router.push(`/product/${product.handle}`);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSingleVariant) {
      addItem(product.variants[0].id, 1);
      toast.success(`${product.title} added to cart`);
    } else {
      router.push(`/product/${product.handle}`);
    }
  };

  return (
    <motion.div
      role="button"
      className="group flex flex-col gap-2"
      onClick={handleCardClick}
      whileHover={cardHover.whileHover}
      transition={cardHover.transition}
    >
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-oat">
        <WishlistButton
          handle={product.handle}
          title={product.title}
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
        />
        {product.featuredImage?.url || product.images[0]?.url ? (
          <Image
            src={product.featuredImage?.url ?? product.images[0]?.url}
            alt={product.featuredImage?.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-oat flex items-center justify-center text-warm-brown/70">
            No image
          </div>
        )}
      </div>
      <h3 className="font-medium text-charcoal">{product.title}</h3>
      <ProductPrice priceRange={product.priceRange} />
      <Button
        className="bg-fern hover:bg-fern-dark text-white"
        onClick={handleCartClick}
      >
        {isSingleVariant ? "Add to Cart" : "View Options"}
      </Button>
    </motion.div>
  );
};

export default ProductCard;
