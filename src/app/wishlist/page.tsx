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
    <div>
      <div className="relative bg-texture-linen border-b border-oat py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.2em] mb-3">
            Your Saved Items
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal">
            My Wishlist
          </h1>
          <p className="mt-4 text-warm-brown/70 text-lg">
            Products you&apos;ve saved for later.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[300px] bg-oat rounded-xl" />
                <div className="h-4 bg-oat rounded mt-3 w-3/4" />
                <div className="h-4 bg-oat rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-texture-linen rounded-2xl border border-oat p-12 max-w-sm mx-auto">
              <Heart className="h-10 w-10 text-warm-brown/70 mx-auto mb-4" />
              <p className="font-display font-bold text-charcoal text-lg mb-2">
                Nothing saved yet
              </p>
              <p className="text-warm-brown/70 text-sm mb-6">
                Save your favourite items while you browse.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-2.5 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
