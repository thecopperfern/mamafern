/**
 * Framer Motion Animation Utilities
 *
 * Centralized animation variants and configurations for consistent
 * motion design across the Mama Fern storefront.
 *
 * Based on Emil Kowalski's animation principles:
 * - Movement distances: 4-16px for micro-interactions, 20-40px for reveals
 * - Hover states: instant on, 150ms off
 * - Always pair opacity with movement (fade AND move)
 * - Respects prefers-reduced-motion
 * - Mobile-friendly (only transforms/opacity, no layout animations)
 */

// Re-export commonly used Framer Motion components
import type { Variants as FramerVariants } from "framer-motion";
export { motion, AnimatePresence } from "framer-motion";
export type { Variants } from "framer-motion";

type Variants = FramerVariants;

/**
 * Spring physics presets
 * Based on testing with e-commerce interactions
 */
export const springs = {
  // Snappy interactions (buttons, micro-interactions)
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
  },
  // Gentle animations (page transitions, reveals)
  gentle: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  // Toast notifications (balanced feel)
  toast: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
  },
} as const;

/**
 * Fade in with upward movement
 * Usage: Product cards, content sections
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

/**
 * Fade in with scale
 * Usage: Modals, popups, image reveals
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle,
  },
};

/**
 * Slide in from right
 * Usage: Cart slideout, side panels
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.gentle,
  },
  exit: {
    opacity: 0,
    x: 300,
    transition: { duration: 0.2 },
  },
};

/**
 * Toast notification animation
 * Slides in from bottom with spring physics
 */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.toast,
  },
  exit: {
    opacity: 0,
    x: 300,
    transition: { duration: 0.2 },
  },
};

/**
 * Page transition (fade + subtle slide)
 * Usage: Route changes, page navigation
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/**
 * Stagger children animation
 * Usage: Product grids, lists
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Button hover/tap animations
 * Micro-interaction for interactive elements
 */
export const buttonTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springs.snappy,
};

/**
 * Product card hover lift
 * Subtle elevation on hover
 */
export const cardHover = {
  whileHover: { y: -4 },
  transition: { duration: 0.2 },
};

/**
 * Image carousel transition
 * For product gallery images
 */
export const imageTransition: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 10 : -10,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 10 : -10,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

/**
 * Thumbnail hover scale
 * For product image thumbnails
 */
export const thumbnailHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: springs.snappy,
};

/**
 * Success pulse animation
 * For "added to cart" feedback
 */
export const successPulse: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.4 },
  },
};

/**
 * Respects user's motion preferences
 * Returns reduced motion variants if user prefers reduced motion
 */
export const reduceMotion = (variants: Variants): Variants => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Return simplified variants without movement - only fade
    return Object.keys(variants).reduce((acc, key) => {
      const variant = variants[key];
      // Extract opacity if it exists, otherwise use 1
      const opacity = typeof variant === 'object' && variant !== null && 'opacity' in variant ? variant.opacity : 1;
      acc[key] = { opacity };
      return acc;
    }, {} as Variants);
  }
  return variants;
};
