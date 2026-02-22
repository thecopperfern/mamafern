"use client";

import { Button } from "@/components/ui/button";
import type { CommerceProduct } from "@/lib/commerce";
import Image from "next/image";
import ProductPrice from "./ProductPrice";
import { useRouter } from "next/navigation";
import WishlistButton from "../WishlistButton";

const ProductCard = ({ product }: { product: CommerceProduct }) => {
  const router = useRouter();
  return (
    <div
      role="button"
      className="group flex flex-col gap-2"
      onClick={() => router.push(`/product/${product.handle}`)}
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
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-oat flex items-center justify-center text-warm-brown/50">
            No image
          </div>
        )}
      </div>
      <h3 className="font-medium text-charcoal">{product.title}</h3>
      <ProductPrice priceRange={product.priceRange} />
      <Button className="bg-fern hover:bg-fern-dark text-white">
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
