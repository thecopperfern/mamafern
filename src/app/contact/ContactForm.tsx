"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, type ContactFormState } from "./action";
import { toast } from "sonner";

export default function ContactForm() {
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
    <div className="bg-texture-linen rounded-2xl border border-oat p-6 md:p-8">
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
            className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition-colors text-sm"
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
            className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern transition-colors text-sm"
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
            className="w-full border border-oat rounded-lg px-4 py-2.5 bg-cream/60 text-charcoal placeholder:text-warm-brown focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern resize-none transition-colors text-sm"
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
  );
}
