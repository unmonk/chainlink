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
import { ClockIcon, Users2Icon } from "lucide-react";

export function QuizList({
  limit = 15,
  isAdmin = false,
  showDrafts = false,
}: {
  limit?: number;
  isAdmin?: boolean;
  showDrafts?: boolean;
}) {
  const quizzes = useQuery(api.quiz.listQuizzes);

  if (!quizzes) {
    return <QuizListSkeleton />;
  }

  // sort by status
  const sortedQuizzes = quizzes.sort((a, b) => {
    if (a.status === "DRAFT") return -1;
    if (b.status === "DRAFT") return 1;
    return 0;
  });

  const filteredQuizzes = sortedQuizzes.filter((quiz) => {
    if (showDrafts) return true;
    return quiz.status !== "DRAFT" && quiz.status !== "CLOSED";
  });

  return (
    <div className="space-y-4 gap-2 flex flex-col">
      {filteredQuizzes.map((quiz) => (
        <Link
          key={quiz._id}
          href={isAdmin ? `/admin/quiz/${quiz._id}` : `/challenge/${quiz._id}`}
        >
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
                  <Badge variant="outline" className="bg-violet-600">
                    Completed
                  </Badge>
                )}
              </div>
              <CardDescription>
                {quiz.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>{}</CardContent>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
                <div className="flex items-center ">
                  <ClockIcon className="h-4 w-4 mr-1.5" />
                  <span>
                    {formatDistanceToNow(quiz.expiresAt, { addSuffix: true })}
                  </span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center">
                  <Users2Icon className="h-4 w-4 mr-1.5" />
                  <span>{quiz.totalParticipants} votes</span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center">
                  <span className="mr-1.5">🔗</span>
                  <span>{quiz.totalWagers} wagered</span>
                </div>
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
