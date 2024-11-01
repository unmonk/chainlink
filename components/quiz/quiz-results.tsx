"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface QuizOptionsProps {
  quiz: Doc<"globalQuiz">;
  currentAnswer?: string;
}

export function QuizResults({ quiz, currentAnswer }: QuizOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    currentAnswer || ""
  );
  const [isPending, setIsPending] = useState(false);
  const updateQuiz = useMutation(api.quiz.updateQuiz);

  const handleSaveAnswer = async () => {
    if (!selectedOption) {
      toast.error("Please select an answer first");
      return;
    }

    try {
      setIsPending(true);
      await updateQuiz({
        quizId: quiz._id,
        correctAnswerId: selectedOption,
        status: "COMPLETE",
      });
      toast.success("Correct answer saved successfully");
    } catch (error) {
      toast.error("Failed to save correct answer");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Correct Answer</CardTitle>
        <CardDescription className="text-destructive ">
          This will set the correct answer for the quiz, and close it. This
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-3"
        >
          {quiz.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleSaveAnswer}
          disabled={isPending || !selectedOption}
          className="w-full"
        >
          Save Correct Answer
        </Button>
      </CardContent>
    </Card>
  );
}
