"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { CommerceProduct } from "@/lib/commerce";

/**
 * QuizResults — Personality result + product recommendation grid + discount code
 *
 * Displays the matched outcome based on quiz answers, recommended products
 * pre-fetched from Shopify, and an optional discount code.
 */
export default function QuizResults({
  outcome,
  products,
  discountCode,
}: {
  outcome: {
    tag: string;
    title: string;
    description: string;
    emoji?: string;
  };
  products: CommerceProduct[];
  discountCode?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try selecting the code manually");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 text-center">
      {/* Outcome */}
      <div className="mb-8">
        {outcome.emoji && (
          <span className="text-5xl block mb-4" role="img" aria-hidden="true">
            {outcome.emoji}
          </span>
        )}
        <h2 className="font-display font-bold text-3xl text-charcoal mb-3">
          {outcome.title}
        </h2>
        <p className="text-charcoal/70 max-w-lg mx-auto">
          {outcome.description}
        </p>
      </div>

      {/* Discount code */}
      {discountCode && (
        <div className="bg-fern/5 border border-fern/20 rounded-xl p-4 mb-8 inline-flex items-center gap-3">
          <span className="text-sm text-charcoal/70">Your exclusive code:</span>
          <span className="font-display font-bold text-lg text-charcoal tracking-wider select-all">
            {discountCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md bg-fern text-white hover:bg-fern-dark transition-colors"
            aria-label={copied ? "Copied!" : "Copy discount code"}
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      )}

      {/* Product recommendations */}
      {products.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display font-bold text-lg text-charcoal mb-4">
            Picks For You
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                className="group rounded-xl border border-oat overflow-hidden hover:border-fern/30 transition-colors"
              >
                {product.images[0]?.url && (
                  <div className="relative aspect-square bg-oat">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-3 text-left">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10">
        <Link
          href="/shop"
          className="inline-block bg-fern hover:bg-fern-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Shop All
        </Link>
      </div>
    </div>
  );
}
