"use client";

import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-display font-bold text-terracotta mb-4">
        Couldn&apos;t load product
      </h1>
      <p className="text-warm-brown/70 mb-8 max-w-md">
        {error.message || "We had trouble loading this product. Please try again."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-3 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-md border border-oat px-6 py-3 text-sm font-medium text-charcoal hover:bg-oat/50 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}
