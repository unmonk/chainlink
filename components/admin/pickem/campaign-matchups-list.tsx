"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Loader2,
  Download,
  ChevronDown,
  ChevronRight,
  CalendarPlusIcon,
  Users,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LoadMatchupsDialog } from "./load-matchups-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CampaignMatchupsListProps {
  campaignId: Id<"pickemCampaigns">;
}

export function CampaignMatchupsList({
  campaignId,
}: CampaignMatchupsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingWeeks, setIsGeneratingWeeks] = useState(false);

  // Get campaign details
  const campaign = useQuery(api.pickem.getPickemCampaignById, { campaignId });
  const generatePickemWeeks = useMutation(
    api.pickem.generatePickemWeeksFromMatchups
  );

  // Get matchups organized by season type and week
  const organizedMatchups = useQuery(
    api.pickem.getPickemMatchupsBySeasonAndWeek,
    {
      campaignId,
    }
  );

  // Get pickem weeks for the campaign
  const pickemWeeks = useQuery(api.pickem.getPickemWeeksByCampaign, {
    campaignId,
  });

  const handleLoadMatchupsFromSchedule = () => {
    setIsDialogOpen(true);
  };

  if (!campaign) {
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
  const sortedPickemWeeks = pickemWeeks?.sort((a, b) => {
    const seasonOrderA = getSeasonTypeOrder(a.seasonType || "REGULAR_SEASON");
    const seasonOrderB = getSeasonTypeOrder(b.seasonType || "REGULAR_SEASON");

    if (seasonOrderA !== seasonOrderB) {
      return seasonOrderA - seasonOrderB;
    }

    return a.weekNumber - b.weekNumber;
  });

  // Sort organized matchups by season type
  const sortedOrganizedMatchups = organizedMatchups
    ? Object.fromEntries(
        Object.entries(organizedMatchups).sort(([a], [b]) => {
          return getSeasonTypeOrder(a) - getSeasonTypeOrder(b);
        })
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Header with campaign info and load button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{campaign.name}</h2>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleLoadMatchupsFromSchedule}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Load Matchups from Schedule
          </Button>
          <Button
            onClick={() => {
              setIsGeneratingWeeks(true);
              generatePickemWeeks({ campaignId }).finally(() => {
                setIsGeneratingWeeks(false);
              });
            }}
            className="flex items-center gap-2"
            disabled={isGeneratingWeeks}
          >
            {isGeneratingWeeks ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlusIcon className="h-4 w-4" />
            )}
            Generate Pickem Weeks
          </Button>
        </div>
      </div>

      {/* Campaign info card */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                League
              </p>
              <p className="text-sm">{campaign.league}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline">{campaign.type}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Scoring
              </p>
              <Badge variant="outline">{campaign.scoringType}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={campaign.active ? "default" : "secondary"}>
                {campaign.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickem Weeks Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Pickem Weeks</h3>

        {!pickemWeeks ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : pickemWeeks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No pickem weeks found
              </h4>
              <p className="text-muted-foreground mb-4">
                No pickem weeks have been generated for this campaign yet.
              </p>
              <Button
                onClick={() => {
                  setIsGeneratingWeeks(true);
                  generatePickemWeeks({ campaignId }).finally(() => {
                    setIsGeneratingWeeks(false);
                  });
                }}
                disabled={isGeneratingWeeks}
              >
                {isGeneratingWeeks ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CalendarPlusIcon className="h-4 w-4 mr-2" />
                )}
                Generate Pickem Weeks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPickemWeeks?.map((week) => (
              <Card
                key={week._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Week {week.weekNumber}
                      </CardTitle>
                      {week.seasonType && (
                        <Badge
                          variant={getSeasonTypeVariant(week.seasonType)}
                          className="mt-1"
                        >
                          {getSeasonTypeDisplayName(week.seasonType)}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={getWeekStatusVariant(week.status)}>
                      {week.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{new Date(week.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{new Date(week.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Matchups:</span>
                    <span>{week.matchups.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Participants:</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {week.participantsWithPicks}/{week.totalParticipants}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Matchups by Season Type and Week */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          Matchups by Season Type and Week
        </h3>

        {!organizedMatchups ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : Object.keys(organizedMatchups).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No matchups found</h4>
              <p className="text-muted-foreground mb-4">
                No matchups have been loaded for this campaign yet.
              </p>
              <Button onClick={handleLoadMatchupsFromSchedule}>
                <Download className="h-4 w-4 mr-2" />
                Load Matchups from Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {Object.entries(sortedOrganizedMatchups || {}).map(
              ([seasonType, weeks]) => (
                <AccordionItem
                  key={seasonType}
                  value={seasonType}
                  className="border rounded-lg bg-background"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeasonTypeVariant(seasonType)}>
                        {getSeasonTypeDisplayName(seasonType)}
                      </Badge>
                      <span className="font-semibold">
                        {Object.keys(weeks).length} Week
                        {Object.keys(weeks).length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-muted-foreground">
                        ({Object.values(weeks).flat().length} total matchups)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 bg-accent/30">
                    <div className="space-y-4">
                      {Object.entries(weeks).map(
                        ([weekNumber, weekMatchups]) => (
                          <Card
                            key={weekNumber}
                            className="border-l-4 border-l-primary bg-background"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  Week {weekNumber}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {weekMatchups.length} matchup
                                    {weekMatchups.length !== 1 ? "s" : ""}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {weekMatchups.map((matchup) => (
                                  <div
                                    key={matchup._id}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <Image
                                          src={matchup.awayTeam.image}
                                          alt={matchup.awayTeam.name}
                                          width={32}
                                          height={32}
                                          className="rounded-full"
                                        />
                                        <span className="font-medium">
                                          {matchup.awayTeam.name}
                                        </span>
                                      </div>
                                      <span className="text-muted-foreground">
                                        @
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Image
                                          src={matchup.homeTeam.image}
                                          alt={matchup.homeTeam.name}
                                          width={32}
                                          height={32}
                                          className="rounded-full"
                                        />
                                        <span className="font-medium">
                                          {matchup.homeTeam.name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 inline mr-1" />
                                        {new Date(
                                          matchup.startTime
                                        ).toLocaleDateString()}
                                      </div>
                                      <Badge
                                        variant={getMatchupStatusVariant(
                                          matchup.status
                                        )}
                                      >
                                        {matchup.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        )}
      </div>

      {/* Load Matchups Dialog */}
      <LoadMatchupsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        campaignId={campaignId}
        campaignLeague={campaign.league as any}
      />
    </div>
  );
}

function getMatchupStatusVariant(status: string) {
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
}
