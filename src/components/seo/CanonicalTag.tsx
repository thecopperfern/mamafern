import { SITE_CONFIG } from "@/lib/seo";

interface CanonicalTagProps {
  path: string;
}

/**
 * Server component that renders a <link rel="canonical"> tag.
 * Use for pages where the canonical URL differs from the default.
 */
export default function CanonicalTag({ path }: CanonicalTagProps) {
  const url = `${SITE_CONFIG.baseUrl}${path}`;
  return <link rel="canonical" href={url} />;
}
