import type { Metadata } from "next";
import PageHero from "@/components/view/PageHero";
import { fetchGraphQL } from "@/shopify/client";
import { gql } from "graphql-tag";

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

export const metadata: Metadata = {
  title: "Terms of Service | Mama Fern",
  description: "Mama Fern terms of service — the rules and guidelines for using our store.",
};

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
          <p className="text-warm-brown/60 text-center py-8">
            Our terms of service are being finalized. Please check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
