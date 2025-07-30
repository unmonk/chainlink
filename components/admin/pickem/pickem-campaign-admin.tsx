"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface PickemCampaignAdminProps {
  campaignId: Id<"pickemCampaigns">;
}

export function PickemCampaignAdmin({ campaignId }: PickemCampaignAdminProps) {
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isDistributingPrizes, setIsDistributingPrizes] = useState(false);

  // Queries
  const campaign = useQuery(api.pickem.getPickemCampaign, { campaignId });
  const currentState = useQuery(api.pickem.getPickemCampaignCurrentState, {
    campaignId,
  });
  const participants = useQuery(api.pickem.getPickemParticipantsByCampaign, {
    campaignId,
  });
  const matchupsBySeasonAndWeek = useQuery(
    api.pickem.getPickemMatchupsBySeasonAndWeek,
    { campaignId }
  );
  const weeklyStandings = useQuery(api.pickem.getWeeklyStandings, {
    campaignId,
    seasonType: currentState?.currentSeasonType || "REGULAR_SEASON",
    weekNumber: currentState?.currentWeek || 1,
  });
  const seasonStandings = useQuery(api.pickem.getSeasonStandings, {
    campaignId,
    seasonType: currentState?.currentSeasonType || "REGULAR_SEASON",
  });

  // Mutations
  const manualAdvanceWeek = useMutation(api.pickem.manualAdvancePickemWeek);
  const distributeWeeklyPrizes = useMutation(api.pickem.distributeWeeklyPrizes);
  const distributeSeasonPrizes = useMutation(api.pickem.distributeSeasonPrizes);

  if (!campaign || !currentState) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
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

  const handleAdvanceWeek = async () => {
    setIsAdvancing(true);
    try {
      const result = await manualAdvanceWeek({ campaignId });
      toast.success(result.message);
    } catch (error) {
      console.error("Error advancing week:", error);
      toast.error("Failed to advance week");
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleDistributeWeeklyPrizes = async () => {
    setIsDistributingPrizes(true);
    try {
      const result = await distributeWeeklyPrizes({
        campaignId,
        seasonType: currentState.currentSeasonType,
        weekNumber: currentState.currentWeek,
      });
      toast.success(result.message);
    } catch (error) {
      console.error("Error distributing weekly prizes:", error);
      toast.error("Failed to distribute weekly prizes");
    } finally {
      setIsDistributingPrizes(false);
    }
  };

  const handleDistributeSeasonPrizes = async () => {
    setIsDistributingPrizes(true);
    try {
      const result = await distributeSeasonPrizes({
        campaignId,
        seasonType: currentState.currentSeasonType,
      });
      toast.success(result.message);
    } catch (error) {
      console.error("Error distributing season prizes:", error);
      toast.error("Failed to distribute season prizes");
    } finally {
      setIsDistributingPrizes(false);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{campaign.name}</span>
            <Badge
              variant={getSeasonTypeVariant(currentState.currentSeasonType)}
            >
              {getSeasonTypeDisplayName(currentState.currentSeasonType)} Week{" "}
              {currentState.currentWeek}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Active Period</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(campaign.startDate)} -{" "}
                  {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-xs text-muted-foreground">
                  {participants?.length || 0} joined
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Entry Fee</p>
                <p className="text-xs text-muted-foreground">
                  {campaign.entryFee} Links
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next Week</p>
                <p className="text-xs text-muted-foreground">
                  {getSeasonTypeDisplayName(currentState.nextSeasonType)} Week{" "}
                  {currentState.nextWeek}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isAdvancing}
                  className="flex items-center space-x-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Advance to Next Week</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Advance Campaign Week</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will advance the campaign from{" "}
                    {getSeasonTypeDisplayName(currentState.currentSeasonType)}{" "}
                    Week {currentState.currentWeek} to{" "}
                    {getSeasonTypeDisplayName(currentState.nextSeasonType)} Week{" "}
                    {currentState.nextWeek}.
                    {currentState.currentSeasonType !==
                      currentState.nextSeasonType && (
                      <span className="block mt-2 font-semibold text-destructive">
                        This will transition from{" "}
                        {getSeasonTypeDisplayName(
                          currentState.currentSeasonType
                        )}{" "}
                        to{" "}
                        {getSeasonTypeDisplayName(currentState.nextSeasonType)}!
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAdvanceWeek}>
                    {isAdvancing ? "Advancing..." : "Advance Week"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  disabled={isDistributingPrizes}
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Distribute Weekly Prizes</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Distribute Weekly Prizes</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will distribute prizes for{" "}
                    {getSeasonTypeDisplayName(currentState.currentSeasonType)}{" "}
                    Week {currentState.currentWeek}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDistributeWeeklyPrizes}>
                    {isDistributingPrizes
                      ? "Distributing..."
                      : "Distribute Prizes"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDistributingPrizes}
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Distribute Season Prizes</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Distribute Season Prizes</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will distribute prizes for the entire{" "}
                    {getSeasonTypeDisplayName(currentState.currentSeasonType)}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDistributeSeasonPrizes}>
                    {isDistributingPrizes
                      ? "Distributing..."
                      : "Distribute Season Prizes"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Current Week Standings */}
      {weeklyStandings && weeklyStandings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Week Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weeklyStandings.slice(0, 10).map((standing, index) => (
                <div
                  key={standing.userId}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-sm w-6">#{index + 1}</span>
                    <span className="font-medium">{standing.name}</span>
                    <Badge variant="outline">{standing.points} pts</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {standing.correct}W {standing.incorrect}L {standing.pushed}T
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Season Standings */}
      {seasonStandings && seasonStandings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Season Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {seasonStandings.slice(0, 10).map((standing, index) => (
                <div
                  key={standing.userId}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-sm w-6">#{index + 1}</span>
                    <span className="font-medium">{standing.name}</span>
                    <Badge variant="outline">{standing.totalPoints} pts</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {standing.totalCorrect}W {standing.totalIncorrect}L{" "}
                    {standing.totalPushed}T
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matchups Overview */}
      {matchupsBySeasonAndWeek && (
        <Card>
          <CardHeader>
            <CardTitle>Matchups Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(matchupsBySeasonAndWeek).map(
                ([seasonType, weeks]) => (
                  <div key={seasonType}>
                    <h3 className="font-semibold mb-2">
                      {getSeasonTypeDisplayName(seasonType)}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {Object.entries(weeks).map(([week, matchups]) => (
                        <div
                          key={week}
                          className="text-center p-2 bg-muted rounded"
                        >
                          <div className="font-medium">Week {week}</div>
                          <div className="text-sm text-muted-foreground">
                            {
                              matchups.filter((m: any) => m.status === "ACTIVE")
                                .length
                            }{" "}
                            active
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {
                              matchups.filter(
                                (m: any) => m.status === "COMPLETE"
                              ).length
                            }{" "}
                            complete
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
