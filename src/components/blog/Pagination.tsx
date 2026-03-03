import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/**
 * Reusable pagination component for blog listing and tag pages.
 * Uses URL-based ?page=N query params for SSR/SEO friendliness.
 * Fully accessible with proper ARIA attributes.
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function pageUrl(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  // Build page numbers to show: always show first, last, current, and neighbors
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={pageUrl(currentPage - 1)}
              className="px-3 py-2 text-sm text-fern hover:bg-fern/10 rounded-lg transition-colors"
              aria-label="Previous page"
            >
              <span aria-hidden="true">&larr;</span> Prev
            </Link>
          ) : (
            <span className="px-3 py-2 text-sm text-warm-brown/40 cursor-not-allowed">
              <span aria-hidden="true">&larr;</span> Prev
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <li key={`ellipsis-${i}`}>
              <span className="px-2 py-2 text-sm text-warm-brown">...</span>
            </li>
          ) : (
            <li key={p}>
              <Link
                href={pageUrl(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  p === currentPage
                    ? "bg-fern text-white font-medium"
                    : "text-charcoal hover:bg-fern/10"
                }`}
              >
                {p}
              </Link>
            </li>
          )
        )}

        {/* Next */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={pageUrl(currentPage + 1)}
              className="px-3 py-2 text-sm text-fern hover:bg-fern/10 rounded-lg transition-colors"
              aria-label="Next page"
            >
              Next <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <span className="px-3 py-2 text-sm text-warm-brown/40 cursor-not-allowed">
              Next <span aria-hidden="true">&rarr;</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
