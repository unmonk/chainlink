"use client";
import MatchupView from "@/components/matchups/matchup-view";
import { ContentLayout } from "@/components/nav/content-layout";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

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
      <Suspense fallback={<Loading />}>
        {matchup?.league === "MBB" || matchup?.league === "WBB" ? (
          <div className="text-center text-muted-foreground">
            <p>Summary view for this league is not supported yet.</p>
            <p>Check back soon!</p>
            <Link
              href={`https://www.espn.com/${
                matchup?.league === "MBB"
                  ? "mens-college-basketball"
                  : "womens-college-basketball"
              }/game/_/gameId/${matchup.gameId}`}
              target="_blank"
              passHref
            >
              <Button variant="outline">
                <ExternalLinkIcon className="w-4 h-4 mr-2" /> View Game on ESPN
              </Button>
            </Link>
          </div>
        ) : (
          <MatchupView data={summary} league={matchup?.league as string} />
        )}
      </Suspense>
    </ContentLayout>
  );
}

const getSummaryUrlByLeagueAndGameId = (league: string, gameId: string) => {
  switch (league) {
    case "COLLEGE-FOOTBALL":
      return `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${gameId}`;
    case "NFL":
      return `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    case "UFL":
      return `https://site.api.espn.com/apis/site/v2/sports/football/ufl/summary?event=${gameId}`;
    case "MBB":
      return `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/?event=${gameId}`;
    case "WBB":
      return `https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/summary?event=${gameId}`;
    case "MLB":
      return `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${gameId}`;
    case "NBA":
      return `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`;
    case "WNBA":
      return `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/summary?event=${gameId}`;
    case "NHL":
      return `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=${gameId}`;
    case "MLS":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/summary?event=${gameId}`;
    case "NWSL":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.2/summary?event=${gameId}`;
    case "EPL":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=${gameId}`;
    case "RPL":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/rus.1/summary?event=${gameId}`;
    case "CSL":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/chn.1/summary?event=${gameId}`;
    case "ARG":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/arg.1/summary?event=${gameId}`;
    case "TUR":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/summary?event=${gameId}`;
    case "FRIENDLY":
      return `https://site.api.espn.com/apis/site/v2/sports/soccer/friendly/summary?event=${gameId}`;
    case "PLL":
      return `https://site.api.espn.com/apis/site/v2/sports/lacrosse/pll/summary?event=${gameId}`;

    default:
      return null;
  }
};
