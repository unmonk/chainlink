"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HelpCircle, Clock, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function DashboardQuiz() {
  const quizData = useQuery(api.quiz.getActiveQuiz);
  const user = useQuery(api.users.currentUser);

  if (!user) return null;

  const userHasResponded = quizData?.participants.find(
    (participant) => participant.userId === user?._id
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Challenge Question</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Answer the global challenge question to earn 🔗Links!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="h-full">
        {quizData === null && (
          <div className="text-center text-sm text-muted-foreground">
            No active challenge. Come back later!
          </div>
        )}
        {quizData && (
          <div className="flex flex-col h-full gap-2 pb-4">
            <div className="text-lg text-balance font-semibold">
              {quizData.quiz.title}
            </div>
            <div className="text-muted-foreground text-sm">
              {quizData.quiz.description}
            </div>

            {/* Preview Options in 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 my-2">
              {quizData.quiz.options.slice(0, 4).map((option, index) => {
                const isSelected =
                  userHasResponded?.selectedOptionId === option.id;
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-1.5 text-xs border rounded-md bg-muted/50",
                      "hover:bg-muted/80 transition-colors cursor-default truncate"
                    )}
                  >
                    {option.text}
                    {isSelected && (
                      <span className="ml-2 text-green-500">✔️</span>
                    )}
                  </div>
                );
              })}
            </div>
            {quizData.quiz.options.length > 4 && (
              <p className="text-xs text-muted-foreground text-center -mt-1">
                +{quizData.quiz.options.length - 4} more options
              </p>
            )}

            <div className="flex flex-col gap-2 mt-6">
              {/* Stats and timer section */}
              <div className="flex items-center justify-between text-sm text-muted-foreground gap-2">
                <div className="flex items-center text-balance">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatDistanceToNow(quizData.quiz.expiresAt)} remaining
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-balance">
                  <Users2Icon className="mr-1 h-4 w-4" />
                  {quizData.totalParticipants} participants
                </div>
              </div>

              <div className="flex flex-row gap-2  items-center w-full justify-between">
                <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-2 rounded-md ">
                  <span className="text-balance text-xs">Wager Range: </span>
                  <span className="font-sm text-cyan-500 text-nowrap">
                    🔗 {quizData.quiz.minWager} - {quizData.quiz.maxWager}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground bg-green-500/10 p-2 rounded-md ">
                  <span className="text-balance text-xs">Potential Win: </span>
                  <span className="font-sm text-green-500 text-nowrap">
                    Up to 🔗 {quizData.quiz.maxWager * 10}
                  </span>
                </div>
              </div>

              <Link href={"/challenge"}>
                <Button
                  className="w-full"
                  disabled={!!userHasResponded}
                  variant={userHasResponded ? "secondary" : "default"}
                >
                  {!userHasResponded && "Wager Now"}{" "}
                  {userHasResponded && "Already Voted"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
