import { notFound } from "next/navigation";
import reader from "@/lib/content";
import { commerceClient } from "@/lib/commerce";
import { buildMetadata } from "@/lib/seo";
import PageTransition from "@/components/PageTransition";
import QuizFlow from "@/components/view/Quiz/QuizFlow";
import type { CommerceProduct } from "@/lib/commerce";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const quiz = await reader.collections.quizzes.read(slug).catch(() => null);
  if (!quiz) return {};

  return buildMetadata({
    title: quiz.seoTitle || quiz.title || slug,
    description: quiz.seoDescription || quiz.description || "",
    path: `/quiz/${slug}`,
  });
}

/**
 * Quiz Page — Server component that loads quiz data and pre-fetches
 * all product recommendations, then passes everything to QuizFlow.
 *
 * Pre-fetching products server-side avoids waterfall requests when
 * the user reaches the results screen.
 */
export default async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const quiz = await reader.collections.quizzes.read(slug).catch(() => null);
  if (!quiz || quiz.status === "draft") notFound();

  // Collect all unique product handles from all outcomes
  const allHandles = new Set<string>();
  (quiz.outcomes || []).forEach((outcome) => {
    (outcome.productHandles || []).forEach((handle) => allHandles.add(handle));
  });

  // Pre-fetch all products in parallel
  const productMap: Record<string, CommerceProduct> = {};
  await Promise.all(
    Array.from(allHandles).map(async (handle) => {
      try {
        const product = await commerceClient.getProductByHandle(handle);
        if (product) {
          productMap[handle] = product;
        }
      } catch {
        console.warn(`Failed to fetch product for quiz: ${handle}`);
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
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Quiz intro header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-charcoal mb-2">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-charcoal/70 max-w-lg mx-auto">
              {quiz.description}
            </p>
          )}
        </div>

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
      </div>
    </PageTransition>
  );
}
