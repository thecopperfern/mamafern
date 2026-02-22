import { commerceClient } from "@/lib/commerce";
import ProductDetail from "@/components/view/ProductDetail";
import ProductCard from "@/components/view/ProductCard";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerceClient.getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Mama Fern`,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await commerceClient.getProductByHandle(handle);
  if (!product) notFound();

  let recommendations: Awaited<ReturnType<typeof commerceClient.getProductRecommendations>> = [];
  try {
    recommendations = await commerceClient.getProductRecommendations(product.id);
  } catch {
    // Recommendations are non-critical
  }

  return (
    <div className="px-4 mt-6">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.title },
        ]}
      />
      <ProductDetail product={product} />
      {recommendations.length > 0 && (
        <section className="mx-auto max-w-6xl py-12">
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
