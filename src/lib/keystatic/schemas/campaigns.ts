import { fields, collection } from "@keystatic/core";

/**
 * Campaign Page Builder
 *
 * Uses fields.blocks() for a section-builder approach — each campaign
 * is a sequence of typed sections (gift bundles, ideas, info grids, CTAs,
 * rich text) that render as corresponding React components.
 */
export const campaignsSchema = collection({
  label: "Campaigns",
  slugField: "title",
  path: "content/campaigns/*",
  format: { contentField: "richContent" },
  schema: {
    title: fields.slug({ name: { label: "Campaign Name" } }),
    status: fields.select({
      label: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
    }),
    startDate: fields.datetime({ label: "Start Date (optional)" }),
    endDate: fields.datetime({ label: "End Date (optional)" }),

    // Hero
    heroEyebrow: fields.text({ label: "Hero Eyebrow" }),
    heroTitle: fields.text({ label: "Hero Title" }),
    heroSubtitle: fields.text({ label: "Hero Subtitle", multiline: true }),

    // Structured sections
    giftBundles: fields.array(
      fields.object({
        name: fields.text({ label: "Bundle Name" }),
        price: fields.text({ label: "Price (e.g. $89)" }),
        savings: fields.text({ label: "Savings (e.g. Save $20)" }),
        description: fields.text({ label: "Description", multiline: true }),
        items: fields.array(fields.text({ label: "Item" }), {
          label: "Bundle Items",
          itemLabel: (props) => props.value,
        }),
        href: fields.text({ label: "Link URL" }),
        icon: fields.text({ label: "Icon Emoji" }),
      }),
      {
        label: "Gift Bundles",
        itemLabel: (props) => props.fields.name.value,
      }
    ),

    giftIdeas: fields.array(
      fields.object({
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description", multiline: true }),
        product: fields.text({ label: "Product Name" }),
        price: fields.text({ label: "Price" }),
        href: fields.text({ label: "Link URL" }),
      }),
      {
        label: "Gift Ideas",
        itemLabel: (props) => props.fields.title.value,
      }
    ),

    infoBlocks: fields.array(
      fields.object({
        emoji: fields.text({ label: "Emoji" }),
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description", multiline: true }),
      }),
      {
        label: "Info Blocks (e.g. Shipping & Gift Wrapping)",
        itemLabel: (props) => props.fields.title.value,
      }
    ),

    // CTA
    ctaHeading: fields.text({ label: "CTA Heading" }),
    ctaBody: fields.text({ label: "CTA Body", multiline: true }),
    ctaPrimaryText: fields.text({ label: "CTA Primary Button Text" }),
    ctaPrimaryHref: fields.text({ label: "CTA Primary Button Link" }),
    ctaSecondaryText: fields.text({ label: "CTA Secondary Button Text" }),
    ctaSecondaryHref: fields.text({ label: "CTA Secondary Button Link" }),

    // Rich content (MDX body for any additional freeform content)
    richContent: fields.mdx({ label: "Additional Content (optional)" }),

    // SEO
    seoTitle: fields.text({ label: "SEO Title" }),
    seoDescription: fields.text({ label: "SEO Description", multiline: true }),
    seoKeywords: fields.array(fields.text({ label: "Keyword" }), {
      label: "SEO Keywords",
      itemLabel: (props) => props.value,
    }),
  },
});
