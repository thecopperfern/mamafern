import { fields, singleton } from "@keystatic/core";

export const mediaGuidelinesSchema = singleton({
  label: "Media Guidelines",
  path: "content/pages/media-guidelines",
  format: { data: "yaml" },
  schema: {
    imageSizes: fields.array(
      fields.object({
        context: fields.text({ label: "Context (e.g. Blog featured image)" }),
        width: fields.integer({ label: "Width (px)" }),
        height: fields.integer({ label: "Height (px)" }),
        notes: fields.text({ label: "Notes", multiline: true }),
      }),
      {
        label: "Recommended Image Sizes",
        itemLabel: (props) => props.fields.context.value,
      }
    ),
    namingConvention: fields.text({
      label: "Naming Convention",
      multiline: true,
      defaultValue:
        "Use lowercase, hyphens instead of spaces. Example: spring-2026-hero.jpg",
    }),
    directories: fields.array(
      fields.object({
        path: fields.text({ label: "Directory Path" }),
        purpose: fields.text({ label: "Purpose" }),
      }),
      {
        label: "Image Directories",
        itemLabel: (props) => props.fields.path.value,
      }
    ),
  },
});
