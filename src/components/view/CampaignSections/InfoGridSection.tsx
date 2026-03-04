type InfoBlock = {
  emoji: string;
  title: string;
  description: string;
};

type Props = {
  items: readonly InfoBlock[];
};

export default function InfoGridSection({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-texture-linen rounded-xl border border-oat p-6 text-center"
          >
            <span className="text-3xl mb-3 block">{item.emoji}</span>
            <h3 className="font-display font-bold text-charcoal mb-2">{item.title}</h3>
            <p className="text-warm-brown text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
