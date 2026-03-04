import { notFound } from "next/navigation";
import reader from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/view/PageHero";
import GiftBundlesSection from "@/components/view/CampaignSections/GiftBundlesSection";
import GiftIdeasSection from "@/components/view/CampaignSections/GiftIdeasSection";
import InfoGridSection from "@/components/view/CampaignSections/InfoGridSection";
import CTASection from "@/components/view/CampaignSections/CTASection";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const campaign = await reader.collections.campaigns.read(slug).catch(() => null);
  if (!campaign) return {};

  return buildMetadata({
    title: campaign.seoTitle || campaign.heroTitle || slug,
    description: campaign.seoDescription || campaign.heroSubtitle || "",
    path: `/campaigns/${slug}`,
    keywords: campaign.seoKeywords as string[],
  });
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await reader.collections.campaigns.read(slug).catch(() => null);
  if (!campaign) notFound();

  // Filter by status and date range
  if (campaign.status === "draft") notFound();
  const now = new Date();
  if (campaign.startDate && new Date(campaign.startDate) > now) notFound();
  if (campaign.endDate && new Date(campaign.endDate) <= now) notFound();

  return (
    <div>
      <PageHero
        eyebrow={campaign.heroEyebrow || undefined}
        title={campaign.heroTitle || slug}
        subtitle={campaign.heroSubtitle || undefined}
      />

      {campaign.giftBundles && campaign.giftBundles.length > 0 && (
        <GiftBundlesSection bundles={campaign.giftBundles} />
      )}

      {campaign.giftIdeas && campaign.giftIdeas.length > 0 && (
        <GiftIdeasSection ideas={campaign.giftIdeas} />
      )}

      {campaign.infoBlocks && campaign.infoBlocks.length > 0 && (
        <InfoGridSection items={campaign.infoBlocks} />
      )}

      {campaign.ctaHeading && (
        <CTASection
          heading={campaign.ctaHeading}
          body={campaign.ctaBody || ""}
          primaryText={campaign.ctaPrimaryText || undefined}
          primaryHref={campaign.ctaPrimaryHref || undefined}
          secondaryText={campaign.ctaSecondaryText || undefined}
          secondaryHref={campaign.ctaSecondaryHref || undefined}
        />
      )}
    </div>
  );
}
