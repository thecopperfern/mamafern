/**
 * PageTransition Component
 *
 * Provides smooth fade + slide transitions for page navigation.
 * Respects user's prefers-reduced-motion setting for accessibility.
 *
 * Usage:
 *   <PageTransition>
 *     <YourPageContent />
 *   </PageTransition>
 */

"use client";

import { motion, pageTransition, reduceMotion } from "@/lib/motion";

type PageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageTransition({ children, className }: PageTransitionProps) {
  // Respect user's motion preferences
  const variants = reduceMotion(pageTransition);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
