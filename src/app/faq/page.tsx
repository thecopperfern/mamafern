import Link from "next/link";
import PageHero from "@/components/view/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about Mama Fern orders, shipping, returns, fabric materials, and sizing. Everything you need to know about our family apparel.",
  path: "/faq",
  keywords: ["mama fern faq", "family clothing questions", "natural fabric care", "mama fern shipping"],
});

/**
 * FAQ content — real answers for launch.
 * Each question is structured for FAQPage JSON-LD (Phase 3).
 */
const FAQS = [
  {
    question: "What materials does Mama Fern use?",
    answer:
      "We prioritize natural, skin-friendly fabrics in every piece we make. Our core materials include organic cotton, cotton-linen blends, and bamboo viscose. All fabrics are selected for breathability, softness, and durability — especially important for babies and kids with sensitive skin. We avoid synthetic materials like polyester wherever possible.",
  },
  {
    question: "How do your sizes run?",
    answer:
      "Our clothing runs true to size with a relaxed, comfortable fit. We design for real bodies and real movement — nothing restrictive. Each product page includes a detailed size chart with measurements. For kids, we recommend sizing up if your child is between sizes for a longer wear life.",
  },
  {
    question: "Do you offer family matching sets?",
    answer:
      "Yes! Coordinating family sets are at the heart of what we do. Our collections feature matching color palettes and complementary designs across baby, kids, mom, and dad sizes. We believe in coordinating — not identical — so each family member gets a piece that fits their style while creating a beautiful unified look.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer hassle-free returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Visit our Returns & Exchanges page for step-by-step instructions on how to start a return. Exchanges are always free.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping within the United States takes 5–7 business days. Expedited shipping (2–3 business days) is available at checkout for an additional fee. All orders include tracking information sent to your email once your package ships.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within the United States. International shipping is coming soon — join our email list to be the first to know when we expand to your country.",
  },
  {
    question: "Are your products organic and sustainable?",
    answer:
      "We use organic cotton certified to GOTS standards wherever available, and all our fabrics meet OEKO-TEX Standard 100 Class I safety requirements — the strictest level, designed for baby products. We're committed to sustainable practices including minimal-waste packaging and responsible sourcing.",
  },
  {
    question: "How should I care for Mama Fern clothing?",
    answer:
      "Machine wash cold on a gentle cycle with like colors. Tumble dry low or lay flat to dry for the longest garment life. Our natural fabrics get softer with every wash. Avoid bleach and fabric softeners, which can break down natural fibers over time. Iron on low heat if needed.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! We offer eco-friendly gift wrapping at checkout. Each gift arrives in recycled kraft paper with a hand-stamped Mama Fern seal and a blank gift note card. Perfect for baby showers, birthdays, and holidays.",
  },
  {
    question: "Where are Mama Fern products made?",
    answer:
      "Our products are designed in the United States and produced in small-batch runs with ethical manufacturing partners. We personally vet every production facility for fair labor practices, safe working conditions, and environmental responsibility.",
  },
  {
    question: "Do you have a loyalty or rewards program?",
    answer:
      "We're building a community rewards program that will launch soon. In the meantime, newsletter subscribers get early access to new drops, exclusive discounts, and first looks at seasonal collections. Join our community to stay in the loop.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "We process orders quickly to get them to you fast. If you need to cancel or modify your order, contact us within 2 hours of placing it and we'll do our best to accommodate your request. After that window, the order may already be in fulfillment.",
  },
  {
    question: "Do you have a Mother's Day gift guide?",
    answer:
      "Yes! Visit our Mother's Day Gift Guide for curated gift bundles and ideas — from The Mama Bundle (tee + tote) to The Family Set (matching pieces for the whole crew). All gifts come with optional eco-friendly gift wrapping in recycled kraft paper with a hand-stamped Mama Fern seal.",
  },
  {
    question: "What family matching options do you have?",
    answer:
      "Our Classic line features coordinating pieces across baby (Seedling Onesie), kids (Sprout Tee), moms (Mama Fern Classic Tee), and dads (Papa Fern Classic Tee) — all in the same earthy color palette. They coordinate beautifully without being identical, so each family member gets their own style.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <div>
      <JsonLd data={faqSchema} />
      <PageHero
        eyebrow="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about orders, materials, and more."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        <section id="faq" aria-label="Frequently Asked Questions">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
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
            Need More Help?
          </p>
          <h3 className="font-display font-bold text-charcoal text-xl mb-3">
            Still have questions?
          </h3>
          <p className="text-charcoal/80 text-sm mb-6 max-w-xs mx-auto">
            We&apos;re always happy to help. Reach out and we&apos;ll get back to you soon.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-fern hover:bg-fern-dark text-white font-medium px-7 py-2.5 rounded-md transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
