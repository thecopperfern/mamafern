"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Look } from "@/types/looks";

interface ProductLookBannerProps {
  looks: Look[];
}

/**
 * "This product is part of a look" banner shown on product pages.
 * Displays when the current product appears in one or more published looks.
 */
export default function ProductLookBanner({ looks }: ProductLookBannerProps) {
  if (looks.length === 0) return null;

  return (
    <div className="space-y-3 my-8" data-testid="product-look-banner">
      {looks.map((look) => (
        <Link
          key={look.id}
          href={`/lookbook?look=${look.id}`}
          className="flex items-center gap-4 p-4 rounded-xl border border-fern/20 bg-fern/5 hover:bg-fern/10 transition-colors group"
        >
          {look.heroImage && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
              <Image
                src={look.heroImage}
                alt={look.heroImageAlt || look.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-fern font-medium uppercase tracking-wide">
              Part of a look
            </p>
            <p className="text-sm text-charcoal font-medium truncate">
              {look.title}
            </p>
          </div>
          <span className="text-fern group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  );
}
