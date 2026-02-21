import type { CommercePriceRange } from "@/lib/commerce";
import { formatPrice } from "@/lib/currency";

const ProductPrice = ({ priceRange }: { priceRange: CommercePriceRange }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-2 font-semibold">
        <p suppressHydrationWarning className="text-lg">
          {formatPrice(
            priceRange.minVariantPrice.amount,
            priceRange.minVariantPrice.currencyCode
          )}
        </p>

        {priceRange.maxVariantPrice.amount !==
          priceRange.minVariantPrice.amount && (
          <p suppressHydrationWarning className="text-lg text-gray-600">
            -{" "}
            {formatPrice(
              priceRange.maxVariantPrice.amount,
              priceRange.maxVariantPrice.currencyCode
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductPrice;
