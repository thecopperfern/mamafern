interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const FernSvg = () => (
  <svg
    width="160"
    height="220"
    viewBox="0 0 160 220"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M80 210 C80 170 78 130 80 20"
      stroke="#4A6741"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M80 175 C63 162 40 166 28 155"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 152 C60 137 36 141 22 129"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 129 C58 113 34 117 18 105"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 106 C60 90 38 93 24 80"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 83 C63 68 44 71 32 57"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 175 C97 162 120 166 132 155"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 152 C100 137 124 141 138 129"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 129 C102 113 126 117 142 105"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 106 C100 90 122 93 136 80"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 83 C97 68 116 71 128 57"
      stroke="#4A6741"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
  return (
    <section className="relative bg-texture-linen border-b border-oat py-16 md:py-20 overflow-hidden">
      {/* Warm gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-cream/30 to-blush/10 pointer-events-none" />

      {/* Right botanical decoration */}
      <div
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none hidden md:block"
        aria-hidden
      >
        <FernSvg />
      </div>

      {/* Left botanical decoration (mirrored) */}
      <div
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none hidden md:block scale-x-[-1]"
        aria-hidden
      >
        <FernSvg />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {eyebrow && (
          <p className="text-xs font-medium text-fern uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-warm-brown/70 text-lg max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Decorative diamond rule */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-sage/50" />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="text-sage shrink-0"
          >
            <path
              d="M5 0 C5 3.5 3.5 5 0 5 C3.5 5 5 6.5 5 10 C5 6.5 6.5 5 10 5 C6.5 5 5 3.5 5 0Z"
              fill="currentColor"
            />
          </svg>
          <div className="h-px w-16 bg-sage/50" />
        </div>
      </div>
    </section>
  );
}
