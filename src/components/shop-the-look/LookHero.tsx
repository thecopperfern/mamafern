"use client";

import Image from "next/image";
import FernSvg from "./FernSvg";

type LookHeroProps = {
  heroImage: string;
  heroImageAlt: string;
  title: string;
};

export default function LookHero({ heroImage, heroImageAlt, title }: LookHeroProps) {
  if (!heroImage) {
    return (
      <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-oat/50 mb-8">
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
    <div className="relative mb-8">
      <FernSvg className="absolute -top-6 -right-4 w-16 h-20 text-fern-dark/15 rotate-45 z-10 pointer-events-none" />
      <FernSvg className="absolute -bottom-6 -left-4 w-16 h-20 text-fern-dark/15 -rotate-45 scale-x-[-1] z-10 pointer-events-none" />

      <div className="relative aspect-video w-full rounded-2xl border border-stone-200 overflow-hidden">
        <Image
          src={heroImage}
          alt={heroImageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 960px"
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent h-24 flex items-end p-5">
          <h3 className="text-white font-display text-lg sm:text-xl drop-shadow-sm">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
