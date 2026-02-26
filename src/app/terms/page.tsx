export const dynamic = "force-dynamic";

import PageHero from "@/components/view/PageHero";
import { fetchGraphQL } from "@/shopify/client";
import { gql } from "graphql-tag";
import { buildMetadata } from "@/lib/seo";

const TERMS_QUERY = gql`
  query GetTermsOfService {
    shop {
      termsOfService {
        title
        body
      }
    }
  }
`;

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Mama Fern terms of service — the rules and guidelines for using our store.",
  path: "/terms",
  noIndex: true,
});

export default async function TermsPage() {
  let policy: { title: string; body: string } | null = null;
  try {
    const data = await fetchGraphQL<{
      shop: { termsOfService: { title: string; body: string } | null };
    }>(TERMS_QUERY);
    policy = data?.shop?.termsOfService ?? null;
  } catch {
    // Fall back to empty state
  }

  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The rules and guidelines for using our store."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        {policy ? (
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          <p className="text-warm-brown/70 text-center py-8">
            Our terms of service are being finalized. Please check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
