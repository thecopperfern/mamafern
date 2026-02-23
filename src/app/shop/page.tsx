import AllCollections from "@/components/view/AllCollections";
import PageHero from "@/components/view/PageHero";
import type { Metadata } from "next";

// ISR: revalidate every 60 seconds for fresh collection data
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop | Mama Fern",
  description: "Browse all Mama Fern collections. Family apparel for moms, dads, and kids.",
};

export default function ShopPage() {
  return (
    <div>
      <PageHero
        eyebrow="All Collections"
        title="Shop All"
        subtitle="Family apparel in skin-friendlier fabrics for every stage of growing together."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AllCollections />
      </div>
    </div>
  );
}
