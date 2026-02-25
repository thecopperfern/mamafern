import { commerceClient } from "@/lib/commerce";
import ProductCard from "@/components/view/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-3xl font-display font-bold text-charcoal mb-4">
          Search
        </h1>
        <p className="text-warm-brown/70">Enter a search term to find products.</p>
      </div>
    );
  }

  const products = await commerceClient.searchProducts(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-display font-bold text-charcoal mb-2">
        Results for &ldquo;{q}&rdquo;
      </h1>
      <p className="text-warm-brown/70 mb-8">
        {products.length} {products.length === 1 ? "product" : "products"} found
      </p>

      {products.length === 0 ? (
        <p className="text-warm-brown/60">
          No products matched your search. Try a different term.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
