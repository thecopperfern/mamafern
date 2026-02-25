export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 animate-pulse">
      <div className="h-4 bg-oat rounded w-40 mb-6" />
      <div className="h-10 bg-oat rounded w-3/4 mb-4" />
      <div className="h-4 bg-oat rounded w-32 mb-10" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-oat rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
        ))}
      </div>
    </div>
  );
}
