export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="h-8 bg-oat rounded w-32 animate-pulse mb-2" />
      <div className="h-5 bg-oat rounded w-64 animate-pulse mb-10" />
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-texture-linen rounded-xl border border-oat p-6">
            <div className="h-4 bg-oat rounded w-24 mb-3" />
            <div className="h-6 bg-oat rounded w-3/4 mb-2" />
            <div className="h-4 bg-oat rounded w-full mb-1" />
            <div className="h-4 bg-oat rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
