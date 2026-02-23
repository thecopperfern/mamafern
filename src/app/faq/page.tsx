import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/view/PageHero";

export const metadata: Metadata = {
  title: "FAQ | Mama Fern",
  description: "Frequently asked questions about Mama Fern orders, shipping, returns, and more.",
};

/**
 * ⚠️ PLACEHOLDER FAQ CONTENT
 * Replace these with real answers once store policies, shipping, and product
 * details are finalized. Search for "PLACEHOLDER" to find all items.
 */
const FAQS = [
  {
    question: "What materials do you use?",
    answer:
      "⚠️ PLACEHOLDER — Describe your actual fabric sourcing, certifications, and care instructions here once finalized.",
  },
  {
    question: "How do your sizes run?",
    answer:
      "⚠️ PLACEHOLDER — Add sizing guide details, fit descriptions, and link to a size chart once products are available.",
  },
  {
    question: "Do you offer family matching sets?",
    answer:
      "⚠️ PLACEHOLDER — Explain which designs are available in coordinating family sizes and link to the Family collection.",
  },
  {
    question: "What is your return policy?",
    answer:
      "⚠️ PLACEHOLDER — Add your actual return window, conditions, and process. Link to the /returns page for the full policy.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "⚠️ PLACEHOLDER — Add real shipping timeframes, carriers, and any expedited options available.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "⚠️ PLACEHOLDER — Confirm whether international shipping is available and list supported countries.",
  },
  {
    question: "Are your products truly organic?",
    answer:
      "⚠️ PLACEHOLDER — Detail your certifications (GOTS, OEKO-TEX, etc.) and transparency commitments.",
  },
];

export default function FAQPage() {
  return (
    <div>
      <PageHero
        eyebrow="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about orders, materials, and more."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 animate-fade-in-up">
        {/* ⚠️ PLACEHOLDER banner */}
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl p-6 mb-8 text-center">
          <p className="text-yellow-700 font-semibold text-lg mb-1">
            ⚠️ PLACEHOLDER — FAQ Answers
          </p>
          <p className="text-yellow-600 text-sm">
            The answers below are placeholder text. Replace each one with real
            policies and product information before launch.
          </p>
        </div>

        <div className="space-y-3" role="list" aria-label="Frequently asked questions">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-texture-linen border border-oat rounded-xl overflow-hidden"
              role="listitem"
            >
              <summary className="cursor-pointer px-6 py-5 font-medium text-charcoal hover:text-fern transition-colors list-none flex items-center justify-between gap-4">
                <span>{faq.question}</span>
                <span className="text-fern shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pt-1 text-warm-brown/70 leading-relaxed text-[14px] border-t border-oat/60">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 bg-texture-linen rounded-2xl border border-oat p-8 text-center">
          <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-2">
            Need More Help?
          </p>
          <h3 className="font-display font-bold text-charcoal text-xl mb-3">
            Still have questions?
          </h3>
          <p className="text-warm-brown/60 text-sm mb-6 max-w-xs mx-auto">
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
