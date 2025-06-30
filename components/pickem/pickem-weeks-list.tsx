"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Loader2,
  Users,
  Trophy,
  ChevronDown,
  ChevronRight,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PickemWeeksListProps {
  campaignId: Id<"pickemCampaigns">;
}

export function PickemWeeksList({ campaignId }: PickemWeeksListProps) {
  // Get pickem weeks for the campaign
  const pickemWeeks = useQuery(api.pickem.getPickemWeeksByCampaign, {
    campaignId,
  });

  if (!pickemWeeks) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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

  const getWeekStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "LOCKED":
        return "secondary";
      case "COMPLETE":
        return "outline";
      case "PENDING":
      default:
        return "outline";
    }
  };

  // Sort season types in the desired order: preseason, regular season, postseason
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

  // Sort pickem weeks by season type and week number
  const sortedPickemWeeks = pickemWeeks.sort((a, b) => {
    const seasonOrderA = getSeasonTypeOrder(a.seasonType || "REGULAR_SEASON");
    const seasonOrderB = getSeasonTypeOrder(b.seasonType || "REGULAR_SEASON");

    if (seasonOrderA !== seasonOrderB) {
      return seasonOrderA - seasonOrderB;
    }

    return a.weekNumber - b.weekNumber;
  });

  // Group weeks by season type
  const weeksBySeason = sortedPickemWeeks.reduce(
    (acc, week) => {
      const seasonType = week.seasonType || "REGULAR_SEASON";
      if (!acc[seasonType]) {
        acc[seasonType] = [];
      }
      acc[seasonType].push(week);
      return acc;
    },
    {} as Record<string, typeof pickemWeeks>
  );

  if (pickemWeeks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">No pickem weeks found</h4>
          <p className="text-muted-foreground">
            No pickem weeks have been generated for this campaign yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Pickem Weeks</h3>

      <Accordion type="multiple" className="space-y-4">
        {Object.entries(weeksBySeason).map(([seasonType, weeks]) => (
          <AccordionItem
            key={seasonType}
            value={seasonType}
            className="border rounded-lg bg-background"
          >
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-accent/50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge variant={getSeasonTypeVariant(seasonType)}>
                    {getSeasonTypeDisplayName(seasonType)}
                  </Badge>
                  <span className="font-semibold text-sm sm:text-base">
                    {weeks.length} Week{weeks.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  (
                  {weeks.reduce(
                    (total, week) => total + week.matchups.length,
                    0
                  )}{" "}
                  total matchups)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-4 bg-accent/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {weeks.map((week) => (
                  <Card
                    key={week._id}
                    className="hover:shadow-md transition-shadow flex flex-col"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-base sm:text-lg">
                            Week {week.weekNumber}
                          </CardTitle>
                          {week.seasonType && (
                            <Badge
                              variant={getSeasonTypeVariant(week.seasonType)}
                              className="mt-1 text-xs"
                            >
                              {getSeasonTypeDisplayName(week.seasonType)}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={getWeekStatusVariant(week.status)}
                          className="text-xs w-fit"
                        >
                          {week.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 space-y-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>
                        <span>
                          {new Date(week.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>
                          {new Date(week.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Matchups:</span>
                        <span>{week.matchups.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">
                          Participants:
                        </span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>
                            {week.participantsWithPicks}/
                            {week.totalParticipants}
                          </span>
                        </div>
                      </div>

                      {/* Show matchup preview if there are matchups */}
                      {week.matchups.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">
                            Matchup Preview:
                          </p>
                          <div className="space-y-2">
                            {week.matchups.slice(0, 2).map(
                              (matchup) =>
                                matchup && (
                                  <div
                                    key={matchup._id}
                                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs"
                                  >
                                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                      <Image
                                        src={matchup.awayTeam.image}
                                        alt={matchup.awayTeam.name}
                                        width={14}
                                        height={14}
                                        className="rounded-full flex-shrink-0"
                                      />
                                      <span className="truncate text-left">
                                        {matchup.awayTeam.name}
                                      </span>
                                    </div>
                                    <span className="text-muted-foreground text-center flex-shrink-0">
                                      @
                                    </span>
                                    <div className="flex items-center justify-end gap-1 sm:gap-2 min-w-0">
                                      <Image
                                        src={matchup.homeTeam.image}
                                        alt={matchup.homeTeam.name}
                                        width={14}
                                        height={14}
                                        className="rounded-full flex-shrink-0"
                                      />
                                      <span className="truncate text-right">
                                        {matchup.homeTeam.name}
                                      </span>
                                    </div>
                                  </div>
                                )
                            )}
                            {week.matchups.length > 2 && (
                              <p className="text-xs text-muted-foreground text-center">
                                +{week.matchups.length - 2} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Spacer to push button to bottom */}
                      <div className="flex-1" />

                      {/* Make Picks Button */}
                      <div className="pt-3 border-t">
                        <Link
                          href={`/pickem/${campaignId}/week/${week.weekNumber}`}
                        >
                          <Button
                            className="w-full h-10 text-sm"
                            variant={
                              week.status === "COMPLETE"
                                ? "secondary"
                                : week.status === "LOCKED"
                                  ? "destructive"
                                  : "default"
                            }
                            disabled={
                              week.status === "COMPLETE" ||
                              week.status === "LOCKED"
                            }
                          >
                            <Target className="h-4 w-4 mr-2" />
                            {week.status === "COMPLETE"
                              ? "View Results"
                              : week.status === "LOCKED"
                                ? "Picks Locked"
                                : "Make Picks"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
