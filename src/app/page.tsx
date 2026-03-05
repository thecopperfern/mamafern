export const dynamic = "force-dynamic";

import Hero from "@/components/view/Hero";
import CategoryCards from "@/components/view/CategoryCards";
import FeaturedCollection from "@/components/view/FeaturedCollection";
import ShopTheLook from "@/components/shop-the-look/ShopTheLook";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import JsonLd from "@/components/seo/JsonLd";
import { TrustBadges, GuaranteeBanner } from "@/components/view/TrustSignals";
import fs from "fs";
import path from "path";
import { migrateLooksData, isLookPublished } from "@/lib/looks-migration";
import reader from "@/lib/content";
import { getHomepageSections } from "@/lib/content-helpers";

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

export default async function Home() {
  // Read hero content and homepage sections from CMS in parallel
  const [heroData, sections] = await Promise.all([
    reader.singletons.homepageHero.read().catch(() => null),
    getHomepageSections(),
  ]);

  // Read looks data server-side for zero-latency rendering
  let publishedLooks: import("@/types/looks").Look[] = [];
  try {
    const filePath = path.join(process.cwd(), "data", "looks.json");
    // If looks.json doesn't exist, initialize from seed file (first deploy)
    if (!fs.existsSync(filePath)) {
      const seedPath = path.join(process.cwd(), "data", "looks.seed.json");
      if (fs.existsSync(seedPath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.copyFileSync(seedPath, filePath);
      }
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = migrateLooksData(JSON.parse(raw));
    publishedLooks = data.looks
      .filter(isLookPublished)
      .sort((a, b) => a.order - b.order);
  } catch {
    // Fall back to empty looks if file doesn't exist yet
  }

  return (
    <div>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Hero
        headlineLine1={heroData?.headlineLine1 || undefined}
        headlineHighlight={heroData?.headlineHighlight || undefined}
        subtitle={heroData?.subtitle || undefined}
        primaryButtonText={heroData?.primaryButtonText || undefined}
        primaryButtonHref={heroData?.primaryButtonHref || undefined}
        secondaryButtonText={heroData?.secondaryButtonText || undefined}
        secondaryButtonHref={heroData?.secondaryButtonHref || undefined}
      />
      {/* Below-fold sections use cv-auto (content-visibility: auto) to defer
          layout/paint work until they scroll into view, reducing initial
          main thread blocking and improving LCP. */}
      <div className="cv-auto">
        <ShopTheLook initialLooks={publishedLooks} />
      </div>
      <div className="cv-auto">
        <CategoryCards
          heading={sections.categoryCardsHeading}
          categories={sections.categories}
        />
      </div>
      {/* Trust signals — builds credibility before first purchase */}
      <div className="cv-auto mx-auto max-w-4xl px-4 py-10">
        <TrustBadges />
        <GuaranteeBanner className="mt-6" />
      </div>

      {sections.featuredSections.map((section) => (
        <div key={section.collectionHandle} className="cv-auto">
          <Suspense fallback={<CollectionSkeleton />}>
            <FeaturedCollection
              handle={section.collectionHandle}
              title={section.title}
              subtitle={section.subtitle}
            />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
