"use client";

import Image from "next/image";
import FernSvg from "./FernSvg";
import LookHotspot from "./LookHotspot";
import type { LookHotspot as HotspotType, LookProduct } from "@/types/looks";

interface LookHeroProps {
  heroImage: string;
  heroImageAlt: string;
  title: string;
  description?: string;
  hotspots?: HotspotType[];
  products?: LookProduct[];
}

export default function LookHero({
  heroImage,
  heroImageAlt,
  title,
  description,
  hotspots,
  products,
}: LookHeroProps) {
  if (!heroImage) {
    return (
      <div
        className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-oat/50 mb-8"
        data-testid="look-hero-placeholder"
      >
        <p className="text-warm-brown/60 text-sm">
          Add a hero image in{" "}
          <a href="/lookadmin" className="underline hover:text-fern">
            /lookadmin
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative mb-8" data-testid="look-hero">
      <FernSvg className="absolute -top-6 -right-4 w-16 h-20 text-fern-dark/15 rotate-45 z-10 pointer-events-none" />
      <FernSvg className="absolute -bottom-6 -left-4 w-16 h-20 text-fern-dark/15 -rotate-45 scale-x-[-1] z-10 pointer-events-none" />

      <div className="relative aspect-video w-full rounded-2xl border border-stone-200 overflow-hidden">
        <Image
          src={heroImage}
          alt={heroImageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 960px"
          data-testid="look-hero-image"
        />

        {/* Hotspots */}
        {hotspots?.map((hs) => {
          const product = products?.find((p) => p.id === hs.productId);
          if (!product) return null;
          return (
            <LookHotspot
              key={hs.productId}
              hotspot={hs}
              product={product}
            />
          );
        })}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent h-24 flex items-end p-5">
          <div>
            <h3
              className="text-white font-display text-lg sm:text-xl drop-shadow-sm"
              data-testid="look-hero-title-overlay"
            >
              {title}
            </h3>
            {description && (
              <p className="text-white/80 text-sm mt-1 drop-shadow-sm">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
