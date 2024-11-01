"use client";
import { notFound } from "next/navigation";
import { QuizStatusToggle } from "@/components/quiz/quiz-status-toggle";
// import { QuizDeleteButton } from "@/components/quiz/quiz-delete-button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import quiz from "@/components/quiz/quiz";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { ContentLayout } from "@/components/nav/content-layout";
import { QuizResults } from "@/components/quiz/quiz-results";

interface QuizEditPageProps {
  params: {
    id: Id<"globalQuiz">;
  };
}

export default function QuizEditPage({ params }: QuizEditPageProps) {
  const quiz = useQuery(api.quiz.getQuizById, { quizId: params.id });
  if (!quiz) return null;

  return (
    <ContentLayout title="Edit Quiz">
      <Suspense fallback={<Loading />}>
        <div className="container max-w-3xl py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Quiz</h1>
            {/* <QuizDeleteButton quizId={params.id} /> */}
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <Card className="">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    {quiz.quiz.title}
                  </CardTitle>
                  {quiz.quiz.status === "DRAFT" && (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                  {quiz.quiz.status === "ACTIVE" && (
                    <Badge variant="default">Active</Badge>
                  )}
                  {quiz.quiz.status === "CLOSED" && (
                    <Badge variant="destructive">Closed</Badge>
                  )}
                  {quiz.quiz.status === "COMPLETE" && (
                    <Badge variant="outline">Completed</Badge>
                  )}
                </div>
                <CardDescription>
                  {quiz.quiz.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Closes{" "}
                    {formatDistanceToNow(quiz.quiz.expiresAt, {
                      addSuffix: true,
                    })}
                  </p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p className="text-sm text-muted-foreground">
                    {quiz.totalParticipants} votes
                  </p>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <p className="text-sm text-muted-foreground">
                    🔗 {quiz.totalWagers} wagered
                  </p>
                </div>
              </CardContent>
            </Card>
            <QuizStatusToggle quiz={quiz.quiz} />
            <QuizResults quiz={quiz.quiz} />
          </div>
        </div>
      </Suspense>
    </ContentLayout>
  );
}
