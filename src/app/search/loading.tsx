export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 animate-pulse">
      <div className="h-8 bg-oat rounded w-64 mb-2" />
      <div className="h-4 bg-oat rounded w-32 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="h-[300px] bg-oat rounded-lg" />
            <div className="h-4 bg-oat rounded mt-3 w-3/4" />
            <div className="h-4 bg-oat rounded mt-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
