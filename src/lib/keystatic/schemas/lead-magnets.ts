import { fields, collection } from "@keystatic/core";

/**
 * Lead Magnets Collection
 *
 * Gated PDF downloads (sizing guides, fabric care, capsule wardrobe planners)
 * that drive email capture. Referenced from blog posts via leadMagnetSlug field.
 *
 * Flow: User sees CTA in blog post -> enters email -> added to Brevo ->
 *       download link revealed.
 */
export const leadMagnetsSchema = collection({
  label: "Lead Magnets",
  slugField: "title",
  path: "content/lead-magnets/*",
  format: { data: "yaml" },
  schema: {
    title: fields.slug({ name: { label: "Title" } }),
    description: fields.text({
      label: "Description",
      multiline: true,
      description: "Shown in the CTA card to explain what the download contains.",
    }),
    fileUrl: fields.text({
      label: "File Path",
      description: "Path to the PDF in /public/downloads/ (e.g. /downloads/sizing-guide.pdf)",
    }),
    ctaText: fields.text({
      label: "CTA Button Text",
      defaultValue: "Download Free Guide",
    }),
    brevoListId: fields.text({
      label: "Brevo List ID (optional)",
      description: "Specific Brevo list to add leads to.",
    }),
    thumbnail: fields.image({
      label: "Thumbnail Image",
      directory: "public/images/lead-magnets",
      publicPath: "/images/lead-magnets",
    }),
  },
});
