/**
 * FernBurst — Botanical Particle Burst
 *
 * Spawns ~5 tiny leaf SVGs that burst outward from a trigger point,
 * rotate, and fade over ~600ms. This is the signature "ferns popping
 * off things" micro-interaction for Mama Fern.
 *
 * Usage:
 *   <div className="relative">
 *     <button onClick={() => setFired(true)}>Like</button>
 *     <FernBurst trigger={fired} onComplete={() => setFired(false)} />
 *   </div>
 *
 * - Position: absolute (parent must be `relative`)
 * - Respects prefers-reduced-motion — renders nothing when enabled
 * - Uses `snappy` spring for burst, linear fade for exit
 */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, springs } from "@/lib/motion";

type FernBurstProps = {
  /** When flipped to true, fires the burst */
  trigger: boolean;
  /** Called after all leaves have finished animating */
  onComplete?: () => void;
  /** Leaf color — maps to Tailwind theme tokens */
  color?: "fern" | "sage";
};

const LEAF_COUNT = 5;
const ANIMATION_DURATION = 600; // ms

/** Color hex values matching tailwind.config */
const colorMap = {
  fern: "#4A7C59",
  sage: "#8FAF8B",
} as const;

type Leaf = {
  id: number;
  angle: number; // radians — direction of travel
  distance: number; // px — how far it flies
  rotation: number; // degrees — spin during flight
  scale: number; // size variance
  color: string;
};

function generateLeaves(color: string): Leaf[] {
  return Array.from({ length: LEAF_COUNT }, (_, i) => {
    // Spread leaves evenly-ish around the circle with some randomness
    const baseAngle = (i / LEAF_COUNT) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * 0.8;
    return {
      id: i,
      angle: baseAngle + jitter,
      distance: 18 + Math.random() * 14, // 18–32px
      rotation: (Math.random() - 0.5) * 180, // -90 to 90 deg
      scale: 0.7 + Math.random() * 0.5, // 0.7–1.2
      color,
    };
  });
}

/**
 * Tiny teardrop/leaf SVG path.
 * Rendered at 16x16 viewBox, colored via fill.
 */
function LeafSvg({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1C8 1 3 6 3 10C3 12.7614 5.23858 15 8 15C10.7614 15 13 12.7614 13 10C13 6 8 1 8 1Z"
        fill={color}
        opacity={0.85}
      />
      {/* Leaf vein */}
      <path
        d="M8 4V12"
        stroke={color}
        strokeWidth="0.5"
        opacity={0.5}
      />
    </svg>
  );
}

export default function FernBurst({
  trigger,
  onComplete,
  color = "fern",
}: FernBurstProps) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference once on mount
  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleComplete = useCallback(() => {
    setLeaves([]);
    onComplete?.();
  }, [onComplete]);

  // Fire burst when trigger flips to true
  useEffect(() => {
    if (!trigger || prefersReducedMotion.current) {
      if (trigger) onComplete?.(); // still call onComplete so parent resets
      return;
    }

    const hex = colorMap[color];
    setLeaves(generateLeaves(hex));

    // Clean up after animation
    timerRef.current = setTimeout(handleComplete, ANIMATION_DURATION + 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, color, handleComplete, onComplete]);

  if (leaves.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      <AnimatePresence>
        {leaves.map((leaf) => {
          const x = Math.cos(leaf.angle) * leaf.distance;
          const y = Math.sin(leaf.angle) * leaf.distance;

          return (
            <motion.div
              key={leaf.id}
              className="absolute left-1/2 top-1/2"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x,
                y,
                scale: leaf.scale,
                rotate: leaf.rotation,
                opacity: 0,
              }}
              transition={{
                x: { ...springs.snappy, duration: 0.5 },
                y: { ...springs.snappy, duration: 0.5 },
                scale: { ...springs.snappy, duration: 0.4 },
                rotate: { ...springs.snappy, duration: 0.5 },
                opacity: { duration: 0.6, ease: "linear", delay: 0.15 },
              }}
            >
              <LeafSvg color={leaf.color} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
