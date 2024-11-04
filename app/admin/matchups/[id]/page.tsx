"use client";
import { EditMatchupForm } from "@/components/matchups/edit-matchup";
import { ContentLayout } from "@/components/nav/content-layout";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { useQuery } from "convex/react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditMatchupPage({ params }: PageProps) {
  const matchup = useQuery(api.matchups.getMatchupById, {
    matchupId: params.id as Id<"matchups">,
  });

  if (!matchup) {
    return <div>Matchup not found</div>;
  }

  return (
    <ContentLayout title="Edit Matchup">
      <EditMatchupForm row={matchup} />
    </ContentLayout>
  );
}
