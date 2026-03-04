import Link from "next/link";

type Bundle = {
  name: string;
  price: string;
  savings: string;
  description: string;
  items: readonly string[];
  href: string;
  icon: string;
};

type Props = {
  bundles: readonly Bundle[];
};

export default function GiftBundlesSection({ bundles }: Props) {
  if (!bundles.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle) => (
          <Link
            key={bundle.name}
            href={bundle.href || "#"}
            className="group block bg-texture-linen rounded-2xl border border-oat p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-2xl mr-2">{bundle.icon}</span>
                <h3 className="inline font-display font-bold text-lg text-charcoal">
                  {bundle.name}
                </h3>
              </div>
              {bundle.savings && (
                <span className="text-xs font-medium bg-fern/10 text-fern px-2 py-1 rounded-full">
                  {bundle.savings}
                </span>
              )}
            </div>
            <p className="text-warm-brown text-sm mb-3">{bundle.description}</p>
            <ul className="space-y-1 mb-4">
              {bundle.items.map((item) => (
                <li key={item} className="text-sm text-charcoal/80 flex items-center gap-2">
                  <span className="text-fern">•</span> {item}
                </li>
              ))}
            </ul>
            <p className="font-display font-bold text-xl text-charcoal">
              {bundle.price}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
