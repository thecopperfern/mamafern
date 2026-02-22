"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, type ContactFormState } from "./action";
import { toast } from "sonner";
import PageHero from "@/components/view/PageHero";

const CONTACT_INFO = [
  {
    emoji: "📦",
    title: "Order Questions",
    desc: "Track, return, or update your order",
  },
  {
    emoji: "🌿",
    title: "Product Info",
    desc: "Materials, sizing, and care instructions",
  },
  {
    emoji: "💚",
    title: "General Feedback",
    desc: "We love hearing from our community",
  },
];

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Message sent! We'll get back to you soon.");
      formRef.current?.reset();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div>
      <PageHero
        eyebrow="Say Hello"
        title="Get in Touch"
        subtitle="Have a question, suggestion, or just want to say hi? We'd love to hear from you."
      />

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: info panel */}
          <div className="animate-fade-in-up">
            <h2 className="font-display font-bold text-xl text-charcoal mb-6">
              How we can help
            </h2>
            <div className="space-y-5 mb-8">
              {CONTACT_INFO.map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <span className="text-xl mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-charcoal text-sm">{item.title}</p>
                    <p className="text-warm-brown/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-texture-linen rounded-xl border border-oat p-5">
              <p className="text-xs font-medium text-fern uppercase tracking-[0.18em] mb-1.5">
                Response Time
              </p>
              <p className="text-warm-brown/70 text-sm leading-relaxed">
                We typically respond within 1&ndash;2 business days.
              </p>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="bg-texture-linen rounded-2xl border border-oat p-6 md:p-8 animate-fade-in-up-1">
            {state.success && (
              <div className="mb-5 rounded-md bg-fern/10 border border-fern/30 px-4 py-3 text-fern text-sm">
                Thanks for reaching out! We&apos;ll get back to you soon.
              </div>
            )}
            {state.error && (
              <div className="mb-5 rounded-md bg-terracotta/10 border border-terracotta/30 px-4 py-3 text-terracotta text-sm">
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-charcoal mb-1.5"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition-colors text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-charcoal mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-charcoal mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern resize-none transition-colors text-sm"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-fern hover:bg-fern-dark text-white font-medium px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
