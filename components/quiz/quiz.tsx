"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function QuizPage() {
  const user = useQuery(api.users.currentUser);
  const activeQuiz = useQuery(api.quiz.getActiveQuiz);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [wager, setWager] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);

  const submitAnswer = useMutation(api.quiz.submitAnswer);
  //check if user has already responded to this quiz
  const userHasResponded = activeQuiz?.participants.find(
    (participant) => participant.userId === user?._id
  );

  useEffect(() => {
    if (userHasResponded) {
      setSelectedOption(userHasResponded.selectedOptionId);
      setWager(userHasResponded.wager);
    }
  }, [userHasResponded, activeQuiz]);

  if (!user || !activeQuiz) return null;

  const handleSubmitAnswer = async () => {
    if (!activeQuiz) return;
    setIsPending(true);
    await submitAnswer({
      quizId: activeQuiz.quiz._id,
      selectedOptionId: selectedOption,
      wager,
      userId: user._id,
    });
    setIsPending(false);
  };

  if (!activeQuiz) return <div>No active quiz, check back later!</div>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{activeQuiz.quiz.title}</CardTitle>
          <CardDescription>{activeQuiz.quiz.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Options Selection */}
          <RadioGroup
            onValueChange={setSelectedOption}
            value={selectedOption}
            className="space-y-3"
            disabled={!!userHasResponded}
          >
            {activeQuiz.quiz.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
                {activeQuiz.percentagePerOption[option.id] && (
                  <p className="text-sm text-muted-foreground">
                    {activeQuiz.percentagePerOption[option.id]} votes{" "}
                  </p>
                )}
              </div>
            ))}
          </RadioGroup>
          <Separator />

          {/* Wager Selection */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Your Wager</h3>
            <Slider
              value={[wager]}
              onValueChange={(value: number[]) => setWager(value[0])}
              max={activeQuiz.quiz.maxWager}
              min={activeQuiz.quiz.minWager}
              step={1}
              disabled={!!userHasResponded}
            />
            <div className="text-sm text-muted-foreground font-bold">
              Selected: <span className="text-cyan-500">🔗 {wager}</span> Links
            </div>
            <div className="space-y-2">
              {/* min and max wagers */}
              <p className="text-sm text-muted-foreground">
                Min Wager:{" "}
                <span className="text-cyan-500">
                  🔗{activeQuiz.quiz.minWager}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Max Wager:{" "}
                <span className="text-cyan-500">
                  🔗{activeQuiz.quiz.maxWager}
                </span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            disabled={!!userHasResponded || isPending}
            onClick={handleSubmitAnswer}
            variant={userHasResponded ? "secondary" : "default"}
          >
            {isPending
              ? "Submitting..."
              : userHasResponded
                ? "Already Voted"
                : "Submit Answer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
