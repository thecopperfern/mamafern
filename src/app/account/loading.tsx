export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 animate-pulse">
      <div className="h-8 bg-oat rounded w-40 mb-6" />
      <div className="h-5 bg-oat rounded w-64 mb-10" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-texture-linen rounded-xl border border-oat p-6">
            <div className="h-5 bg-oat rounded w-1/2 mb-3" />
            <div className="h-4 bg-oat rounded w-full mb-2" />
            <div className="h-4 bg-oat rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
