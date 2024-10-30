"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface QuizStatusToggleProps {
  quiz: Doc<"globalQuiz">;
}

export function QuizStatusToggle({ quiz }: QuizStatusToggleProps) {
  const updateStatus = useMutation(api.quiz.updateQuizStatus);
  const [isPending, setIsPending] = useState(false);

  if (!quiz) return null;

  const handleStatusChange = async (
    newStatus: "DRAFT" | "ACTIVE" | "CLOSED"
  ) => {
    try {
      setIsPending(true);
      await updateStatus({
        quizId: quiz._id,
        status: newStatus,
      });
      toast.success(`Quiz status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update quiz status");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Status</CardTitle>
        <CardDescription>
          Control whether this quiz is in draft, active, or closed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          disabled={isPending || quiz.status === "COMPLETE"}
          value={quiz.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
