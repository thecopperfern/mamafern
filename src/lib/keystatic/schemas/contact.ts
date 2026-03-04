import { fields, singleton } from "@keystatic/core";

export const contactPageSchema = singleton({
  label: "Contact Page",
  path: "content/pages/contact",
  format: { data: "yaml" },
  schema: {
    heroEyebrow: fields.text({ label: "Hero Eyebrow", defaultValue: "Say Hello" }),
    heroTitle: fields.text({ label: "Hero Title", defaultValue: "Get in Touch" }),
    heroSubtitle: fields.text({
      label: "Hero Subtitle",
      defaultValue: "Have a question or feedback? We'd love to hear from you.",
    }),
    contactInfoHeading: fields.text({
      label: "Contact Info Heading",
      defaultValue: "How we can help",
    }),
    contactInfoItems: fields.array(
      fields.object({
        emoji: fields.text({ label: "Emoji" }),
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description", multiline: true }),
      }),
      {
        label: "Contact Info Items",
        itemLabel: (props) => props.fields.title.value,
      }
    ),
    responseTimeLabel: fields.text({
      label: "Response Time Label",
      defaultValue: "Response Time",
    }),
    responseTimeText: fields.text({
      label: "Response Time Text",
      defaultValue: "We typically respond within 1–2 business days.",
    }),
    seoTitle: fields.text({ label: "SEO Title", defaultValue: "Contact Us" }),
    seoDescription: fields.text({ label: "SEO Description", multiline: true }),
  },
});
