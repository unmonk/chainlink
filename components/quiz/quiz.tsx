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

  if (!user) return null;

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

  if (!activeQuiz)
    return (
      <div className="mx-auto">
        <Card className="text-center p-2">
          <CardHeader>
            <CardTitle className="text-2xl">No Active Challenge</CardTitle>
            <CardDescription>
              There are no challenges available at the moment. Check back soon
              for new opportunities to earn Links!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-muted-foreground">
              Challenges let you test your knowledge and earn Links by making
              correct predictions or participating in a poll.
            </p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="mx-auto mb-4">
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

            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Min Wager</p>
                <p className="font-semibold text-cyan-500">
                  🔗 {activeQuiz.quiz.minWager}
                </p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-sm text-muted-foreground mb-1">Your Wager</p>
                <p className="font-semibold text-cyan-500">🔗 {wager}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Max Wager</p>
                <p className="font-semibold text-cyan-500">
                  🔗 {activeQuiz.quiz.maxWager}
                </p>
              </div>
            </div>

            <div className="bg-green-500/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Potential Win Amount
              </p>
              <p className="font-bold text-green-500 text-lg">
                🔗 {wager * 10 > 0 ? wager * 10 : 10}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Win 10x your wager if your prediction is correct
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
