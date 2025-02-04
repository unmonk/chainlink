"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BracketGame } from "./bracket-game";
import type {
  BracketProps,
  BracketGame as BracketGameType,
} from "./bracketTypes";

export function TournamentBracket({
  tournamentId,
  games = [],
  predictions = {},
  onPredictionSubmit,
}: BracketProps) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center p-4">
        No games available for this tournament.
      </div>
    );
  }

  const rounds = Array.from(new Set(games.map((game) => game.round))).sort(
    (a, b) => a - b
  );

  const getGamesForRound = (round: number): BracketGameType[] => {
    return games
      .filter((game) => game.round === round)
      .sort((a, b) => a.gamePosition - b.gamePosition);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between min-w-[1000px]">
        {rounds.map((round) => (
          <div
            key={round}
            className={cn(
              "flex flex-col justify-around",
              round > 1 && "md:mt-16"
            )}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Round {round}
            </h2>
            {getGamesForRound(round).map((game) => (
              <BracketGame
                key={game.id}
                game={game}
                prediction={predictions[game.id]}
                onPredictionSubmit={
                  onPredictionSubmit
                    ? (prediction) => onPredictionSubmit(game.id, prediction)
                    : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
