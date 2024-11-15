"use client";
import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { ContentLayout } from "@/components/nav/content-layout";
import ChallengeResultsCard from "@/components/quiz/challenge-results-card";
import ChallengeResponsesList from "@/components/quiz/challenge-responses-list";

export default function ChallengePage({
  params,
}: {
  params: { id: Id<"globalQuiz"> };
}) {
  const quiz = useQuery(api.quiz.getQuizById, { quizId: params.id });

  if (!quiz) return null;

  return (
    <ContentLayout title={quiz.quiz.title}>
      <div className="flex flex-col gap-4">
        <ChallengeResultsCard quiz={quiz} />
        <ChallengeResponsesList quiz={quiz} />
      </div>
    </ContentLayout>
  );
}
