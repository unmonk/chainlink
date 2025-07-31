"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Calendar } from "lucide-react";
import Link from "next/link";
import { COSMETIC_STYLE } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface PickemLeaderboardProps {
  campaignId: Id<"pickemCampaigns">;
}

export function PickemLeaderboard({ campaignId }: PickemLeaderboardProps) {
  const [leaderboardType, setLeaderboardType] = useState<"season" | "week">(
    "season"
  );
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedSeasonType, setSelectedSeasonType] = useState<
    "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON"
  >("REGULAR_SEASON");

  const campaign = useQuery(api.pickem.getPickemCampaign, {
    campaignId,
  });

  const matchupsBySeasonAndWeek = useQuery(
    api.pickem.getPickemMatchupsBySeasonAndWeek,
    {
      campaignId,
    }
  );

  const seasonStandings = useQuery(api.pickem.getSeasonStandings, {
    campaignId,
    seasonType: selectedSeasonType,
  });

  const weeklyStandings = useQuery(api.pickem.getWeeklyStandings, {
    campaignId,
    seasonType: selectedSeasonType,
    weekNumber: selectedWeek,
  });

  if (!campaign || !matchupsBySeasonAndWeek) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading leaderboard...</div>
      </div>
    );
  }

  // Get available weeks for the selected season type
  // Fix: Use the exact season type key as returned by the query
  const availableWeeks = matchupsBySeasonAndWeek[selectedSeasonType]
    ? Object.keys(matchupsBySeasonAndWeek[selectedSeasonType])
        .map(Number)
        .sort((a, b) => a - b)
    : [];

  // Get current standings based on selected type
  const currentStandings =
    leaderboardType === "season" ? seasonStandings : weeklyStandings;

  if (!currentStandings) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading standings...</div>
      </div>
    );
  }

  if (currentStandings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No standings available yet.</div>
      </div>
    );
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return <Badge className="bg-yellow-500 text-white">1st</Badge>;
      case 2:
        return <Badge className="bg-gray-400 text-white">2nd</Badge>;
      case 3:
        return <Badge className="bg-amber-600 text-white">3rd</Badge>;
      default:
        return <Badge variant="outline">{position}</Badge>;
    }
  };

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

  // Type guards to help TypeScript understand the data structure
  const isSeasonStanding = (
    standing: any
  ): standing is {
    totalPoints: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalPushed: number;
  } => {
    return leaderboardType === "season";
  };

  const isWeeklyStanding = (
    standing: any
  ): standing is {
    points: number;
    correct: number;
    incorrect: number;
    pushed: number;
  } => {
    return leaderboardType === "week";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      {/* Leaderboard Type Selector */}
      <div className="flex flex-col gap-4">
        {/* First row - Type and Season */}
        <div className="flex flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm font-medium whitespace-nowrap">
              Type:
            </label>
            <Select
              value={leaderboardType}
              onValueChange={(value: "season" | "week") =>
                setLeaderboardType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Season</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm font-medium whitespace-nowrap">
              Season:
            </label>
            <Select
              value={selectedSeasonType}
              onValueChange={(
                value: "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON"
              ) => setSelectedSeasonType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESEASON">Preseason</SelectItem>
                <SelectItem value="REGULAR_SEASON">Regular Season</SelectItem>
                <SelectItem value="POSTSEASON">Postseason</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row - Week selector (only when week type is selected) */}
        {leaderboardType === "week" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              Week:
            </label>
            <Select
              value={selectedWeek.toString()}
              onValueChange={(value) => setSelectedWeek(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableWeeks.length > 0 ? (
                  availableWeeks.map((week) => (
                    <SelectItem key={week} value={week.toString()}>
                      {week}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="1" disabled>
                    No weeks
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {leaderboardType === "season"
              ? `${getSeasonTypeDisplayName(selectedSeasonType)} Standings`
              : `Week ${selectedWeek} Standings`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStandings.map((standing, index) => (
              <Link
                key={standing.userId}
                href={`/u/${standing.name}`}
                className="block"
              >
                <div className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent transition-colors">
                  {/* Top row - Rank and User */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getPositionIcon(index + 1)}
                      {getPositionBadge(index + 1)}
                    </div>

                    <Avatar
                      height="h-10"
                      width="w-10"
                      cosmetic={
                        standing.image
                          ? undefined
                          : ("default" as COSMETIC_STYLE)
                      }
                      hasGlow={false}
                      className="flex-shrink-0"
                    >
                      <AvatarImage src={standing.image} alt={standing.name} />
                      <AvatarFallback>{standing.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{standing.name}</h3>
                    </div>
                  </div>

                  {/* Bottom row - Stats */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      {isSeasonStanding(standing)
                        ? `${standing.totalCorrect} correct • ${standing.totalIncorrect} incorrect`
                        : `${standing.correct} correct • ${standing.incorrect} incorrect`}
                      {(isSeasonStanding(standing)
                        ? standing.totalPushed
                        : standing.pushed) > 0 &&
                        ` • ${isSeasonStanding(standing) ? standing.totalPushed : standing.pushed} pushed`}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {(() => {
                          const correct = isSeasonStanding(standing)
                            ? standing.totalCorrect
                            : standing.correct;
                          const incorrect = isSeasonStanding(standing)
                            ? standing.totalIncorrect
                            : standing.incorrect;
                          return correct + incorrect > 0
                            ? ((correct / (correct + incorrect)) * 100).toFixed(
                                1
                              )
                            : "0.0";
                        })()}
                        % accuracy
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {isSeasonStanding(standing)
                          ? standing.totalPoints
                          : standing.points}{" "}
                        pts
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
