"use client";

import { useState, useCallback } from "react";
import QuizCard from "./QuizCard";
import QuizEmailGate from "./QuizEmailGate";
import QuizResults from "./QuizResults";
import type { CommerceProduct } from "@/lib/commerce";

type Question = {
  text: string;
  emoji?: string;
  answers: { text: string; emoji?: string; tag: string }[];
};

type Outcome = {
  tag: string;
  title: string;
  description: string;
  emoji?: string;
  productHandles: string[];
};

/**
 * QuizFlow — Main quiz stepper component
 *
 * Manages the full quiz flow:
 * 1. Step through questions one at a time
 * 2. Tally answer tags to determine winning outcome
 * 3. Show email gate (if enabled)
 * 4. Show results with product recommendations
 *
 * All product data is pre-fetched server-side and passed in as a map.
 */
export default function QuizFlow({
  quizName,
  questions,
  outcomes,
  emailCaptureEnabled,
  emailHeading,
  emailSubtext,
  brevoListId,
  discountCode,
  productMap,
}: {
  quizName: string;
  questions: Question[];
  outcomes: Outcome[];
  emailCaptureEnabled: boolean;
  emailHeading: string;
  emailSubtext?: string;
  brevoListId?: string;
  discountCode?: string;
  productMap: Record<string, CommerceProduct>;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalSteps = questions.length;
  const currentQuestion = questions[step];

  // Determine winning outcome by tallying tags
  const getWinningOutcome = useCallback(
    (selectedTags: string[]) => {
      const tagCounts = new Map<string, number>();
      selectedTags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });

      let maxTag = outcomes[0]?.tag || "";
      let maxCount = 0;
      tagCounts.forEach((count, tag) => {
        if (count > maxCount) {
          maxCount = count;
          maxTag = tag;
        }
      });

      return outcomes.find((o) => o.tag === maxTag) || outcomes[0];
    },
    [outcomes]
  );

  const handleAnswer = (tag: string) => {
    const newAnswers = [...answers, tag];
    setAnswers(newAnswers);

    if (step < totalSteps - 1) {
      // Next question
      setTimeout(() => setStep(step + 1), 300);
    } else {
      // Quiz complete
      if (emailCaptureEnabled) {
        setShowEmailGate(true);
      } else {
        setShowResults(true);
      }
    }
  };

  const winningOutcome = getWinningOutcome(answers);
  const outcomeProducts = winningOutcome.productHandles
    .map((handle) => productMap[handle])
    .filter(Boolean);

  // Email gate screen
  if (showEmailGate && !showResults) {
    return (
      <QuizEmailGate
        heading={emailHeading}
        subtext={emailSubtext}
        quizName={quizName}
        resultTag={winningOutcome.tag}
        resultTitle={winningOutcome.title}
        listId={brevoListId}
        onComplete={() => setShowResults(true)}
      />
    );
  }

  // Results screen
  if (showResults) {
    return (
      <QuizResults
        outcome={winningOutcome}
        products={outcomeProducts}
        discountCode={discountCode}
      />
    );
  }

  // Question stepper
  return (
    <div className="max-w-lg mx-auto py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-charcoal/50">
            Question {step + 1} of {totalSteps}
          </span>
          <span className="text-xs text-charcoal/50">
            {Math.round(((step + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-oat rounded-full overflow-hidden">
          <div
            className="h-full bg-fern rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        {currentQuestion.emoji && (
          <span className="text-3xl block mb-2" role="img" aria-hidden="true">
            {currentQuestion.emoji}
          </span>
        )}
        <h2 className="font-display font-bold text-xl text-charcoal">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-3">
        {currentQuestion.answers.map((answer, i) => (
          <QuizCard
            key={i}
            text={answer.text}
            emoji={answer.emoji}
            selected={false}
            onClick={() => handleAnswer(answer.tag)}
          />
        ))}
      </div>

      {/* Back button */}
      {step > 0 && (
        <button
          type="button"
          onClick={() => {
            setStep(step - 1);
            setAnswers(answers.slice(0, -1));
          }}
          className="mt-4 text-sm text-charcoal/50 hover:text-charcoal/70 underline"
        >
          Back
        </button>
      )}
    </div>
  );
}
