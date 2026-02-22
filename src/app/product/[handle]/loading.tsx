export default function ProductLoading() {
  return (
    <div className="px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10 animate-pulse">
        <div className="md:col-span-2 h-[400px] bg-oat rounded-lg" />
        <div className="flex flex-col gap-y-4">
          <div className="h-7 bg-oat rounded w-3/4" />
          <div className="h-4 bg-oat rounded w-full" />
          <div className="h-4 bg-oat rounded w-2/3" />
          <div className="flex gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-12 bg-oat rounded" />
            ))}
          </div>
          <div className="h-6 bg-oat rounded w-24 mt-2" />
          <div className="h-10 bg-oat rounded mt-2" />
        </div>
      </div>
    </div>
  );
}
