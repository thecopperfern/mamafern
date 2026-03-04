import { fields, singleton } from "@keystatic/core";

export const footerSchema = singleton({
  label: "Footer",
  path: "content/pages/footer",
  format: { data: "yaml" },
  schema: {
    brandDescription: fields.text({
      label: "Brand Description",
      multiline: true,
      defaultValue:
        "Grounded family apparel for crunchy, cozy homes. Cute patterns and sayings in skin-friendly fabrics.",
    }),
    shopLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
      }),
      {
        label: "Shop Links",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    infoLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
      }),
      {
        label: "Info Links",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    legalLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
      }),
      {
        label: "Legal Links",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    newsletterHeading: fields.text({
      label: "Newsletter Heading",
      defaultValue: "Stay in the Loop",
    }),
    newsletterSubtitle: fields.text({
      label: "Newsletter Subtitle",
      defaultValue:
        "Get deals, new arrivals, and family inspo straight to your inbox.",
    }),
  },
});
