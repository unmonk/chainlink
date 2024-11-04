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

export default function DashboardQuiz() {
  const quizData = useQuery(api.quiz.getActiveQuiz);
  const user = useQuery(api.users.currentUser);

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
      <CardContent>
        {quizData === null && (
          <div className="text-center text-sm text-muted-foreground">
            No active challenge. Come back later!
          </div>
        )}
        {quizData && (
          <>
            <div className="text-lg text-balance font-semibold">
              {quizData.quiz.title}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground gap-2">
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
            <Link href={"/challenge"}>
              <Button
                className="mt-4 w-full "
                disabled={!!userHasResponded}
                variant={userHasResponded ? "secondary" : "default"}
              >
                {!userHasResponded && "Wager Now"}{" "}
                {userHasResponded && "Already Voted"}
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
