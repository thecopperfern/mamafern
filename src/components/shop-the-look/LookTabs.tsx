"use client";

import { cn } from "@/lib/utils";
import type { Look } from "@/types/looks";

type LookTabsProps = {
  looks: Look[];
  activeId: string;
  onSelect: (id: string) => void;
};

export default function LookTabs({ looks, activeId, onSelect }: LookTabsProps) {
  return (
    <div className="flex justify-center gap-1 mb-8" role="tablist" aria-label="Shop the Look categories">
      {looks.map((look) => (
        <button
          key={look.id}
          role="tab"
          aria-selected={activeId === look.id}
          aria-controls={`look-panel-${look.id}`}
          onClick={() => onSelect(look.id)}
          className={cn(
            "px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200",
            activeId === look.id
              ? "bg-fern text-white shadow-sm"
              : "bg-oat text-warm-brown hover:bg-sage/30"
          )}
        >
          {look.label}
        </button>
      ))}
    </div>
  );
}
