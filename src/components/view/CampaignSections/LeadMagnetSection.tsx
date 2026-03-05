import reader from "@/lib/content";
import LeadMagnetCTA from "@/components/blog/LeadMagnetCTA";

/**
 * LeadMagnetSection — Renders a lead magnet CTA on a campaign page
 *
 * Loads lead magnet data by slug from Keystatic and renders
 * the email-gated download card.
 */
export default async function LeadMagnetSection({ slug }: { slug: string }) {
  const lm = await reader.collections.leadMagnets.read(slug).catch(() => null);
  if (!lm || !lm.fileUrl) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <LeadMagnetCTA
        title={(lm.title as string) || slug}
        description={(lm.description as string) || undefined}
        fileUrl={lm.fileUrl}
        ctaText={(lm.ctaText as string) || undefined}
        brevoListId={(lm.brevoListId as string) || undefined}
        thumbnail={(lm.thumbnail as string) || undefined}
      />
    </section>
  );
}
