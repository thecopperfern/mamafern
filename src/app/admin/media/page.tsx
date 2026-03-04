import reader from "@/lib/content";

export const dynamic = "force-dynamic";

const FALLBACK_SIZES = [
  { context: "Blog featured image", width: 1200, height: 630, notes: "16:9 ratio, used in OG tags" },
  { context: "Style guide hero", width: 1200, height: 800, notes: "3:2 ratio" },
  { context: "Campaign hero", width: 1200, height: 600, notes: "2:1 ratio, wide banner" },
  { context: "Product lifestyle", width: 800, height: 800, notes: "1:1 square" },
];

const FALLBACK_DIRS = [
  { path: "public/images/blog", purpose: "Blog post featured images" },
  { path: "public/images/style-guides", purpose: "Style guide images" },
  { path: "public/images/lookbook", purpose: "Shop the Look hero images" },
];

export default async function MediaPage() {
  let imageSizes = FALLBACK_SIZES;
  let directories = FALLBACK_DIRS;
  let namingConvention = "Use lowercase, hyphens instead of spaces. Example: spring-2026-hero.jpg";

  try {
    const data = await reader.singletons.mediaGuidelines.read();
    if (data) {
      if (data.imageSizes && data.imageSizes.length > 0) {
        imageSizes = data.imageSizes as typeof FALLBACK_SIZES;
      }
      if (data.directories && data.directories.length > 0) {
        directories = data.directories as typeof FALLBACK_DIRS;
      }
      if (data.namingConvention) {
        namingConvention = data.namingConvention;
      }
    }
  } catch {
    // Use fallbacks
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-charcoal mb-2">
        Media Guidelines
      </h1>
      <p className="text-sm text-warm-brown mb-8">
        Reference guide for image sizes, naming conventions, and directory structure.
        Edit these in the CMS under Settings &rarr; Media Guidelines.
      </p>

      {/* Image Sizes */}
      <section className="mb-10">
        <h2 className="font-display font-bold text-lg text-charcoal mb-4">
          Recommended Image Sizes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-oat rounded-lg overflow-hidden">
            <thead className="bg-oat/30">
              <tr>
                <th className="text-left px-4 py-2 text-charcoal font-medium">Context</th>
                <th className="text-left px-4 py-2 text-charcoal font-medium">Width</th>
                <th className="text-left px-4 py-2 text-charcoal font-medium">Height</th>
                <th className="text-left px-4 py-2 text-charcoal font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {imageSizes.map((size) => (
                <tr key={size.context} className="border-t border-oat/50">
                  <td className="px-4 py-2 text-charcoal">{size.context}</td>
                  <td className="px-4 py-2 text-warm-brown">{size.width}px</td>
                  <td className="px-4 py-2 text-warm-brown">{size.height}px</td>
                  <td className="px-4 py-2 text-warm-brown">{size.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Naming Convention */}
      <section className="mb-10">
        <h2 className="font-display font-bold text-lg text-charcoal mb-4">
          Naming Convention
        </h2>
        <div className="bg-oat/20 rounded-lg border border-oat p-4">
          <p className="text-sm text-charcoal whitespace-pre-line">{namingConvention}</p>
        </div>
      </section>

      {/* Directories */}
      <section>
        <h2 className="font-display font-bold text-lg text-charcoal mb-4">
          Image Directories
        </h2>
        <div className="space-y-3">
          {directories.map((dir) => (
            <div key={dir.path} className="flex items-start gap-3 rounded-lg border border-oat p-4">
              <code className="text-xs font-mono bg-fern/10 text-fern px-2 py-1 rounded shrink-0">
                {dir.path}
              </code>
              <p className="text-sm text-warm-brown">{dir.purpose}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
