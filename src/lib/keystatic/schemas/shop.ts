import { fields, singleton } from "@keystatic/core";

export const shopPageSchema = singleton({
  label: "Shop Page",
  path: "content/pages/shop",
  format: { data: "yaml" },
  schema: {
    heroEyebrow: fields.text({ label: "Hero Eyebrow", defaultValue: "All Collections" }),
    heroTitle: fields.text({ label: "Hero Title", defaultValue: "Shop All" }),
    heroSubtitle: fields.text({
      label: "Hero Subtitle",
      defaultValue:
        "Family apparel in skin-friendly fabrics for every stage of growing together.",
    }),
    seoTitle: fields.text({ label: "SEO Title", defaultValue: "Shop" }),
    seoDescription: fields.text({ label: "SEO Description", multiline: true }),
    seoKeywords: fields.array(fields.text({ label: "Keyword" }), {
      label: "SEO Keywords",
      itemLabel: (props) => props.value,
    }),
  },
});
