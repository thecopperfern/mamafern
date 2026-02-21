import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-display font-bold text-fern mb-4">404</h1>
      <p className="text-lg text-charcoal mb-2">Page not found</p>
      <p className="text-warm-brown/60 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-3 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
      >
        Back to Shop
      </Link>
    </main>
  );
}
