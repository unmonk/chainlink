"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";
import { MatchupWithPickCounts } from "@/convex/matchups";
import { leagueLogos } from "@/convex/utils";

interface MatchupSelectorProps {
  onMatchupSelect: (matchup: MatchupWithPickCounts) => void;
}

export function MatchupSelector({ onMatchupSelect }: MatchupSelectorProps) {
  const matchups = useQuery(api.matchups.getActiveMatchups);

  if (!matchups) return null;

  function handleMatchupSelect(matchupId: string) {
    if (!matchups) return;
    const matchup = matchups.find((m) => m._id === matchupId);
    if (!matchup) return;
    onMatchupSelect(matchup);
  }

  return (
    <Select onValueChange={handleMatchupSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a matchup" />
      </SelectTrigger>
      <SelectContent>
        {matchups.map((matchup) => (
          <SelectItem key={matchup._id} value={matchup._id}>
            <img
              src={leagueLogos[matchup.league as keyof typeof leagueLogos]}
              alt={matchup.league}
              className="w-4 h-4 inline-block mr-2"
            />
            {matchup.title} -{" "}
            <img
              src={matchup.homeTeam.image}
              alt={matchup.homeTeam.name}
              className="w-4 h-4 inline-block mx-1"
            />
            {matchup.homeTeam.name} vs{" "}
            <img
              src={matchup.awayTeam.image}
              alt={matchup.awayTeam.name}
              className="w-4 h-4 inline-block mx-1"
            />
            {matchup.awayTeam.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
