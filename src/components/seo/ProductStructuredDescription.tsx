import { stripHtml } from "@/lib/seo";
import type { CommerceProduct } from "@/lib/commerce";

interface ProductStructuredDescriptionProps {
  product: CommerceProduct;
  collectionName?: string;
}

/**
 * Renders a product's description with semantic enhancement for LLM readability.
 * Includes hidden but crawlable structured facts about the product.
 */
export default function ProductStructuredDescription({
  product,
  collectionName,
}: ProductStructuredDescriptionProps) {
  const plainDescription = stripHtml(product.description || "");

  return (
    <article itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={plainDescription.slice(0, 300)} />
      {product.images[0]?.url && (
        <meta itemProp="image" content={product.images[0].url} />
      )}

      {/* Visible description */}
      {product.description && (
        <div
          className="prose prose-stone max-w-none text-sm text-warm-brown/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      {/* Hidden but crawlable structured facts for LLM extraction */}
      <section className="sr-only" aria-hidden="true">
        <p>
          {product.title} is part of the Mama Fern
          {collectionName ? ` ${collectionName}` : ""} collection. Made for
          families who value natural fabrics, earthy aesthetics, and comfortable
          everyday clothing.
          {product.productType ? ` Product type: ${product.productType}.` : ""}
          {" "}Price: {product.priceRange.minVariantPrice.amount}{" "}
          {product.priceRange.minVariantPrice.currencyCode}.
          {product.variants.some((v) => v.availableForSale)
            ? " Currently in stock."
            : " Currently out of stock."}
          {" "}Ships from United States. Available at mamafern.com.
        </p>
      </section>
    </article>
  );
}
