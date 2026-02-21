import AllCollections from "@/components/view/AllCollections";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | Mama Fern",
  description: "Browse all Mama Fern collections. Family apparel for moms, dads, and kids.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-display font-bold text-charcoal mt-10">
        Shop All
      </h1>
      <AllCollections />
    </div>
  );
}
