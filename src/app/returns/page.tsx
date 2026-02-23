import type { Metadata } from "next";
import PageHero from "@/components/view/PageHero";
import { fetchGraphQL } from "@/shopify/client";
import { gql } from "graphql-tag";

const REFUND_POLICY_QUERY = gql`
  query GetRefundPolicy {
    shop {
      refundPolicy {
        title
        body
      }
    }
  }
`;

export const metadata: Metadata = {
  title: "Returns & Refunds | Mama Fern",
  description: "Mama Fern returns and refund policy — how to return or exchange items.",
};

export default async function ReturnsPage() {
  let policy: { title: string; body: string } | null = null;
  try {
    const data = await fetchGraphQL<{
      shop: { refundPolicy: { title: string; body: string } | null };
    }>(REFUND_POLICY_QUERY);
    policy = data?.shop?.refundPolicy ?? null;
  } catch {
    // Fall back to empty state
  }

  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Returns & Refunds"
        subtitle="Our policy on returns, exchanges, and refunds."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        {policy ? (
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          <p className="text-warm-brown/60 text-center py-8">
            Our returns policy is being finalized. Please check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
