import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Mama Fern",
  description: "Updates, stories, and inspiration from the Mama Fern community.",
};

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-charcoal mb-4">
        Community
      </h1>
      <p className="text-warm-brown/70 mb-12 text-lg">
        Stories, updates, and a little inspiration from our Mama Fern family.
      </p>

      <div className="space-y-10">
        <article className="border-b border-oat pb-8">
          <p className="text-xs text-warm-brown/50 uppercase tracking-wider mb-2">
            Welcome
          </p>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-3">
            Hello from Mama Fern
          </h2>
          <p className="text-warm-brown/70 leading-relaxed">
            We&apos;re so glad you&apos;re here. Mama Fern is more than a clothing
            brand — it&apos;s a community of families who value comfort, quality,
            and a little bit of fun in their everyday wear. Stay tuned for
            seasonal drop announcements, behind-the-scenes looks at our design
            process, and stories from the families who wear Mama Fern.
          </p>
        </article>

        <div className="bg-sage/20 rounded-xl p-8 text-center">
          <h3 className="font-display font-bold text-charcoal text-xl mb-2">
            More coming soon
          </h3>
          <p className="text-warm-brown/60">
            We&apos;re building something special here. Check back for new posts,
            or follow us on social media for the latest updates.
          </p>
        </div>
      </div>
    </div>
  );
}
