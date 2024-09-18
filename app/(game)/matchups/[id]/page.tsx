"use client";
import MatchupView from "@/components/matchups/matchup-view";
import { ContentLayout } from "@/components/nav/content-layout";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const matchupId = params.id;
  if (!matchupId) {
    redirect("/dashboard");
  }
  const matchup = useQuery(api.matchups.getMatchupById, {
    matchupId: matchupId as Id<"matchups">,
  });

  const summaryUrl = getSummaryUrlByLeagueAndGameId(
    matchup?.league as string,
    matchup?.gameId as string
  );

  console.log(summaryUrl);

  //fetch summary data
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!summaryUrl) {
        return;
      }
      const summaryData = await fetch(summaryUrl);
      const summaryJson = await summaryData.json();
      setSummary(summaryJson);
    };

    fetchSummary();
  }, [summaryUrl]);

  if (!summary) {
    return (
      <ContentLayout title="Loading...">
        <Loading />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`${matchup?.homeTeam.name} vs ${matchup?.awayTeam.name}`}
    >
      <MatchupView data={summary} league={matchup?.league as string} />
    </ContentLayout>
  );
}

const getSummaryUrlByLeagueAndGameId = (league: string, gameId: string) => {
  switch (league) {
    case "COLLEGE-FOOTBALL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${gameId}`;
    case "NFL":
      return `http://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    case "MLB":
      return `http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${gameId}`;
    case "NBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`;
    case "WNBA":
      return `http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/summary?event=${gameId}`;
    case "NHL":
      return `http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=${gameId}`;
    default:
      return null;
  }
};
