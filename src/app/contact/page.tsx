import { getContactPage } from "@/lib/content-helpers";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getContactPage();
  return buildMetadata({
    title: "Contact Us",
    description: `${data.heroSubtitle} Reach out to the Mama Fern team.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const data = await getContactPage();

  return (
    <div>
      <div className="relative bg-texture-linen border-b border-oat py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.2em] mb-3">
            {data.heroEyebrow}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal">
            {data.heroTitle}
          </h1>
          <p className="mt-4 text-warm-brown text-lg">
            {data.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: info panel */}
          <div>
            <h2 className="font-display font-bold text-xl text-charcoal mb-6">
              {data.contactInfoHeading}
            </h2>
            <div className="space-y-5 mb-8">
              {data.contactInfoItems.map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <span className="text-xl mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-charcoal text-sm">{item.title}</p>
                    <p className="text-warm-brown text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-texture-linen rounded-xl border border-oat p-5">
              <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-1.5">
                {data.responseTimeLabel}
              </p>
              <p className="text-warm-brown text-sm">
                {data.responseTimeText}
              </p>
            </div>
          </div>

          {/* Right: form panel */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
