"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/atoms/wishlist";
import { commerceClient, type CommerceProduct } from "@/lib/commerce";
import ProductCard from "@/components/view/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items, initialize } = useWishlist();
  const [products, setProducts] = useState<CommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        items.map((handle) =>
          commerceClient.getProductByHandle(handle).catch(() => null)
        )
      );
      setProducts(results.filter((p): p is CommerceProduct => p !== null));
      setLoading(false);
    }
    fetchProducts();
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-display font-bold text-charcoal mb-8">
        My Wishlist
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-[300px] bg-oat rounded-lg" />
              <div className="h-4 bg-oat rounded mt-2 w-3/4" />
              <div className="h-4 bg-oat rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-warm-brown/30 mx-auto mb-4" />
          <p className="text-warm-brown/60 mb-4">
            Your wishlist is empty.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-2.5 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
