"use client";

interface LookHeroProps {
  heroImage: string;
  heroImageAlt: string;
  title: string;
}

/**
 * Decorative fern frond SVG — a single botanical silhouette.
 * Used at low opacity as a subtle brand watermark frame element.
 */
function FernSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M40 120 C40 120 40 0 40 0 C45 20 60 25 65 35 C55 30 45 35 40 40 C45 45 60 48 68 55 C55 50 45 52 40 58 C45 62 58 68 65 78 C55 70 45 68 40 72 C45 78 55 85 60 95 C52 88 44 84 40 88 C42 92 50 98 55 105 C48 100 42 96 40 100 Z" />
    </svg>
  );
}

export default function LookHero({
  heroImage,
  heroImageAlt,
  title,
}: LookHeroProps) {
  if (!heroImage) {
    return (
      <div
        className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-oat/50"
        data-testid="look-hero-placeholder"
      >
        <p className="text-stone-400 text-sm text-center px-4">
          Add a hero image in{" "}
          <span className="font-medium text-stone-500">/lookadmin</span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="look-hero">
      {/* Fern decoration — top-right */}
      <FernSvg className="absolute -top-3 -right-3 w-10 h-14 text-green-800/20 z-10 rotate-[30deg]" />

      {/* Fern decoration — bottom-left */}
      <FernSvg className="absolute -bottom-3 -left-3 w-10 h-14 text-green-800/20 z-10 rotate-[210deg]" />

      {/* Hero Image */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={heroImageAlt}
          className="w-full h-full object-cover"
          data-testid="look-hero-image"
        />

        {/* Title Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-6 py-4">
          <p
            className="text-white text-sm font-medium drop-shadow-sm"
            data-testid="look-hero-title-overlay"
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
