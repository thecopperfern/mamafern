import { commerceClient } from "@/lib/commerce";
import ProductDetail from "@/components/view/ProductDetail";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import RelatedProducts from "@/components/view/RelatedProducts";
import InternalLinks from "@/components/seo/InternalLinks";
import JsonLd from "@/components/seo/JsonLd";
import PageTransition from "@/components/PageTransition";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductMetadata, stripHtml, SITE_CONFIG } from "@/lib/seo";

export const dynamic = "force-dynamic";

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product.description || ""),
    image: product.images[0]?.url,
    brand: { "@type": "Brand", name: "Mama Fern" },
    offers: {
      "@type": "Offer",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: product.variants.some((v) => v.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_CONFIG.baseUrl}/product/${product.handle}`,
      seller: { "@type": "Organization", name: "Mama Fern" },
    },
    ...(product.variants[0]?.id ? { sku: product.variants[0].id } : {}),
  };

  return (
    <PageTransition>
      <div className="px-4 mt-6">
        <JsonLd data={productSchema} />
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
    </PageTransition>
  );
}
