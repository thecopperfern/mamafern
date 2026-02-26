export const dynamic = "force-dynamic";

import PageHero from "@/components/view/PageHero";
import { fetchGraphQL } from "@/shopify/client";
import { gql } from "graphql-tag";
import { buildMetadata } from "@/lib/seo";

const PRIVACY_POLICY_QUERY = gql`
  query GetPrivacyPolicy {
    shop {
      privacyPolicy {
        title
        body
      }
    }
  }
`;

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Mama Fern privacy policy — how we collect, use, and protect your information.",
  path: "/privacy",
  noIndex: true,
});

export default async function PrivacyPage() {
  let policy: { title: string; body: string } | null = null;
  try {
    const data = await fetchGraphQL<{
      shop: { privacyPolicy: { title: string; body: string } | null };
    }>(PRIVACY_POLICY_QUERY);
    policy = data?.shop?.privacyPolicy ?? null;
  } catch {
    // Fall back to empty state
  }

  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        {policy ? (
          <div
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          <p className="text-warm-brown/70 text-center py-8">
            Our privacy policy is being finalized. Please check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
