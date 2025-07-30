"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface PickemWeeksListProps {
  campaignId: Id<"pickemCampaigns">;
}

export function PickemWeeksList({ campaignId }: PickemWeeksListProps) {
  const matchupsBySeasonAndWeek = useQuery(
    api.pickem.getPickemMatchupsBySeasonAndWeek,
    {
      campaignId,
    }
  );

  const getSeasonTypeDisplayName = (seasonType: string) => {
    switch (seasonType) {
      case "PRESEASON":
        return "Preseason";
      case "REGULAR_SEASON":
        return "Regular Season";
      case "POSTSEASON":
        return "Postseason";
      default:
        return seasonType;
    }
  };

  const getSeasonTypeVariant = (seasonType: string) => {
    switch (seasonType) {
      case "PRESEASON":
        return "secondary";
      case "REGULAR_SEASON":
        return "default";
      case "POSTSEASON":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getWeekStatusVariant = (matchups: any[]) => {
    const hasActiveMatchups = matchups.some((m) => m.status === "ACTIVE");
    const hasLockedMatchups = matchups.some((m) => m.status === "LOCKED");
    const allComplete = matchups.every((m) => m.status === "COMPLETE");

    if (allComplete) return "outline";
    if (hasLockedMatchups) return "secondary";
    if (hasActiveMatchups) return "default";
    return "outline";
  };

  const getSeasonTypeOrder = (seasonType: string) => {
    switch (seasonType) {
      case "PRESEASON":
        return 0;
      case "REGULAR_SEASON":
        return 1;
      case "POSTSEASON":
        return 2;
      default:
        return 3;
    }
  };

  if (!matchupsBySeasonAndWeek) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading weeks...</div>
      </div>
    );
  }

  const seasonTypes = Object.keys(matchupsBySeasonAndWeek).sort(
    (a, b) => getSeasonTypeOrder(a) - getSeasonTypeOrder(b)
  );

  if (seasonTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No weeks available yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mt-4">Weeks</h2>

      {seasonTypes.map((seasonType) => {
        const weeks = Object.keys(matchupsBySeasonAndWeek[seasonType])
          .map(Number)
          .sort((a, b) => a - b);

        return (
          <div key={seasonType} className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={getSeasonTypeVariant(seasonType)}>
                {getSeasonTypeDisplayName(seasonType)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeks.map((week) => {
                const weekMatchups = matchupsBySeasonAndWeek[seasonType][week];
                const weekStatus = getWeekStatusVariant(weekMatchups);

                // Find the earliest start time for this week
                const earliestStartTime = Math.min(
                  ...weekMatchups.map((m) => m.startTime)
                );

                return (
                  <Link
                    key={`${seasonType}-${week}`}
                    href={`/pickem/${campaignId}/season/${seasonType.toLowerCase()}/week/${week}`}
                  >
                    <Card
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${
                        weekStatus === "default"
                          ? "border-2 border-green-500 dark:border-green-500"
                          : weekStatus === "secondary"
                            ? "border-2 border-nuetral-900 dark:border-nuetral-900"
                            : "border-2 border-gray-500 dark:border-gray-500"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Week {week}</CardTitle>
                          <Badge variant={weekStatus}>
                            {weekStatus === "default" && "Active"}
                            {weekStatus === "secondary" && "Locked"}
                            {weekStatus === "outline" && "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(earliestStartTime, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Trophy className="h-4 w-4" />
                          <span>
                            {weekMatchups.length} game
                            {weekMatchups.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {weekStatus === "default" && "Make your picks"}
                            {weekStatus === "outline" && "Available Soon"}
                            {weekStatus === "secondary" && "Week Complete"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
