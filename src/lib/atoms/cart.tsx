"use client";

import { atom, useAtom } from "jotai";
import { commerceClient, type CommerceCart } from "@/lib/commerce";

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

  const addItem = async (merchandiseId: string, quantity: number) => {
    try {
      const updatedCart = await commerceClient.addToCart(cart.id, [
        { merchandiseId, quantity },
      ]);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

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
    } catch (error) {
      console.error("Error initializing cart:", error);
      // If cart fetch fails, create a new one
      try {
        const newCart = await commerceClient.createCart();
        localStorage.setItem("cartId", newCart.id);
        setCart(newCart);
      } catch (e) {
        console.error("Error creating fallback cart:", e);
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

  return {
    cart,
    addItem,
    updateItem,
    removeItem,
    initializeCart,
    applyDiscount,
    removeDiscount,
  };
};
