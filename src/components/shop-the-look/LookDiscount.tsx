"use client";

import type { LookDiscount as LookDiscountType, LookProduct } from "@/types/looks";

interface LookDiscountProps {
  discount: LookDiscountType;
  products: LookProduct[];
}

/**
 * Displays a discount banner for the look, showing the deal terms
 * and the total vs discounted price when applicable.
 */
export default function LookDiscount({ discount, products }: LookDiscountProps) {
  if (!discount.enabled) return null;

  // Calculate total price from products
  const totalPrice = products.reduce((sum, p) => {
    const num = parseFloat(p.price.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const meetsMinimum = products.length >= discount.minItems;

  const discountedPrice =
    discount.type === "percentage"
      ? totalPrice * (1 - discount.value / 100)
      : totalPrice - discount.value;

  const message =
    discount.message ||
    `Buy ${discount.minItems}+ items and get ${
      discount.type === "percentage"
        ? `${discount.value}% off`
        : `$${discount.value.toFixed(2)} off`
    }`;

  return (
    <div
      className="bg-fern/10 border border-fern/20 rounded-xl p-4 text-center space-y-2"
      data-testid="look-discount-banner"
    >
      <p className="text-sm text-fern font-medium">
        {message}
        {discount.code && (
          <>
            {" "}
            &mdash; Use code{" "}
            <span className="font-bold bg-fern/10 px-2 py-0.5 rounded">
              {discount.code}
            </span>
          </>
        )}
      </p>

      {meetsMinimum && totalPrice > 0 && (
        <p className="text-xs text-warm-brown">
          <span className="line-through opacity-60">
            ${totalPrice.toFixed(2)}
          </span>{" "}
          <span className="text-fern font-semibold text-sm">
            ${Math.max(0, discountedPrice).toFixed(2)}
          </span>
        </p>
      )}
    </div>
  );
}
