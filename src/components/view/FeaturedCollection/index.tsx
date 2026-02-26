import { commerceClient } from "@/lib/commerce";
import Link from "next/link";
import Image from "next/image";

type Props = {
  handle: string;
  title: string;
  subtitle?: string;
};

export default async function FeaturedCollection({
  handle,
  title,
  subtitle,
}: Props) {
  let products;
  try {
    products = await commerceClient.getProductsByCollection(handle, {
      first: 4,
    });
  } catch (error) {
    // Gracefully handle missing Shopify credentials or API errors
    if (process.env.NODE_ENV === "development") {
      console.warn(`Failed to load collection "${handle}":`, error);
    }
    return null;
  }

  if (!products || products.length === 0) return null;

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount));
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal">
            {title}
          </h2>
          {subtitle && (
            <p className="text-warm-brown/70 mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          href={`/collections/${handle}`}
          className="text-sm font-medium text-fern hover:text-fern-dark transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.handle}`}
            className="group"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-oat">
              {product.featuredImage?.url || product.images[0]?.url ? (
                <Image
                  src={product.featuredImage?.url ?? product.images[0]?.url}
                  alt={
                    product.featuredImage?.altText ?? product.title
                  }
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-oat flex items-center justify-center text-warm-brown/70">
                  {product.title}
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-charcoal group-hover:text-fern transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-warm-brown/70">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
