/**
 * Generic JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with the given data.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
