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
  Edit,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LoadMatchupsDialog } from "./load-matchups-dialog";
import { EditMatchupDialog } from "./edit-matchup-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface CampaignMatchupsListProps {
  campaignId: Id<"pickemCampaigns">;
}

export function CampaignMatchupsList({
  campaignId,
}: CampaignMatchupsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMatchup, setSelectedMatchup] = useState<any>(null);

  // Get campaign details
  const campaign = useQuery(api.pickem.getPickemCampaign, { campaignId });
  const campaignMatchups = useQuery(api.pickem.getPickemMatchupsByCampaign, {
    campaignId,
  });

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

  const handleLoadMatchupsFromSchedule = () => {
    setIsDialogOpen(true);
  };

  const handleEditMatchup = (matchup: any) => {
    setSelectedMatchup(matchup);
    setIsEditDialogOpen(true);
  };

  const updateMatchup = useMutation(api.pickem.updatePickemMatchup);
  const [bulkUpdating, setBulkUpdating] = useState<string | null>(null);

  const handleBulkStatusUpdate = async (
    weekMatchups: any[],
    status: string,
    weekKey: string
  ) => {
    setBulkUpdating(weekKey);
    try {
      await Promise.all(
        weekMatchups.map((matchup) =>
          updateMatchup({
            matchupId: matchup._id,
            status: status as any,
            title: matchup.title,
            gameId: matchup.gameId,
            startTime: matchup.startTime,
            homeTeam: matchup.homeTeam,
            awayTeam: matchup.awayTeam,
            winnerId: matchup.winnerId,
          })
        )
      );
      toast.success(`Week ${weekMatchups[0]?.week} set to ${status}`);
    } catch (error) {
      toast.error("Failed to update week status");
    } finally {
      setBulkUpdating(null);
    }
  };

  if (!campaign) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Sort campaignMatchups by seasonType and week
  const sortedMatchups =
    campaignMatchups && Array.isArray(campaignMatchups)
      ? [...campaignMatchups].sort((a, b) => {
          // Sort by seasonType order first
          const seasonTypeOrderA = getSeasonTypeOrder(
            a.seasonType || "REGULAR_SEASON"
          );
          const seasonTypeOrderB = getSeasonTypeOrder(
            b.seasonType || "REGULAR_SEASON"
          );
          if (seasonTypeOrderA !== seasonTypeOrderB) {
            return seasonTypeOrderA - seasonTypeOrderB;
          }
          // Then by week
          return (a.week || 0) - (b.week || 0);
        })
      : [];

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
          </div>
        </CardContent>
      </Card>

      {campaignMatchups && campaignMatchups.length > 0 && (
        <div className="space-y-4">
          {/* Group matchups by season type */}
          {Object.entries(
            sortedMatchups.reduce(
              (acc, matchup) => {
                const seasonType = matchup.seasonType || "REGULAR_SEASON";
                if (!acc[seasonType]) {
                  acc[seasonType] = [];
                }
                acc[seasonType].push(matchup);
                return acc;
              },
              {} as Record<string, typeof sortedMatchups>
            )
          )
            .sort(([a], [b]) => {
              const orderA = getSeasonTypeOrder(a);
              const orderB = getSeasonTypeOrder(b);
              return orderA - orderB;
            })
            .map(([seasonType, matchups]) => (
              <Accordion key={seasonType} type="single" collapsible>
                <AccordionItem value={seasonType}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeasonTypeVariant(seasonType)}>
                        {getSeasonTypeDisplayName(seasonType)}
                      </Badge>
                      <span className="text-lg font-semibold">
                        {getSeasonTypeDisplayName(seasonType)} (
                        {matchups.length} matchups)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* Group matchups by week within this season type */}
                      {Object.entries(
                        matchups.reduce(
                          (acc, matchup) => {
                            const week = matchup.week || 0;
                            if (!acc[week]) {
                              acc[week] = [];
                            }
                            acc[week].push(matchup);
                            return acc;
                          },
                          {} as Record<number, typeof matchups>
                        )
                      )
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([week, weekMatchups]) => (
                          <Accordion key={week} type="single" collapsible>
                            <AccordionItem value={`${seasonType}-week-${week}`}>
                              <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-sm"
                                    >
                                      Week {week}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {weekMatchups.length} game
                                      {weekMatchups.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                  <div
                                    className="flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {["PENDING", "ACTIVE", "LOCKED"].map(
                                      (status) => (
                                        <Button
                                          key={status}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6 px-2"
                                          onClick={() =>
                                            handleBulkStatusUpdate(
                                              weekMatchups,
                                              status,
                                              `${seasonType}-${week}`
                                            )
                                          }
                                          disabled={
                                            bulkUpdating ===
                                            `${seasonType}-${week}`
                                          }
                                        >
                                          {bulkUpdating ===
                                          `${seasonType}-${week}` ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            status
                                          )}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid gap-2 pl-4 pt-2">
                                  {weekMatchups.map((matchup) => (
                                    <Card key={matchup._id} className="p-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-medium">
                                            {matchup.title}
                                          </h4>
                                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3" />
                                              {new Date(
                                                matchup.startTime
                                              ).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {new Date(
                                                matchup.startTime
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
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
                                        <div className="flex items-center gap-3">
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                              <Image
                                                src={matchup.awayTeam.image}
                                                alt={matchup.awayTeam.name}
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                              />
                                              <span className="text-sm font-medium">
                                                {matchup.awayTeam.name}
                                              </span>
                                              <span className="text-sm font-bold min-w-[20px] text-center">
                                                {matchup.awayTeam.score}
                                              </span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                              @
                                            </span>
                                            <div className="flex items-center gap-1">
                                              <Image
                                                src={matchup.homeTeam.image}
                                                alt={matchup.homeTeam.name}
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                              />
                                              <span className="text-sm font-medium">
                                                {matchup.homeTeam.name}
                                              </span>
                                              <span className="text-sm font-bold min-w-[20px] text-center">
                                                {matchup.homeTeam.score}
                                              </span>
                                            </div>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleEditMatchup(matchup)
                                            }
                                            className="flex items-center gap-1"
                                          >
                                            <Edit className="h-3 w-3" />
                                            Edit
                                          </Button>
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
        </div>
      )}

      {/* Load Matchups Dialog */}
      <LoadMatchupsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        campaignId={campaignId}
        campaignLeague={campaign.league as any}
      />

      {/* Edit Matchup Dialog */}
      <EditMatchupDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        matchup={selectedMatchup}
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
