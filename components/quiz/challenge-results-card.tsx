"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import useStoreUserEffect from "@/hooks/use-store-user";
import { QuizResults } from "@/convex/quiz";

export default function ChallengeResultsCard({ quiz }: { quiz: QuizResults }) {
  const userId = useStoreUserEffect();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{quiz.quiz.title}</span>
          {quiz.quiz.status === "DRAFT" && (
            <Badge variant="secondary">Draft</Badge>
          )}
          {quiz.quiz.status === "ACTIVE" && (
            <Badge variant="outline" className="bg-sky-700">
              Active
            </Badge>
          )}
          {quiz.quiz.status === "CLOSED" && (
            <Badge variant="destructive">Closed</Badge>
          )}
          {quiz.quiz.status === "COMPLETE" ? (
            quiz.responses.find((r) => r.user._id === userId)
              ?.selectedOptionId === quiz.quiz.correctAnswerId ||
            quiz.quiz.correctAnswerId === "TIE" ? (
              <Badge variant="outline" className="bg-green-700">
                WIN
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-600">
                LOSS
              </Badge>
            )
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{quiz.quiz.description}</p>
        <div className="flex flex-col gap-4">
          {quiz.quiz.status === "COMPLETE" && quiz.quiz.correctAnswerId && (
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Winning Option</h3>
              <p>
                {quiz.quiz.correctAnswerId === "TIE"
                  ? "Tie"
                  : quiz.quiz.options.find(
                      (opt) => opt.id === quiz.quiz.correctAnswerId
                    )?.text}
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
                <div key={result.optionId} className="flex items-center gap-2">
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
              {quiz.quiz.minWager} - {quiz.quiz.maxWager} 🔗 Links
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
  );
}
