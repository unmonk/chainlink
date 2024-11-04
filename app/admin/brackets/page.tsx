"use client";
import { BracketViewer } from "@/components/admin/brackets/bracket-viewer";
import { ContentLayout } from "@/components/nav/content-layout";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function BracketsPage() {
  const result = useQuery(api.brackets.getTournamentById, {
    tournamentId:
      "ms7eec9em2d8hbf4fmgvtcvtp173zmnj" as Id<"bracketTournaments">,
  });

  if (!result) return null;
  const { tournament, bracketGames } = result;

  const formattedGames = bracketGames.map((game) => ({
    ...game,
    teams: game.teams.map((team) => ({
      id: team.id ?? team.espnId ?? String(team.order),
      name: team.name,
      seed: team.seed,
      score: team.score ?? 0,
    })),
  }));

  return (
    <ContentLayout title="Brackets">
      <BracketViewer games={formattedGames} />
    </ContentLayout>
  );
}
