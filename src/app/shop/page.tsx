import AllCollections from "@/components/view/AllCollections";
import PageHero from "@/components/view/PageHero";
import PageTransition from "@/components/PageTransition";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Shop All",
  description:
    "Browse all Mama Fern collections — grounded family apparel in natural fabrics for moms, dads, and kids. Cute patterns, earthy designs, and skin-friendly materials.",
  path: "/shop",
  keywords: ["shop mama fern", "family apparel store", "buy natural kids clothes", "organic family fashion"],
});

export default function ShopPage() {
  return (
    <PageTransition>
      <div>
        <PageHero
          eyebrow="All Collections"
          title="Shop All"
          subtitle="Family apparel in skin-friendly fabrics for every stage of growing together."
        />
        <div className="mx-auto max-w-6xl px-4">
          <AllCollections />
        </div>
      </div>
    </PageTransition>
  );
}
