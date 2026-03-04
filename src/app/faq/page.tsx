export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import reader from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const data = await reader.singletons.faqPage.read();
  return buildMetadata({
    title: data?.seoTitle || "FAQ",
    description:
      data?.seoDescription ||
      "Frequently asked questions about Mama Fern orders, shipping, returns, fabric materials, and sizing. Everything you need to know about our family apparel.",
    path: "/faq",
    keywords: (data?.seoKeywords || ["mama fern faq", "family clothing questions", "natural fabric care", "mama fern shipping"]) as string[],
  });
}

export default async function FAQPage() {
  const data = await reader.singletons.faqPage.read();

  const heroEyebrow = data?.heroEyebrow || "Got Questions?";
  const heroTitle = data?.heroTitle || "Frequently Asked Questions";
  const heroSubtitle = data?.heroSubtitle || "Everything you need to know about orders, materials, and more.";
  const faqs = data?.faqs?.length
    ? data.faqs
    : [
        { question: "What materials does Mama Fern use?", answer: "We prioritize natural, skin-friendly fabrics in every piece we make. Our core materials include organic cotton, cotton-linen blends, and bamboo viscose. All fabrics are selected for breathability, softness, and durability \u2014 especially important for babies and kids with sensitive skin. We avoid synthetic materials like polyester wherever possible." },
        { question: "How do your sizes run?", answer: "Our clothing runs true to size with a relaxed, comfortable fit. We design for real bodies and real movement \u2014 nothing restrictive. Each product page includes a detailed size chart with measurements. For kids, we recommend sizing up if your child is between sizes for a longer wear life." },
      ];
  const ctaEyebrow = data?.ctaEyebrow || "Need More Help?";
  const ctaHeading = data?.ctaHeading || "Still have questions?";
  const ctaBody = data?.ctaBody || "We\u2019re always happy to help. Reach out and we\u2019ll get back to you soon.";
  const ctaButtonText = data?.ctaButtonText || "Contact Us";
  const ctaButtonHref = data?.ctaButtonHref || "/contact";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      <JsonLd data={faqSchema} />
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <div className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        <section id="faq" aria-label="Frequently Asked Questions">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-texture-linen border border-oat rounded-xl overflow-hidden"
              >
                <summary className="cursor-pointer px-6 py-5 font-medium text-charcoal hover:text-fern transition-colors list-none flex items-center justify-between gap-4">
                  <h3 className="text-[15px] font-medium">{faq.question}</h3>
                  <span className="text-fern shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1 text-charcoal/90 leading-relaxed text-[15px] border-t border-oat/60">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Still have questions CTA */}
        <div className="mt-12 bg-texture-linen rounded-2xl border border-oat p-8 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-2">
            {ctaEyebrow}
          </p>
          <h3 className="font-display font-bold text-charcoal text-xl mb-3">
            {ctaHeading}
          </h3>
          <p className="text-charcoal/80 text-sm mb-6 max-w-xs mx-auto">
            {ctaBody}
          </p>
          <Link
            href={ctaButtonHref}
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
          >
            {ctaButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
