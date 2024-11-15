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
import { useRouter } from "next/navigation";

interface QuizOptionsProps {
  quiz: Doc<"globalQuiz">;
  currentAnswer?: string;
}

export function QuizResults({ quiz, currentAnswer }: QuizOptionsProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>(
    currentAnswer || ""
  );
  const [isPending, setIsPending] = useState(false);
  const updateQuiz = useMutation(api.quiz.updateQuiz);

  const handleSaveAnswer = async () => {
    if (!selectedOption) {
      toast.error("Please select an answer or declare a tie");
      return;
    }

    try {
      setIsPending(true);
      await updateQuiz({
        quizId: quiz._id,
        correctAnswerId: selectedOption,
        status: "COMPLETE",
      });
      toast.success(
        selectedOption === "TIE"
          ? "Quiz marked as tie"
          : "Correct answer saved successfully"
      );
      router.push("/admin/quiz");
    } catch (error) {
      toast.error("Failed to save result");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Quiz Result</CardTitle>
        <CardDescription className="text-destructive">
          Select a winning answer or declare a tie. This will close the quiz and
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
          <div className="flex items-center space-x-2 pt-2 border-t">
            <RadioGroupItem value="TIE" id="tie-option" />
            <Label htmlFor="tie-option" className="text-sm font-medium">
              Declare a Tie
            </Label>
          </div>
        </RadioGroup>

        <Button
          onClick={handleSaveAnswer}
          disabled={isPending || !selectedOption}
          className="w-full"
        >
          {selectedOption === "TIE" ? "Save as Tie" : "Save Correct Answer"}
        </Button>
      </CardContent>
    </Card>
  );
}
