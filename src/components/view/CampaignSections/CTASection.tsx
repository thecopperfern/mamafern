import Link from "next/link";

type Props = {
  heading: string;
  body: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
};

export default function CTASection({
  heading,
  body,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h2 className="font-display font-bold text-3xl text-charcoal mb-4">{heading}</h2>
      <p className="text-warm-brown text-lg mb-8">{body}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {primaryText && primaryHref && (
          <Link
            href={primaryHref}
            className="bg-fern hover:bg-fern-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            {primaryText}
          </Link>
        )}
        {secondaryText && secondaryHref && (
          <Link
            href={secondaryHref}
            className="border border-fern text-fern hover:bg-fern/5 font-medium px-8 py-3 rounded-lg transition-colors"
          >
            {secondaryText}
          </Link>
        )}
      </div>
    </section>
  );
}
