"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/atoms/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const wishlisted = isWishlisted(handle);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleItem(handle);
    if (added) {
      toast.success(`${title} added to wishlist`);
    } else {
      toast.success(`${title} removed from wishlist`);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      className={cn("text-warm-brown/40 hover:text-terracotta", className)}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn("h-5 w-5", wishlisted && "fill-terracotta text-terracotta")}
      />
    </Button>
  );
}
