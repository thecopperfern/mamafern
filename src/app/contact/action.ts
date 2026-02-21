"use server";

import { Resend } from "resend";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hello@mamafern.com";

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
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: "Mama Fern Contact <onboarding@resend.dev>",
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `Contact Form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });
    } else {
      // Fallback: log to console when no API key is configured
      console.log("[Contact Form]", { name, email, message });
    }
    return { success: true };
  } catch (err) {
    console.error("[Contact Form Error]", err);
    return { error: "Something went wrong. Please try again." };
  }
}
