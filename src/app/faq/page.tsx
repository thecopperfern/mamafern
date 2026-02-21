import type { Metadata } from "next";

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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-charcoal mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group border border-oat rounded-lg overflow-hidden"
          >
            <summary className="cursor-pointer px-6 py-4 font-medium text-charcoal hover:bg-oat/50 transition-colors list-none flex items-center justify-between">
              {faq.question}
              <span className="text-fern ml-2 group-open:rotate-45 transition-transform text-xl">
                +
              </span>
            </summary>
            <div className="px-6 pb-4 text-warm-brown/70 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
