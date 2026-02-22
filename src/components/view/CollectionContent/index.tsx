"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/view/ProductCard";
import type { CommerceProduct } from "@/lib/commerce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

type Props = {
  products: CommerceProduct[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
  };
  handle: string;
  currentSort: string;
};

const sortLabels: Record<string, string> = {
  default: "Best Selling",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "Over $100", min: 100, max: Infinity },
];

export default function CollectionContent({
  products,
  pageInfo,
  handle,
  currentSort,
}: Props) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    return `/collections/${handle}?${searchParams.toString()}`;
  };

  // Extract all unique option values for filtering
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => {
      const sizeOpt = p.options.find(
        (o) => o.name.toLowerCase() === "size"
      );
      sizeOpt?.optionValues.forEach((v) => sizes.add(v.name));
    });
    return Array.from(sizes);
  }, [products]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Price filter
      if (priceRange) {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        if (price < priceRange.min || price >= priceRange.max) return false;
      }
      // Size filter
      if (selectedSize) {
        const hasSizeVariant = p.variants.some((v) =>
          v.selectedOptions.some(
            (o) =>
              o.name.toLowerCase() === "size" && o.value === selectedSize
          )
        );
        if (!hasSizeVariant) return false;
      }
      return true;
    });
  }, [products, priceRange, selectedSize]);

  const hasActiveFilters = priceRange !== null || selectedSize !== null;

  const clearFilters = () => {
    setPriceRange(null);
    setSelectedSize(null);
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-warm-brown/60">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => router.push(buildUrl({ sort: e.target.value }))}
            className="text-sm border border-oat rounded-md px-2 py-1 bg-cream text-charcoal"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-1 text-sm"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-fern text-white rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
              {(priceRange ? 1 : 0) + (selectedSize ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-warm-brown/60 hover:text-fern flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap gap-6 p-4 bg-white rounded-lg border border-oat">
          {/* Price filter */}
          <div>
            <h3 className="text-sm font-medium text-charcoal mb-2">Price</h3>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    setPriceRange(
                      priceRange?.min === range.min ? null : range
                    )
                  }
                  className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    priceRange?.min === range.min
                      ? "bg-fern text-white border-fern"
                      : "border-oat text-charcoal hover:border-fern"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size filter */}
          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-charcoal mb-2">Size</h3>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? null : size)
                    }
                    className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                      selectedSize === size
                        ? "bg-fern text-white border-fern"
                        : "border-oat text-charcoal hover:border-fern"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-warm-brown/60 py-12">
          {hasActiveFilters
            ? "No products match your filters."
            : "No products found in this collection."}
        </p>
      )}

      {!hasActiveFilters && (
        <div className="flex justify-center gap-4">
          {pageInfo.hasPreviousPage && (
            <Link href={`/collections/${handle}?sort=${currentSort}`}>
              <Button variant="outline">First Page</Button>
            </Link>
          )}
          {pageInfo.hasNextPage && pageInfo.endCursor && (
            <Link
              href={buildUrl({
                after: pageInfo.endCursor,
                sort: currentSort,
              })}
            >
              <Button variant="outline">Next Page</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
