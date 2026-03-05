import Link from "next/link";
import Image from "next/image";
import { BookOpen, ShoppingBag, LayoutGrid } from "lucide-react";
import { commerceClient } from "@/lib/commerce";

type RelatedItem = {
  type: string;
  handle: string;
  label: string;
};

/**
 * RelatedContentCards — Renders linked content at the bottom of blog posts
 *
 * Supports three types of internal links:
 * - blog: Links to other blog posts (text card with icon)
 * - product: Links to products (mini card with image/price from Shopify)
 * - collection: Links to collections (text card with icon)
 *
 * Product cards fetch live data from the commerce adapter to show
 * current price and product image.
 */
export default async function RelatedContentCards({
  items,
}: {
  items: RelatedItem[];
}) {
  if (!items || items.length === 0) return null;

  // Pre-fetch product data for product-type links
  const productHandles = items
    .filter((item) => item.type === "product")
    .map((item) => item.handle);

  const productMap = new Map<string, { title: string; image?: string; price: string }>();
  await Promise.all(
    productHandles.map(async (handle) => {
      try {
        const product = await commerceClient.getProductByHandle(handle);
        if (product) {
          productMap.set(handle, {
            title: product.title,
            image: product.images[0]?.url,
            price: `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
          });
        }
      } catch {
        // Non-critical — continue without product data
      }
    })
  );

  const iconMap = {
    blog: BookOpen,
    product: ShoppingBag,
    collection: LayoutGrid,
  };

  const hrefMap = {
    blog: (handle: string) => `/blog/${handle}`,
    product: (handle: string) => `/product/${handle}`,
    collection: (handle: string) => `/collections/${handle}`,
  };

  return (
    <section className="mt-10 pt-8 border-t border-oat" aria-label="Related content">
      <h2 className="font-display font-bold text-lg text-charcoal mb-4">
        Related
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = iconMap[item.type as keyof typeof iconMap] || BookOpen;
          const href = (hrefMap[item.type as keyof typeof hrefMap] || hrefMap.blog)(item.handle);
          const productData = item.type === "product" ? productMap.get(item.handle) : null;

          return (
            <Link
              key={`${item.type}-${item.handle}`}
              href={href}
              className="group flex items-center gap-3 p-3 rounded-lg border border-oat hover:border-fern/30 hover:bg-fern/5 transition-colors"
            >
              {productData?.image ? (
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-oat">
                  <Image
                    src={productData.image}
                    alt={productData.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-md bg-fern/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-fern" aria-hidden="true" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal group-hover:text-fern transition-colors truncate">
                  {item.label || productData?.title || item.handle}
                </p>
                {productData?.price && (
                  <p className="text-xs text-charcoal/60">{productData.price}</p>
                )}
                {!productData && (
                  <p className="text-xs text-charcoal/50 capitalize">{item.type}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
