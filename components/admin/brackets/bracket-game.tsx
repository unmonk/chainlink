import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  BracketGame as BracketGameType,
  BracketPrediction,
} from "./bracketTypes";
import Image from "next/image";

interface BracketGameProps {
  game: BracketGameType;
  prediction?: BracketPrediction;
  onPredictionSubmit?: (prediction: BracketPrediction) => void;
}

export function BracketGame({
  game,
  prediction,
  onPredictionSubmit,
}: BracketGameProps) {
  const [homeScore, setHomeScore] = useState(
    prediction?.homeTeamScore?.toString() || ""
  );
  const [awayScore, setAwayScore] = useState(
    prediction?.awayTeamScore?.toString() || ""
  );

  const homeTeam = game.teams.find((team) => team.homeAway === "HOME");
  const awayTeam = game.teams.find((team) => team.homeAway === "AWAY");

  const handleSubmit = () => {
    if (!onPredictionSubmit) return;

    const prediction: BracketPrediction = {
      homeTeamScore: parseInt(homeScore) || 0,
      awayTeamScore: parseInt(awayScore) || 0,
      winnerId:
        parseInt(homeScore) > parseInt(awayScore) ? homeTeam?.id : awayTeam?.id,
    };

    onPredictionSubmit(prediction);
  };

  return (
    <Card className="w-full max-w-[300px] mb-4">
      <CardContent className="p-4">
        {game.teams.map((team) => (
          <div
            key={team.id}
            className={cn(
              "flex items-center gap-2 p-2",
              team.winner && "bg-green-100 dark:bg-green-900",
              team.homeAway === "HOME" ? "mb-2" : "mt-2"
            )}
          >
            <div className="flex-shrink-0 w-8 h-8">
              <Image
                height={32}
                width={32}
                src={team.image || "/placeholder.svg?height=32&width=32"}
                alt={`${team.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{team.seed}</span>
                <span className="text-sm">{team.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">{team.region}</div>
            </div>
            {game.status === "SCHEDULED" ? (
              <Input
                type="number"
                min="0"
                className="w-16"
                value={team.homeAway === "HOME" ? homeScore : awayScore}
                onChange={(e) =>
                  team.homeAway === "HOME"
                    ? setHomeScore(e.target.value)
                    : setAwayScore(e.target.value)
                }
              />
            ) : (
              <span className="text-lg font-bold">{team.score || 0}</span>
            )}
          </div>
        ))}
        {game.status === "SCHEDULED" && onPredictionSubmit && (
          <Button onClick={handleSubmit} className="w-full mt-4">
            Submit Prediction
          </Button>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(game.scheduledAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
