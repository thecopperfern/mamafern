import { commerceClient } from "@/lib/commerce";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionContent from "@/components/view/CollectionContent";
import Breadcrumbs from "@/components/view/Breadcrumbs";
import InternalLinks from "@/components/seo/InternalLinks";
import { buildCollectionMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ after?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const result = await commerceClient.getCollectionByHandle(handle, {
    first: 1,
  });
  if (!result) return { title: "Collection Not Found" };
  return buildCollectionMetadata(result.collection);
}

const SORT_OPTIONS: Record<string, { sortKey: string; reverse: boolean }> = {
  default: { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED", reverse: true },
};

export default async function CollectionPage({
  params,
  searchParams,
}: Props) {
  const { handle } = await params;
  const { after, sort } = await searchParams;
  const sortOption = SORT_OPTIONS[sort ?? "default"] ?? SORT_OPTIONS.default;

  const result = await commerceClient.getCollectionByHandle(handle, {
    first: 12,
    after: after ?? null,
    sortKey: sortOption.sortKey,
    reverse: sortOption.reverse,
  });

  if (!result) notFound();

  return (
    <div className="my-10 flex flex-col gap-y-6 px-4">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: result.collection.title },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display text-charcoal">
          {result.collection.title}
        </h1>
      </div>
      {result.collection.description && (
        <p className="text-warm-brown/70 max-w-2xl">
          {result.collection.description}
        </p>
      )}
      <CollectionContent
        products={result.products}
        pageInfo={result.pageInfo}
        handle={handle}
        currentSort={sort ?? "default"}
      />
      <InternalLinks context="collection" />
    </div>
  );
}
