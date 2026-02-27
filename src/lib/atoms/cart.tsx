"use client";

import { atom, useAtom } from "jotai";
import { commerceClient, type CommerceCart } from "@/lib/commerce";

export const isCartOpenAtom = atom(false);

const initialCartState: CommerceCart = {
  id: "",
  checkoutUrl: "",
  lines: [],
  subtotal: { amount: "0.00", currencyCode: "USD" },
  total: { amount: "0.00", currencyCode: "USD" },
  totalQuantity: 0,
  discountCodes: [],
};

const cartAtom = atom<CommerceCart>(initialCartState);

export const useCartActions = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setCartOpen] = useAtom(isCartOpenAtom);

  const addItem = async (
    merchandiseId: string,
    quantity: number,
    opts?: { skipOpen?: boolean }
  ) => {
    try {
      const updatedCart = await commerceClient.addToCart(cart.id, [
        { merchandiseId, quantity },
      ]);
      setCart(updatedCart);
      if (!opts?.skipOpen) setCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error; // Re-throw so caller can handle (e.g., show toast)
    }
  };

  const openCart = () => setCartOpen(true);

  const updateItem = async (lineItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        const updatedCart = await commerceClient.removeFromCart(cart.id, [
          lineItemId,
        ]);
        setCart(updatedCart);
        return;
      }
      const updatedCart = await commerceClient.updateCartItems(cart.id, [
        { id: lineItemId, quantity },
      ]);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (lineItemId: string) => {
    try {
      const updatedCart = await commerceClient.removeFromCart(cart.id, [
        lineItemId,
      ]);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const initializeCart = async () => {
    try {
      let cartId = localStorage.getItem("cartId");
      if (!cartId) {
        const newCart = await commerceClient.createCart();
        cartId = newCart.id;
        if (cartId) {
          localStorage.setItem("cartId", cartId);
        }
        setCart(newCart);
        return;
      }
      const fetchedCart = await commerceClient.getCart(cartId);
      setCart(fetchedCart);
    } catch {
      // Silently fall back to empty cart if Shopify is unavailable
      // This is expected during development without credentials
      setCart(initialCartState);
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Cart initialization failed - using local cart. " +
            "Set SHOPIFY_STOREFRONT_ACCESS_TOKEN to enable Shopify integration."
        );
      }
    }
  };

  const applyDiscount = async (code: string) => {
    try {
      const updatedCart = await commerceClient.applyDiscountCode(cart.id, code);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Error applying discount:", error);
      throw error;
    }
  };

  const removeDiscount = async (code: string) => {
    try {
      const updatedCart = await commerceClient.removeDiscountCode(
        cart.id,
        code
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing discount:", error);
    }
  };

  const checkout = async (): Promise<string> => {
    try {
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)customerAccessToken=([^;]*)/);
        const token = match ? decodeURIComponent(match[1]) : null;
        if (token) {
          const result = await commerceClient.associateBuyer(cart.id, token);
          return result.checkoutUrl;
        }
      }
    } catch {
      // Fall through to unauthenticated checkout URL
    }
    return cart.checkoutUrl;
  };

  return {
    cart,
    addItem,
    openCart,
    updateItem,
    removeItem,
    initializeCart,
    applyDiscount,
    removeDiscount,
    checkout,
  };
};
