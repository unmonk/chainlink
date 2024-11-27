"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { useQuery } from "convex/react";
import { Badge } from "../ui/badge";

export default function UserQuizRecord({ userId }: { userId: Id<"users"> }) {
  const userResponses = useQuery(api.quiz.getUserQuizRecord, {
    userId,
  });

  if (!userResponses) return null;

  const wins = userResponses.filter((response) => response.win).length;
  const losses = userResponses.filter(
    (response) => response.win === false
  ).length;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground">My Record</h3>
      <div className="flex items-center gap-4">
        <Badge
          variant="outline"
          className="bg-green-700/20 text-muted-foreground text-xs"
        >
          Wins: {wins}
        </Badge>
        <Badge
          variant="destructive"
          className="bg-red-700/20 text-muted-foreground text-xs"
        >
          Losses: {losses}
        </Badge>
      </div>
    </div>
  );
}
