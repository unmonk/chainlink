"use client";

import { useEffect, useMemo, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface BracketViewerProps {
  games: {
    _id: Id<"bracketGames">;
    _creationTime: number;
    status: "PENDING" | "COMPLETE" | "ACTIVE";
    tournamentId: Id<"bracketTournaments">;
    round: number;
    gamePosition: number;
    region: string;
    teams: {
      id: string;
      name: string;
      seed: number;
      score: number;
    }[];
    scheduledAt: number;
  }[];
}

export function BracketViewer({ games }: BracketViewerProps) {
  const rounds = useMemo(() => {
    // Group games by round
    const gamesByRound = games.reduce((acc, game) => {
      const round = acc[game.round - 1] || {
        title: `Round ${game.round}`,
        seeds: [],
      };
      round.seeds.push({
        id: game._id,
        date: new Date(game.scheduledAt).toDateString(),
        teams: game.teams.map((team) => ({
          name: team.name || "TBD",
          seed: team.seed,
          score: team.score || 0,
        })),
      });
      acc[game.round - 1] = round;
      return acc;
    }, [] as any[]);

    // Sort seeds within each round by gamePosition
    return gamesByRound.map((round) => ({
      ...round,
      seeds: round.seeds.sort((a: any, b: any) => {
        const gameA = games.find((g) => g._id === a.id);
        const gameB = games.find((g) => g._id === b.id);
        return (gameA?.gamePosition || 0) - (gameB?.gamePosition || 0);
      }),
    }));
  }, [games]);

  return (
    <div className="relative w-full h-full overflow-x-auto rounded-lg border bg-background p-4 gap-4">
      <div className="w-full">
        {/* <Bracket
          rounds={rounds}
          roundClassName="mb-4"
          bracketClassName="gap-4"
          mobileBreakpoint={768}
          roundTitleComponent={(title: React.ReactNode) => (
            <div className="text-foreground font-medium">{title}</div>
          )}
          renderSeedComponent={({ seed }) => (
            <div className="p-2 rounded-lg border min-w-[200px] max-h-[100px] overflow-y-auto flex flex-col justify-center items-center">
              {seed.teams.map((team, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1 w-full">
                  {team.seed && (
                    <span className="text-xs text-muted-foreground">
                      ({team.seed})
                    </span>
                  )}
                  <span className="font-medium">{team.name}</span>
                  <span className="ml-auto">{team.score}</span>
                </div>
              ))}
            </div>
          )}
        /> */}
      </div>
    </div>
  );
}
