import Image from "next/image";
import Link from "next/link";
import { commerceClient } from "@/lib/commerce";

/**
 * ProductCallout — Inline product card for blog posts
 *
 * Fetches a product by handle from Shopify and renders a mini
 * product card with image, title, price, and link.
 *
 * Used in blog posts to create content-to-commerce pathways.
 */
export default async function ProductCallout({
  handle,
}: {
  handle: string;
}) {
  let product;
  try {
    product = await commerceClient.getProductByHandle(handle);
  } catch {
    console.warn(`ProductCallout: failed to fetch product ${handle}`);
    return null;
  }

  if (!product) return null;

  const price = parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2);
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.handle}`}
      className="my-6 flex items-center gap-4 p-4 rounded-xl border border-oat hover:border-fern/30 hover:bg-fern/5 transition-colors not-prose"
    >
      {image?.url && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-oat">
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div>
        <p className="font-medium text-charcoal text-sm">{product.title}</p>
        <p className="text-xs text-charcoal/60 mt-0.5">${price}</p>
        <p className="text-xs text-fern font-medium mt-1">Shop Now &rarr;</p>
      </div>
    </Link>
  );
}
