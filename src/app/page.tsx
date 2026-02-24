// ISR: revalidate every 60 seconds for fresh product data without rebuilding
export const revalidate = 60;

import Hero from "@/components/view/Hero";
import CategoryCards from "@/components/view/CategoryCards";
import FeaturedCollection from "@/components/view/FeaturedCollection";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CollectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryCards />
      <Suspense fallback={<CollectionSkeleton />}>
        <FeaturedCollection
          handle="new-arrivals"
          title="New Arrivals"
          subtitle="Fresh drops for the whole family"
        />
      </Suspense>
      <Suspense fallback={<CollectionSkeleton />}>
        <FeaturedCollection
          handle="staples"
          title="Evergreen Staples"
          subtitle="The essentials that never go out of style"
        />
      </Suspense>
    </div>
  );
}
