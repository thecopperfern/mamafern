"use client";

import { Button } from "@/components/ui/button";
import type { CommerceProduct } from "@/lib/commerce";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import WishlistButton from "../WishlistButton";
import { useCartActions } from "@/lib/atoms/cart";
import { toast } from "sonner";
import { motion, cardHover } from "@/lib/motion";

const ProductCard = ({ product }: { product: CommerceProduct }) => {
  const { addItem } = useCartActions();

  // Single variant = only one option and it's the default (no real choices)
  const isSingleVariant =
    product.variants.length === 1 &&
    product.variants[0].selectedOptions.every(
      (opt) => opt.value === "Default Title"
    );

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSingleVariant) {
      addItem(product.variants[0].id, 1);
      toast.success(`${product.title} added to cart`);
    }
  };

  return (
    <motion.div
      className="group flex flex-col gap-2"
      whileHover={cardHover.whileHover}
      transition={cardHover.transition}
    >
      <Link
        href={`/product/${product.handle}`}
        className="block relative w-full h-[300px] rounded-lg overflow-hidden border border-oat focus-visible:outline-2 focus-visible:outline-fern focus-visible:outline-offset-2"
      >
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
          <div className="w-full h-full bg-oat flex items-center justify-center text-warm-brown">
            No image
          </div>
        )}
      </Link>
      <Link href={`/product/${product.handle}`} className="focus-visible:outline-2 focus-visible:outline-fern">
        <h3 className="font-medium text-charcoal">{product.title}</h3>
      </Link>
      <ProductPrice priceRange={product.priceRange} />
      {isSingleVariant ? (
        <Button
          className="bg-fern hover:bg-fern-dark text-white"
          onClick={handleCartClick}
        >
          Add to Cart
        </Button>
      ) : (
        <Button
          className="bg-fern hover:bg-fern-dark text-white"
          asChild
        >
          <Link href={`/product/${product.handle}`}>View Options</Link>
        </Button>
      )}
    </motion.div>
  );
};

export default ProductCard;
