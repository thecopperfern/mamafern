import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-display font-bold text-fern mb-4">404</h1>
      <p className="text-lg text-charcoal mb-2">Post not found</p>
      <p className="text-warm-brown/60 mb-8 max-w-md">
        This article doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center justify-center rounded-md bg-fern px-6 py-3 text-sm font-medium text-white hover:bg-fern-dark transition-colors"
      >
        Back to Journal
      </Link>
    </div>
  );
}
