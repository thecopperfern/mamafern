import { fields, collection } from "@keystatic/core";

export const styleGuidesSchema = collection({
  label: "Style Guides",
  slugField: "title",
  path: "content/style-guides/*",
  format: { contentField: "content" },
  schema: {
    title: fields.slug({ name: { label: "Guide Title" } }),
    description: fields.text({ label: "Short Description", multiline: true }),
    emoji: fields.text({ label: "Emoji Icon", defaultValue: "🌿" }),
    featuredImage: fields.image({
      label: "Featured Image",
      directory: "public/images/style-guides",
      publicPath: "/images/style-guides",
    }),
    content: fields.mdx({ label: "Content" }),
    seoTitle: fields.text({ label: "SEO Title" }),
    seoDescription: fields.text({ label: "SEO Description", multiline: true }),
    seoKeywords: fields.array(fields.text({ label: "Keyword" }), {
      label: "SEO Keywords",
      itemLabel: (props) => props.value,
    }),
  },
});
