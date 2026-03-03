"use client";

import { useState } from "react";
import LookTabs from "./LookTabs";
import LookHero from "./LookHero";
import ProductSpot from "./ProductSpot";
import type { Look } from "@/types/looks";

interface ShopTheLookProps {
  initialLooks?: Look[];
}

export default function ShopTheLook({ initialLooks }: ShopTheLookProps) {
  const [activeTab, setActiveTab] = useState(initialLooks?.[0]?.id || "moms");
  const looks = initialLooks || [];

  if (!looks.length) return null;

  return (
    <section
      className="max-w-5xl mx-auto px-4 py-12"
      aria-label="Shop the Look"
      data-testid="shop-the-look-section"
    >
      <h2
        className="font-display text-3xl sm:text-4xl text-charcoal text-center mb-2"
        data-testid="shop-the-look-heading"
      >
        Shop the Look
      </h2>
      <p className="text-warm-brown/70 text-center text-sm mb-8">
        Curated outfits for the whole family
      </p>

      <LookTabs looks={looks} activeTab={activeTab} onTabChange={setActiveTab}>
        {(look) => (
          <div className="mt-6 space-y-8">
            <LookHero
              heroImage={look.heroImage}
              heroImageAlt={look.heroImageAlt}
              title={look.title}
            />

            {look.products.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                data-testid={`products-grid-${look.id}`}
              >
                {look.products.map((product) => (
                  <ProductSpot key={product.shopifyProductId} product={product} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12 text-warm-brown/50 text-sm"
                data-testid={`no-products-${look.id}`}
              >
                No products added yet.{" "}
                <a href="/lookadmin" className="underline hover:text-fern">
                  Add some in the admin panel
                </a>
              </div>
            )}
          </div>
        )}
      </LookTabs>
    </section>
  );
}
