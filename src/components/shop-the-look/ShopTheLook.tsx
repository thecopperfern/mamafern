"use client";

import { useState, useEffect } from "react";
import LookTabs from "./LookTabs";
import LookHero from "./LookHero";
import ProductSpot from "./ProductSpot";
import type { Look } from "@/types/looks";

export default function ShopTheLook() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeId, setActiveId] = useState("moms");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/looks")
      .then((res) => res.json())
      .then((data) => {
        if (data.looks?.length) {
          setLooks(data.looks);
          setActiveId(data.looks[0].id);
        }
      })
      .catch((err) => console.warn("Failed to load looks:", err))
      .finally(() => setLoading(false));
  }, []);

  const activeLook = looks.find((l) => l.id === activeId);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-oat rounded w-48 mx-auto" />
          <div className="h-10 bg-oat rounded-full w-64 mx-auto" />
          <div className="aspect-video bg-oat rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-oat rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!looks.length) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12" aria-label="Shop the Look">
      <h2 className="font-display text-3xl sm:text-4xl text-charcoal text-center mb-2">
        Shop the Look
      </h2>
      <p className="text-warm-brown/70 text-center text-sm mb-8">
        Curated outfits for the whole family
      </p>

      <LookTabs looks={looks} activeId={activeId} onSelect={setActiveId} />

      {activeLook && (
        <div
          id={`look-panel-${activeLook.id}`}
          role="tabpanel"
          aria-label={activeLook.label}
        >
          <LookHero
            heroImage={activeLook.heroImage}
            heroImageAlt={activeLook.heroImageAlt}
            title={activeLook.title}
          />

          {activeLook.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {activeLook.products.map((product) => (
                <ProductSpot key={product.shopifyProductId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-warm-brown/50 text-sm">
              No products added yet.{" "}
              <a href="/lookadmin" className="underline hover:text-fern">
                Add some in the admin panel
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
