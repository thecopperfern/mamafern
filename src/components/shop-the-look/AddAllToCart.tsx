"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/atoms/cart";
import { toast } from "sonner";
import type { LookProduct } from "@/types/looks";

interface AddAllToCartProps {
  products: LookProduct[];
}

/**
 * "Add Selected to Cart" button with per-product checkboxes.
 * Only Shopify products with a variantId can be added to cart.
 * Manual products without variantId show as non-selectable.
 */
export default function AddAllToCart({ products }: AddAllToCartProps) {
  const { addItem } = useCartActions();
  const [loading, setLoading] = useState(false);

  // Only products with variantId can be added
  const cartableProducts = products.filter((p) => !!p.variantId);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(cartableProducts.map((p) => p.id))
  );

  if (cartableProducts.length === 0) return null;

  const toggleProduct = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const selectedCount = selectedIds.size;

  const handleAddAll = async () => {
    const toAdd = cartableProducts.filter((p) => selectedIds.has(p.id));
    if (toAdd.length === 0) return;

    setLoading(true);
    try {
      for (const product of toAdd) {
        await addItem(product.variantId!, 1, { skipOpen: true });
      }
      toast.success(`${toAdd.length} item${toAdd.length > 1 ? "s" : ""} added to cart`);
    } catch {
      toast.error("Failed to add items to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3" data-testid="add-all-to-cart">
      <div className="flex flex-wrap gap-3">
        {cartableProducts.map((product) => (
          <label
            key={product.id}
            className="flex items-center gap-2 text-sm text-charcoal cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(product.id)}
              onChange={() => toggleProduct(product.id)}
              className="rounded border-stone-300 text-fern focus:ring-fern"
            />
            {product.title}
          </label>
        ))}
      </div>

      <Button
        onClick={handleAddAll}
        disabled={loading || selectedCount === 0}
        className="bg-fern hover:bg-fern-dark text-white gap-2"
      >
        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
        {loading
          ? "Adding..."
          : `Add ${selectedCount} item${selectedCount !== 1 ? "s" : ""} to cart`}
      </Button>
    </div>
  );
}
