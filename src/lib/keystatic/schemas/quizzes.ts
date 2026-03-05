import { fields, collection } from "@keystatic/core";

/**
 * Quiz Funnel Schema
 *
 * Supports two quiz types:
 * - "style": Style personality quizzes ("What's your family style?")
 * - "finder": Product finder quizzes ("Help me find the right outfit")
 *
 * Each quiz has a series of questions with tagged answers. Based on
 * the user's answers, we tally tags and match to an outcome that
 * includes a personality result, product recommendations, and an
 * optional discount code.
 *
 * Flow: Questions -> Email Gate -> Results + Product Recommendations
 */
export const quizzesSchema = collection({
  label: "Quizzes",
  slugField: "title",
  path: "content/quizzes/*",
  format: { data: "yaml" },
  schema: {
    title: fields.slug({ name: { label: "Quiz Title" } }),
    type: fields.select({
      label: "Quiz Type",
      options: [
        { label: "Style Personality", value: "style" },
        { label: "Product Finder", value: "finder" },
      ],
      defaultValue: "style",
    }),
    description: fields.text({
      label: "Description",
      multiline: true,
      description: "Shown on the quiz landing page before starting.",
    }),
    status: fields.select({
      label: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
    }),

    // Questions
    questions: fields.array(
      fields.object({
        text: fields.text({ label: "Question Text" }),
        emoji: fields.text({ label: "Emoji (optional)" }),
        answers: fields.array(
          fields.object({
            text: fields.text({ label: "Answer Text" }),
            emoji: fields.text({ label: "Emoji (optional)" }),
            tag: fields.text({
              label: "Outcome Tag",
              description: "Maps this answer to an outcome (e.g. 'earthy', 'minimal', 'bold')",
            }),
          }),
          {
            label: "Answers",
            itemLabel: (props) => props.fields.text.value || "Answer",
          }
        ),
      }),
      {
        label: "Questions",
        itemLabel: (props) => props.fields.text.value || "Question",
      }
    ),

    // Outcomes
    outcomes: fields.array(
      fields.object({
        tag: fields.text({
          label: "Outcome Tag",
          description: "The tag that maps to this outcome (must match answer tags)",
        }),
        title: fields.text({ label: "Result Title" }),
        description: fields.text({ label: "Result Description", multiline: true }),
        emoji: fields.text({ label: "Emoji (optional)" }),
        productHandles: fields.array(
          fields.text({ label: "Product Handle" }),
          {
            label: "Recommended Products",
            itemLabel: (props) => props.value,
            description: "Shopify product handles to recommend for this outcome",
          }
        ),
      }),
      {
        label: "Outcomes",
        itemLabel: (props) => `${props.fields.tag.value}: ${props.fields.title.value}`,
      }
    ),

    // Email capture settings
    emailCaptureEnabled: fields.checkbox({
      label: "Require Email Before Results",
      defaultValue: true,
    }),
    emailHeading: fields.text({
      label: "Email Gate Heading",
      defaultValue: "Almost there! Enter your email to see your results.",
    }),
    emailSubtext: fields.text({
      label: "Email Gate Subtext",
      defaultValue: "Plus get 10% off your first order.",
    }),
    brevoListId: fields.text({
      label: "Brevo List ID (optional)",
      description: "Specific Brevo list to add quiz contacts to.",
    }),

    // Discount code reference
    discountCode: fields.text({
      label: "Discount Code (shown on results page)",
      description: "An existing Shopify discount code to display with results.",
    }),

    // SEO
    seoTitle: fields.text({ label: "SEO Title" }),
    seoDescription: fields.text({ label: "SEO Description", multiline: true }),
  },
});
