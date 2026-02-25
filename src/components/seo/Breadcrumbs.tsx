import { SITE_CONFIG } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: BreadcrumbItem[];
}

/**
 * SEO-optimized breadcrumbs with BreadcrumbList JSON-LD.
 * Renders semantic <nav><ol> structure + inline structured data.
 */
export default function SeosBreadcrumbs({ crumbs }: BreadcrumbsProps) {
  const items = [{ label: "Home", href: "/" }, ...crumbs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `${SITE_CONFIG.baseUrl}${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-warm-brown/50 mb-4">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-fern transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-charcoal font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
