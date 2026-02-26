/**
 * Flying to Cart Animation
 *
 * Creates a visual "flying" effect when adding items to cart.
 * The product image flies from the product location to the cart icon.
 *
 * Usage:
 *   const { flyToCart } = useFlyToCart();
 *
 *   <button onClick={(e) => {
 *     flyToCart(e.currentTarget);
 *     // ... add to cart logic
 *   }}>
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

type FlyingItem = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageUrl?: string;
};

/**
 * Hook to trigger flying cart animation
 */
export function useFlyToCart() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const flyToCart = useCallback((
    startElement: HTMLElement,
    imageUrl?: string
  ) => {
    // Find cart icon in the navbar
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (!cartIcon) {
      console.warn('Cart icon not found - add data-cart-icon to cart button');
      return;
    }

    const startRect = startElement.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    const itemId = `flying-${Date.now()}-${Math.random()}`;

    const flyingItem: FlyingItem = {
      id: itemId,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + endRect.width / 2,
      endY: endRect.top + endRect.height / 2,
      imageUrl,
    };

    setFlyingItems((prev) => [...prev, flyingItem]);

    // Remove after animation completes
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== itemId));
    }, 800);
  }, []);

  return { flyToCart, FlyingItems: () => <FlyingItemsRenderer items={flyingItems} /> };
}

/**
 * Renders flying items
 */
function FlyingItemsRenderer({ items }: { items: FlyingItem[] }) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            position: "fixed",
            left: item.startX,
            top: item.startY,
            x: "-50%",
            y: "-50%",
            opacity: 1,
            scale: 1,
            zIndex: 9999,
          }}
          animate={{
            left: item.endX,
            top: item.endY,
            opacity: 0,
            scale: 0.3,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94], // Ease-out quad
          }}
          className="pointer-events-none"
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="h-16 w-16 rounded-lg border-2 border-fern object-cover shadow-lg"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg border-2 border-fern bg-fern/20 shadow-lg flex items-center justify-center text-fern">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

/**
 * Global FlyToCart Provider
 * Add this to your root layout to enable flying cart animations
 */
export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const { FlyingItems } = useFlyToCart();

  return (
    <>
      {children}
      <FlyingItems />
    </>
  );
}
