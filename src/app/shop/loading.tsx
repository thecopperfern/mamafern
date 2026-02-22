export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="h-8 bg-oat rounded w-40 mt-10 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[300px] bg-oat rounded-lg" />
            <div className="h-4 bg-oat rounded mt-3 w-3/4" />
            <div className="h-4 bg-oat rounded mt-2 w-1/2" />
            <div className="h-9 bg-oat rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
