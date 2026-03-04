import { fields, singleton } from "@keystatic/core";

export const popupSettingsSchema = singleton({
  label: "Email Popup",
  path: "content/pages/popup-settings",
  format: { data: "yaml" },
  schema: {
    enabled: fields.checkbox({ label: "Enabled", defaultValue: true }),
    heading: fields.text({
      label: "Heading",
      defaultValue: "Welcome to Mama Fern",
    }),
    offerText: fields.text({
      label: "Offer Text",
      defaultValue: "Join our community and get 10% off your first order",
    }),
    buttonText: fields.text({
      label: "Button Text",
      defaultValue: "Get 10% Off",
    }),
    disclaimer: fields.text({
      label: "Disclaimer",
      multiline: true,
      defaultValue:
        "By subscribing, you agree to receive marketing emails. Unsubscribe anytime.",
    }),
    exitIntentHeading: fields.text({
      label: "Exit Intent Heading",
      defaultValue: "Your 10% off is about to leaf!",
    }),
    exitIntentBody: fields.text({
      label: "Exit Intent Body",
      multiline: true,
      defaultValue:
        "This offer is only for new friends of the fern family. Sure you want to go?",
    }),
    exitIntentStayButton: fields.text({
      label: "Exit Intent Stay Button",
      defaultValue: "Keep My 10% Off",
    }),
    exitIntentLeaveText: fields.text({
      label: "Exit Intent Leave Text",
      defaultValue: "No thanks, I'll pay full price",
    }),
    delayMs: fields.integer({
      label: "Show Delay (ms)",
      defaultValue: 8000,
      description: "How long to wait before showing the popup (in milliseconds)",
    }),
    cookieExpiryDays: fields.integer({
      label: "Cookie Expiry (days)",
      defaultValue: 30,
      description: "How many days before showing the popup again after dismissal",
    }),
  },
});
