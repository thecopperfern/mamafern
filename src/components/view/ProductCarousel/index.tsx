"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { CommerceImage } from "@/lib/commerce";

export default function ProductCarousel({
  images,
}: {
  images: CommerceImage[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [mainCarouselRef, mainEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [thumbCarouselRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollPrev();
  }, [mainEmblaApi]);

  const scrollNext = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollNext();
  }, [mainEmblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmblaApi || !thumbEmblaApi) return;
      mainEmblaApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainEmblaApi, thumbEmblaApi]
  );

  const onSelect = useCallback(() => {
    if (!mainEmblaApi) return;

    const newIndex = mainEmblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);

    setCanScrollPrev(mainEmblaApi.canScrollPrev());
    setCanScrollNext(mainEmblaApi.canScrollNext());

    if (thumbEmblaApi) {
      thumbEmblaApi.scrollTo(newIndex);
    }
  }, [mainEmblaApi, thumbEmblaApi]);

  useEffect(() => {
    if (!mainEmblaApi) return;

    onSelect();
    mainEmblaApi.on("select", onSelect);
    mainEmblaApi.on("reInit", onSelect);

    return () => {
      mainEmblaApi.off("select", onSelect);
      mainEmblaApi.off("reInit", onSelect);
    };
  }, [mainEmblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className="col-span-2 mx-auto grid w-full grid-cols-[auto_1fr] gap-x-4">
      {/* Thumbnail Carousel */}
      <div className="hidden overflow-hidden lg:block" ref={thumbCarouselRef}>
        <div className="grid grid-flow-row gap-y-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={cn(
                "relative aspect-square h-24 w-24 cursor-pointer overflow-hidden rounded-xl border",
                selectedIndex === index
                  ? "border-fern"
                  : "border-oat"
              )}
            >
              <Image
                width={96}
                height={96}
                src={image.url}
                alt={image.altText ?? ""}
                className="h-full w-full object-cover"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Carousel */}
      <div className="relative grid place-items-center">
        <div className="overflow-hidden" ref={mainCarouselRef}>
          <div className="grid auto-cols-[100%] grid-flow-col">
            {images.map((image, index) => (
              <div className="relative min-w-0" key={index}>
                <Image
                  width={1000}
                  height={400}
                  src={image.url}
                  alt={image.altText ?? ""}
                  className="h-full max-h-[650px] w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 disabled:opacity-50"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-50"
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
