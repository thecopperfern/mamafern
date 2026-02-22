import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/view/PageHero";

export const metadata: Metadata = {
  title: "FAQ | Mama Fern",
  description: "Frequently asked questions about Mama Fern orders, shipping, returns, and more.",
};

const FAQS = [
  {
    question: "What materials do you use?",
    answer:
      "We primarily use organic cotton and other skin-friendly fabrics. Each product listing includes detailed fabric composition and care instructions.",
  },
  {
    question: "How do your sizes run?",
    answer:
      "Our adult tees are available in unisex and women's fits. We recommend checking the size guide on each product page. When in doubt, size up for a cozier fit.",
  },
  {
    question: "Do you offer family matching sets?",
    answer:
      "Yes! Many of our designs come in coordinating adult and kids versions. Check our Family collection for easy matching options.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for unworn, unwashed items in original condition. Please reach out via our contact page to start a return.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 5-7 business days within the US. We'll send you a tracking number as soon as your order ships.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Not yet, but we're working on it! Currently we ship within the United States only.",
  },
  {
    question: "Are your products truly organic?",
    answer:
      "We use certified organic cotton where possible and clearly label fabric composition on each product. We're committed to transparency about our materials.",
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
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-texture-linen border border-oat rounded-xl overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-5 font-medium text-charcoal hover:text-fern transition-colors list-none flex items-center justify-between gap-4">
                <span>{faq.question}</span>
                <span className="text-fern shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
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
