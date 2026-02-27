"use client";

import { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/atoms/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion";
import FernBurst from "@/components/animations/FernBurst";

export default function WishlistButton({
  handle,
  title,
  className,
}: {
  handle: string;
  title: string;
  className?: string;
}) {
  const { initialize, toggleItem, isWishlisted } = useWishlist();
  const [justBurst, setJustBurst] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [lastAction, setLastAction] = useState<"add" | "remove" | null>(null);

  useEffect(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const wishlisted = isWishlisted(handle);

  const handleBurstComplete = useCallback(() => {
    setJustBurst(false);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleItem(handle);
    setLastAction(added ? "add" : "remove");
    setAnimateKey((k) => k + 1);

    if (added) {
      setJustBurst(true);
      toast.success(`${title} added to wishlist`);
    } else {
      toast.success(`${title} removed from wishlist`);
    }
  };

  /**
   * Multi-keyframe animations require tween (not spring).
   * Add: heartbeat thump — scale up, overshoot down, settle
   * Remove: gentle shrink and return
   */
  const heartAnimation =
    lastAction === "add"
      ? { scale: [1, 1.3, 0.9, 1.05, 1] }
      : lastAction === "remove"
      ? { scale: [1, 0.85, 1] }
      : {};

  const heartTransition =
    lastAction === "add"
      ? { duration: 0.4, ease: "easeInOut" as const, times: [0, 0.25, 0.55, 0.8, 1] }
      : lastAction === "remove"
      ? { duration: 0.25, ease: "easeInOut" as const, times: [0, 0.5, 1] }
      : { duration: 0 };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      className={cn("text-warm-brown hover:text-terracotta relative", className)}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        key={animateKey}
        animate={heartAnimation}
        transition={heartTransition}
      >
        <Heart
          className={cn("h-5 w-5", wishlisted && "fill-terracotta text-terracotta")}
        />
      </motion.div>
      <FernBurst
        trigger={justBurst}
        onComplete={handleBurstComplete}
        color="fern"
      />
    </Button>
  );
}
