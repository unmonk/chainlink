"use client";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Loading from "@/components/ui/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ContentLayout } from "@/components/nav/content-layout";

interface QuizPageProps {
  params: {
    id: Id<"globalQuiz">;
  };
}

export default function ChallengePage({ params }: QuizPageProps) {
  const quiz = useQuery(api.quiz.getQuizById, { quizId: params.id });

  if (!quiz) return null;

  return (
    <ContentLayout title={quiz.quiz.title}>
      <Suspense fallback={<Loading />}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{quiz.quiz.title}</span>
              <Badge
                variant={
                  quiz.quiz.status === "ACTIVE" ? "default" : "secondary"
                }
              >
                {quiz.quiz.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{quiz.quiz.description}</p>
            <div className="flex flex-col gap-4">
              {quiz.quiz.status === "COMPLETE" && quiz.quiz.correctAnswerId && (
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Winning Option</h3>
                  <p>
                    {
                      quiz.quiz.options.find(
                        (opt) => opt.id === quiz.quiz.correctAnswerId
                      )?.text
                    }
                  </p>
                </div>
              )}
              <div className="grid gap-2">
                <h3 className="font-semibold">Results</h3>
                {quiz.percentageResults.map((result) => {
                  const option = quiz.quiz.options.find(
                    (opt) => opt.id === result.optionId
                  );
                  return (
                    <div
                      key={result.optionId}
                      className="flex items-center gap-2"
                    >
                      <div className="w-32 truncate flex items-center gap-1">
                        {option?.text}{" "}
                        {quiz.quiz.correctAnswerId === result.optionId && "✅"}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Wager Range
                </span>
                <Badge variant="outline">
                  {quiz.quiz.minWager} - {quiz.quiz.maxWager} coins
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  {quiz.quiz.status === "ACTIVE" ? "Expires" : "Closed"}
                </span>
                <Badge variant="outline">
                  {formatDistanceToNow(quiz.quiz.expiresAt, {
                    addSuffix: true,
                  })}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Total Responses
                </span>
                <Badge variant="outline">{quiz.responses.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<Loading />}>
        {!quiz.responses || quiz.responses.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No responses yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Wager</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quiz.responses
                    .sort((a, b) => b.wager - a.wager)
                    .map((response) => (
                      <TableRow key={response._id}>
                        <Link href={`/u/${response.user.name}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={response.user.image}
                                  alt={response.user.name}
                                />
                                <AvatarFallback>
                                  {response.user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{response.user.name}</span>
                            </div>
                          </TableCell>
                        </Link>
                        <TableCell>
                          {
                            quiz.quiz.options.find(
                              (opt) => opt.id === response.selectedOptionId
                            )?.text
                          }
                        </TableCell>
                        <TableCell>🔗{response.wager}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Suspense>
    </ContentLayout>
  );
}
