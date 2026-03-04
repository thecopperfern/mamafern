import { fields, singleton } from "@keystatic/core";

/**
 * Homepage Sections — controls category cards and featured collection sections.
 * The hero is managed by the existing `homepageHero` singleton.
 */
export const homepageSectionsSchema = singleton({
  label: "Homepage Sections",
  path: "content/pages/homepage-sections",
  format: { data: "yaml" },
  schema: {
    categoryCardsHeading: fields.text({
      label: "Category Cards Heading",
      defaultValue: "Shop by Category",
    }),
    categories: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
        colorClass: fields.select({
          label: "Color Gradient",
          options: [
            { label: "Blush → Cream", value: "from-blush/40 to-cream" },
            { label: "Sage → Cream", value: "from-sage/40 to-cream" },
            { label: "Terracotta → Cream", value: "from-terracotta-light/30 to-cream" },
            { label: "Oat → Cream", value: "from-oat to-cream" },
            { label: "Fern → Cream", value: "from-fern/40 to-cream" },
            { label: "Brown → Cream", value: "from-warm-brown/30 to-cream" },
          ],
          defaultValue: "from-blush/40 to-cream",
        }),
      }),
      {
        label: "Category Cards",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    featuredSections: fields.array(
      fields.object({
        collectionHandle: fields.text({ label: "Shopify Collection Handle" }),
        title: fields.text({ label: "Section Title" }),
        subtitle: fields.text({ label: "Section Subtitle" }),
      }),
      {
        label: "Featured Collection Sections",
        itemLabel: (props) => props.fields.title.value,
      }
    ),
  },
});
