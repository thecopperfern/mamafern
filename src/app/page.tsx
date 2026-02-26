export const dynamic = "force-dynamic";

import Hero from "@/components/view/Hero";
import CategoryCards from "@/components/view/CategoryCards";
import FeaturedCollection from "@/components/view/FeaturedCollection";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import JsonLd from "@/components/seo/JsonLd";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mama Fern",
  url: "https://mamafern.com",
  logo: "https://mamafern.com/logo.png",
  description:
    "Grounded family apparel for crunchy, cozy homes. Natural fabrics, earthy patterns, and family-forward designs for moms, dads, and kids.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://mamafern.com/contact",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mama Fern",
  url: "https://mamafern.com",
  description:
    "Grounded family apparel in natural fabrics for crunchy, cottagecore, and outdoor-loving families.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://mamafern.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

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
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
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
