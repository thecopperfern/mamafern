"use client";

import { useState } from "react";
import LookTabs from "./LookTabs";
import LookHero from "./LookHero";
import ProductSpot from "./ProductSpot";

interface Product {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  productUrl: string;
  selectedImageUrl: string;
  selectedImageAlt: string;
  comingSoon: boolean;
}

interface Look {
  id: string;
  label: string;
  title: string;
  heroImage: string;
  heroImageAlt: string;
  products: Product[];
}

interface ShopTheLookProps {
  initialLooks?: Look[];
}

export default function ShopTheLook({ initialLooks }: ShopTheLookProps) {
  const [looks] = useState<Look[]>(initialLooks || []);
  const [activeTab, setActiveTab] = useState(
    initialLooks?.[0]?.id || "moms"
  );

  if (!looks.length) return null;

  return (
    <section
      className="max-w-5xl mx-auto px-4 py-12"
      data-testid="shop-the-look-section"
    >
      {/* Section Heading */}
      <h2
        className="text-center font-display text-3xl md:text-4xl text-charcoal mb-8"
        data-testid="shop-the-look-heading"
      >
        Shop the Look
      </h2>

      <LookTabs looks={looks} activeTab={activeTab} onTabChange={setActiveTab}>
        {(look) => (
          <div className="mt-6 space-y-8">
            {/* Look Title */}
            <h3
              className="font-display text-xl md:text-2xl text-charcoal text-center"
              data-testid={`look-title-${look.id}`}
            >
              {look.title}
            </h3>

            {/* Hero Image */}
            <LookHero
              heroImage={look.heroImage}
              heroImageAlt={look.heroImageAlt}
              title={look.title}
            />

            {/* Product Grid */}
            {look.products.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
                data-testid={`products-grid-${look.id}`}
              >
                {look.products.map((product) => (
                  <ProductSpot
                    key={product.shopifyProductId}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8 text-stone-400 text-sm"
                data-testid={`no-products-${look.id}`}
              >
                No products added yet. Head to{" "}
                <span className="font-medium text-stone-500">/lookadmin</span>{" "}
                to curate this look.
              </div>
            )}
          </div>
        )}
      </LookTabs>
    </section>
  );
}
