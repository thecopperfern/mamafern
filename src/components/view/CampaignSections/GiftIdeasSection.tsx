import Link from "next/link";

type GiftIdea = {
  title: string;
  description: string;
  product: string;
  price: string;
  href: string;
};

type Props = {
  ideas: readonly GiftIdea[];
};

export default function GiftIdeasSection({ ideas }: Props) {
  if (!ideas.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ideas.map((idea) => (
          <Link
            key={idea.title}
            href={idea.href || "#"}
            className="group block bg-texture-linen rounded-xl border border-oat p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="font-display font-bold text-charcoal mb-2">{idea.title}</h3>
            <p className="text-warm-brown text-sm mb-3">{idea.description}</p>
            <p className="text-sm font-medium text-charcoal">{idea.product}</p>
            <p className="text-fern font-bold">{idea.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
