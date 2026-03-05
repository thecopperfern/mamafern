import reader from "@/lib/content";
import { commerceClient } from "@/lib/commerce";
import QuizFlow from "@/components/view/Quiz/QuizFlow";
import type { CommerceProduct } from "@/lib/commerce";

/**
 * QuizEmbed — Embeds a quiz inline on a campaign page
 *
 * Loads quiz data by slug from Keystatic and pre-fetches all products,
 * then renders the QuizFlow client component.
 */
export default async function QuizEmbed({ slug }: { slug: string }) {
  const quiz = await reader.collections.quizzes.read(slug).catch(() => null);
  if (!quiz || quiz.status === "draft") return null;

  // Pre-fetch all products from all outcomes
  const allHandles = new Set<string>();
  (quiz.outcomes || []).forEach((outcome) => {
    (outcome.productHandles || []).forEach((handle) => allHandles.add(handle));
  });

  const productMap: Record<string, CommerceProduct> = {};
  await Promise.all(
    Array.from(allHandles).map(async (handle) => {
      try {
        const product = await commerceClient.getProductByHandle(handle);
        if (product) productMap[handle] = product;
      } catch {
        // Non-critical
      }
    })
  );

  const questions = (quiz.questions || []).map((q) => ({
    text: q.text || "",
    emoji: q.emoji || undefined,
    answers: (q.answers || []).map((a) => ({
      text: a.text || "",
      emoji: a.emoji || undefined,
      tag: a.tag || "",
    })),
  }));

  const outcomes = (quiz.outcomes || []).map((o) => ({
    tag: o.tag || "",
    title: o.title || "",
    description: o.description || "",
    emoji: o.emoji || undefined,
    productHandles: (o.productHandles || []) as string[],
  }));

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <QuizFlow
        quizName={quiz.title || slug}
        questions={questions}
        outcomes={outcomes}
        emailCaptureEnabled={quiz.emailCaptureEnabled ?? true}
        emailHeading={quiz.emailHeading || "Enter your email to see your results"}
        emailSubtext={quiz.emailSubtext || undefined}
        brevoListId={quiz.brevoListId || undefined}
        discountCode={quiz.discountCode || undefined}
        productMap={productMap}
      />
    </section>
  );
}
