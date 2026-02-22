"use server";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hello@mamafern.com";
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "hello@mamafern.com";

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  try {
    if (BREVO_API_KEY) {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "Mama Fern Website", email: BREVO_SENDER_EMAIL },
          to: [{ email: CONTACT_TO_EMAIL }],
          replyTo: { email },
          subject: `Contact Form: ${name}`,
          textContent: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });
      if (!res.ok) {
        const errorBody = await res.text();
        console.error("[Brevo SMTP Error]", res.status, errorBody);
        return { error: "Something went wrong. Please try again." };
      }
    } else {
      // Fallback: log when no API key is configured
      console.log("[Contact Form]", { name, email, message });
    }
    return { success: true };
  } catch (err) {
    console.error("[Contact Form Error]", err);
    return { error: "Something went wrong. Please try again." };
  }
}
