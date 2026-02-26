"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
}

// Placeholder reviews — replace with Shopify metafields or a reviews API
const PLACEHOLDER_REVIEWS: Review[] = [];

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-oat"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({
  productHandle,
}: {
  productHandle: string;
}) {
  const [reviews] = useState<Review[]>(PLACEHOLDER_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newName, setNewName] = useState("");
  const [newBody, setNewBody] = useState("");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating || !newName.trim() || !newBody.trim()) {
      toast.error("Please fill out all fields and select a rating.");
      return;
    }
    // TODO: Submit to reviews API / Shopify metafields
    console.log("[Review Submitted]", {
      productHandle,
      rating: newRating,
      author: newName,
      body: newBody,
    });
    toast.success("Thanks for your review! It will appear after moderation.");
    setShowForm(false);
    setNewRating(0);
    setNewName("");
    setNewBody("");
  };

  return (
    <section className="border-t border-oat pt-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-charcoal">
          Customer Reviews
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white border border-oat rounded-lg p-4 mb-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-charcoal mb-1 block">
              Rating
            </label>
            <StarRating rating={newRating} interactive onRate={setNewRating} />
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-1 block">
              Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-oat rounded-md px-3 py-2 text-sm bg-white text-charcoal placeholder:text-warm-brown/70 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-1 block">
              Review
            </label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={3}
              className="w-full border border-oat rounded-md px-3 py-2 text-sm bg-white text-charcoal placeholder:text-warm-brown/70 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <Button type="submit" className="bg-fern hover:bg-fern-dark text-white">
            Submit Review
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-warm-brown/70 text-sm py-4">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-oat rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-medium text-charcoal">
                    {review.author}
                  </span>
                </div>
                <span className="text-xs text-warm-brown/70">
                  {review.date}
                </span>
              </div>
              <p className="text-sm text-warm-brown/70">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
