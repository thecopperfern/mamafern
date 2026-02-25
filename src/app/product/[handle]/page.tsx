import { commerceClient } from "@/lib/commerce";
import ProductDetail from "@/components/view/ProductDetail";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import RelatedProducts from "@/components/view/RelatedProducts";
import InternalLinks from "@/components/seo/InternalLinks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerceClient.getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };
  return buildProductMetadata(product);
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
        <RelatedProducts
          products={recommendations}
          title="Complete the Family Look"
        />
      )}
      <InternalLinks context="product" />
    </div>
  );
}
