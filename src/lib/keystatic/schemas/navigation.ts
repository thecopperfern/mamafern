import { fields, singleton } from "@keystatic/core";

export const navigationSchema = singleton({
  label: "Navigation",
  path: "content/pages/navigation",
  format: { data: "yaml" },
  schema: {
    mainLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
      }),
      {
        label: "Main Navigation Links",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    infoLinks: fields.array(
      fields.object({
        label: fields.text({ label: "Label" }),
        href: fields.text({ label: "URL" }),
      }),
      {
        label: "Info Bar Links",
        itemLabel: (props) => props.fields.label.value,
      }
    ),
  },
});
