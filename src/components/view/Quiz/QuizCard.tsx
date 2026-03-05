"use client";

import { cn } from "@/lib/utils";

/**
 * QuizCard — Individual answer option card
 *
 * Displays an emoji + text answer option. Highlights when selected.
 * Keyboard accessible with Enter/Space support.
 */
export default function QuizCard({
  text,
  emoji,
  selected,
  onClick,
}: {
  text: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
        "hover:border-fern/50 hover:bg-fern/5 focus:outline-none focus:ring-2 focus:ring-fern/30",
        selected
          ? "border-fern bg-fern/10 shadow-sm"
          : "border-oat bg-white"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        {emoji && (
          <span className="text-2xl" role="img" aria-hidden="true">
            {emoji}
          </span>
        )}
        <span className="text-sm font-medium text-charcoal">{text}</span>
      </div>
    </button>
  );
}
