import Link from "next/link";

interface TagCloudProps {
  tags: { tag: string; count: number }[];
}

/**
 * Tag cloud showing all blog tags with post counts.
 * Displayed between the search bar and the post grid on the blog index.
 */
export default function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="sr-only">Browse by topic</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="text-xs font-medium text-fern bg-fern/10 px-3 py-1 rounded-full hover:bg-fern/20 transition-colors"
          >
            {tag}{" "}
            <span className="text-fern/60">({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
