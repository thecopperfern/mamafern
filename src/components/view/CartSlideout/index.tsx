"use client";

import { useState } from "react";
import { useCartActions } from "@/lib/atoms/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, Tag, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartSlideout({ open, onClose }: Props) {
  const { cart, updateItem, removeItem, applyDiscount, removeDiscount, checkout } =
    useCartActions();
  const [promoOpen, setPromoOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/40 z-50"
        onClick={onClose}
      />

      {/* Slideout panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-oat">
          <h2 className="text-lg font-display font-bold text-charcoal">
            Your Cart
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="text-charcoal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Free shipping progress bar */}
        {(() => {
          const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 70);
          const subtotal = parseFloat(cart.subtotal.amount);
          const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
          const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
          return (
            <div className="px-4 pt-3 pb-3 bg-fern/5 border-b border-oat">
              {remaining > 0 ? (
                <p className="text-xs text-warm-brown/70 mb-1.5">
                  Add{" "}
                  <span className="font-semibold text-fern">
                    ${remaining.toFixed(2)}
                  </span>{" "}
                  more for free shipping
                </p>
              ) : (
                <p className="text-xs text-fern font-medium mb-1.5">
                  🌿 You&apos;ve unlocked free shipping!
                </p>
              )}
              <div className="w-full bg-oat rounded-full h-1.5">
                <div
                  className="bg-fern h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })()}

        {cart.lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <ShoppingBag className="h-12 w-12 text-warm-brown/70" />
            <p className="text-warm-brown/70">Your cart is empty</p>
            <Button
              onClick={onClose}
              className="bg-fern hover:bg-fern-dark text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex gap-3 p-3 bg-white rounded-lg border border-oat"
                >
                  {line.image && (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={line.image.url}
                        alt={line.image.altText ?? line.productTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${line.productHandle}`}
                      onClick={onClose}
                      className="text-sm font-medium text-charcoal hover:text-fern transition-colors line-clamp-1"
                    >
                      {line.productTitle}
                    </Link>
                    {line.variantTitle && line.variantTitle !== "Default Title" && (
                      <p className="text-xs text-warm-brown/70 mt-0.5">
                        {line.variantTitle}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-charcoal mt-1">
                      {formatPrice(
                        line.totalAmount.amount,
                        line.totalAmount.currencyCode
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 touch-manipulation"
                        onClick={() =>
                          updateItem(line.id, line.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-sm w-8 text-center font-medium">
                        {line.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 touch-manipulation"
                        onClick={() =>
                          updateItem(line.id, line.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 ml-auto text-warm-brown/70 hover:text-terracotta touch-manipulation"
                        onClick={() => {
                          removeItem(line.id);
                          toast.success(`${line.productTitle} removed from cart`);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-oat p-4 space-y-3">
              {/* Promo code section */}
              <div>
                <button
                  type="button"
                  onClick={() => setPromoOpen(!promoOpen)}
                  className="flex items-center gap-1 text-sm text-warm-brown/70 hover:text-fern transition-colors"
                >
                  <Tag className="h-3.5 w-3.5" />
                  Have a promo code?
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${promoOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {promoOpen && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="Enter code"
                      className="h-8 text-sm"
                    />
                    <Button
                      size="sm"
                      className="bg-fern hover:bg-fern-dark text-white h-8 px-3"
                      disabled={!promoCode.trim() || promoLoading}
                      onClick={async () => {
                        setPromoLoading(true);
                        setPromoError("");
                        try {
                          const updated = await applyDiscount(
                            promoCode.trim()
                          );
                          const applied = updated.discountCodes.find(
                            (dc) =>
                              dc.code.toLowerCase() ===
                              promoCode.trim().toLowerCase()
                          );
                          if (applied && !applied.applicable) {
                            setPromoError("Code is not applicable");
                          } else {
                            setPromoCode("");
                          }
                        } catch {
                          setPromoError("Failed to apply code");
                        } finally {
                          setPromoLoading(false);
                        }
                      }}
                    >
                      {promoLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-terracotta mt-1">{promoError}</p>
                )}
              </div>

              {/* Applied discount codes */}
              {cart.discountCodes.length > 0 && (
                <div className="space-y-1">
                  {cart.discountCodes.map((dc) => (
                    <div
                      key={dc.code}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-fern" />
                        <span className={dc.applicable ? "text-fern" : "text-terracotta"}>
                          {dc.code}
                        </span>
                        {!dc.applicable && (
                          <span className="text-xs text-terracotta">(not applicable)</span>
                        )}
                      </span>
                      <button
                        onClick={() => removeDiscount(dc.code)}
                        className="text-warm-brown/70 hover:text-terracotta"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-warm-brown/70">Subtotal</span>
                <span className="font-semibold text-charcoal">
                  {formatPrice(cart.subtotal.amount, cart.subtotal.currencyCode)}
                </span>
              </div>
              <p className="text-xs text-warm-brown/70">
                Shipping and taxes calculated at checkout
              </p>
              <Button
                className="w-full bg-fern hover:bg-fern-dark text-white"
                disabled={checkoutLoading}
                onClick={async () => {
                  setCheckoutLoading(true);
                  try {
                    const url = await checkout();
                    window.location.href = url;
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
              >
                {checkoutLoading ? "Redirecting..." : "Checkout"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
