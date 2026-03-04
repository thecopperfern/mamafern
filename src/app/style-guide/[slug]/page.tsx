import { notFound } from "next/navigation";
import reader from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/view/PageHero";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = await reader.collections.styleGuides.read(slug).catch(() => null);
  if (!guide) return {};

  return buildMetadata({
    title: guide.seoTitle || (guide.title as unknown as string) || slug,
    description: guide.seoDescription || guide.description || "",
    path: `/style-guide/${slug}`,
    keywords: guide.seoKeywords as string[],
  });
}

export default async function StyleGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await reader.collections.styleGuides.read(slug).catch(() => null);

  // If no CMS entry, let Next.js try the static routes (crunchy-mom, etc.)
  if (!guide) notFound();

  // Render the MDX content
  const { default: Content } = await (guide.content as unknown as () => Promise<{ default: React.ComponentType }>)();

  return (
    <div>
      <PageHero
        eyebrow="Style Guide"
        title={(guide.title as unknown as string) || slug}
        subtitle={guide.description || undefined}
      />

      <article className="mx-auto max-w-3xl px-4 py-14">
        <div className="prose prose-charcoal prose-headings:font-display prose-a:text-fern max-w-none">
          <Content />
        </div>
      </article>
    </div>
  );
}
