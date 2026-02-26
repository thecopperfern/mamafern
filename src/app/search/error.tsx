"use client";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-display font-bold text-terracotta mb-4">
        Search failed
      </h1>
      <p className="text-warm-brown/70 mb-8 max-w-md">
        {error.message || "We couldn't complete your search. Please try again."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-3 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
      >
        Try Again
      </button>
    </main>
  );
}
