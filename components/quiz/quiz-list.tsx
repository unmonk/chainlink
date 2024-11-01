"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Separator } from "../ui/separator";

export function QuizList() {
  const quizzes = useQuery(api.quiz.listQuizzes);

  if (!quizzes) {
    return <QuizListSkeleton />;
  }

  // Separate drafts and published quizzes
  const drafts = quizzes.filter((quiz) => quiz.status === "DRAFT");
  const published = quizzes.filter(
    (quiz) => quiz.status === "ACTIVE" || quiz.status === "CLOSED"
  );

  // Combine with drafts first
  const sortedQuizzes = [...drafts, ...published];

  return (
    <div className="space-y-4 gap-2 flex flex-col">
      {sortedQuizzes.map((quiz) => (
        <Link key={quiz._id} href={`/admin/quiz/${quiz._id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  {quiz.title}
                </CardTitle>
                {quiz.status === "DRAFT" && (
                  <Badge variant="secondary">Draft</Badge>
                )}
                {quiz.status === "ACTIVE" && (
                  <Badge variant="default">Active</Badge>
                )}
                {quiz.status === "CLOSED" && (
                  <Badge variant="destructive">Closed</Badge>
                )}
                {quiz.status === "COMPLETE" && (
                  <Badge variant="outline">Completed</Badge>
                )}
              </div>
              <CardDescription>
                {quiz.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Closes{" "}
                  {formatDistanceToNow(quiz.expiresAt, { addSuffix: true })}
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
        </Link>
      ))}
    </div>
  );
}

function QuizListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
