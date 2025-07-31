"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Trophy,
  Calendar,
  Users,
  Coins,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface PrizeDistributionAdminProps {
  campaignId: Id<"pickemCampaigns">;
}

export function PrizeDistributionAdmin({
  campaignId,
}: PrizeDistributionAdminProps) {
  const [selectedSeasonType, setSelectedSeasonType] =
    useState<string>("REGULAR_SEASON");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isDistributingWeekly, setIsDistributingWeekly] = useState(false);
  const [isDistributingSeason, setIsDistributingSeason] = useState(false);
  const [showWeeklyDialog, setShowWeeklyDialog] = useState(false);
  const [showSeasonDialog, setShowSeasonDialog] = useState(false);

  // Queries
  const campaign = useQuery(api.pickem.getPickemCampaign, { campaignId });
  const weeklyStandings = useQuery(api.pickem.getWeeklyStandings, {
    campaignId,
    seasonType: selectedSeasonType as any,
    weekNumber: selectedWeek,
  });
  const seasonStandings = useQuery(api.pickem.getSeasonStandings, {
    campaignId,
    seasonType: selectedSeasonType as any,
  });
  const prizeHistory = useQuery(api.pickem.getPrizeDistributionHistory, {
    campaignId,
  });

  // Mutations
  const distributeWeeklyPrizes = useMutation(api.pickem.distributeWeeklyPrizes);
  const distributeSeasonPrizes = useMutation(api.pickem.distributeSeasonPrizes);

  const handleDistributeWeeklyPrizes = async () => {
    setIsDistributingWeekly(true);
    try {
      const result = await distributeWeeklyPrizes({
        campaignId,
        seasonType: selectedSeasonType as any,
        weekNumber: selectedWeek,
      });

      toast.success(result.message);
      setShowWeeklyDialog(false);
    } catch (error) {
      console.error("Error distributing weekly prizes:", error);
      toast.error("Failed to distribute weekly prizes");
    } finally {
      setIsDistributingWeekly(false);
    }
  };

  const handleDistributeSeasonPrizes = async () => {
    setIsDistributingSeason(true);
    try {
      const result = await distributeSeasonPrizes({
        campaignId,
        seasonType: selectedSeasonType as any,
      });

      toast.success(result.message);
      setShowSeasonDialog(false);
    } catch (error) {
      console.error("Error distributing season prizes:", error);
      toast.error("Failed to distribute season prizes");
    } finally {
      setIsDistributingSeason(false);
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

  const weeklyPrizes =
    campaign?.prizes?.filter((prize) => prize.prizeType === "WEEKLY") || [];
  const seasonPrizes =
    campaign?.prizes?.filter((prize) => prize.prizeType === "SEASON") || [];

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Prize Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Season Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Season Type</label>
            <Select
              value={selectedSeasonType}
              onValueChange={setSelectedSeasonType}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESEASON">Preseason</SelectItem>
                <SelectItem value="REGULAR_SEASON">Regular Season</SelectItem>
                <SelectItem value="POSTSEASON">Postseason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weekly Prize Distribution */}
          {weeklyPrizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Weekly Prizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Distribute prizes for Week {selectedWeek} of{" "}
                    {getSeasonTypeDisplayName(selectedSeasonType)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedWeek.toString()}
                    onValueChange={(value) => setSelectedWeek(parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => i + 1).map(
                        (week) => (
                          <SelectItem key={week} value={week.toString()}>
                            {week}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <AlertDialog
                    open={showWeeklyDialog}
                    onOpenChange={setShowWeeklyDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="default"
                        disabled={isDistributingWeekly}
                        className="flex items-center space-x-2"
                      >
                        {isDistributingWeekly ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trophy className="h-4 w-4" />
                        )}
                        <span>
                          {isDistributingWeekly
                            ? "Distributing..."
                            : "Distribute Weekly Prizes"}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Distribute Weekly Prizes
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will distribute {weeklyPrizes.length} weekly
                          prize(s) for Week {selectedWeek} of{" "}
                          {getSeasonTypeDisplayName(selectedSeasonType)}.
                          <br />
                          <br />
                          <strong>This action cannot be undone.</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDistributeWeeklyPrizes}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Distribute Prizes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Weekly Standings Preview */}
              {weeklyStandings && weeklyStandings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Current Standings (Top 10)</h4>
                  <div className="space-y-1">
                    {weeklyStandings.slice(0, 10).map((participant, index) => (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">
                            {participant.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Coins className="h-4 w-4" />
                            <span>{participant.points} pts</span>
                          </span>
                          <span className="text-muted-foreground">
                            {participant.correct}W / {participant.incorrect}L
                            {participant.pushed > 0 &&
                              ` / ${participant.pushed}P`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Season Prize Distribution */}
          {seasonPrizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Season Prizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Distribute prizes for{" "}
                    {getSeasonTypeDisplayName(selectedSeasonType)}
                  </p>
                </div>
                <AlertDialog
                  open={showSeasonDialog}
                  onOpenChange={setShowSeasonDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="default"
                      disabled={isDistributingSeason}
                      className="flex items-center space-x-2"
                    >
                      {isDistributingSeason ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trophy className="h-4 w-4" />
                      )}
                      <span>
                        {isDistributingSeason
                          ? "Distributing..."
                          : "Distribute Season Prizes"}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Distribute Season Prizes
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will distribute {seasonPrizes.length} season
                        prize(s) for{" "}
                        {getSeasonTypeDisplayName(selectedSeasonType)}.
                        <br />
                        <br />
                        <strong>This action cannot be undone.</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDistributeSeasonPrizes}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Distribute Prizes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Season Standings Preview */}
              {seasonStandings && seasonStandings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Current Standings (Top 10)</h4>
                  <div className="space-y-1">
                    {seasonStandings.slice(0, 10).map((participant, index) => (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">
                            {participant.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Coins className="h-4 w-4" />
                            <span>{participant.totalPoints} pts</span>
                          </span>
                          <span className="text-muted-foreground">
                            {participant.totalCorrect}W /{" "}
                            {participant.totalIncorrect}L
                            {participant.totalPushed > 0 &&
                              ` / ${participant.totalPushed}P`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prize Distribution History */}
          {prizeHistory && prizeHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Distribution History</h3>
              <div className="space-y-2">
                {prizeHistory.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {transaction.from === "PICKEM_WEEKLY_PRIZE" ? (
                          <Calendar className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">
                          {transaction.from === "PICKEM_WEEKLY_PRIZE"
                            ? "Weekly Prize"
                            : "Season Prize"}
                        </span>
                      </div>
                      {transaction.metadata && (
                        <div className="text-sm text-muted-foreground">
                          {(transaction.metadata as any).prizeName && (
                            <span>
                              {(transaction.metadata as any).prizeName}
                            </span>
                          )}
                          {(transaction.metadata as any).weekNumber && (
                            <span>
                              {" "}
                              - Week {(transaction.metadata as any).weekNumber}
                            </span>
                          )}
                          {(transaction.metadata as any).seasonType && (
                            <span>
                              {" "}
                              -{" "}
                              {getSeasonTypeDisplayName(
                                (transaction.metadata as any).seasonType
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-green-600">
                        +{transaction.amount} 🔗
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          transaction._creationTime
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
