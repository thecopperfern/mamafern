export default function CollectionLoading() {
  return (
    <div className="my-10 flex flex-col gap-y-6 px-4 animate-pulse">
      <div className="h-8 bg-oat rounded w-48" />
      <div className="h-4 bg-oat rounded w-96 max-w-full" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
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
